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

export type CalibrationKPIs = {
  followUpUpliftFactor: number // Conversion improvement (25-28% range)
  adminAutomationReduction: number // Admin task reduction (70-90% range)
  staffCostSavingsRate: number // Staff overhead reduction
  clientCapacityIncrease: number // Capacity increase (30% baseline)
  retentionImprovement: number // Retention improvement (20% baseline)
  inquiryAutomationRate: number // Inquiry automation (50% baseline)
  compoundingGrowthRate: number // Monthly compounding (2.5% baseline)
  conservativeLiberalFactor: number // 0 = conservative, 1 = liberal
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

  // Close rate improvement
  const responseTimeUpliftFactor = computeResponseTimeUplift(avgInitialResponseTimeMinutes)
  const improvedCloseRatePct = clamp(
    currentCloseRatePct * responseTimeUpliftFactor * followUpUpliftFactor,
    0,
    100
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
    retentionImprovementPct: retentionImprovement * 100
  }
}

