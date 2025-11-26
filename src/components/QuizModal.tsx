import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addEmailToFirestore } from "@/lib/firebase";
import { createBrevoContactAndAddToList } from "@/lib/brevo";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
  reinvestmentFocus: string;
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string;
  email: string;
}

// Common country codes for phone numbers (E.164 format)
const COUNTRY_CODES = [
  { code: "+1", country: "US/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+972", country: "Israel", flag: "🇮🇱" },
];

export function QuizModal({ isOpen, onClose }: QuizModalProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [answers, setAnswers] = useState<QuizAnswers>({
    monthlyClients: 0,
    monthlyLeads: 0,
    monthlyRevenue: 0,
    closeRate: 0,
    weeklyAdminHours: 0,
    showUpRate: 0,
    churnRate: 0,
    monthlyHiringCosts: 0,
    monthlyTrainingCosts: 0,
    monthlyOperationalExpenses: 0,
    reinvestmentFocus: "",
    firstName: "",
    lastName: "",
    phone: "",
    countryCode: "+1", // Default to US/Canada
    email: "",
  });

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate ROI and navigate to results
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setLoadingStatus("Calculating your AI Scaling Report...");

    // Submit to Firebase and Brevo (only once when quiz is completed)
    if (answers.firstName && answers.lastName && answers.email) {
      try {
        setLoadingStatus("Saving your information...");
        const fullName = `${answers.firstName} ${answers.lastName}`;
        // Submit to Firebase
        await addEmailToFirestore(
          answers.email,
          fullName,
          answers.phone || "",
          "Fitness_Funnel_Playbook"
        );
        if (import.meta.env.DEV) {
          console.log('✅ Quiz submission saved to Firebase');
        }
      } catch (error) {
        // Always log errors
        console.error('❌ Error saving quiz submission to Firebase:', error);
        // Continue to results page even if Firebase fails
      }

      // Submit to Brevo (non-blocking)
      try {
        setLoadingStatus("Syncing with our systems...");
        // Format phone number with country code (E.164 format: +1234567890)
        const formattedPhone = answers.phone 
          ? `${answers.countryCode || "+1"}${answers.phone.replace(/\D/g, "")}` // Remove all non-digits
          : "";
        
        await createBrevoContactAndAddToList(
          answers.email,
          answers.firstName,
          answers.lastName,
          formattedPhone
        );
        if (import.meta.env.DEV) {
          console.log('✅ Quiz submission saved to Brevo');
        }
      } catch (error) {
        // Always log errors
        console.error('❌ Error saving quiz submission to Brevo:', error);
        // Continue to results page even if Brevo fails
      }
    }

    setLoadingStatus("Generating your personalized report...");
    
    // Small delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 500));

    // Calculate derived values for ROI
    // Handle zero values gracefully - use defaults if needed
    const customerValue = answers.monthlyClients > 0 
      ? answers.monthlyRevenue / answers.monthlyClients 
      : (answers.monthlyRevenue > 0 ? answers.monthlyRevenue : 500); // Default $500 if no clients/revenue
    // Use actual business expenses instead of estimate
    // Total monthly operational costs = hiring + training + operational expenses
    const monthlyStaffPayment = answers.monthlyHiringCosts + 
                                answers.monthlyTrainingCosts + 
                                answers.monthlyOperationalExpenses;
    const avgResponseMinutes = 60; // Default

    setLoadingStatus("Almost ready...");

    // Navigate to results with answers
    navigate("/results", {
      state: {
        answers,
        calculated: {
          monthlyLeads: answers.monthlyLeads,
          customerValue,
          monthlyStaffPayment,
          avgResponseMinutes,
          currentCloseRate: answers.closeRate,
        },
      },
    });
  };

  const updateAnswer = (field: keyof QuizAnswers, value: number | string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return answers.monthlyClients >= 0 && answers.monthlyLeads >= 0;
      case 2:
        return answers.monthlyRevenue >= 0 && answers.closeRate >= 0 && answers.closeRate <= 100;
      case 3:
        return answers.weeklyAdminHours >= 0 && answers.showUpRate >= 0 && answers.showUpRate <= 100;
      case 4:
        return answers.churnRate >= 0 && answers.churnRate <= 100 && answers.reinvestmentFocus.length > 0;
      case 5:
        return answers.monthlyHiringCosts >= 0 && 
               answers.monthlyTrainingCosts >= 0 && 
               answers.monthlyOperationalExpenses >= 0;
      case 6:
        return answers.firstName.length > 0 && 
               answers.lastName.length > 0 && 
               answers.email.length > 0 && 
               /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(answers.email);
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-gray-900 rounded-2xl p-6 md:p-8 lg:p-12 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border-2 border-blue-400/80 shadow-2xl shadow-blue-500/60"
        >
          {/* Close Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Loading Overlay */}
          <AnimatePresence>
            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center space-y-6"
                >
                  {/* Animated Sparkles Icon */}
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="mx-auto"
                  >
                    <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-blue-400" />
                  </motion.div>

                  {/* Loading Spinner */}
                  <div className="flex justify-center">
                    <LoadingSpinner size="lg" color="white" />
                  </div>

                  {/* Status Message */}
                  <motion.p
                    key={loadingStatus}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl md:text-2xl font-semibold text-white"
                  >
                    {loadingStatus}
                  </motion.p>

                  {/* Progress Dots */}
                  <div className="flex justify-center space-x-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-blue-400 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
          </motion.div>

          {/* Step Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-6"
          >
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-sm text-gray-400 font-semibold"
            >
              Step {currentStep} of {totalSteps}
            </motion.span>
          </motion.div>

          {/* SECTION 1 — INTRO */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                Let's Calculate Your <br></br>Potential AI Revenue
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Instant results. No technical experience needed.
              </p>
            </motion.div>
          )}

          {/* Questions */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="q1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <Label htmlFor="monthlyClients" className="text-white text-lg">
                    How many clients do you coach monthly?
                  </Label>
                  <Input
                    id="monthlyClients"
                    type="text"
                    inputMode="numeric"
                    value={answers.monthlyClients === 0 ? "0" : answers.monthlyClients || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") {
                        updateAnswer("monthlyClients", 0);
                      } else if (/^\d+$/.test(val)) {
                        const num = parseInt(val, 10);
                        updateAnswer("monthlyClients", num);
                      }
                    }}
                    className="bg-gray-800/50 border-2 border-blue-500/30 text-white text-lg py-6"
                    placeholder="Enter number of clients"
                    autoFocus
                  />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="monthlyLeads" className="text-white text-lg">
                    How many leads do you get per month?
                  </Label>
                  <Input
                    id="monthlyLeads"
                    type="text"
                    inputMode="numeric"
                    value={answers.monthlyLeads === 0 ? "0" : answers.monthlyLeads || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") {
                        updateAnswer("monthlyLeads", 0);
                      } else if (/^\d+$/.test(val)) {
                        const num = parseInt(val, 10);
                        updateAnswer("monthlyLeads", num);
                      }
                    }}
                    className="bg-gray-800/50 border-2 border-blue-500/30 text-white text-lg py-6"
                    placeholder="Enter number of leads"
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="q2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <Label htmlFor="monthlyRevenue" className="text-white text-lg">
                    What's your average monthly revenue?
                  </Label>
                  <Input
                    id="monthlyRevenue"
                    type="text"
                    inputMode="numeric"
                    value={answers.monthlyRevenue === 0 ? "0" : answers.monthlyRevenue || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d]/g, "");
                      if (val === "") {
                        updateAnswer("monthlyRevenue", 0);
                      } else {
                        const num = parseInt(val, 10);
                        updateAnswer("monthlyRevenue", num);
                      }
                    }}
                    className="bg-gray-800/50 border-2 border-blue-500/30 text-white text-lg py-6"
                    placeholder="Enter monthly revenue ($)"
                    autoFocus
                  />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="closeRate" className="text-white text-lg">
                    What's your current close rate? (%)
                  </Label>
                  <Input
                    id="closeRate"
                    type="text"
                    inputMode="decimal"
                    value={answers.closeRate === 0 ? "0" : answers.closeRate || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d.]/g, "").replace(/\./g, (match, offset, string) => {
                        return string.indexOf(".") === offset ? match : "";
                      });
                      if (val === "" || val === ".") {
                        updateAnswer("closeRate", 0);
                      } else {
                        const num = parseFloat(val);
                        if (!isNaN(num) && num >= 0 && num <= 100) {
                          updateAnswer("closeRate", num);
                        }
                      }
                    }}
                    className="bg-gray-800/50 border-2 border-blue-500/30 text-white text-lg py-6"
                    placeholder="Enter close rate (e.g., 15)"
                  />
                  <p className="text-sm text-gray-400">
                    Percentage of leads that become paying clients
                  </p>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="q3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <Label htmlFor="weeklyAdminHours" className="text-white text-lg">
                    How many hours/week do you spend on admin + repetitive tasks?
                  </Label>
                  <Input
                    id="weeklyAdminHours"
                    type="text"
                    inputMode="decimal"
                    value={answers.weeklyAdminHours === 0 ? "0" : answers.weeklyAdminHours || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d.]/g, "").replace(/\./g, (match, offset, string) => {
                        return string.indexOf(".") === offset ? match : "";
                      });
                      if (val === "" || val === ".") {
                        updateAnswer("weeklyAdminHours", 0);
                      } else {
                        const num = parseFloat(val);
                        if (!isNaN(num) && num >= 0) {
                          updateAnswer("weeklyAdminHours", num);
                        }
                      }
                    }}
                    className="bg-gray-800/50 border-2 border-blue-500/30 text-white text-lg py-6"
                    placeholder="Enter hours per week"
                    autoFocus
                  />
                  <p className="text-sm text-gray-400">
                    Think: email responses, scheduling, follow-ups, data entry, etc.
                  </p>
                </div>
                <div className="space-y-4">
                  <Label htmlFor="showUpRate" className="text-white text-lg">
                    What's your show-up rate for calls? (%)
                  </Label>
                  <Input
                    id="showUpRate"
                    type="text"
                    inputMode="decimal"
                    value={answers.showUpRate === 0 ? "0" : answers.showUpRate || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d.]/g, "").replace(/\./g, (match, offset, string) => {
                        return string.indexOf(".") === offset ? match : "";
                      });
                      if (val === "" || val === ".") {
                        updateAnswer("showUpRate", 0);
                      } else {
                        const num = parseFloat(val);
                        if (!isNaN(num) && num >= 0 && num <= 100) {
                          updateAnswer("showUpRate", num);
                        }
                      }
                    }}
                    className="bg-gray-800/50 border-2 border-blue-500/30 text-white text-lg py-6"
                    placeholder="Enter show-up rate (e.g., 70)"
                  />
                  <p className="text-sm text-gray-400">
                    Percentage of scheduled calls where clients actually show up
                  </p>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="q4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <Label htmlFor="churnRate" className="text-white text-lg">
                    What's your monthly churn rate? (%)
                  </Label>
                  <Input
                    id="churnRate"
                    type="text"
                    inputMode="decimal"
                    value={answers.churnRate === 0 ? "0" : answers.churnRate || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d.]/g, "").replace(/\./g, (match, offset, string) => {
                        return string.indexOf(".") === offset ? match : "";
                      });
                      if (val === "" || val === ".") {
                        updateAnswer("churnRate", 0);
                      } else {
                        const num = parseFloat(val);
                        if (!isNaN(num) && num >= 0 && num <= 100) {
                          updateAnswer("churnRate", num);
                        }
                      }
                    }}
                    className="bg-gray-800/50 border-2 border-blue-500/30 text-white text-lg py-6"
                    placeholder="Enter churn rate (e.g., 5)"
                    autoFocus
                  />
                  <p className="text-sm text-gray-400">
                    Percentage of clients who cancel each month
                  </p>
                </div>
                <div className="space-y-4">
                  <Label htmlFor="reinvestmentFocus" className="text-white text-lg">
                    If AI could automate 70–90% of those tasks, what would you reinvest the saved time into?
                  </Label>
                  <div className="space-y-3">
                    {[
                      "Acquiring new clients",
                      "Improving client retention",
                      "Creating new programs/services",
                      "Personal development & learning",
                      "Work-life balance",
                    ].map((option) => (
                      <button
                        key={option}
                        onClick={() => updateAnswer("reinvestmentFocus", option)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          answers.reinvestmentFocus === option
                            ? "border-blue-500 bg-blue-500/20 text-white"
                            : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="q5"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <Label htmlFor="monthlyHiringCosts" className="text-white text-lg">
                    How much do you spend monthly on hiring? ($)
                  </Label>
                  <Input
                    id="monthlyHiringCosts"
                    type="text"
                    inputMode="numeric"
                    value={answers.monthlyHiringCosts === 0 ? "0" : answers.monthlyHiringCosts || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d]/g, "");
                      if (val === "") {
                        updateAnswer("monthlyHiringCosts", 0);
                      } else {
                        const num = parseInt(val, 10);
                        updateAnswer("monthlyHiringCosts", num);
                      }
                    }}
                    className="bg-gray-800/50 border-2 border-blue-500/30 text-white text-lg py-6"
                    placeholder="Enter monthly hiring costs (e.g., 2000)"
                    autoFocus
                  />
                  <p className="text-sm text-gray-400">
                    Include recruitment, onboarding, and hiring platform costs
                  </p>
                </div>
                <div className="space-y-4">
                  <Label htmlFor="monthlyTrainingCosts" className="text-white text-lg">
                    How much do you spend monthly on training? ($)
                  </Label>
                  <Input
                    id="monthlyTrainingCosts"
                    type="text"
                    inputMode="numeric"
                    value={answers.monthlyTrainingCosts === 0 ? "0" : answers.monthlyTrainingCosts || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d]/g, "");
                      if (val === "") {
                        updateAnswer("monthlyTrainingCosts", 0);
                      } else {
                        const num = parseInt(val, 10);
                        updateAnswer("monthlyTrainingCosts", num);
                      }
                    }}
                    className="bg-gray-800/50 border-2 border-blue-500/30 text-white text-lg py-6"
                    placeholder="Enter monthly training costs (e.g., 1500)"
                  />
                  <p className="text-sm text-gray-400">
                    Include staff training, courses, certifications, and development programs
                  </p>
                </div>
                <div className="space-y-4">
                  <Label htmlFor="monthlyOperationalExpenses" className="text-white text-lg">
                    What are your monthly operational expenses? ($)
                  </Label>
                  <Input
                    id="monthlyOperationalExpenses"
                    type="text"
                    inputMode="numeric"
                    value={answers.monthlyOperationalExpenses === 0 ? "0" : answers.monthlyOperationalExpenses || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d]/g, "");
                      if (val === "") {
                        updateAnswer("monthlyOperationalExpenses", 0);
                      } else {
                        const num = parseInt(val, 10);
                        updateAnswer("monthlyOperationalExpenses", num);
                      }
                    }}
                    className="bg-gray-800/50 border-2 border-blue-500/30 text-white text-lg py-6"
                    placeholder="Enter monthly operational expenses (e.g., 5000)"
                  />
                  <p className="text-sm text-gray-400">
                    Include software subscriptions, tools, marketing, and other recurring business costs
                  </p>
                </div>
              </motion.div>
            )}

            {currentStep === 6 && (
              <motion.div
                key="q6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <Label className="text-white text-lg">
                  Almost there! Just need your contact information to send your results.
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-white text-sm">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={answers.firstName}
                      onChange={(e) => updateAnswer("firstName", e.target.value)}
                      className="bg-gray-800/50 border-2 border-blue-500/30 text-white py-4"
                      placeholder="First name"
                      autoFocus
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-white text-sm">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={answers.lastName}
                      onChange={(e) => updateAnswer("lastName", e.target.value)}
                      className="bg-gray-800/50 border-2 border-blue-500/30 text-white py-4"
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-white text-sm">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={answers.email}
                    onChange={(e) => updateAnswer("email", e.target.value)}
                    className="bg-gray-800/50 border-2 border-blue-500/30 text-white py-4"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-white text-sm">
                    Phone Number (Optional)
                  </Label>
                  <div className="flex gap-2">
                    <Select
                      value={answers.countryCode}
                      onValueChange={(value) => updateAnswer("countryCode", value)}
                    >
                      <SelectTrigger className="w-[140px] bg-gray-800/50 border-2 border-blue-500/30 text-white">
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] bg-gray-800 border-2 border-blue-500/30">
                        {COUNTRY_CODES.map((country) => (
                          <SelectItem
                            key={country.code}
                            value={country.code}
                            className="text-white focus:bg-blue-500/20"
                          >
                            <span className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span>{country.code}</span>
                              <span className="text-gray-400 text-xs">({country.country})</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      type="tel"
                      value={answers.phone}
                      onChange={(e) => {
                        // Only allow digits, spaces, dashes, and parentheses
                        const cleaned = e.target.value.replace(/[^\d\s\-()]/g, "");
                        updateAnswer("phone", cleaned);
                      }}
                      className="flex-1 bg-gray-800/50 border-2 border-blue-500/30 text-white py-4"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  By submitting this form, you agree to our <a href="/privacy-policy" className="text-blue-500 hover:text-blue-400">Privacy Policy</a>. We respect your privacy. Unsubscribe anytime.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <Button
                onClick={handleBack}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Back
              </Button>
            )}
            <div className="flex-1" />
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" color="white" className="mr-2 inline" />
                  Generating Report...
                </>
              ) : currentStep === totalSteps ? (
                <>
                  Calculate My AI Scaling Report <ArrowRight className="w-5 h-5 ml-2 inline" />
                </>
              ) : (
                <>
                  Next <ArrowRight className="w-5 h-5 ml-2 inline" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

