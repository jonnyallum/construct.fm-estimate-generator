/**
 * CONSTRUCT FM — PRICING DATABASE
 * ================================
 * Extracted from real Construct FM quotations (Feb-Mar 2025):
 * - CQ-010156: SMR Corner Extension (stud walls, glass, decoration)
 * - CQ-010167: Rhino Enclosure (roofing, guttering) — Longleat
 * - CQ-010168: Gully Drainage (excavation, pipework) — Longleat
 * - TEC1096MH: Landau Marine full office refurb (£89,850 ex VAT)
 *
 * All rates are EXCLUSIVE of VAT unless stated.
 * Labour rate baseline: £43.75/hr (from TEC report)
 * Profit margin: ~20% on cost (from TEC profit breakdown)
 * Prelims: typically 6-11% of main contract value
 *
 * Last updated: 2026-02-17
 */

// ============================================================
// LABOUR RATES (per hour, ex VAT)
// ============================================================
export const LABOUR_RATES = {
    generalBuilder: { rate: 43.75, unit: 'hr', description: 'General builder / labourer' },
    carpenter: { rate: 43.75, unit: 'hr', description: 'Carpenter / joiner' },
    plasterer: { rate: 43.75, unit: 'hr', description: 'Plasterer / renderer' },
    painter: { rate: 43.75, unit: 'hr', description: 'Painter & decorator' },
    electrician: { rate: 55.00, unit: 'hr', description: 'Electrician (provisional)' },
    plumber: { rate: 55.00, unit: 'hr', description: 'Plumber (provisional)' },
    management: { rate: 65.00, unit: 'hr', description: 'Site management / supervision' },
} as const

// ============================================================
// PRELIMS (overhead costs added to every job)
// ============================================================
export const PRELIMS = {
    management: { description: 'Site management & supervision', percentOfContract: 4.5 },
    segregation: { description: 'Site segregation & protection', percentOfContract: 1.0 },
    wasteManagement: { description: 'Waste management & disposal', percentOfContract: 1.5 },
    access: { description: 'Access equipment (scaffolding, MEWP)', percentOfContract: 1.5 },
    plant: { description: 'Plant & tool hire', percentOfContract: 2.0 },
} as const

// ============================================================
// PARTITIONS & STUD WALLS
// ============================================================
export const PARTITIONS = {
    metalStudPartition: {
        description: 'Gyproc metal stud partition; 2x12.5mm taper edge wallboard each side; joints filled, taped, finished flush; soundproofing insulation',
        rate: 106.51,
        unit: 'm²',
        source: 'CQ-010156',
    },
    metalStudPartitionFull: {
        description: 'Metal stud partition complete (as above, lump sum for typical office)',
        rate: 1597.70,
        unit: 'item',
        source: 'CQ-010156',
    },
    timberStudWall: {
        description: 'Timber stud wall: C16/C24 47x95mm at 400mm centres, Knauf APR 35 100mm insulation, 12.5mm plasterboard, skim coat',
        rate: 129.09,
        unit: 'm²',
        source: 'TEC1096MH (£6,454.50 / 50m²)',
    },
    reinforceStudWall: {
        description: 'Reinforce stud wall for wall-hung TV/equipment',
        rate: 151.85,
        unit: 'item',
        source: 'CQ-010156',
    },
    dotAndDab: {
        description: 'Dot & dab plasterboard to masonry walls (PVA prime, adhesive, plasterboard, skim)',
        rate: 36.04,
        unit: 'm²',
        source: 'TEC1096MH (£108.11 / 3m²)',
    },
    boxingForSteel: {
        description: 'Boxing in steelwork (treated batten, insulation, fireline plasterboard, skim)',
        rate: 20.45,
        unit: 'lm',
        source: 'TEC1096MH (£400.88 / 19.6m)',
    },
} as const

// ============================================================
// DOORS & GLAZING
// ============================================================
export const DOORS_GLAZING = {
    standardFlushDoor: {
        description: 'Supply & install standard flush door (inc frame, ironmongery)',
        rate: 798.40,
        unit: 'each',
        source: 'CQ-010156',
    },
    removeGlassPartition: {
        description: 'Remove glass partitioning and set aside for reuse (approx 3.1m x 2.4m)',
        rate: 246.50,
        unit: 'item',
        source: 'CQ-010156',
    },
    installGlassPartition: {
        description: 'Install previously set aside glass partition to office area',
        rate: 404.50,
        unit: 'item',
        source: 'CQ-010156',
    },
    glazedPanels1m: {
        description: '1m glazed panels (supply & fitting)',
        rate: 640.00,
        unit: 'each',
        source: 'TEC1096MH (£3,200 / 5no)',
    },
    glassPartitionAllowance: {
        description: 'Glass partition allowance (provisional)',
        rate: 6000.00,
        unit: 'item',
        source: 'TEC1096MH',
    },
} as const

// ============================================================
// DECORATION & PAINTING
// ============================================================
export const DECORATION = {
    wallsMistAndTwoCoats: {
        description: 'Walls: one mist coat + two full coats vinyl silk/matt emulsion',
        rate: 10.31,
        unit: 'm²',
        source: 'TEC1096MH (avg across multiple rooms)',
    },
    wallsOver300mm: {
        description: 'Walls over 300mm wide: mist + 2 coats emulsion (small area)',
        rate: 352.50,
        unit: 'item',
        source: 'CQ-010156',
    },
    ceilingMistAndTwoCoats: {
        description: 'Ceiling: one mist coat + two full coats emulsion (white)',
        rate: 5.32,
        unit: 'm²',
        source: 'TEC1096MH (£6,745.45 labour / 1272m² = £5.30/m² labour + materials)',
    },
    primeUndercoatPaintDoor: {
        description: 'Prime, undercoat and paint single door',
        rate: 214.38,
        unit: 'each',
        source: 'TEC1096MH (£3,215.63 / 15 doors)',
    },
    primeUndercoatPaintSkirting: {
        description: 'Prime, undercoat and paint skirting board',
        rate: 19.69,
        unit: 'lm',
        source: 'TEC1096MH (£1,515.94 / 77m)',
    },
    glossPaint2Coats: {
        description: 'Apply 2 coats of gloss paint',
        rate: 5.47,
        unit: 'lm',
        source: 'TEC1096MH (£328.13 / 60m)',
    },
    primerCoat: {
        description: 'Apply 1 coat of primer',
        rate: 4.38,
        unit: 'lm',
        source: 'TEC1096MH (£131.25 / 30m)',
    },
    steelPrimer: {
        description: 'Apply 1 coat red oxide primer to steelwork',
        rate: 8.79,
        unit: 'm²',
        source: 'TEC1096MH (£39.55 / 4.5m²)',
    },
} as const

// ============================================================
// FLOORING
// ============================================================
export const FLOORING = {
    carpetTiles: {
        description: 'Carpet tiles (supply & fit, inc gripper rods)',
        rate: 49.81,
        unit: 'm²',
        materialAllowance: 15.00,
        underlayAllowance: 5.00,
        source: 'TEC1096MH',
    },
    lvtClick: {
        description: 'LVT click flooring (supply & fit)',
        rate: 102.50,
        unit: 'm²',
        materialAllowance: 40.00,
        source: 'TEC1096MH',
    },
    gripperRods: {
        description: 'Fit gripper rods for carpet',
        rate: 3.13,
        unit: 'lm',
        source: 'TEC1096MH (£218.75 / 70m)',
    },
    coldLayTarmac: {
        description: 'Make good with cold lay tarmac',
        rate: 257.50,
        unit: 'item',
        source: 'CQ-010168',
    },
} as const

// ============================================================
// ROOFING & GUTTERING
// ============================================================
export const ROOFING = {
    removeReplaceRoofFixings: {
        description: 'Remove existing roof fixings and replace with new (approx 500no)',
        rate: 1896.40,
        unit: 'item',
        source: 'CQ-010167',
    },
    cleanClearGuttering: {
        description: 'Clean & clear high level guttering',
        rate: 10.44,
        unit: 'lm',
        source: 'CQ-010167 (£365.50 / 35m)',
    },
    refixGutteringBrackets: {
        description: 'Refix guttering brackets',
        rate: 256.29,
        unit: 'item',
        source: 'CQ-010167',
    },
    resealGutteringJoints: {
        description: 'Reseal all guttering joints',
        rate: 309.50,
        unit: 'item',
        source: 'CQ-010167',
    },
} as const

// ============================================================
// DRAINAGE & GROUNDWORKS
// ============================================================
export const DRAINAGE = {
    trenchExcavation450mm: {
        description: 'Excavate trench 450mm wide, 0.50m deep (by hand, compact with whacker)',
        rate: 21.60,
        unit: 'lm',
        source: 'CQ-010168',
    },
    disposeSpoilOnSite: {
        description: 'Dispose excavated material on site (temporary spoil heaps, avg 10m distance)',
        rate: 84.00,
        unit: 'm³',
        source: 'CQ-010168',
    },
    disposeSpoilOffSite: {
        description: 'Remove excavated material from site to tip (avg 10km, inc tipping charges)',
        rate: 88.38,
        unit: 'm³',
        source: 'CQ-010168',
    },
    soilPipeLaidToFall: {
        description: 'Supply & install soil pipe laid to fall, set in concrete',
        rate: 41.20,
        unit: 'lm',
        source: 'CQ-010168',
    },
    backfillGranular: {
        description: 'Backfill with arisings and granular material (10mm pea shingle)',
        rate: 12.18,
        unit: 'lm',
        source: 'CQ-010168',
    },
} as const

// ============================================================
// CEILINGS & INSULATION
// ============================================================
export const CEILINGS = {
    suspendedCeiling: {
        description: 'Suspended Gyplyner ceiling frame + 1 layer standard plasterboard + skim finish',
        rate: 82.17,
        unit: 'm²',
        source: 'TEC1096MH (£1,848.92 / 22.5m²)',
    },
    ceilingTilesInstalled: {
        description: 'Ceiling tiles (supply & installation)',
        rate: 2750.00,
        unit: 'item',
        source: 'TEC1096MH (provisional)',
    },
    loftInsulation100mm: {
        description: 'Knauf Earthwool Combi Cut 44 Loft Roll 100mm between ceiling joists',
        rate: 13.82,
        unit: 'm²',
        source: 'TEC1096MH (£310.90 / 22.5m²)',
    },
    acousticInsulation100mm: {
        description: 'Knauf Earthwool Acoustic Partition Roll APR 35 100mm between studs',
        rate: 10.93,
        unit: 'm²',
        source: 'TEC1096MH (included in stud wall rate)',
    },
} as const

// ============================================================
// SKIRTING & TRIM
// ============================================================
export const SKIRTING = {
    mdfTorusSkirting144mm: {
        description: 'Supply & install MDF Primed Torus Skirting 144mm (inc primer, undercoat, gloss)',
        rate: 34.83,
        unit: 'lm',
        source: 'TEC1096MH (£1,044.80 / 30m)',
    },
    mdfSkirtingSupplyOnly: {
        description: 'Supply & install MDF Primed Torus Skirting 144mm (no decoration)',
        rate: 14.52,
        unit: 'lm',
        source: 'TEC1096MH (£392.11 / 27m)',
    },
} as const

// ============================================================
// STRUCTURAL STEEL
// ============================================================
export const STRUCTURAL = {
    universalBeamInstall: {
        description: 'Supply, erect & set in position Universal Column UB 203x133x30 + primer',
        rate: 941.09,
        unit: 'item',
        source: 'TEC1096MH (4.9m beam)',
        ratePerMetre: 192.06,
    },
    padstone: {
        description: 'Supreme Concrete Padstone 215x215x102mm bedded in cement sand mortar (1:3)',
        rate: 58.33,
        unit: 'each',
        source: 'TEC1096MH (£116.66 / 2no)',
    },
} as const

// ============================================================
// PLASTERING
// ============================================================
export const PLASTERING = {
    fixPlasterboardToWalls: {
        description: 'Fix standard plasterboard to walls (screws)',
        rate: 43.75,
        unit: 'm²',
        source: 'TEC1096MH (£1,268.88 / 29m² labour)',
    },
    fixPlasterboardToCeiling: {
        description: 'Fix standard plasterboard to ceiling',
        rate: 43.75,
        unit: 'm²',
        source: 'TEC1096MH',
    },
    skimWalls: {
        description: 'Skim coat walls (Thistle Multi Finish)',
        rate: 13.26,
        unit: 'm²',
        source: 'TEC1096MH (£1,424 / 107.4m²)',
    },
    skimCeiling: {
        description: 'Skim coat ceiling',
        rate: 16.83,
        unit: 'm²',
        source: 'TEC1096MH (£378.60 / 22.5m²)',
    },
} as const

// ============================================================
// PROVISIONAL SUMS (common allowances)
// ============================================================
export const PROVISIONAL_SUMS = {
    electricalSmallRoom: { description: 'Electrical allowance (small room/office)', rate: 1575.00, unit: 'item' },
    electricalMediumRoom: { description: 'Electrical allowance (medium room)', rate: 2000.00, unit: 'item' },
    electricalLargeRoom: { description: 'Electrical allowance (large room)', rate: 2450.00, unit: 'item' },
    kitchenFittingOnly: { description: 'Kitchen fitting allowance (fitting only, client supplies)', rate: 3750.00, unit: 'item' },
    barAllowance: { description: 'Bar/servery allowance', rate: 3000.00, unit: 'item' },
    featureWall: { description: 'Feature wall allowance', rate: 4250.00, unit: 'item' },
    internalAlterations: { description: 'Internal alterations (inc skips)', rate: 775.00, unit: 'item' },
    ceilingTiles: { description: 'Ceiling tiles (supply & install)', rate: 2750.00, unit: 'item' },
    fitBlinds: { description: 'Fit blinds', rate: 130.00, unit: 'item' },
} as const

// ============================================================
// PROFIT MARGIN & VAT
// ============================================================
export const BUSINESS = {
    defaultProfitMargin: 0.20,  // 20% markup on cost
    vatRate: 0.20,              // 20% VAT
    quoteValidityDays: 30,      // Standard quote validity
    paymentTermsDays: 14,       // 14 days from invoice
    defectsLiabilityMonths: 6,  // 6 months defects period
} as const

// ============================================================
// HELPER: Calculate estimate from line items
// ============================================================
export interface LineItem {
    description: string
    quantity: number
    unit: string
    rate: number
    total?: number
}

export function calculateEstimate(items: LineItem[], prelimsPercent = 8) {
    const mainContractTotal = items.reduce((sum, item) => {
        const total = item.quantity * item.rate
        return sum + total
    }, 0)

    const prelimsValue = mainContractTotal * (prelimsPercent / 100)
    const subtotal = mainContractTotal + prelimsValue
    const vat = subtotal * BUSINESS.vatRate
    const grandTotal = subtotal + vat

    return {
        items: items.map(item => ({ ...item, total: item.quantity * item.rate })),
        mainContractTotal,
        prelimsValue,
        prelimsPercent,
        subtotalExVat: subtotal,
        vat,
        grandTotal,
    }
}
