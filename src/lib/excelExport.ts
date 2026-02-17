/**
 * Excel Export Utility for Construct FM Estimate Generator
 * Fetches the .xlsm templates from /public/templates/ and populates them
 * with estimate data, then triggers a download.
 *
 * Template structure (both Quotation & Invoice share same layout):
 * ─── Quote Letter sheet ───
 * B1:  "QUOTATION" or "INVOICE"
 * B3:  Works title (project title)
 * B6:  Client name
 * B7-B11: Address lines
 * B13: Date | E13: Quote No. / Invoice No.
 * E12: PO No. (invoice only)
 * B16: Description of Works
 * B27: "PRELIMS VALUE EXCLUSIVE OF V.A.T" | F27: prelims total
 * B29: Header row (PRELIMS, Quant, Unit, Rate, Total)
 * B30+: Prelim line items (Description, Qty, Unit, Rate, Total)
 * B41: "MAIN CONTRACT WORKS EXCLUSIVE OF V.A.T" | F41: main total
 * B43: Header row (MAIN CONTRACT WORKS COST BREAKDOWN, Quant, Unit, Rate, Total)
 * B45+: Main contract line items
 */

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

export interface ExportLineItem {
    description: string
    quantity: number
    unit: string
    rate: number
    total: number
}

export interface ExportData {
    clientName: string
    projectTitle: string
    reference: string
    date: string
    prelimsItems: ExportLineItem[]
    prelimsTotal: number
    mainItems: ExportLineItem[]
    mainContractTotal: number
    subtotalExVat: number
    vat: number
    grandTotal: number
    // Invoice-specific
    invoiceNumber?: string
    poNumber?: string
}

async function loadTemplate(templatePath: string): Promise<ExcelJS.Workbook> {
    const response = await fetch(templatePath)
    const arrayBuffer = await response.arrayBuffer()
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(arrayBuffer)
    return workbook
}

function populateSheet(ws: ExcelJS.Worksheet, data: ExportData, type: 'quotation' | 'invoice') {
    // Title
    ws.getCell('B1').value = type === 'invoice' ? 'INVOICE' : 'QUOTATION'

    // Project / Works
    ws.getCell('B3').value = data.projectTitle || 'WORKS'

    // Client
    ws.getCell('B6').value = data.clientName || 'Client'

    // Date & Reference
    ws.getCell('B13').value = new Date(data.date)
    ws.getCell('B13').numFmt = 'DD/MM/YYYY'

    if (type === 'invoice') {
        ws.getCell('E13').value = data.invoiceNumber || ''
        if (data.poNumber) ws.getCell('E12').value = data.poNumber
    } else {
        ws.getCell('E13').value = data.reference || ''
    }

    // Description of Works
    ws.getCell('B16').value = data.projectTitle || 'Description of Works'

    // ── PRELIMS SECTION ──
    ws.getCell('F27').value = data.prelimsTotal

    // Write prelim items starting at row 30
    const prelimStartRow = 30
    data.prelimsItems.forEach((item, i) => {
        const row = prelimStartRow + i
        ws.getCell(`B${row}`).value = item.description
        ws.getCell(`C${row}`).value = item.quantity
        ws.getCell(`D${row}`).value = item.unit
        ws.getCell(`E${row}`).value = item.rate
        ws.getCell(`F${row}`).value = item.total
    })
    // Clear remaining prelim rows (30-39 = 10 slots)
    for (let i = data.prelimsItems.length; i < 10; i++) {
        const row = prelimStartRow + i
        ws.getCell(`B${row}`).value = ''
        ws.getCell(`C${row}`).value = ''
        ws.getCell(`D${row}`).value = ''
        ws.getCell(`E${row}`).value = ''
        ws.getCell(`F${row}`).value = ''
    }

    // ── MAIN CONTRACT SECTION ──
    ws.getCell('F41').value = data.mainContractTotal

    // Write main items starting at row 45
    const mainStartRow = 45
    data.mainItems.forEach((item, i) => {
        const row = mainStartRow + i
        ws.getCell(`B${row}`).value = item.description
        ws.getCell(`C${row}`).value = item.quantity
        ws.getCell(`D${row}`).value = item.unit
        ws.getCell(`E${row}`).value = item.rate
        ws.getCell(`F${row}`).value = item.total
    })
    // Clear remaining main rows (up to ~60 slots available)
    for (let i = data.mainItems.length; i < 60; i++) {
        const row = mainStartRow + i
        // Only clear if row exists and has content
        const cell = ws.getCell(`B${row}`)
        if (cell.value === 0 || cell.value === null || cell.value === '') {
            ws.getCell(`B${row}`).value = ''
            ws.getCell(`C${row}`).value = ''
            ws.getCell(`D${row}`).value = ''
            ws.getCell(`E${row}`).value = ''
            ws.getCell(`F${row}`).value = ''
        }
    }
}

function populateBuildingWorks(ws: ExcelJS.Worksheet, data: ExportData) {
    // PROJECT & Client
    ws.getCell('D2').value = data.clientName || 'Client'
    ws.getCell('D3').value = new Date(data.date)

    // Prelim items in D11+ area
    const prelimNames = data.prelimsItems.map(i => i.description)
    prelimNames.forEach((name, i) => {
        const row = 11 + i
        ws.getCell(`D${row}`).value = name
        ws.getCell(`F${row}`).value = data.prelimsItems[i].quantity
        ws.getCell(`G${row}`).value = data.prelimsItems[i].unit
    })

    // Main items in row 27+
    data.mainItems.forEach((item, i) => {
        const row = 27 + i
        ws.getCell(`D${row}`).value = item.description
        ws.getCell(`F${row}`).value = item.quantity
        ws.getCell(`G${row}`).value = item.unit
        ws.getCell(`H${row}`).value = item.rate
    })
}

export async function exportToExcel(data: ExportData, type: 'quotation' | 'invoice') {
    const templatePath = type === 'invoice'
        ? '/templates/Invoice_Template.xlsm'
        : '/templates/Quotation_Template.xlsm'

    try {
        const workbook = await loadTemplate(templatePath)

        // Populate Quote Letter sheet
        const quoteSheet = workbook.getWorksheet('Quote Letter ')
        if (quoteSheet) {
            populateSheet(quoteSheet, data, type)
        }

        // Populate BUILDING WORKS sheet
        const buildingSheet = workbook.getWorksheet('BUILDING WORKS')
        if (buildingSheet) {
            populateBuildingWorks(buildingSheet, data)
        }

        // Generate filename
        const dateStr = data.date.replace(/-/g, '')
        const clientSlug = (data.clientName || 'client').replace(/\s+/g, '_').substring(0, 20)
        const prefix = type === 'invoice' ? 'INV' : 'QUO'
        const ref = type === 'invoice' ? (data.invoiceNumber || '') : (data.reference || '')
        const filename = `${prefix}_${clientSlug}_${ref || dateStr}.xlsx`

        // Export as .xlsx (exceljs can't write .xlsm macros, but structure is preserved)
        const buffer = await workbook.xlsx.writeBuffer()
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        saveAs(blob, filename)

        return true
    } catch (error) {
        console.error('Excel export failed:', error)
        alert('Failed to generate Excel file. Check console for details.')
        return false
    }
}
