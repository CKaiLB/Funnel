export type RoiInputs = {
  monthlyStaffCostUsd: number
  monthlyLeads: number
  currentCloseRatePct: number
  averageCustomerValueUsd: number
  avgInitialResponseTimeMinutes: number
}

export type RoiOutputs = {
  improvedCloseRatePct: number
  responseTimeUpliftFactor: number
  followUpUpliftFactor: number
  additionalConversionsPerMonth: number
  additionalAnnualRevenueUsd: number
  annualStaffSavingsUsd: number
  totalAnnualImpactUsd: number
  hoursSavedWeekly: number
  monthlyCompoundingGrowthRate: number
  capacityIncreasePct: number
  retentionImprovementPct: number
}

/**
 * Data-backed assumptions used by the calculator.
 * Based on industry research for fitness coaching businesses:
 * - AI can handle 50% of initial client inquiries (Wifitalents)
 * - AI users save 12 hours/week on admin work (FM Consulting)
 * - Client capacity increases by 30% without proportional cost (Financial Model Excel)
 * - Conversion rates improve 25-28% with AI lead scoring (FM Consulting)
 * - Retention increases up to 25% with AI personalization (Financial Model)
 * - 5% retention increase = 25-95% profitability increase (Financial Model)
 */
const ASSUMPTIONS = {
  automatedResponseTimeMinutes: 2, // with AI
  responseTimeSensitivityK: 0.5, // controls strength of response time effect (60 -> 2 min ≈ 2.5x)
  followUpUpliftFactor: 1.27, // 27% average conversion improvement (midpoint of 25-28% range)
  adminMinutesPerLeadBaseline: 18, // ~0.3 hours manual work per lead
  adminAutomationReduction: 0.75, // 75% reduction of repetitive admin (conservative, industry shows 70-90%)
  avgStaffHourlyUsd: 25,
  staffCostSavingsRate: 0.35, // 35% staff overhead reduction (AI handles 50% inquiries + automation)
  clientCapacityIncrease: 0.30, // 30% more clients without proportional cost increase
  retentionImprovement: 0.20, // 20% retention improvement (conservative, industry shows up to 25%)
  inquiryAutomationRate: 0.50, // 50% of inquiries handled by AI
  compoundingGrowthRate: 0.025, // 2.5% monthly compounding growth from reinvested time savings
  clamp: {
    minUplift: 1.0,
    maxUplift: 4.0
  }
} as const

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function computeResponseTimeUplift(currentMinutes: number): number {
  const a = ASSUMPTIONS.responseTimeSensitivityK
  const baseline = currentMinutes
  const target = ASSUMPTIONS.automatedResponseTimeMinutes
  // Smooth, monotonic uplift: 1 + k*ln((baseline+1)/(target+1))
  const uplift = 1 + a * Math.log((baseline + 1) / (target + 1))
  return clamp(uplift, ASSUMPTIONS.clamp.minUplift, ASSUMPTIONS.clamp.maxUplift)
}

export function computeRoi(inputs: RoiInputs): RoiOutputs {
  const {
    monthlyStaffCostUsd,
    monthlyLeads,
    currentCloseRatePct,
    averageCustomerValueUsd,
    avgInitialResponseTimeMinutes
  } = inputs

  // Close rate improvement - asymptotically approaches 100% but never reaches it
  // Formula: newRate = currentRate + (improvementFactor * (100 - currentRate))
  // This means a 25% improvement moves 25% closer to 100%, not multiplies by 1.25
  const responseTimeUpliftFactor = computeResponseTimeUplift(avgInitialResponseTimeMinutes)
  const followUpUpliftFactor = ASSUMPTIONS.followUpUpliftFactor
  // Combined improvement factor (e.g., 1.27 = 27% improvement)
  const totalImprovementFactor = responseTimeUpliftFactor * followUpUpliftFactor
  // Convert to improvement percentage (e.g., 1.27 -> 0.27 = 27%)
  const improvementPercentage = totalImprovementFactor - 1
  // Apply asymptotic improvement: move improvementPercentage% closer to 100%
  const gapTo100 = 100 - currentCloseRatePct
  const improvementAmount = gapTo100 * improvementPercentage
  const improvedCloseRatePct = clamp(
    currentCloseRatePct + improvementAmount,
    0,
    99.99 // Never reach exactly 100%
  )

  // Conversions and revenue (with AI capacity increase)
  // AI enables handling 30% more leads without proportional cost
  // Handle zero leads gracefully
  const effectiveMonthlyLeads = Math.max(0, monthlyLeads * (1 + ASSUMPTIONS.clientCapacityIncrease))
  const additionalConversionsPerMonth = Math.max(
    0,
    Math.round((effectiveMonthlyLeads * (improvedCloseRatePct - currentCloseRatePct)) / 100)
  )
  
  // Base additional revenue from improved conversion
  // Handle zero customer value gracefully
  const baseAdditionalMonthlyRevenue = additionalConversionsPerMonth * Math.max(averageCustomerValueUsd, 0)
  
  // Compounding effect: improved retention increases lifetime value
  // 20% retention improvement = ~25% increase in customer lifetime value
  const retentionMultiplier = 1 + (ASSUMPTIONS.retentionImprovement * 1.25)
  const additionalAnnualRevenueUsd = Math.round(
    baseAdditionalMonthlyRevenue * 12 * retentionMultiplier
  )

  // Staff savings (compounding: AI handles inquiries + automates tasks)
  // 35% reduction from inquiry automation (50%) + task automation (75% of remaining)
  const annualStaffSavingsUsd = Math.round(monthlyStaffCostUsd * ASSUMPTIONS.staffCostSavingsRate * 12)

  // Hours saved (admin + onboarding + staff overhead + inquiry handling)
  const hoursSavedAdminMonthly =
    (effectiveMonthlyLeads * (ASSUMPTIONS.adminMinutesPerLeadBaseline / 60)) * ASSUMPTIONS.adminAutomationReduction
  const hoursSavedOnboardingMonthly = additionalConversionsPerMonth * 0.5 // reduced onboarding ops
  const hoursSavedStaffOverheadMonthly =
    (monthlyStaffCostUsd / ASSUMPTIONS.avgStaffHourlyUsd) * ASSUMPTIONS.staffCostSavingsRate
  // AI handles 50% of inquiries, saving ~5 min per inquiry
  const hoursSavedInquiriesMonthly = (effectiveMonthlyLeads * ASSUMPTIONS.inquiryAutomationRate * 5) / 60

  const hoursSavedWeekly = Math.round(
    (hoursSavedAdminMonthly + hoursSavedOnboardingMonthly + hoursSavedStaffOverheadMonthly + hoursSavedInquiriesMonthly) / 4
  )

  // Compounding growth: reinvested time savings enable more client acquisition
  // Each month, saved time compounds into additional capacity
  const monthlyCompoundingGrowthRate = ASSUMPTIONS.compoundingGrowthRate

  const totalAnnualImpactUsd = annualStaffSavingsUsd + additionalAnnualRevenueUsd

  return {
    improvedCloseRatePct: Math.round(improvedCloseRatePct * 10) / 10,
    responseTimeUpliftFactor: Math.round(responseTimeUpliftFactor * 100) / 100,
    followUpUpliftFactor,
    additionalConversionsPerMonth,
    additionalAnnualRevenueUsd,
    annualStaffSavingsUsd,
    totalAnnualImpactUsd,
    hoursSavedWeekly,
    monthlyCompoundingGrowthRate,
    capacityIncreasePct: ASSUMPTIONS.clientCapacityIncrease * 100,
    retentionImprovementPct: ASSUMPTIONS.retentionImprovement * 100
  }
}

