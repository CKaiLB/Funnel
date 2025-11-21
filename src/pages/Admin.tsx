import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  DollarSign, Clock, TrendingUp, BarChart3, Settings, 
  Target, Users, Zap, AlertTriangle, LineChart as LineChartIcon,
  Gauge, Activity
} from "lucide-react";
import { computeRoiWithCalibration, type CalibrationKPIs } from "@/lib/roi-admin";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface QuizAnswers {
  monthlyClients: number;
  monthlyLeads: number;
  monthlyRevenue: number;
  closeRate: number;
  weeklyAdminHours: number;
  showUpRate: number;
  churnRate: number;
  monthlyHiringCosts: number;
  monthlyTrainingCosts: number;
  monthlyOperationalExpenses: number;
}

export default function Admin() {
  // Quiz answers state
  const [answers, setAnswers] = useState<QuizAnswers>({
    monthlyClients: 20,
    monthlyLeads: 50,
    monthlyRevenue: 10000,
    closeRate: 15,
    weeklyAdminHours: 15,
    showUpRate: 70,
    churnRate: 5,
    monthlyHiringCosts: 2000,
    monthlyTrainingCosts: 1500,
    monthlyOperationalExpenses: 5000,
  });

  // Calibration KPIs state
  const [calibration, setCalibration] = useState<CalibrationKPIs>({
    followUpUpliftFactor: 1.27, // 27% conversion improvement
    adminAutomationReduction: 0.75, // 75% admin reduction
    staffCostSavingsRate: 0.35, // 35% staff overhead reduction
    clientCapacityIncrease: 0.30, // 30% capacity increase
    retentionImprovement: 0.20, // 20% retention improvement
    inquiryAutomationRate: 0.50, // 50% inquiry automation
    compoundingGrowthRate: 0.025, // 2.5% monthly compounding
    conservativeLiberalFactor: 0.5, // Middle of the road (0 = conservative, 1 = liberal)
  });

  // Calculate derived values
  const customerValue = answers.monthlyClients > 0 
    ? answers.monthlyRevenue / answers.monthlyClients 
    : (answers.monthlyRevenue > 0 ? answers.monthlyRevenue : 500);
  const monthlyStaffPayment = answers.monthlyHiringCosts + 
                              answers.monthlyTrainingCosts + 
                              answers.monthlyOperationalExpenses;
  const avgResponseMinutes = 60;

  // Calculate ROI with calibration
  const roi = computeRoiWithCalibration(
    {
      monthlyStaffCostUsd: monthlyStaffPayment,
      monthlyLeads: answers.monthlyLeads,
      currentCloseRatePct: answers.closeRate,
      averageCustomerValueUsd: customerValue,
      avgInitialResponseTimeMinutes: avgResponseMinutes,
    },
    calibration
  );

  // Calculate improvements
  const hoursSavedWeekly = roi.hoursSavedWeekly;
  const monthlyRevenuePotential = Math.round(
    (roi.additionalAnnualRevenueUsd / 12) + (roi.annualStaffSavingsUsd / 12)
  );
  const yearlyGrowthPotential = roi.totalAnnualImpactUsd;
  // Close rate: Already calculated asymptotically in ROI (moves closer to 100%, never reaches it)
  const improvedCloseRate = Math.min(99.99, Math.max(0, roi.improvedCloseRatePct));
  // Show-up rate: 15% improvement - asymptotically approaches 100%
  // Move 15% closer to 100% (not multiply by 1.15)
  const showUpRateImprovement = 0.15; // 15% of remaining gap
  const gapTo100ShowUp = 100 - answers.showUpRate;
  const improvedShowUpRate = Math.min(99.99, Math.max(0, answers.showUpRate + (gapTo100ShowUp * showUpRateImprovement)));
  // Churn rate: 40% reduction (multiply by 0.6) - approaches 0% asymptotically
  const improvedChurnRate = Math.max(0.01, answers.churnRate * 0.6); // Never reach exactly 0%
  
  // Calculate potential increase in clients
  // Based on: improved close rate + capacity increase + reduced churn
  // Industry data: AI enables 30% capacity increase without proportional cost (Financial Model Excel)
  const capacityIncreaseFactor = 1 + (roi.capacityIncreasePct / 100);
  const additionalConversions = Math.max(0, Math.round((answers.monthlyLeads * (improvedCloseRate - answers.closeRate)) / 100));
  const potentialMonthlyClients = Math.round(
    answers.monthlyClients * capacityIncreaseFactor + additionalConversions
  );
  const potentialClientIncrease = potentialMonthlyClients - answers.monthlyClients;

  // Growth curve calculation
  const monthlyRevenueIncrease = Math.max(0, monthlyRevenuePotential);
  const aiMonthlyRevenue = Math.max(0, answers.monthlyRevenue) + monthlyRevenueIncrease;
  const naturalGrowthRate = 0.01;
  const aiCompoundingGrowthRate = roi.monthlyCompoundingGrowthRate || 0.025;
  const capacityGrowthRate = roi.capacityIncreasePct / 100 / 12;
  const aiGrowthRate = aiCompoundingGrowthRate + capacityGrowthRate;

  // Generate growth curve data
  const growthCurveData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const baseRevenue = Math.max(0, answers.monthlyRevenue);
    let cumulativeBaseline = 0;
    for (let m = 1; m <= month; m++) {
      const monthlyBaseline = baseRevenue * Math.pow(1 + naturalGrowthRate, m - 1);
      cumulativeBaseline += monthlyBaseline;
    }
    
    let cumulativeAI = 0;
    let currentAIMonthlyRevenue = Math.max(0, aiMonthlyRevenue);
    for (let m = 1; m <= month; m++) {
      if (m > 1) {
        currentAIMonthlyRevenue = currentAIMonthlyRevenue * (1 + aiGrowthRate);
      }
      cumulativeAI += currentAIMonthlyRevenue;
    }
    
    return {
      month: `M${month}`,
      current: Math.round(cumulativeBaseline),
      projected: Math.round(Math.max(cumulativeAI, cumulativeBaseline)),
      difference: Math.round(Math.max(cumulativeAI, cumulativeBaseline) - cumulativeBaseline),
    };
  });

  // KPI comparison data
  const kpiComparisonData = [
    {
      metric: "Close Rate",
      current: answers.closeRate,
      improved: improvedCloseRate,
      improvement: improvedCloseRate - answers.closeRate,
    },
    {
      metric: "Show-Up Rate",
      current: answers.showUpRate,
      improved: improvedShowUpRate,
      improvement: improvedShowUpRate - answers.showUpRate,
    },
    {
      metric: "Churn Rate",
      current: answers.churnRate,
      improved: improvedChurnRate,
      improvement: answers.churnRate - improvedChurnRate,
    },
  ];

  const updateAnswer = (field: keyof QuizAnswers, value: number) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const updateCalibration = (field: keyof CalibrationKPIs, value: number) => {
    setCalibration((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-900 overflow-x-hidden">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <div className="text-sm text-gray-400">
            AI Scaling Report Configuration
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)] overflow-hidden">
        {/* Left Panel - Quiz Questions & Calibration */}
        <div className="w-1/2 border-r border-gray-700 overflow-y-auto bg-gray-900">
          <div className="p-6 space-y-6">
            {/* Quiz Questions Section */}
            <Card className="p-6 bg-gray-800/50 border-blue-500/30">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Business Inputs
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white text-sm">Monthly Clients</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={answers.monthlyClients === 0 ? "0" : answers.monthlyClients || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") {
                        updateAnswer("monthlyClients", 0);
                      } else if (/^\d+$/.test(val)) {
                        updateAnswer("monthlyClients", parseInt(val, 10));
                      }
                    }}
                    className="bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white text-sm">Monthly Leads</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={answers.monthlyLeads === 0 ? "0" : answers.monthlyLeads || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") {
                        updateAnswer("monthlyLeads", 0);
                      } else if (/^\d+$/.test(val)) {
                        updateAnswer("monthlyLeads", parseInt(val, 10));
                      }
                    }}
                    className="bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white text-sm">Monthly Revenue ($)</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={answers.monthlyRevenue === 0 ? "0" : answers.monthlyRevenue || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d]/g, "");
                      updateAnswer("monthlyRevenue", val === "" ? 0 : parseInt(val, 10));
                    }}
                    className="bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white text-sm">Close Rate (%)</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={answers.closeRate === 0 ? "0" : answers.closeRate || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d.]/g, "").replace(/\./g, (m, o, s) => s.indexOf(".") === o ? m : "");
                      if (val !== "" && val !== ".") {
                        const num = parseFloat(val);
                        if (!isNaN(num) && num >= 0 && num <= 100) {
                          updateAnswer("closeRate", num);
                        }
                      } else {
                        updateAnswer("closeRate", 0);
                      }
                    }}
                    className="bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white text-sm">Weekly Admin Hours</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={answers.weeklyAdminHours === 0 ? "0" : answers.weeklyAdminHours || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d.]/g, "").replace(/\./g, (m, o, s) => s.indexOf(".") === o ? m : "");
                      if (val !== "" && val !== ".") {
                        const num = parseFloat(val);
                        if (!isNaN(num) && num >= 0) {
                          updateAnswer("weeklyAdminHours", num);
                        }
                      } else {
                        updateAnswer("weeklyAdminHours", 0);
                      }
                    }}
                    className="bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white text-sm">Show-Up Rate (%)</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={answers.showUpRate === 0 ? "0" : answers.showUpRate || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d.]/g, "").replace(/\./g, (m, o, s) => s.indexOf(".") === o ? m : "");
                      if (val !== "" && val !== ".") {
                        const num = parseFloat(val);
                        if (!isNaN(num) && num >= 0 && num <= 100) {
                          updateAnswer("showUpRate", num);
                        }
                      } else {
                        updateAnswer("showUpRate", 0);
                      }
                    }}
                    className="bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white text-sm">Churn Rate (%)</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={answers.churnRate === 0 ? "0" : answers.churnRate || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d.]/g, "").replace(/\./g, (m, o, s) => s.indexOf(".") === o ? m : "");
                      if (val !== "" && val !== ".") {
                        const num = parseFloat(val);
                        if (!isNaN(num) && num >= 0 && num <= 100) {
                          updateAnswer("churnRate", num);
                        }
                      } else {
                        updateAnswer("churnRate", 0);
                      }
                    }}
                    className="bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white text-sm">Hiring Costs ($/mo)</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={answers.monthlyHiringCosts === 0 ? "0" : answers.monthlyHiringCosts || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d]/g, "");
                      updateAnswer("monthlyHiringCosts", val === "" ? 0 : parseInt(val, 10));
                    }}
                    className="bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white text-sm">Training Costs ($/mo)</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={answers.monthlyTrainingCosts === 0 ? "0" : answers.monthlyTrainingCosts || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d]/g, "");
                      updateAnswer("monthlyTrainingCosts", val === "" ? 0 : parseInt(val, 10));
                    }}
                    className="bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-white text-sm">Operational Expenses ($/mo)</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={answers.monthlyOperationalExpenses === 0 ? "0" : answers.monthlyOperationalExpenses || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d]/g, "");
                      updateAnswer("monthlyOperationalExpenses", val === "" ? 0 : parseInt(val, 10));
                    }}
                    className="bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>
              </div>
            </Card>

            {/* Calibration KPIs Section */}
            <Card className="p-6 bg-gray-800/50 border-purple-500/30">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-purple-400" />
                Calibration KPIs
              </h2>
              <div className="space-y-6">
                {/* Conservative/Liberal Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-white font-semibold">Growth Projection Style</Label>
                    <div className="flex gap-4 text-xs">
                      <span className={`${calibration.conservativeLiberalFactor < 0.33 ? 'text-blue-400 font-bold' : 'text-gray-500'}`}>
                        Conservative
                      </span>
                      <span className={`${calibration.conservativeLiberalFactor >= 0.33 && calibration.conservativeLiberalFactor < 0.67 ? 'text-green-400 font-bold' : 'text-gray-500'}`}>
                        Balanced
                      </span>
                      <span className={`${calibration.conservativeLiberalFactor >= 0.67 ? 'text-purple-400 font-bold' : 'text-gray-500'}`}>
                        Liberal
                      </span>
                    </div>
                  </div>
                  <Slider
                    value={[calibration.conservativeLiberalFactor * 100]}
                    onValueChange={([value]) => updateCalibration("conservativeLiberalFactor", value / 100)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-400">
                    Adjusts all calibration values: Conservative = lower estimates, Liberal = higher estimates
                  </p>
                </div>

                {/* Individual KPI Controls */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-white text-sm">Conversion Uplift Factor</Label>
                      <span className="text-blue-400 font-mono text-sm">
                        {(calibration.followUpUpliftFactor * 100 - 100).toFixed(1)}%
                      </span>
                    </div>
                    <Slider
                      value={[(calibration.followUpUpliftFactor - 1) * 100]}
                      onValueChange={([value]) => updateCalibration("followUpUpliftFactor", 1 + value / 100)}
                      min={15}
                      max={35}
                      step={0.5}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-400">Industry: 25-28% (FM Consulting)</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-white text-sm">Admin Automation Reduction</Label>
                      <span className="text-blue-400 font-mono text-sm">
                        {(calibration.adminAutomationReduction * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Slider
                      value={[calibration.adminAutomationReduction * 100]}
                      onValueChange={([value]) => updateCalibration("adminAutomationReduction", value / 100)}
                      min={60}
                      max={95}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-400">Industry: 70-90% range</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-white text-sm">Staff Cost Savings Rate</Label>
                      <span className="text-blue-400 font-mono text-sm">
                        {(calibration.staffCostSavingsRate * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Slider
                      value={[calibration.staffCostSavingsRate * 100]}
                      onValueChange={([value]) => updateCalibration("staffCostSavingsRate", value / 100)}
                      min={20}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-400">From inquiry + task automation</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-white text-sm">Client Capacity Increase</Label>
                      <span className="text-blue-400 font-mono text-sm">
                        {(calibration.clientCapacityIncrease * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Slider
                      value={[calibration.clientCapacityIncrease * 100]}
                      onValueChange={([value]) => updateCalibration("clientCapacityIncrease", value / 100)}
                      min={15}
                      max={45}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-400">Baseline: 30% (Financial Model Excel)</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-white text-sm">Retention Improvement</Label>
                      <span className="text-blue-400 font-mono text-sm">
                        {(calibration.retentionImprovement * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Slider
                      value={[calibration.retentionImprovement * 100]}
                      onValueChange={([value]) => updateCalibration("retentionImprovement", value / 100)}
                      min={10}
                      max={30}
                      step={0.5}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-400">Baseline: 20% (up to 25% industry max)</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-white text-sm">Inquiry Automation Rate</Label>
                      <span className="text-blue-400 font-mono text-sm">
                        {(calibration.inquiryAutomationRate * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Slider
                      value={[calibration.inquiryAutomationRate * 100]}
                      onValueChange={([value]) => updateCalibration("inquiryAutomationRate", value / 100)}
                      min={30}
                      max={70}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-400">Baseline: 50% (Wifitalents)</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-white text-sm">Monthly Compounding Growth</Label>
                      <span className="text-blue-400 font-mono text-sm">
                        {(calibration.compoundingGrowthRate * 100).toFixed(2)}%
                      </span>
                    </div>
                    <Slider
                      value={[calibration.compoundingGrowthRate * 1000]}
                      onValueChange={([value]) => updateCalibration("compoundingGrowthRate", value / 1000)}
                      min={10}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-400">Baseline: 2.5% (reinvested time savings)</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Panel - Results & Charts */}
        <div className="w-1/2 overflow-y-auto bg-gray-900">
          <div className="p-6 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500/40">
                <DollarSign className="w-8 h-8 text-blue-400 mb-2" />
                <div className="text-2xl font-black text-blue-400 mb-1">
                  ${monthlyRevenuePotential.toLocaleString()}
                </div>
                <p className="text-xs text-gray-400">Monthly Revenue Potential</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-2 border-purple-500/40">
                <Clock className="w-8 h-8 text-purple-400 mb-2" />
                <div className="text-2xl font-black text-purple-400 mb-1">
                  {hoursSavedWeekly}h
                </div>
                <p className="text-xs text-gray-400">Hours Saved/Week</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-green-600/20 to-blue-600/20 border-2 border-green-500/40">
                <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
                <div className="text-2xl font-black text-green-400 mb-1">
                  ${yearlyGrowthPotential.toLocaleString()}+
                </div>
                <p className="text-xs text-gray-400">Yearly Growth Potential</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-2 border-cyan-500/40">
                <Users className="w-8 h-8 text-cyan-400 mb-2" />
                <div className="text-2xl font-black text-cyan-400 mb-1">
                  {answers.monthlyClients}
                </div>
                <div className="text-xs text-green-400 mt-1">→ {potentialMonthlyClients} (+{potentialClientIncrease})</div>
                <p className="text-xs text-gray-400 mt-1">Potential Monthly Clients</p>
              </Card>
            </div>

            {/* Growth Curve Chart */}
            <Card className="p-6 bg-gray-800/50 border-2 border-blue-500/40">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <LineChartIcon className="w-5 h-5 text-blue-400" />
                12-Month Revenue Projection
              </h3>
              <ChartContainer
                config={{
                  current: { label: "Current Trajectory", color: "hsl(var(--muted))" },
                  projected: { label: "With AI Automation", color: "hsl(217, 91%, 60%)" },
                }}
                className="h-[300px]"
              >
                <LineChart data={growthCurveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9CA3AF" 
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    stroke="#9CA3AF" 
                    tick={{ fontSize: 10 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#6B7280" 
                    strokeWidth={2}
                    dot={{ fill: "#6B7280", r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="projected" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-400">
                  <strong className="text-white">12-Month Difference:</strong> ${growthCurveData[11].difference.toLocaleString()}
                </p>
              </div>
            </Card>

            {/* KPI Comparison Chart */}
            <Card className="p-6 bg-gray-800/50 border-2 border-purple-500/40">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                KPI Improvement Analysis
              </h3>
              <ChartContainer
                config={{
                  current: { label: "Current", color: "hsl(0, 0%, 50%)" },
                  improved: { label: "With AI", color: "hsl(217, 91%, 60%)" },
                }}
                className="h-[300px]"
              >
                <BarChart data={kpiComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="metric" 
                    stroke="#9CA3AF" 
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    stroke="#9CA3AF" 
                    tick={{ fontSize: 10 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="current" fill="#6B7280" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="improved" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
              <div className="mt-4 space-y-2 text-sm">
                {kpiComparisonData.map((kpi, i) => (
                  <div key={i} className="flex justify-between text-gray-300">
                    <span>{kpi.metric}:</span>
                    <span className="text-green-400">
                      {kpi.metric === "Churn Rate" 
                        ? `-${kpi.improvement.toFixed(1)}%` 
                        : `+${kpi.improvement.toFixed(1)}%`}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Calibration Summary */}
            <Card className="p-6 bg-gray-800/50 border-2 border-green-500/40">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                Active Calibration Values
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Conversion Uplift:</span>
                    <span className="text-white font-mono">
                      {((calibration.followUpUpliftFactor - 1) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Admin Reduction:</span>
                    <span className="text-white font-mono">
                      {(calibration.adminAutomationReduction * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Staff Savings:</span>
                    <span className="text-white font-mono">
                      {(calibration.staffCostSavingsRate * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Capacity Increase:</span>
                    <span className="text-white font-mono">
                      {(calibration.clientCapacityIncrease * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Retention Improvement:</span>
                    <span className="text-white font-mono">
                      {(calibration.retentionImprovement * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Compounding Growth:</span>
                    <span className="text-white font-mono">
                      {(calibration.compoundingGrowthRate * 100).toFixed(2)}%/mo
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Research Sources */}
            <Card className="p-6 bg-gray-800/50 border-2 border-yellow-500/40">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Research Sources
              </h3>
              <div className="space-y-2 text-xs text-gray-400">
                <p>• <strong className="text-white">30% capacity increase:</strong> Financial Model Excel</p>
                <p>• <strong className="text-white">25-28% conversion improvement:</strong> FM Consulting</p>
                <p>• <strong className="text-white">70-90% admin reduction:</strong> Industry range</p>
                <p>• <strong className="text-white">50% inquiry automation:</strong> Wifitalents</p>
                <p>• <strong className="text-white">Up to 25% retention improvement:</strong> Financial Model</p>
                <p>• <strong className="text-white">5% retention = 25-95% profitability:</strong> Financial Model</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

