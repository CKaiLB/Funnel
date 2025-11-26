export type RoiInputs = {
  monthlyStaffCostUsd: number
  monthlyLeads: number
  currentCloseRatePct: number
  averageCustomerValueUsd: number
  avgInitialResponseTimeMinutes: number
  monthlyClients?: number // Optional: for business maturity scoring
  monthlyRevenue?: number // Optional: for business maturity scoring
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
  aiGrowthScore: number
  aiGrowthScoreBreakdown: {
    businessMaturityScore: number
    revenueGrowthScore: number
    closeRateImprovementScore: number
    costSavingsScore: number
    efficiencyGainsScore: number
    capacityExpansionScore: number
    retentionImprovementScore: number
    compoundingGrowthScore: number
  }
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
  },
  closeRate: {
    maxAchievable: 0.85, // 85% realistic maximum (industry research: 70-85% is excellent, 90%+ unrealistic)
    maxImprovementPercentage: 1.5, // Cap improvement at 150% (prevents unrealistic gains)
    asymptoticCurve: 0.3 // Controls how aggressively the curve slows near maximum (higher = more aggressive)
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

  // Close rate improvement - uses three combined approaches:
  // 1. Realistic maximum cap (85% - industry research shows 70-85% is excellent, 90%+ unrealistic)
  // 2. Capped improvement percentage (max 150% to prevent unrealistic gains)
  // 3. Asymptotic curve that slows dramatically as it approaches maximum
  const responseTimeUpliftFactor = computeResponseTimeUplift(avgInitialResponseTimeMinutes)
  const followUpUpliftFactor = ASSUMPTIONS.followUpUpliftFactor
  // Combined improvement factor (e.g., 1.27 = 27% improvement)
  const totalImprovementFactor = responseTimeUpliftFactor * followUpUpliftFactor
  // Convert to improvement percentage and cap it (e.g., 1.27 -> 0.27 = 27%, max 1.5 = 150%)
  const improvementPercentage = Math.min(
    totalImprovementFactor - 1,
    ASSUMPTIONS.closeRate.maxImprovementPercentage
  )
  
  // Calculate gap to realistic maximum (85% instead of 100%)
  const maxAchievablePct = ASSUMPTIONS.closeRate.maxAchievable * 100
  const gapToMax = maxAchievablePct - currentCloseRatePct
  
  // Apply asymptotic curve: improvement slows as we approach maximum
  // Uses exponential decay: improvement = baseImprovement * (1 - (currentRate/maxRate)^curve)
  // Higher curve value = more aggressive slowing near maximum
  const distanceFromMax = Math.max(0, gapToMax)
  const normalizedDistance = distanceFromMax / maxAchievablePct // 0 to 1
  const asymptoticMultiplier = 1 - Math.pow(normalizedDistance, ASSUMPTIONS.closeRate.asymptoticCurve)
  
  // Calculate improvement amount with asymptotic curve applied
  const baseImprovementAmount = gapToMax * improvementPercentage
  const asymptoticImprovementAmount = baseImprovementAmount * (0.3 + 0.7 * asymptoticMultiplier)
  
  // Apply improvement and clamp to realistic maximum
  const improvedCloseRatePct = clamp(
    currentCloseRatePct + asymptoticImprovementAmount,
    0,
    maxAchievablePct // 85% maximum, never reaches 100%
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

  // Calculate AI Growth Score (0-10, increments of 0.1)
  // Enterprise-grade scoring based on scaling opportunity across all dimensions
  const aiGrowthScoreData = computeAiGrowthScore({
    inputs,
    outputs: {
      improvedCloseRatePct,
      additionalAnnualRevenueUsd,
      annualStaffSavingsUsd,
      totalAnnualImpactUsd,
      hoursSavedWeekly,
      monthlyCompoundingGrowthRate,
      capacityIncreasePct: ASSUMPTIONS.clientCapacityIncrease * 100,
      retentionImprovementPct: ASSUMPTIONS.retentionImprovement * 100,
      additionalConversionsPerMonth,
      effectiveMonthlyLeads
    }
  })

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
    retentionImprovementPct: ASSUMPTIONS.retentionImprovement * 100,
    aiGrowthScore: aiGrowthScoreData.score,
    aiGrowthScoreBreakdown: aiGrowthScoreData.breakdown
  }
}

/**
 * Computes the AI Growth Score (0-10) based on scaling opportunity across all dimensions.
 * Enterprise-grade scoring methodology based on:
 * - Revenue growth potential (weighted by current scale)
 * - Close rate improvement opportunity (more room = higher score)
 * - Cost savings potential (relative to current costs)
 * - Efficiency gains (time savings)
 * - Capacity expansion potential (lead volume and scalability)
 * - Retention improvement opportunity
 * - Compounding growth potential
 * 
 * Each component is normalized to 0-1 scale, weighted, and combined.
 * Score is rounded to 0.1 increments for clarity.
 */
function computeAiGrowthScore(params: {
  inputs: RoiInputs
  outputs: {
    improvedCloseRatePct: number
    additionalAnnualRevenueUsd: number
    annualStaffSavingsUsd: number
    totalAnnualImpactUsd: number
    hoursSavedWeekly: number
    monthlyCompoundingGrowthRate: number
    capacityIncreasePct: number
    retentionImprovementPct: number
    additionalConversionsPerMonth: number
    effectiveMonthlyLeads: number
  }
}): {
  score: number
  breakdown: {
    businessMaturityScore: number
    revenueGrowthScore: number
    closeRateImprovementScore: number
    costSavingsScore: number
    efficiencyGainsScore: number
    capacityExpansionScore: number
    retentionImprovementScore: number
    compoundingGrowthScore: number
  }
} {
  const { inputs, outputs } = params
  const {
    monthlyStaffCostUsd,
    monthlyLeads,
    currentCloseRatePct,
    averageCustomerValueUsd,
    monthlyClients,
    monthlyRevenue
  } = inputs

  // Use provided revenue or estimate from leads/close rate/customer value
  const estimatedMonthlyRevenue = monthlyRevenue || Math.max(
    1000, // Minimum baseline to avoid division by zero
    monthlyLeads * (currentCloseRatePct / 100) * Math.max(averageCustomerValueUsd, 100)
  )
  const estimatedAnnualRevenue = estimatedMonthlyRevenue * 12

  // Calculate or estimate monthly clients
  const estimatedMonthlyClients = monthlyClients || Math.max(
    0,
    Math.round(monthlyLeads * (currentCloseRatePct / 100))
  )

  // Business Maturity Factor (30% weight) - Qualifies leads based on scale
  // Target: 5-10 clients and $5-10k/month revenue = high maturity (7+ score)
  // Below that = lower maturity (should score < 7)
  const clientMaturityScore = (() => {
    if (estimatedMonthlyClients >= 5 && estimatedMonthlyClients <= 10) {
      return 1.0 // Perfect range
    } else if (estimatedMonthlyClients >= 3 && estimatedMonthlyClients < 5) {
      return 0.6 // Close but below target
    } else if (estimatedMonthlyClients > 10 && estimatedMonthlyClients <= 15) {
      return 0.9 // Slightly above, still good
    } else if (estimatedMonthlyClients > 15) {
      return 0.8 // Larger scale, different dynamics
    } else {
      return 0.3 // Too small, not ready
    }
  })()

  const revenueMaturityScore = (() => {
    if (estimatedMonthlyRevenue >= 5000 && estimatedMonthlyRevenue <= 10000) {
      return 1.0 // Perfect range
    } else if (estimatedMonthlyRevenue >= 3000 && estimatedMonthlyRevenue < 5000) {
      return 0.6 // Close but below target
    } else if (estimatedMonthlyRevenue > 10000 && estimatedMonthlyRevenue <= 15000) {
      return 0.9 // Slightly above, still good
    } else if (estimatedMonthlyRevenue > 15000) {
      return 0.8 // Larger scale
    } else {
      return 0.3 // Too small, not ready
    }
  })()

  // Combined maturity score (both client count and revenue must be in target range)
  // This ensures businesses with 5-10 clients AND $5-10k revenue score highest
  const businessMaturityScore = (clientMaturityScore * 0.5) + (revenueMaturityScore * 0.5)

  // 1. Revenue Growth Potential (25% weight)
  // Score based on total annual impact relative to current revenue
  // Higher impact relative to current revenue = higher scaling opportunity
  // Normalized: 0% impact = 0, 100%+ impact = 1.0, 200%+ impact = 1.0 (capped)
  const revenueImpactRatio = estimatedAnnualRevenue > 0
    ? outputs.totalAnnualImpactUsd / estimatedAnnualRevenue
    : 0
  const revenueGrowthScore = Math.min(1.0, revenueImpactRatio / 1.0) // 100% impact = full score

  // 2. Close Rate Improvement Opportunity (20% weight)
  // More room to improve = higher opportunity score
  // Score based on: (improvement amount) / (maximum possible improvement)
  // Maximum improvement = moving from current to 100%
  const closeRateImprovement = outputs.improvedCloseRatePct - currentCloseRatePct
  const maxPossibleImprovement = 100 - currentCloseRatePct
  const closeRateImprovementScore = maxPossibleImprovement > 0
    ? Math.min(1.0, closeRateImprovement / maxPossibleImprovement)
    : 0

  // 3. Cost Savings Potential (15% weight)
  // Score based on staff savings relative to current staff costs
  // Higher savings relative to costs = higher opportunity
  // Normalized: 0% savings = 0, 35%+ savings = 1.0 (capped at assumption rate)
  const costSavingsRatio = monthlyStaffCostUsd > 0
    ? (outputs.annualStaffSavingsUsd / 12) / monthlyStaffCostUsd
    : 0
  const costSavingsScore = Math.min(1.0, costSavingsRatio / ASSUMPTIONS.staffCostSavingsRate)

  // 4. Efficiency Gains (15% weight)
  // Score based on hours saved per week
  // More hours saved = higher efficiency opportunity
  // Normalized: 0 hours = 0, 20+ hours/week = 1.0 (enterprise benchmark)
  const efficiencyGainsScore = Math.min(1.0, outputs.hoursSavedWeekly / 20)

  // 5. Capacity Expansion Potential (10% weight)
  // Score based on lead volume and capacity increase
  // Higher lead volume with capacity expansion = higher scaling opportunity
  // Normalized: 0 leads = 0, 100+ leads/month = 1.0 (scales logarithmically for larger volumes)
  const capacityExpansionScore = monthlyLeads > 0
    ? Math.min(1.0, Math.log10(Math.max(1, monthlyLeads)) / Math.log10(100))
    : 0

  // 6. Retention Improvement Opportunity (10% weight)
  // Score based on retention improvement percentage
  // Higher improvement = higher opportunity
  // Normalized: 0% improvement = 0, 20%+ improvement = 1.0 (matches assumption)
  const retentionImprovementScore = Math.min(
    1.0,
    outputs.retentionImprovementPct / (ASSUMPTIONS.retentionImprovement * 100)
  )

  // 7. Compounding Growth Potential (5% weight)
  // Score based on monthly compounding growth rate
  // Higher compounding rate = higher long-term scaling potential
  // Normalized: 0% = 0, 2.5%+ = 1.0 (matches assumption)
  const compoundingGrowthScore = Math.min(
    1.0,
    outputs.monthlyCompoundingGrowthRate / ASSUMPTIONS.compoundingGrowthRate
  )

  // Weighted combination - Business maturity is 30% to ensure proper qualification
  const weights = {
    businessMaturity: 0.30, // NEW: Ensures 5-10 clients + $5-10k revenue score 7+
    revenueGrowth: 0.20, // Reduced from 0.25
    closeRateImprovement: 0.15, // Reduced from 0.20
    costSavings: 0.12, // Reduced from 0.15
    efficiencyGains: 0.12, // Reduced from 0.15
    capacityExpansion: 0.06, // Reduced from 0.10
    retentionImprovement: 0.04, // Reduced from 0.10
    compoundingGrowth: 0.01 // Reduced from 0.05
  }

  const rawScore =
    businessMaturityScore * weights.businessMaturity +
    revenueGrowthScore * weights.revenueGrowth +
    closeRateImprovementScore * weights.closeRateImprovement +
    costSavingsScore * weights.costSavings +
    efficiencyGainsScore * weights.efficiencyGains +
    capacityExpansionScore * weights.capacityExpansion +
    retentionImprovementScore * weights.retentionImprovement +
    compoundingGrowthScore * weights.compoundingGrowth

  // Scale to 0-10 and round to 0.1 increments
  const score = Math.round(rawScore * 100) / 10
  const finalScore = clamp(score, 0, 10)

  return {
    score: finalScore,
    breakdown: {
      businessMaturityScore: Math.round(businessMaturityScore * 100) / 100,
      revenueGrowthScore: Math.round(revenueGrowthScore * 100) / 100,
      closeRateImprovementScore: Math.round(closeRateImprovementScore * 100) / 100,
      costSavingsScore: Math.round(costSavingsScore * 100) / 100,
      efficiencyGainsScore: Math.round(efficiencyGainsScore * 100) / 100,
      capacityExpansionScore: Math.round(capacityExpansionScore * 100) / 100,
      retentionImprovementScore: Math.round(retentionImprovementScore * 100) / 100,
      compoundingGrowthScore: Math.round(compoundingGrowthScore * 100) / 100
    }
  }
}

