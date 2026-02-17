'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import {
  PARTITIONS, DOORS_GLAZING, DECORATION, FLOORING, ROOFING,
  DRAINAGE, CEILINGS, SKIRTING, STRUCTURAL, PLASTERING,
  PROVISIONAL_SUMS, LABOUR_RATES, BUSINESS,
  calculateEstimate, type LineItem,
} from '@/lib/pricing'

// ── Flatten all rate categories into a searchable catalogue ──
type RateEntry = { key: string; category: string; description: string; rate: number; unit: string }

function buildCatalogue(): RateEntry[] {
  const cats: Record<string, Record<string, { description: string; rate: number; unit: string }>> = {
    'Partitions & Stud Walls': PARTITIONS,
    'Doors & Glazing': DOORS_GLAZING,
    'Decoration & Painting': DECORATION,
    'Flooring': FLOORING,
    'Roofing & Guttering': ROOFING,
    'Drainage & Groundworks': DRAINAGE,
    'Ceilings & Insulation': CEILINGS,
    'Skirting & Trim': SKIRTING,
    'Structural Steel': STRUCTURAL,
    'Plastering': PLASTERING,
    'Provisional Sums': PROVISIONAL_SUMS,
  }
  const entries: RateEntry[] = []
  for (const [category, items] of Object.entries(cats)) {
    for (const [key, item] of Object.entries(items)) {
      entries.push({ key, category, description: item.description, rate: item.rate, unit: item.unit })
    }
  }
  return entries
}

const catalogue = buildCatalogue()
const categories = [...new Set(catalogue.map((e) => e.category))]

const fmt = (n: number) => '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function EstimateGenerator() {
  const [clientName, setClientName] = useState('')
  const [projectTitle, setProjectTitle] = useState('')
  const [projectRef, setProjectRef] = useState('')
  const [items, setItems] = useState<(LineItem & { id: number })[]>([])
  const [prelimsPercent, setPrelimsPercent] = useState(8)
  const [selectedCategory, setSelectedCategory] = useState(categories[0])
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'edit' | 'estimate' | 'invoice'>('edit')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('14 days from invoice')
  const [bankDetails, setBankDetails] = useState('Sort Code: XX-XX-XX | Account: XXXXXXXX')
  const [notes, setNotes] = useState('')
  const nextId = useRef(1)

  const filteredRates = catalogue.filter((e) => {
    const matchCat = e.category === selectedCategory
    const matchSearch = search === '' || e.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const addItem = (entry: RateEntry) => {
    setItems((prev) => [...prev, { id: nextId.current++, description: entry.description, quantity: 1, unit: entry.unit, rate: entry.rate }])
  }

  const updateItem = (id: number, field: 'quantity' | 'rate' | 'description', value: string) => {
    setItems((prev) => prev.map((item) => {
      if (item.id !== id) return item
      if (field === 'description') return { ...item, description: value }
      return { ...item, [field]: parseFloat(value) || 0 }
    }))
  }

  const removeItem = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id))

  const addCustomItem = () => {
    setItems((prev) => [...prev, { id: nextId.current++, description: 'Custom item', quantity: 1, unit: 'item', rate: 0 }])
  }

  const estimate = calculateEstimate(items, prelimsPercent)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-10 no-print">
        <div className="flex items-center gap-4">
          <Image src="/images/logo.png" alt="Construct FM" width={48} height={48} className="rounded-lg" />
          <div>
            <h1 className="text-2xl font-bold text-cfm-orange">Estimate Generator</h1>
            <p className="text-sm text-cfm-muted">Internal tool — Construct FM rate card</p>
          </div>
        </div>
        <div className="flex gap-3">
          {viewMode !== 'edit' && (
            <button onClick={() => setViewMode('edit')} className="px-4 py-2 rounded-lg border border-cfm-border text-cfm-muted font-semibold text-sm hover:text-cfm-text hover:border-cfm-text transition-colors">
              ← Edit
            </button>
          )}
          {viewMode === 'edit' && (
            <>
              <button onClick={() => setViewMode('estimate')} className="px-4 py-2 rounded-lg bg-cfm-orange text-black font-semibold text-sm hover:bg-cfm-orange-hover transition-colors">
                View Estimate
              </button>
              <button onClick={() => { if (!invoiceNumber) setInvoiceNumber('INV-' + String(Date.now()).slice(-6)); setViewMode('invoice') }} className="px-4 py-2 rounded-lg border border-cfm-green text-cfm-green font-semibold text-sm hover:bg-cfm-green hover:text-black transition-colors">
                Generate Invoice
              </button>
            </>
          )}
          {viewMode !== 'edit' && (
            <button onClick={() => window.print()} className="px-4 py-2 rounded-lg border border-cfm-orange text-cfm-orange font-semibold text-sm hover:bg-cfm-orange hover:text-black transition-colors">
              Print / PDF
            </button>
          )}
        </div>
      </header>

      {viewMode === 'edit' ? (
        <>
          {/* Project Details */}
          <section className="rounded-xl bg-cfm-card border border-cfm-border p-6 mb-8">
            <h2 className="text-lg font-bold mb-4 text-cfm-orange">Project Details</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-cfm-muted mb-1">Client Name</label>
                <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Landau Marine" className="w-full" />
              </div>
              <div>
                <label className="block text-xs text-cfm-muted mb-1">Project Title</label>
                <input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="e.g. Office Refurbishment" className="w-full" />
              </div>
              <div>
                <label className="block text-xs text-cfm-muted mb-1">Reference</label>
                <input value={projectRef} onChange={(e) => setProjectRef(e.target.value)} placeholder="e.g. CQ-010200" className="w-full" />
              </div>
            </div>
          </section>

          {/* Rate Card Browser */}
          <section className="rounded-xl bg-cfm-card border border-cfm-border p-6 mb-8">
            <h2 className="text-lg font-bold mb-4 text-cfm-orange">Rate Card</h2>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search rates..." className="w-full mb-4" />
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedCategory === cat ? 'bg-cfm-orange text-black' : 'bg-cfm-border text-cfm-muted hover:text-cfm-text'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {filteredRates.map((entry) => (
                <button key={entry.key} onClick={() => addItem(entry)}
                  className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg hover:bg-cfm-border/50 transition-colors group">
                  <span className="text-sm text-cfm-text group-hover:text-cfm-orange transition-colors">{entry.description}</span>
                  <span className="text-xs text-cfm-muted whitespace-nowrap ml-4">{fmt(entry.rate)}/{entry.unit}</span>
                </button>
              ))}
              {filteredRates.length === 0 && <p className="text-sm text-cfm-muted py-4 text-center">No rates found</p>}
            </div>
          </section>

          {/* Line Items Table */}
          <section className="rounded-xl bg-cfm-card border border-cfm-border p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-cfm-orange">Line Items ({items.length})</h2>
              <button onClick={addCustomItem} className="px-3 py-1.5 rounded-lg border border-cfm-border text-cfm-muted text-xs hover:text-cfm-orange hover:border-cfm-orange transition-colors">
                + Custom Item
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-cfm-muted py-8 text-center">Click items from the rate card above to add them here</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-cfm-muted border-b border-cfm-border">
                      <th className="text-left py-2 pr-2">Description</th>
                      <th className="text-right py-2 px-2 w-20">Qty</th>
                      <th className="text-center py-2 px-2 w-16">Unit</th>
                      <th className="text-right py-2 px-2 w-24">Rate</th>
                      <th className="text-right py-2 px-2 w-28">Total</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-cfm-border/50 hover:bg-cfm-border/20">
                        <td className="py-2 pr-2">
                          <input value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            className="w-full bg-transparent border-none p-0 text-sm focus:ring-0" />
                        </td>
                        <td className="py-2 px-2">
                          <input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                            className="w-full text-right bg-transparent border-none p-0 text-sm focus:ring-0" min="0" step="0.1" />
                        </td>
                        <td className="py-2 px-2 text-center text-cfm-muted">{item.unit}</td>
                        <td className="py-2 px-2">
                          <input type="number" value={item.rate} onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                            className="w-full text-right bg-transparent border-none p-0 text-sm focus:ring-0" min="0" step="0.01" />
                        </td>
                        <td className="py-2 px-2 text-right font-medium text-cfm-orange">{fmt(item.quantity * item.rate)}</td>
                        <td className="py-2 pl-2">
                          <button onClick={() => removeItem(item.id)} className="text-cfm-red/60 hover:text-cfm-red text-lg leading-none">&times;</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Totals */}
          {items.length > 0 && (
            <section className="rounded-xl bg-cfm-card border border-cfm-border p-6">
              <h2 className="text-lg font-bold mb-4 text-cfm-orange">Estimate Totals</h2>
              <div className="space-y-3 max-w-md ml-auto">
                <div className="flex justify-between text-sm">
                  <span className="text-cfm-muted">Main Contract Total</span>
                  <span className="font-medium">{fmt(estimate.mainContractTotal)}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-cfm-muted flex items-center gap-2">
                    Prelims
                    <input type="number" value={prelimsPercent} onChange={(e) => setPrelimsPercent(parseFloat(e.target.value) || 0)}
                      className="w-14 text-center text-xs py-0.5 px-1" min="0" max="20" step="0.5" />%
                  </span>
                  <span className="font-medium">{fmt(estimate.prelimsValue)}</span>
                </div>
                <div className="border-t border-cfm-border pt-3 flex justify-between text-sm">
                  <span className="text-cfm-muted">Subtotal (ex VAT)</span>
                  <span className="font-bold">{fmt(estimate.subtotalExVat)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cfm-muted">VAT @ 20%</span>
                  <span className="font-medium">{fmt(estimate.vat)}</span>
                </div>
                <div className="border-t border-cfm-border pt-3 flex justify-between">
                  <span className="font-bold text-lg">Grand Total</span>
                  <span className="font-bold text-lg text-cfm-orange">{fmt(estimate.grandTotal)}</span>
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        /* ── PRINT VIEW (ESTIMATE or INVOICE) ── */
        <div className="print-view">
          {/* Print Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-cfm-orange">
            <div className="flex items-center gap-4">
              <Image src="/images/logo.png" alt="Construct FM" width={56} height={56} className="rounded-lg" />
              <div>
                <h1 className="text-2xl font-bold text-cfm-orange">Construct FM</h1>
                <p className="text-xs text-cfm-muted">Construction & Facilities Management</p>
              </div>
            </div>
            <div className="text-right text-sm">
              <p className={`font-bold text-lg ${viewMode === 'invoice' ? 'text-cfm-green' : 'text-cfm-orange'}`}>
                {viewMode === 'invoice' ? 'INVOICE' : 'ESTIMATE'}
              </p>
              {viewMode === 'invoice' && invoiceNumber && <p className="font-medium">{invoiceNumber}</p>}
              {projectRef && <p className="text-cfm-muted">Ref: {projectRef}</p>}
              <p className="text-cfm-muted">{viewMode === 'invoice' ? invoiceDate : new Date().toLocaleDateString('en-GB')}</p>
            </div>
          </div>

          {/* Invoice-specific: editable fields (no-print) */}
          {viewMode === 'invoice' && (
            <div className="no-print rounded-xl bg-cfm-card border border-cfm-border p-6 mb-8">
              <h3 className="text-sm font-bold text-cfm-green mb-3">Invoice Settings</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-cfm-muted mb-1">Invoice Number</label>
                  <input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="block text-xs text-cfm-muted mb-1">Invoice Date</label>
                  <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="block text-xs text-cfm-muted mb-1">Due Date</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="block text-xs text-cfm-muted mb-1">Payment Terms</label>
                  <input value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} className="w-full" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs text-cfm-muted mb-1">Bank Details</label>
                  <input value={bankDetails} onChange={(e) => setBankDetails(e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="block text-xs text-cfm-muted mb-1">Notes</label>
                  <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Stage 2 payment" className="w-full" />
                </div>
              </div>
            </div>
          )}

          {/* Client & Project */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs text-cfm-muted uppercase tracking-wider mb-1">Client</p>
              <p className="font-bold text-lg">{clientName || 'TBC'}</p>
            </div>
            <div>
              <p className="text-xs text-cfm-muted uppercase tracking-wider mb-1">Project</p>
              <p className="font-bold text-lg">{projectTitle || 'TBC'}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-sm mb-8">
            <thead>
              <tr className="text-xs text-cfm-muted border-b-2 border-cfm-border">
                <th className="text-left py-2 pr-2">#</th>
                <th className="text-left py-2 pr-2">Description</th>
                <th className="text-right py-2 px-2">Qty</th>
                <th className="text-center py-2 px-2">Unit</th>
                <th className="text-right py-2 px-2">Rate</th>
                <th className="text-right py-2 px-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {estimate.items.map((item, i) => (
                <tr key={i} className="border-b border-cfm-border/30">
                  <td className="py-2 pr-2 text-cfm-muted">{i + 1}</td>
                  <td className="py-2 pr-2">{item.description}</td>
                  <td className="py-2 px-2 text-right">{item.quantity}</td>
                  <td className="py-2 px-2 text-center text-cfm-muted">{item.unit}</td>
                  <td className="py-2 px-2 text-right">{fmt(item.rate)}</td>
                  <td className="py-2 px-2 text-right font-medium">{fmt(item.total!)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Totals */}
          <div className="max-w-sm ml-auto space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-cfm-muted">Main Contract Total</span><span>{fmt(estimate.mainContractTotal)}</span></div>
            <div className="flex justify-between"><span className="text-cfm-muted">Prelims ({prelimsPercent}%)</span><span>{fmt(estimate.prelimsValue)}</span></div>
            <div className="border-t border-cfm-border pt-2 flex justify-between font-bold"><span>Subtotal (ex VAT)</span><span>{fmt(estimate.subtotalExVat)}</span></div>
            <div className="flex justify-between"><span className="text-cfm-muted">VAT @ 20%</span><span>{fmt(estimate.vat)}</span></div>
            <div className="border-t-2 border-cfm-orange pt-2 flex justify-between text-lg font-bold"><span>Grand Total</span><span className="text-cfm-orange">{fmt(estimate.grandTotal)}</span></div>
          </div>

          {/* Invoice: Due Date & Bank Details */}
          {viewMode === 'invoice' && (
            <div className="mt-8 p-4 rounded-lg border border-cfm-green/30 bg-cfm-green/5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-cfm-muted uppercase tracking-wider mb-1">Payment Terms</p>
                  <p className="font-medium">{paymentTerms}</p>
                </div>
                <div>
                  <p className="text-xs text-cfm-muted uppercase tracking-wider mb-1">Due Date</p>
                  <p className="font-bold text-cfm-green">{dueDate || 'TBC'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-cfm-muted uppercase tracking-wider mb-1">Bank Details</p>
                  <p className="font-medium">{bankDetails}</p>
                </div>
                {notes && (
                  <div className="col-span-2">
                    <p className="text-xs text-cfm-muted uppercase tracking-wider mb-1">Notes</p>
                    <p>{notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-cfm-border text-xs text-cfm-muted space-y-1">
            {viewMode === 'invoice' ? (
              <>
                <p>Please make payment by the due date shown above.</p>
                <p>Late payments may incur interest at 8% above the Bank of England base rate per the Late Payment of Commercial Debts Act 1998.</p>
              </>
            ) : (
              <>
                <p>This estimate is valid for {BUSINESS.quoteValidityDays} days from the date above.</p>
                <p>Payment terms: {BUSINESS.paymentTermsDays} days from invoice. Defects liability: {BUSINESS.defectsLiabilityMonths} months.</p>
                <p>All prices exclusive of VAT unless stated. Subject to site survey and final specification.</p>
              </>
            )}
            <p className="mt-2 font-medium text-cfm-text">Construct FM Ltd · Havant, Hampshire · constructfm.co.uk</p>
          </div>
        </div>
      )}
    </div>
  )
}
