import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Download, Calendar, Clock, DollarSign, TrendingUp, Zap, Target, BarChart3, Star, CheckCircle, UserCheck, BookOpen, Users, TrendingDown, AlertTriangle } from "lucide-react";
import { computeRoi } from "@/lib/roi";
import { Analytics } from "@vercel/analytics/react";
import { sendWelcomeEmail } from "@/lib/email";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

// Meta Pixel TypeScript declarations
declare global {
  interface Window {
    fbq: any;
  }
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    monthlyRevenue: 0,
    hoursSaved: 0,
    yearlyGrowth: 0,
  });

  // Get answers from navigation state
  const state = location.state as {
    answers?: {
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
      reinvestmentFocus: string;
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
    };
    calculated?: {
      monthlyLeads: number;
      customerValue: number;
      monthlyStaffPayment: number;
      avgResponseMinutes: number;
      currentCloseRate: number;
    };
  };

  // If no state, redirect to home
  useEffect(() => {
    if (!state?.answers || !state?.calculated) {
      navigate("/");
    }
  }, [state, navigate]);

  if (!state?.answers || !state?.calculated) {
    return null;
  }

  const { answers, calculated } = state;

  // Calculate ROI
  const roi = computeRoi({
    monthlyStaffCostUsd: calculated.monthlyStaffPayment,
    monthlyLeads: calculated.monthlyLeads,
    currentCloseRatePct: calculated.currentCloseRate,
    averageCustomerValueUsd: calculated.customerValue,
    avgInitialResponseTimeMinutes: calculated.avgResponseMinutes,
  });

  // Calculate improvements with new KPIs (using ROI calculation values)
  const hoursSavedWeekly = roi.hoursSavedWeekly;
  const monthlyRevenuePotential = Math.round(
    (roi.additionalAnnualRevenueUsd / 12) + (roi.annualStaffSavingsUsd / 12)
  );
  const yearlyGrowthPotential = roi.totalAnnualImpactUsd;

  // Calculate AI impact on new KPIs (using ROI calculation values)
  // Handle zero values gracefully
  // Close rate: Already calculated asymptotically in ROI (moves closer to 100%, never reaches it)
  const improvedCloseRate = Math.min(99.99, Math.max(0, roi.improvedCloseRatePct));
  // Show-up rate: 15% improvement - asymptotically approaches 100%
  // Move 15% closer to 100% (not multiply by 1.15)
  const showUpRateImprovement = 0.15; // 15% of remaining gap
  const gapTo100ShowUp = 100 - answers.showUpRate;
  const improvedShowUpRate = Math.min(99.99, Math.max(0, answers.showUpRate + (gapTo100ShowUp * showUpRateImprovement)));
  // Churn rate: 40% reduction (multiply by 0.6) - approaches 0% asymptotically
  const improvedChurnRate = Math.max(0.01, answers.churnRate * 0.6); // Never reach exactly 0%
  const additionalConversions = Math.max(0, Math.round((answers.monthlyLeads * (improvedCloseRate - answers.closeRate)) / 100));
  const additionalRevenueFromConversions = additionalConversions * Math.max(calculated.customerValue, 0);
  const revenueSavedFromChurn = Math.max(0, (answers.monthlyClients * (answers.churnRate - improvedChurnRate) / 100) * Math.max(calculated.customerValue, 0));
  
  // Calculate potential increase in clients
  // Based on: improved close rate + capacity increase + reduced churn
  // Industry data: AI enables 30% capacity increase without proportional cost (Financial Model Excel)
  // Research: AI automation allows handling 30% more clients without proportional cost increase
  const capacityIncreaseFactor = 1 + (roi.capacityIncreasePct / 100); // e.g., 1.30 for 30% increase
  const potentialMonthlyClients = Math.round(
    answers.monthlyClients * capacityIncreaseFactor + additionalConversions
  );
  const potentialClientIncrease = potentialMonthlyClients - answers.monthlyClients;

  // Calculate AI revenue improvements per month
  // Base monthly revenue increase from AI improvements (close rate, churn, show-up rate)
  // Compounding growth calculation based on data-backed ROI
  // Handle zero revenue gracefully
  const monthlyRevenueIncrease = Math.max(0, monthlyRevenuePotential); // From close rate, churn reduction, etc.
  const aiMonthlyRevenue = Math.max(0, answers.monthlyRevenue) + monthlyRevenueIncrease;
  const naturalGrowthRate = 0.01; // 1% natural monthly growth (conservative baseline)
  
  // Compounding growth rate from ROI calculation (reinvested time savings compound)
  const aiCompoundingGrowthRate = roi.monthlyCompoundingGrowthRate || 0.025; // 2.5% monthly compounding
  // Additional growth from capacity increase (30% more clients without proportional cost)
  const capacityGrowthRate = roi.capacityIncreasePct / 100 / 12; // Spread capacity increase over 12 months
  // Combined AI growth rate (compounding + capacity expansion)
  const aiGrowthRate = aiCompoundingGrowthRate + capacityGrowthRate; // ~4.5% monthly compounding

  // Generate growth curve data (12 months projection) - CUMULATIVE REVENUE
  // This shows COMPOUNDING growth: each month's improvements build on previous months
  const growthCurveData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    
    // Baseline: Current revenue with minimal natural growth, cumulative
    // Handle zero revenue - start from a minimum baseline if needed
    const baseRevenue = Math.max(0, answers.monthlyRevenue);
    let cumulativeBaseline = 0;
    for (let m = 1; m <= month; m++) {
      const monthlyBaseline = baseRevenue * Math.pow(1 + naturalGrowthRate, m - 1);
      cumulativeBaseline += monthlyBaseline;
    }
    
    // AI Projection: COMPOUNDING revenue growth
    // Month 1: Base AI improvements (better close rate, retention, capacity)
    // Month 2+: Previous month's revenue + compounding growth from reinvested time savings
    // Each month, saved time compounds into more capacity = more revenue = more time saved
    let cumulativeAI = 0;
    let currentAIMonthlyRevenue = Math.max(0, aiMonthlyRevenue);
    
    for (let m = 1; m <= month; m++) {
      // Compounding effect: each month builds on the previous
      // Time savings reinvested = more clients = more revenue = more time savings
      if (m > 1) {
        // Apply compounding growth (reinvested time savings enable more growth)
        currentAIMonthlyRevenue = currentAIMonthlyRevenue * (1 + aiGrowthRate);
      }
      cumulativeAI += currentAIMonthlyRevenue;
    }
    
    // Ensure AI is always higher (safety check)
    const finalAI = Math.max(cumulativeAI, cumulativeBaseline);
    
    return {
      month: `Month ${month}`,
      current: Math.round(cumulativeBaseline),
      projected: Math.round(finalAI),
      difference: Math.round(finalAI - cumulativeBaseline),
    };
  });

  // Generate KPI comparison data
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
      improvement: answers.churnRate - improvedChurnRate, // Lower is better
    },
  ];

  // Dynamic insights based on user inputs
  const generateInsights = () => {
    const insights = [];

    // Close rate insights - handle zero values
    if (answers.closeRate === 0 && answers.monthlyLeads > 0) {
      insights.push({
        icon: <TrendingUp className="w-6 h-6 text-green-400" />,
        title: "Starting from Zero - Massive Opportunity",
        content: `You're currently at 0% close rate with ${answers.monthlyLeads} leads/month. With AI-powered follow-up sequences, you could achieve ${improvedCloseRate.toFixed(1)}% close rate, converting ${additionalConversions} more leads per month. That's an additional $${additionalRevenueFromConversions.toLocaleString()}/month in revenue.`,
        color: "green",
      });
    } else if (answers.closeRate < 20 && answers.closeRate > 0) {
      insights.push({
        icon: <TrendingDown className="w-6 h-6 text-red-400" />,
        title: "Low Close Rate Opportunity",
        content: `Your current close rate of ${answers.closeRate}% is below industry average. With AI-powered follow-up sequences, you could increase this to ${improvedCloseRate.toFixed(1)}%, converting ${additionalConversions} more leads per month. That's an additional $${additionalRevenueFromConversions.toLocaleString()}/month in revenue.`,
        color: "red",
      });
    } else if (answers.closeRate >= 20) {
      insights.push({
        icon: <TrendingUp className="w-6 h-6 text-green-400" />,
        title: "Strong Close Rate with Growth Potential",
        content: `Your ${answers.closeRate}% close rate is solid, but AI automation can push it to ${improvedCloseRate.toFixed(1)}% through faster response times and consistent follow-ups. This would add ${additionalConversions} more clients monthly, generating $${additionalRevenueFromConversions.toLocaleString()}/month.`,
        color: "green",
      });
    }

    // Show-up rate insights - handle zero values
    if (answers.showUpRate === 0 && answers.monthlyLeads > 0) {
      insights.push({
        icon: <Clock className="w-6 h-6 text-orange-400" />,
        title: "Show-Up Rate Opportunity",
        content: `Starting with 0% show-up rate? AI-powered automated reminders and calendar sync can dramatically improve this to ${improvedShowUpRate.toFixed(1)}%, ensuring you maximize every lead opportunity.`,
        color: "orange",
      });
    } else if (answers.showUpRate > 0 && answers.showUpRate < 70) {
      insights.push({
        icon: <Clock className="w-6 h-6 text-orange-400" />,
        title: "Show-Up Rate Leak",
        content: `With a ${answers.showUpRate}% show-up rate, you're losing ${Math.round(answers.monthlyLeads * (100 - answers.showUpRate) / 100)} potential client meetings per month. AI-powered automated reminders and calendar sync can increase this to ${improvedShowUpRate.toFixed(1)}%, recovering ${Math.round(answers.monthlyLeads * (improvedShowUpRate - answers.showUpRate) / 100)} meetings monthly.`,
        color: "orange",
      });
    }

    // Churn rate insights - handle zero values
    if (answers.churnRate > 5 && answers.monthlyClients > 0) {
      insights.push({
        icon: <Users className="w-6 h-6 text-purple-400" />,
        title: "High Churn Impact",
        content: `Your ${answers.churnRate}% monthly churn rate means you're losing ${Math.round(answers.monthlyClients * answers.churnRate / 100)} clients per month, costing $${revenueSavedFromChurn.toLocaleString()}/month. AI-driven engagement sequences and automated check-ins can reduce churn to ${improvedChurnRate.toFixed(1)}%, saving $${revenueSavedFromChurn.toLocaleString()}/month in retained revenue.`,
        color: "purple",
      });
    } else if (answers.churnRate === 0 && answers.monthlyClients > 0) {
      insights.push({
        icon: <Users className="w-6 h-6 text-green-400" />,
        title: "Maintain Zero Churn",
        content: `Great job maintaining 0% churn! AI-driven engagement sequences and automated check-ins can help you maintain this perfect retention rate as you scale, ensuring long-term client relationships.`,
        color: "green",
      });
    }

    // Admin hours insights - handle zero values
    if (answers.weeklyAdminHours > 10) {
      insights.push({
        icon: <Zap className="w-6 h-6 text-blue-400" />,
        title: "Massive Time Bottleneck",
        content: `You're spending ${answers.weeklyAdminHours} hours/week on repetitive tasks—that's ${Math.round(answers.weeklyAdminHours * 52 / 40)} weeks of full-time work per year. AI can automate 70-90% of this, freeing up ${hoursSavedWeekly} hours/week. If reinvested into ${answers.reinvestmentFocus.toLowerCase()}, this could scale your business from ${answers.monthlyClients} to ${Math.round(Math.max(answers.monthlyClients, 1) * 1.8)} clients within 90 days.`,
        color: "blue",
      });
    } else if (answers.weeklyAdminHours === 0) {
      insights.push({
        icon: <Zap className="w-6 h-6 text-blue-400" />,
        title: "Prevent Future Time Waste",
        content: `As your business grows, admin tasks will multiply. AI automation can prevent you from spending 10-20+ hours/week on repetitive work, allowing you to scale efficiently from day one.`,
        color: "blue",
      });
    }

    // Lead volume insights - handle zero values
    if (answers.monthlyLeads === 0) {
      insights.push({
        icon: <Target className="w-6 h-6 text-cyan-400" />,
        title: "Lead Generation Opportunity",
        content: `Starting with 0 leads? AI can help you generate and nurture leads from day one. With automated outreach and follow-up systems, you can scale your lead generation without proportional time investment.`,
        color: "cyan",
      });
    } else if (answers.monthlyLeads > 0 && answers.monthlyLeads < Math.max(answers.monthlyClients, 1) * 2) {
      insights.push({
        icon: <Target className="w-6 h-6 text-cyan-400" />,
        title: "Lead Generation Opportunity",
        content: `You're currently converting ${answers.monthlyClients} clients from ${answers.monthlyLeads} leads monthly. With AI automating your outreach and follow-up, you could handle ${Math.round(answers.monthlyLeads * capacityIncreaseFactor)} leads/month without additional time investment, potentially growing to ${potentialMonthlyClients} clients (${potentialClientIncrease > 0 ? `+${potentialClientIncrease}` : 'no change'} increase).`,
        color: "cyan",
      });
    }

    // Client capacity increase insight
    if (potentialClientIncrease > 0) {
      insights.push({
        icon: <Users className="w-6 h-6 text-cyan-400" />,
        title: "Client Capacity Expansion",
        content: `With AI automation handling ${roi.capacityIncreasePct.toFixed(0)}% more capacity without proportional cost (industry standard: 30% from Financial Model Excel), you could scale from ${answers.monthlyClients} to ${potentialMonthlyClients} monthly clients. This includes ${additionalConversions} additional conversions from improved close rates plus capacity expansion from automated systems.`,
        color: "cyan",
      });
    }

    // URGENCY INSIGHT - Always add this one
    const monthsDelayed = 6; // Example: if they wait 6 months
    const competitiveDisadvantage = Math.round(monthlyRevenuePotential * monthsDelayed);
    const futureGap = Math.round((yearlyGrowthPotential / 12) * monthsDelayed);
    insights.push({
      icon: <AlertTriangle className="w-6 h-6 text-red-400" />,
      title: "Decrease in Competitive Advantage",
      content: `Every month you delay, the competitive gap grows. Waiting just ${monthsDelayed} months, you'll have missed out on $${competitiveDisadvantage.toLocaleString()} in compounding revenue. Coaches who act now will dominate their markets, while those who wait risk becoming irrelevant. Your current ${answers.closeRate}% close rate and ${answers.showUpRate}% show-up rate will look increasingly weak as AI-powered competitors achieve ${improvedCloseRate.toFixed(1)}% and ${improvedShowUpRate.toFixed(1)}%. The window to gain a competitive advantage is closing.`,
      color: "red",
    });

    return insights;
  };

  const insights = generateInsights();

  // Animate numbers
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = {
      monthlyRevenue: monthlyRevenuePotential / steps,
      hoursSaved: hoursSavedWeekly / steps,
      yearlyGrowth: yearlyGrowthPotential / steps,
    };

    let current = { monthlyRevenue: 0, hoursSaved: 0, yearlyGrowth: 0 };
    const interval = setInterval(() => {
      current = {
        monthlyRevenue: Math.min(current.monthlyRevenue + increment.monthlyRevenue, monthlyRevenuePotential),
        hoursSaved: Math.min(current.hoursSaved + increment.hoursSaved, hoursSavedWeekly),
        yearlyGrowth: Math.min(current.yearlyGrowth + increment.yearlyGrowth, yearlyGrowthPotential),
      };

      setAnimatedValues({
        monthlyRevenue: Math.floor(current.monthlyRevenue),
        hoursSaved: Math.floor(current.hoursSaved),
        yearlyGrowth: Math.floor(current.yearlyGrowth),
      });

      if (
        current.monthlyRevenue >= monthlyRevenuePotential &&
        current.hoursSaved >= hoursSavedWeekly &&
        current.yearlyGrowth >= yearlyGrowthPotential
      ) {
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [monthlyRevenuePotential, hoursSavedWeekly, yearlyGrowthPotential]);

  // Meta Pixel tracking
  useEffect(() => {
    if (!window.fbq) {
      const script = document.createElement('script');
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1424382612134633');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    } else {
      window.fbq('track', 'PageView');
    }
  }, []);

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle playbook download submission - only sends to webhook
  const handleDownloadPlaybook = async () => {
    if (!answers.firstName || !answers.lastName || !answers.email) {
      toast({
        title: "Error",
        description: "Please complete the quiz to download the playbook.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const fullName = `${answers.firstName} ${answers.lastName}`;
      // Only send to webhook (Firebase was already submitted when quiz completed)
      await sendWelcomeEmail(
        answers.email,
        fullName,
        answers.phone || "",
        "Fitness_Funnel_Playbook"
      );

      toast({
        title: "Success!",
        description: "Your playbook is on its way. Check your spam and promotions inbox!",
      });

      // Optionally redirect after a delay
      setTimeout(() => {
        window.location.href = "https://www.sweepai.site/interest-form";
      }, 2000);
    } catch (error) {
      console.error("Error sending playbook:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 overflow-x-hidden">
      {/* Centered Sweep Logo - Smaller on mobile */}
      <div className="flex justify-center pt-2 pb-2 md:pt-8 md:pb-6">
        <img 
          src="/lovable-uploads/2e025803-adcb-4eb0-8995-15991e0213a4.png" 
          alt="Sweep Logo" 
          className="h-10 w-auto md:h-20"
        />
      </div>

      <div className="px-3 sm:px-4 py-3 sm:py-6 max-w-7xl mx-auto">
        {/* SECTION 1 — RESULTS HEADER - Optimized for mobile above fold */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 sm:mb-12"
        >
          {/* Progress Bar Animation - Smaller on mobile */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-3 sm:mb-6 max-w-md mx-auto"
          >
            <div className="h-2 sm:h-3 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
          </motion.div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-4 md:mb-6 text-white leading-tight px-2">
            {answers.firstName}'s AI Revenue Opportunity
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-6 md:mb-8 px-2">
            Based on your inputs, you're missing out on:
          </p>

          {/* Big Animated Stats - Compact on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-6 sm:mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-4 sm:p-5 md:p-6 lg:p-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500/40">
                <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-400 mx-auto mb-2 sm:mb-3 md:mb-4" />
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-blue-400 mb-1 sm:mb-2">
                  ${animatedValues.monthlyRevenue.toLocaleString()}
                </div>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">Monthly Revenue Potential</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-4 sm:p-5 md:p-6 lg:p-8 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-2 border-purple-500/40">
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-400 mx-auto mb-2 sm:mb-3 md:mb-4" />
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-purple-400 mb-1 sm:mb-2">
                  {animatedValues.hoursSaved}h
                </div>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">Hours Saved/Week</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="p-4 sm:p-5 md:p-6 lg:p-8 bg-gradient-to-br from-green-600/20 to-blue-600/20 border-2 border-green-500/40">
                <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-400 mx-auto mb-2 sm:mb-3 md:mb-4" />
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-green-400 mb-1 sm:mb-2">
                  ${animatedValues.yearlyGrowth.toLocaleString()}+
                </div>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">Yearly Growth Potential</p>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* METHODOLOGY & CALCULATION REPORT */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-6 sm:mb-8 md:mb-12"
        >
          <Card className="p-4 sm:p-6 md:p-8 bg-gray-800/50 border border-blue-500/30">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              Calculation Methodology
            </h3>
            
            <div className="space-y-4 sm:space-y-5 text-sm sm:text-base text-gray-300">
              {/* Key Metrics */}
              <div>
                <h4 className="font-semibold text-white mb-2">Key Metrics Calculation</h4>
                <ul className="space-y-2 text-gray-400 list-disc list-inside text-sm">
                  <li>
                    <strong className="text-white">Monthly Revenue (${monthlyRevenuePotential.toLocaleString()}):</strong> {roi.additionalConversionsPerMonth} conversions/month ({answers.closeRate}% → {roi.improvedCloseRatePct.toFixed(1)}% close rate) × ${calculated.customerValue.toLocaleString()}/client + ${Math.round(roi.annualStaffSavingsUsd / 12).toLocaleString()}/month staff savings.
                  </li>
                  <li>
                    <strong className="text-white">Hours Saved ({hoursSavedWeekly}h/week):</strong> {Math.round(answers.weeklyAdminHours * 0.75)}h from {answers.weeklyAdminHours}h/week admin automation (75% reduction) + inquiry automation + onboarding efficiency.
                  </li>
                  <li>
                    <strong className="text-white">Yearly Growth (${yearlyGrowthPotential.toLocaleString()}):</strong> ${roi.additionalAnnualRevenueUsd.toLocaleString()} revenue + ${roi.annualStaffSavingsUsd.toLocaleString()} savings, with {roi.retentionImprovementPct}% retention improvement increasing lifetime value.
                  </li>
                </ul>
              </div>

              {/* Industry Calibration Values */}
              <div className="pt-3 border-t border-gray-700">
                <h4 className="font-semibold text-white mb-2">Industry Benchmarks Used</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-400">
                  <div>• <strong className="text-blue-400">30% capacity increase</strong> (Financial Model Excel)</div>
                  <div>• <strong className="text-blue-400">27% conversion improvement</strong> (FM Consulting)</div>
                  <div>• <strong className="text-blue-400">75% admin reduction</strong> (70-90% range)</div>
                  <div>• <strong className="text-blue-400">50% inquiry automation</strong> (Wifitalents)</div>
                  <div>• <strong className="text-blue-400">35% staff overhead reduction</strong></div>
                  <div>• <strong className="text-blue-400">2.5% monthly compounding</strong></div>
                </div>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* CEO DASHBOARD SECTION - Mobile optimized */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-6 sm:mb-12"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 md:mb-8 text-center px-2">
            Your Business Growth Dashboard
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
            {/* Growth Curve Chart - Smaller on mobile */}
            <Card className="p-3 sm:p-4 md:p-6 bg-gray-900/80 border-2 border-blue-500/40">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 md:mb-4">12-Month Revenue Projection</h3>
              <ChartContainer
                config={{
                  current: { label: "Current Trajectory", color: "hsl(var(--muted))" },
                  projected: { label: "With AI Automation", color: "hsl(217, 91%, 60%)" },
                }}
                className="h-[200px] sm:h-[250px] md:h-[300px]"
              >
                <LineChart data={growthCurveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9CA3AF" 
                    tick={{ fontSize: 9 }}
                    angle={-30}
                    textAnchor="end"
                    height={50}
                    interval={0}
                  />
                  <YAxis 
                    stroke="#9CA3AF" 
                    tick={{ fontSize: 10 }}
                    width={50}
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
              <p className="text-xs sm:text-sm text-gray-400 mt-2 sm:mt-3 md:mt-4 text-center">
                Projected difference: ${growthCurveData[11].difference.toLocaleString()}
              </p>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700">
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  <strong className="text-white">Baseline:</strong> ${answers.monthlyRevenue.toLocaleString()}/month with 1% natural growth (cumulative shown).
                  <br />
                  <strong className="text-white">AI Projection:</strong> Starts at ${(answers.monthlyRevenue + monthlyRevenuePotential).toLocaleString()}/month, then compounds at {(roi.monthlyCompoundingGrowthRate * 100).toFixed(1)}% monthly from reinvested time savings + {(roi.capacityIncreasePct / 12).toFixed(2)}% capacity expansion. Each month builds on the previous, showing exponential growth.
                </p>
              </div>
            </Card>

            {/* KPI Comparison Bar Chart - Smaller on mobile */}
            <Card className="p-3 sm:p-4 md:p-6 bg-gray-900/80 border-2 border-purple-500/40">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 md:mb-4">KPI Improvement Analysis</h3>
              <ChartContainer
                config={{
                  current: { label: "Current", color: "hsl(0, 0%, 50%)" },
                  improved: { label: "With AI", color: "hsl(217, 91%, 60%)" },
                }}
                className="h-[200px] sm:h-[250px] md:h-[300px]"
              >
                <BarChart data={kpiComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="metric" 
                    stroke="#9CA3AF" 
                    tick={{ fontSize: 10 }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="#9CA3AF" 
                    tick={{ fontSize: 10 }}
                    width={40}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="current" fill="#6B7280" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="improved" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
              <div className="mt-2 sm:mt-3 md:mt-4 space-y-1 sm:space-y-2 text-xs sm:text-sm">
                {kpiComparisonData.map((kpi, i) => (
                  <div key={i} className="flex justify-between text-gray-300">
                    <span className="truncate pr-2">{kpi.metric}:</span>
                    <span className="text-green-400 whitespace-nowrap">
                      {kpi.metric === "Churn Rate" 
                        ? `-${kpi.improvement.toFixed(1)}%` 
                        : `+${kpi.improvement.toFixed(1)}%`}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700">
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  <strong className="text-white">Close Rate:</strong> {answers.closeRate}% → {roi.improvedCloseRatePct.toFixed(1)}% via {((roi.followUpUpliftFactor - 1) * 100).toFixed(0)}% AI follow-up uplift (industry: 25-28% avg).
                  <br />
                  <strong className="text-white">Show-Up Rate:</strong> {answers.showUpRate}% → {improvedShowUpRate.toFixed(1)}% via automated reminders.
                  <br />
                  <strong className="text-white">Churn Rate:</strong> {answers.churnRate}% → {improvedChurnRate.toFixed(1)}% via AI engagement sequences (20% retention improvement).
                </p>
              </div>
            </Card>
          </div>

          {/* Key Metrics Grid - Compact on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            <Card className="p-3 sm:p-4 bg-gray-900/80 border border-blue-500/30">
              <div className="text-xs sm:text-sm text-gray-400 mb-1">Current Close Rate</div>
              <div className="text-xl sm:text-2xl font-bold text-blue-400">{answers.closeRate}%</div>
              <div className="text-xs text-green-400 mt-1">→ {improvedCloseRate.toFixed(1)}%</div>
            </Card>
            <Card className="p-3 sm:p-4 bg-gray-900/80 border border-purple-500/30">
              <div className="text-xs sm:text-sm text-gray-400 mb-1">Show-Up Rate</div>
              <div className="text-xl sm:text-2xl font-bold text-purple-400">{answers.showUpRate}%</div>
              <div className="text-xs text-green-400 mt-1">→ {improvedShowUpRate.toFixed(1)}%</div>
            </Card>
            <Card className="p-3 sm:p-4 bg-gray-900/80 border border-red-500/30">
              <div className="text-xs sm:text-sm text-gray-400 mb-1">Churn Rate</div>
              <div className="text-xl sm:text-2xl font-bold text-red-400">{answers.churnRate}%</div>
              <div className="text-xs text-green-400 mt-1">→ {improvedChurnRate.toFixed(1)}%</div>
            </Card>
            <Card className="p-3 sm:p-4 bg-gray-900/80 border border-green-500/30">
              <div className="text-xs sm:text-sm text-gray-400 mb-1">Monthly Leads</div>
              <div className="text-xl sm:text-2xl font-bold text-green-400">{answers.monthlyLeads}</div>
              <div className="text-xs text-green-400 mt-1">Potential: {Math.round(answers.monthlyLeads * capacityIncreaseFactor)}</div>
            </Card>
            <Card className="p-3 sm:p-4 bg-gray-900/80 border border-cyan-500/30">
              <div className="text-xs sm:text-sm text-gray-400 mb-1">Potential Clients</div>
              <div className="text-xl sm:text-2xl font-bold text-cyan-400">{answers.monthlyClients}</div>
              <div className="text-xs text-green-400 mt-1">→ {potentialMonthlyClients} (+{potentialClientIncrease})</div>
            </Card>
          </div>
        </motion.section>

        {/* SECTION 2 — DYNAMIC INSIGHTS - Mobile optimized */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-6 sm:mb-12"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 text-center px-2">
            Your Business Intelligence Report
          </h2>

          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {insights.map((insight, index) => {
              const colorClasses = {
                red: "bg-red-500/20",
                orange: "bg-orange-500/20",
                purple: "bg-purple-500/20",
                blue: "bg-blue-500/20",
                cyan: "bg-cyan-500/20",
                green: "bg-green-500/20",
              };
              return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-5 md:p-6 bg-gray-900/80 border-2 border-gray-800 rounded-lg hover:border-blue-500/40 transition-all"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colorClasses[insight.color as keyof typeof colorClasses] || "bg-gray-500/20"} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <div className="w-5 h-5 sm:w-6 sm:h-6">
                    {insight.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-1 sm:mb-2">
                    {insight.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {insight.content}
                  </p>
                </div>
              </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* SECTION 3 — BRIDGE TO BLUEPRINT - Mobile optimized */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-6 sm:mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                Your 30-Day AI Implementation Blueprint
              </h2>
              <p className="text-base sm:text-lg text-gray-300 mb-3 sm:mb-4">
                Based on your report, we've prepared a step-by-step implementation guide that addresses the specific opportunities identified in your business.
              </p>
              <p className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-6">
                This blueprint outlines how top online fitness coaches are automating <strong className="text-white">10–30+ hours per week</strong> and adding <strong className="text-white">$5k–$30k monthly revenue</strong> through AI systems. It includes the exact frameworks, tools, and processes they use to scale efficiently.
              </p>
              <div className="bg-blue-500/10 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-r-lg">
                <p className="text-sm sm:text-base text-blue-200">
                  Each section of your report corresponds to actionable strategies in the blueprint, providing a clear path forward for your business growth.
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <Button
                  onClick={handleDownloadPlaybook}
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 sm:py-5 md:py-6 px-6 sm:px-8 text-base sm:text-lg md:text-xl rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 sm:border-4 border-blue-400/80 shadow-blue-500/60 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Download className="w-5 h-5 sm:w-6 sm:h-6 mr-2 inline" />
                      Download My AI Blueprint <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 inline" />
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    window.location.href = "https://www.sweepai.site/interest-form";
                  }}
                  size="lg"
                  variant="outline"
                  className="w-full border-2 border-gray-600 text-gray-300 sm:text-gray-800 hover:bg-gray-800 font-semibold py-4 sm:py-5 md:py-6 px-6 sm:px-8 text-sm sm:text-base md:text-lg rounded-xl sm:rounded-2xl"
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 inline" />
                  Schedule Implementation Consultation
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative order-first lg:order-last"
            >
              <div className="relative">
                <img 
                  src="/playbook.png" 
                  alt="AI Blueprint" 
                  className="w-full rounded-xl sm:rounded-2xl ring-2 sm:ring-4 ring-blue-400/60 shadow-2xl shadow-blue-500/50"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl sm:rounded-2xl blur-xl -z-10"></div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* MARKETING COPY SECTIONS - MOVED FROM PLAYBOOK PAGE - Mobile optimized */}
        
        {/* Testimonials Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-6 sm:mb-12"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)] px-2">
            What Other Coaches Are Saying
          </h2>
          <div className="space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-5 md:p-6 lg:p-8 shadow-2xl bg-gray-900/80 border-2 border-purple-500/30 backdrop-blur-sm ring-2 sm:ring-4 ring-purple-400/20 shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center ring-2 sm:ring-4 ring-purple-400/60 shadow-lg shadow-purple-500/50">
                    <Star className="w-5 h-6 sm:w-6 sm:h-8 md:w-8 md:h-10 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-400 fill-current drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                    ))}
                  </div>
                  <blockquote className="text-sm sm:text-base md:text-lg text-gray-300 italic mb-3 sm:mb-4">
                    "I was spending 20+ hours weekly on client communication. Now it's all automated and I'm booking on autopilot. The system pays for itself."
                  </blockquote>
                  <p className="text-xs sm:text-sm md:text-base font-semibold text-white">- Brandon, Gym Owner</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 sm:p-5 md:p-6 lg:p-8 shadow-2xl bg-gray-900/80 border-2 border-purple-500/30 backdrop-blur-sm ring-2 sm:ring-4 ring-purple-400/20 shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center ring-2 sm:ring-4 ring-green-400/60 shadow-lg shadow-green-500/50">
                    <CheckCircle className="w-5 h-6 sm:w-6 sm:h-8 md:w-8 md:h-10 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-400 fill-current drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                    ))}
                  </div>
                  <blockquote className="text-sm sm:text-base md:text-lg text-gray-300 italic mb-3 sm:mb-4">
                    "These guys are wizards. There's nodbody doing what they're doing.Its hard to find this level of professionalism and communication like this."
                  </blockquote>
                  <p className="text-xs sm:text-sm md:text-base font-semibold text-white">- Zach, Fitness Coach</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.section>

        {/* High-Value Results Section - Mobile optimized */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-6 sm:mb-12"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)] px-2">
            High-Value Results You Can Expect
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="text-center group hover:scale-105 transition-transform duration-500">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 ring-2 sm:ring-4 ring-purple-400/60 shadow-lg shadow-purple-500/50">
                <TrendingUp className="w-6 h-7 sm:w-7 sm:h-8 md:w-8 md:h-10 lg:w-10 lg:h-12 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-400 mb-1 sm:mb-2">3-5x</h3>
              <p className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 sm:mb-2">More Clients</p>
              <p className="text-xs sm:text-sm md:text-base text-gray-300">Book more clients consistently with automated follow-ups</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-500">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 ring-2 sm:ring-4 ring-blue-400/60 shadow-lg shadow-blue-500/50">
                <Clock className="w-6 h-7 sm:w-7 sm:h-8 md:w-8 md:h-10 lg:w-10 lg:h-12 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400 mb-1 sm:mb-2">15-20hrs</h3>
              <p className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 sm:mb-2">Time Saved</p>
              <p className="text-xs sm:text-sm md:text-base text-gray-300">Weekly time savings on client communication</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-500">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 ring-2 sm:ring-4 ring-green-400/60 shadow-lg shadow-green-500/50">
                <DollarSign className="w-6 h-7 sm:w-7 sm:h-8 md:w-8 md:h-10 lg:w-10 lg:h-12 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-green-400 mb-1 sm:mb-2">40-60%</h3>
              <p className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 sm:mb-2">Revenue Increase</p>
              <p className="text-xs sm:text-sm md:text-base text-gray-300">Higher conversion rates and client retention</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-500">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 ring-2 sm:ring-4 ring-orange-400/60 shadow-lg shadow-orange-500/50">
                <UserCheck className="w-6 h-7 sm:w-7 sm:h-8 md:w-8 md:h-10 lg:w-10 lg:h-12 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-400 mb-1 sm:mb-2">80%</h3>
              <p className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 sm:mb-2">Client Retention</p>
              <p className="text-xs sm:text-sm md:text-base text-gray-300">Better client relationships and long-term success</p>
            </div>
          </div>
        </motion.section>

        {/* Case Studies Section - Mobile optimized */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-6 sm:mb-12"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)] px-2">
            Real Client Wins & Case Studies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            <Card className="p-4 sm:p-5 md:p-6 lg:p-8 shadow-2xl bg-gray-900/80 border-2 border-purple-500/30 backdrop-blur-sm ring-2 sm:ring-4 ring-purple-400/20 shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 ring-2 sm:ring-4 ring-purple-400/60 shadow-lg shadow-purple-500/50">
                  <TrendingUp className="w-6 h-7 sm:w-7 sm:h-8 md:w-8 md:h-10 lg:w-10 lg:h-12 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2">Boon</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-2 sm:mb-3">Personal Trainer</p>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                  "Quadrupled his client base in 1 month. The funnel handles converts traffic into customers automatically."
                </p>
              </div>
            </Card>
            
            <Card className="p-4 sm:p-5 md:p-6 lg:p-8 shadow-2xl bg-gray-900/80 border-2 border-purple-500/30 backdrop-blur-sm ring-2 sm:ring-4 ring-purple-400/20 shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 ring-2 sm:ring-4 ring-green-400/60 shadow-lg shadow-green-500/50">
                  <DollarSign className="w-6 h-7 sm:w-7 sm:h-8 md:w-8 md:h-10 lg:w-10 lg:h-12 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2">Dan</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-2 sm:mb-3">Online Coach</p>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                  "8x his revenue in 1 month. The system onboards new clients while I sleep."
                </p>
              </div>
            </Card>
            
            <Card className="p-4 sm:p-5 md:p-6 lg:p-8 shadow-2xl bg-gray-900/80 border-2 border-purple-500/30 backdrop-blur-sm ring-2 sm:ring-4 ring-purple-400/20 shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 sm:col-span-2 md:col-span-1">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 ring-2 sm:ring-4 ring-purple-400/60 shadow-lg shadow-purple-500/50">
                  <UserCheck className="w-6 h-7 sm:w-7 sm:h-8 md:w-8 md:h-10 lg:w-10 lg:h-12 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2">Zach</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-2 sm:mb-3">Fitness Coach</p>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                  "100-400 New Community Members in 30 Days. The system onboards them on autopilot."
                </p>
              </div>
            </Card>
          </div>
        </motion.section>
      </div>

      <Analytics />
    </div>
  );
}
