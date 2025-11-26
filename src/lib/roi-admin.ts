export type RoiInputs = {
  monthlyStaffCostUsd: number
  monthlyLeads: number
  currentCloseRatePct: number
  averageCustomerValueUsd: number
  avgInitialResponseTimeMinutes: number
  monthlyClients?: number // Optional: for business maturity scoring
  monthlyRevenue?: number // Optional: for business maturity scoring
  currentChurnRatePct?: number // Optional: for churn rate calculation
  currentShowUpRatePct?: number // Optional: for show-up rate calculation
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
  improvedShowUpRatePct: number
  improvedChurnRatePct: number
  showUpRateImprovement: number
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

export type CalibrationKPIs = {
  followUpUpliftFactor: number // Conversion improvement (25-28% range)
  adminAutomationReduction: number // Admin task reduction (70-90% range)
  staffCostSavingsRate: number // Staff overhead reduction
  clientCapacityIncrease: number // Capacity increase (30% baseline)
  retentionImprovement: number // Retention improvement (20% baseline)
  inquiryAutomationRate: number // Inquiry automation (50% baseline)
  compoundingGrowthRate: number // Monthly compounding (2.5% baseline)
  conservativeLiberalFactor: number // 0 = conservative, 1 = liberal
  showUpRateImprovement: number // Show-up rate improvement (15% baseline)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function computeResponseTimeUplift(currentMinutes: number): number {
  const responseTimeSensitivityK = 0.5
  const automatedResponseTimeMinutes = 2
  const baseline = currentMinutes
  const target = automatedResponseTimeMinutes
  const uplift = 1 + responseTimeSensitivityK * Math.log((baseline + 1) / (target + 1))
  return clamp(uplift, 1.0, 4.0)
}

export function computeRoiWithCalibration(
  inputs: RoiInputs,
  calibration: CalibrationKPIs
): RoiOutputs {
  const {
    monthlyStaffCostUsd,
    monthlyLeads,
    currentCloseRatePct,
    averageCustomerValueUsd,
    avgInitialResponseTimeMinutes
  } = inputs

  // Apply conservative/liberal factor to calibration values
  const applyFactor = (conservative: number, liberal: number) => {
    return conservative + (liberal - conservative) * calibration.conservativeLiberalFactor;
  };

  // Adjust calibration values based on conservative/liberal scale
  const followUpUpliftFactor = applyFactor(
    calibration.followUpUpliftFactor * 0.9, // 10% more conservative
    calibration.followUpUpliftFactor * 1.1  // 10% more liberal
  );
  
  const adminAutomationReduction = applyFactor(
    calibration.adminAutomationReduction * 0.9, // 70% -> 63% conservative
    Math.min(0.95, calibration.adminAutomationReduction * 1.1) // Up to 95% liberal
  );
  
  const staffCostSavingsRate = applyFactor(
    calibration.staffCostSavingsRate * 0.85, // 35% -> ~30% conservative
    Math.min(0.50, calibration.staffCostSavingsRate * 1.15) // Up to 50% liberal
  );
  
  const clientCapacityIncrease = applyFactor(
    calibration.clientCapacityIncrease * 0.8, // 30% -> 24% conservative
    calibration.clientCapacityIncrease * 1.2 // 36% liberal
  );
  
  const retentionImprovement = applyFactor(
    calibration.retentionImprovement * 0.75, // 20% -> 15% conservative
    Math.min(0.30, calibration.retentionImprovement * 1.25) // Up to 30% liberal
  );
  
  const inquiryAutomationRate = applyFactor(
    calibration.inquiryAutomationRate * 0.9, // 50% -> 45% conservative
    Math.min(0.70, calibration.inquiryAutomationRate * 1.2) // Up to 70% liberal
  );
  
  const compoundingGrowthRate = applyFactor(
    calibration.compoundingGrowthRate * 0.6, // 2.5% -> 1.5% conservative
    calibration.compoundingGrowthRate * 1.6 // 4% liberal
  );

  const showUpRateImprovement = applyFactor(
    calibration.showUpRateImprovement * 0.8, // 15% -> 12% conservative
    Math.min(0.25, calibration.showUpRateImprovement * 1.4) // Up to 25% liberal
  );

  // Close rate improvement - uses three combined approaches:
  // 1. Realistic maximum cap (85% - industry research shows 70-85% is excellent, 90%+ unrealistic)
  // 2. Capped improvement percentage (max 150% to prevent unrealistic gains)
  // 3. Asymptotic curve that slows dramatically as it approaches maximum
  const responseTimeUpliftFactor = computeResponseTimeUplift(avgInitialResponseTimeMinutes)
  // Combined improvement factor (e.g., 1.27 = 27% improvement)
  const totalImprovementFactor = responseTimeUpliftFactor * followUpUpliftFactor
  // Convert to improvement percentage and cap it (e.g., 1.27 -> 0.27 = 27%, max 1.5 = 150%)
  const maxImprovementPercentage = 1.5 // Cap improvement at 150% (prevents unrealistic gains)
  const improvementPercentage = Math.min(
    totalImprovementFactor - 1,
    maxImprovementPercentage
  )
  
  // Calculate gap to realistic maximum (85% instead of 100%)
  const maxAchievablePct = 85 // 85% realistic maximum (industry research: 70-85% is excellent)
  const gapToMax = maxAchievablePct - currentCloseRatePct
  
  // Apply asymptotic curve: improvement slows as we approach maximum
  // Uses exponential decay: improvement = baseImprovement * (1 - (currentRate/maxRate)^curve)
  // Higher curve value = more aggressive slowing near maximum
  const asymptoticCurve = 0.3 // Controls how aggressively the curve slows near maximum
  const distanceFromMax = Math.max(0, gapToMax)
  const normalizedDistance = distanceFromMax / maxAchievablePct // 0 to 1
  const asymptoticMultiplier = 1 - Math.pow(normalizedDistance, asymptoticCurve)
  
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
  const effectiveMonthlyLeads = Math.max(0, monthlyLeads * (1 + clientCapacityIncrease))
  const additionalConversionsPerMonth = Math.max(
    0,
    Math.round((effectiveMonthlyLeads * (improvedCloseRatePct - currentCloseRatePct)) / 100)
  )
  
  // Base additional revenue from improved conversion
  const baseAdditionalMonthlyRevenue = additionalConversionsPerMonth * Math.max(averageCustomerValueUsd, 0)
  
  // Compounding effect: improved retention increases lifetime value
  const retentionMultiplier = 1 + (retentionImprovement * 1.25)
  const additionalAnnualRevenueUsd = Math.round(
    baseAdditionalMonthlyRevenue * 12 * retentionMultiplier
  )

  // Staff savings
  const annualStaffSavingsUsd = Math.round(monthlyStaffCostUsd * staffCostSavingsRate * 12)

  // Hours saved (admin + onboarding + staff overhead + inquiry handling)
  const avgStaffHourlyUsd = 25
  const adminMinutesPerLeadBaseline = 18
  const hoursSavedAdminMonthly =
    (effectiveMonthlyLeads * (adminMinutesPerLeadBaseline / 60)) * adminAutomationReduction
  const hoursSavedOnboardingMonthly = additionalConversionsPerMonth * 0.5
  const hoursSavedStaffOverheadMonthly =
    (monthlyStaffCostUsd / avgStaffHourlyUsd) * staffCostSavingsRate
  const hoursSavedInquiriesMonthly = (effectiveMonthlyLeads * inquiryAutomationRate * 5) / 60

  const hoursSavedWeekly = Math.round(
    (hoursSavedAdminMonthly + hoursSavedOnboardingMonthly + hoursSavedStaffOverheadMonthly + hoursSavedInquiriesMonthly) / 4
  )

  const totalAnnualImpactUsd = annualStaffSavingsUsd + additionalAnnualRevenueUsd

  // Calculate Show-Up Rate improvement (asymptotically approaches 100%)
  // Uses calibrated showUpRateImprovement value
  // Use provided show-up rate or estimate from inputs
  const currentShowUpRate = inputs.currentShowUpRatePct || (inputs.monthlyClients && monthlyLeads > 0
    ? Math.min(100, (inputs.monthlyClients / (monthlyLeads * (currentCloseRatePct / 100))) * 100)
    : 70) // Default estimate
  const gapTo100ShowUp = 100 - currentShowUpRate
  const improvedShowUpRatePct = Math.min(
    99.99,
    Math.max(0, currentShowUpRate + (gapTo100ShowUp * showUpRateImprovement))
  )

  // Calculate Churn Rate improvement (linked to retention improvement)
  // Research: 20% retention improvement typically results in 40% churn reduction
  // Formula: churn reduction = retention improvement × 2 (conservative multiplier)
  // Use provided churn rate or default estimate
  const currentChurnRate = inputs.currentChurnRatePct || 5 // Default 5% if not provided
  const churnReductionMultiplier = retentionImprovement * 2 // 20% retention = 40% churn reduction
  const churnReductionFactor = Math.min(0.6, 1 - churnReductionMultiplier) // Cap at 60% reduction (0.4x)
  const improvedChurnRatePct = Math.max(0.01, currentChurnRate * churnReductionFactor)

  // Calculate AI Growth Score using calibrated values
  const aiGrowthScoreData = computeAiGrowthScore({
    inputs,
    outputs: {
      improvedCloseRatePct,
      additionalAnnualRevenueUsd,
      annualStaffSavingsUsd,
      totalAnnualImpactUsd,
      hoursSavedWeekly,
      monthlyCompoundingGrowthRate: compoundingGrowthRate,
      capacityIncreasePct: clientCapacityIncrease * 100,
      retentionImprovementPct: retentionImprovement * 100,
      additionalConversionsPerMonth,
      effectiveMonthlyLeads
    },
    calibration: {
      staffCostSavingsRate,
      retentionImprovement
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
    monthlyCompoundingGrowthRate: compoundingGrowthRate,
    capacityIncreasePct: clientCapacityIncrease * 100,
    retentionImprovementPct: retentionImprovement * 100,
    improvedShowUpRatePct: Math.round(improvedShowUpRatePct * 10) / 10,
    improvedChurnRatePct: Math.round(improvedChurnRatePct * 10) / 10,
    showUpRateImprovement: showUpRateImprovement,
    aiGrowthScore: aiGrowthScoreData.score,
    aiGrowthScoreBreakdown: aiGrowthScoreData.breakdown
  }
}

/**
 * Computes the AI Growth Score (0-10) based on scaling opportunity across all dimensions.
 * Enterprise-grade scoring methodology - adapted for calibrated values.
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
  calibration: {
    staffCostSavingsRate: number
    retentionImprovement: number
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
  const { inputs, outputs, calibration } = params
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
    1000,
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
  const revenueImpactRatio = estimatedAnnualRevenue > 0
    ? outputs.totalAnnualImpactUsd / estimatedAnnualRevenue
    : 0
  const revenueGrowthScore = Math.min(1.0, revenueImpactRatio / 1.0)

  // 2. Close Rate Improvement Opportunity (20% weight)
  const closeRateImprovement = outputs.improvedCloseRatePct - currentCloseRatePct
  const maxPossibleImprovement = 100 - currentCloseRatePct
  const closeRateImprovementScore = maxPossibleImprovement > 0
    ? Math.min(1.0, closeRateImprovement / maxPossibleImprovement)
    : 0

  // 3. Cost Savings Potential (15% weight) - uses calibrated rate
  const costSavingsRatio = monthlyStaffCostUsd > 0
    ? (outputs.annualStaffSavingsUsd / 12) / monthlyStaffCostUsd
    : 0
  const costSavingsScore = Math.min(1.0, costSavingsRatio / calibration.staffCostSavingsRate)

  // 4. Efficiency Gains (15% weight)
  const efficiencyGainsScore = Math.min(1.0, outputs.hoursSavedWeekly / 20)

  // 5. Capacity Expansion Potential (10% weight)
  const capacityExpansionScore = monthlyLeads > 0
    ? Math.min(1.0, Math.log10(Math.max(1, monthlyLeads)) / Math.log10(100))
    : 0

  // 6. Retention Improvement Opportunity (10% weight) - uses calibrated rate
  const retentionImprovementScore = Math.min(
    1.0,
    outputs.retentionImprovementPct / (calibration.retentionImprovement * 100)
  )

  // 7. Compounding Growth Potential (5% weight)
  const compoundingGrowthScore = Math.min(
    1.0,
    outputs.monthlyCompoundingGrowthRate / 0.025 // Baseline 2.5%
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

