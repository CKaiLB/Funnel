import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, Target, DollarSign, BookOpen, Star, CheckCircle, TrendingUp, UserCheck, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Analytics } from "@vercel/analytics/react";
import { computeRoi } from "@/lib/roi";
import { addEmailToFirestore } from "@/lib/firebase";
import { createBrevoContactAndAddToList } from "@/lib/brevo";

// Meta Pixel TypeScript declarations
declare global {
  interface Window {
    fbq: any;
  }
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

export default function AIPlaybook() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deprivationAmount, setDeprivationAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+1",
    wantsConsultation: false,
  });
  const countIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const deprivationSectionRef = useRef<HTMLDivElement | null>(null);
  const hasStartedCountingRef = useRef<boolean>(false);

  // Default values for deprivation calculation
  const defaultRoi = computeRoi({
    monthlyStaffCostUsd: 15000,
    monthlyLeads: 25,
    currentCloseRatePct: 15,
    averageCustomerValueUsd: 500,
    avgInitialResponseTimeMinutes: 60
  });

  const totalAnnualSavings = defaultRoi.totalAnnualImpactUsd;

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-open modal after 5 seconds
  useEffect(() => {
    const autoOpenTimer = setTimeout(() => {
      if (!hasAutoOpened) {
        setShowModal(true);
        setHasAutoOpened(true);
      }
    }, 5000);

    return () => clearTimeout(autoOpenTimer);
  }, [hasAutoOpened]);

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

    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = 'https://www.facebook.com/tr?id=1424382612134633&ev=PageView&noscript=1';
    noscript.appendChild(img);
    document.head.appendChild(noscript);

    return () => {
      if (noscript.parentNode) {
        noscript.parentNode.removeChild(noscript);
      }
    };
  }, []);

  // Count up animation for deprivation section - only when section is visible
  useEffect(() => {
    if (!deprivationSectionRef.current || hasStartedCountingRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStartedCountingRef.current) {
            const targetAmount = totalAnnualSavings;
            if (targetAmount > 0) {
              hasStartedCountingRef.current = true;
              const duration = 2000;
              const steps = 60;
              const increment = targetAmount / steps;
              let current = 0;
              
              countIntervalRef.current = setInterval(() => {
                current += increment;
                if (current >= targetAmount) {
                  setDeprivationAmount(targetAmount);
                  if (countIntervalRef.current) {
                    clearInterval(countIntervalRef.current);
                  }
                } else {
                  setDeprivationAmount(Math.floor(current));
                }
              }, duration / steps);
              
              observer.disconnect();
            }
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    );

    const currentRef = deprivationSectionRef.current;
    observer.observe(currentRef);

    return () => {
      observer.disconnect();
      if (countIntervalRef.current) {
        clearInterval(countIntervalRef.current);
      }
    };
  }, [totalAnnualSavings]);

  // Animation for playbook graphic float
  const playbookControls = useAnimation();

  useEffect(() => {
    playbookControls.start({
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    });
  }, [playbookControls]);

  // Pulse animation for CTA button
  const buttonControls = useAnimation();

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      buttonControls.start({
        scale: [1, 1.05, 1],
        transition: {
          duration: 0.5,
          ease: "easeInOut"
        }
      });
    }, 5000);

    return () => clearInterval(pulseInterval);
  }, [buttonControls]);

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    return (
      formData.firstName.trim().length > 0 &&
      formData.lastName.trim().length > 0 &&
      formData.email.trim().length > 0 &&
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email) &&
      formData.phone.trim().length > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields with valid information.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      // Format phone number with country code (E.164 format: +1234567890)
      const formattedPhone = formData.phone 
        ? `${formData.countryCode}${formData.phone.replace(/\D/g, "")}` // Remove all non-digits
        : "";

      // Submit to Firebase
      try {
        await addEmailToFirestore(
          formData.email,
          fullName,
          formattedPhone,
          "Fitness_Funnel_Playbook"
        );
        if (import.meta.env.DEV) {
          console.log('✅ Form submission saved to Firebase');
        }
      } catch (error) {
        console.error('❌ Error saving to Firebase:', error);
        // Continue even if Firebase fails
      }

      // Submit to Brevo (non-blocking)
      try {
        await createBrevoContactAndAddToList(
          formData.email,
          formData.firstName,
          formData.lastName,
          formattedPhone
        );
        if (import.meta.env.DEV) {
          console.log('✅ Form submission saved to Brevo');
        }
      } catch (error) {
        console.error('❌ Error saving to Brevo:', error);
        // Continue even if Brevo fails
      }

      toast({
        title: "Success!",
        description: "Your playbook is on its way. Check your email!",
      });

      // Redirect based on consultation checkbox
      setTimeout(() => {
        if (formData.wantsConsultation) {
          window.location.href = "https://www.sweepai.site/interest-form";
        } else {
          window.location.href = "https://www.sweepai.site";
        }
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 overflow-x-hidden">
      {/* Centered Sweep Logo - Smaller on mobile, minimal padding */}
      <div className="flex justify-center pt-1 pb-1 md:pt-8 md:pb-6">
        <img 
          src="/lovable-uploads/2e025803-adcb-4eb0-8995-15991e0213a4.png" 
          alt="Sweep Logo" 
          className="h-8 w-auto md:h-20"
        />
      </div>

      {/* SECTION 1 — HERO - Optimized for mobile above fold */}
      <section className="px-3 sm:px-4 py-2 sm:py-6 md:py-8 lg:py-12 max-w-6xl mx-auto">
        <div className="text-center mb-2 sm:mb-6 md:mb-8 lg:mb-12">
          {/* Headline - slides in from left, smaller on mobile */}
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-1 sm:mb-3 md:mb-4 lg:mb-6 text-white leading-tight px-2"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Unlock Hidden Revenue Inside Your Coaching Business Using AI
          </motion.h1>
          
          {/* Subheadline - fades in, smaller on mobile */}
          <motion.p 
            className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-2 sm:mb-5 md:mb-6 lg:mb-8 max-w-3xl mx-auto px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Most coaches are leaving $5k–$50k every month on the table. Find out exactly how much in under 60 seconds.
          </motion.p>

          {/* Playbook Graphic - floats upward, smaller on mobile */}
          <motion.div
            className="flex justify-center mb-2 sm:mb-5 md:mb-6 lg:mb-8"
            animate={playbookControls}
          >
            <div className="relative">
              <img 
                src="/playbook.png" 
                alt="AI Playbook" 
                className="w-48 h-auto sm:w-64 md:w-80 lg:w-96 xl:w-[28rem] rounded-xl sm:rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl"></div>
              <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-8 h-8 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-lg"></div>
            </div>
          </motion.div>

          {/* CTA Button - pulses every 5 seconds, responsive sizing, compact on mobile */}
          <motion.div
            animate={buttonControls}
            className="mb-2 sm:mb-4 md:mb-6 px-2"
          >
            <Button 
              onClick={() => setShowModal(true)}
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 sm:py-4 md:py-5 lg:py-6 px-4 sm:px-8 md:px-10 lg:px-12 text-sm sm:text-lg md:text-xl lg:text-2xl rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 sm:border-4 border-blue-400/80 shadow-blue-500/60"
            >
              Get My 30-Day AI Blueprint <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-2 inline" />
            </Button>
          </motion.div>

          {/* Social Proof Line - smaller on mobile */}
          <motion.p 
            className="text-xs sm:text-sm md:text-base text-gray-400 mb-1 sm:mb-3 md:mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="text-yellow-400 font-semibold">Trusted by 350+ Fitness Coaches</span>
          </motion.p>

          {/* Footer Microcopy - smaller on mobile */}
          <motion.p 
            className="text-xs sm:text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            No tech skills required. No cost. Immediate result.
          </motion.p>
        </div>
      </section>

      {/* SECTION 2 — BENEFITS PREVIEW - Mobile optimized */}
      <section className="px-3 sm:px-4 py-6 sm:py-8 md:py-12 max-w-6xl mx-auto mb-6 sm:mb-8 md:mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="p-4 sm:p-5 md:p-6 lg:p-8 bg-gray-900/80 border-2 border-blue-500/40 backdrop-blur-sm shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 h-full">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">Unlock Revenue Opportunities</h3>
                <p className="text-sm sm:text-base text-gray-300">Implement the revenue generating frameworks top coaches are using to scale their businesses.</p>
              </div>
            </Card>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="p-4 sm:p-5 md:p-6 lg:p-8 bg-gray-900/80 border-2 border-purple-500/40 backdrop-blur-sm shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 h-full">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">Identify Operational Leaks</h3>
                <p className="text-sm sm:text-base text-gray-300">Discover how many hours you're wasting on tasks that could run on autopilot.</p>
              </div>
            </Card>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="p-4 sm:p-5 md:p-6 lg:p-8 bg-gray-900/80 border-2 border-green-500/40 backdrop-blur-sm shadow-2xl hover:shadow-green-500/40 transition-all duration-300 h-full">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Target className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">Integrate Enterprise Level Strategy</h3>
                <p className="text-sm sm:text-base text-gray-300">Create a scalable, repeatable system that can be scaled to 50+ clients.</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* OPT-IN MODAL - Similar to QuizModal last step */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border-2 border-purple-400/80 shadow-2xl shadow-purple-500/60"
            >
              {/* Close Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                  Get <span className="text-3xl sm:text-4xl font-bold text-green-400">FREE</span> Instant Access
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-300">
                  Enter your details below to receive your free 30-Day AI Blueprint instantly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-white text-sm sm:text-base">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      className="mt-1 sm:mt-2 bg-gray-800/50 border-2 border-purple-500/30 text-white py-3 sm:py-4 text-sm sm:text-base"
                      placeholder="First name"
                      autoFocus
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-white text-sm sm:text-base">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      className="mt-1 sm:mt-2 bg-gray-800/50 border-2 border-purple-500/30 text-white py-3 sm:py-4 text-sm sm:text-base"
                      placeholder="Last name"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-white text-sm sm:text-base">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="mt-1 sm:mt-2 bg-gray-800/50 border-2 border-purple-500/30 text-white py-3 sm:py-4 text-sm sm:text-base"
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white text-sm sm:text-base">
                    Phone Number *
                  </Label>
                  <div className="flex gap-2 mt-1 sm:mt-2">
                    <Select
                      value={formData.countryCode}
                      onValueChange={(value) => updateFormData("countryCode", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="w-[120px] sm:w-[140px] bg-gray-800/50 border-2 border-purple-500/30 text-white text-xs sm:text-sm">
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] bg-gray-800 border-2 border-purple-500/30">
                        {COUNTRY_CODES.map((country) => (
                          <SelectItem
                            key={country.code}
                            value={country.code}
                            className="text-white focus:bg-purple-500/20 text-xs sm:text-sm"
                          >
                            <span className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span>{country.code}</span>
                              <span className="text-gray-400 text-xs hidden sm:inline">({country.country})</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        // Only allow digits, spaces, dashes, and parentheses
                        const cleaned = e.target.value.replace(/[^\d\s\-()]/g, "");
                        updateFormData("phone", cleaned);
                      }}
                      className="flex-1 bg-gray-800/50 border-2 border-purple-500/30 text-white py-3 sm:py-4 text-sm sm:text-base"
                      placeholder="(555) 123-4567"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-2">
                  <Checkbox
                    id="consultation"
                    checked={formData.wantsConsultation}
                    onCheckedChange={(checked) => updateFormData("wantsConsultation", checked === true)}
                    disabled={isSubmitting}
                    className="mt-1 border-2 border-purple-500/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <Label
                    htmlFor="consultation"
                    className="text-sm sm:text-base text-gray-300 leading-relaxed cursor-pointer"
                  >
                    I want a FREE consultation to address AI scaling opportunities.
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !validateForm()}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg md:text-xl rounded-xl shadow-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? "Sending..." : "Get My Free Blueprint"}
                </Button>

                <p className="text-xs sm:text-sm text-gray-400 text-center">
                  By submitting this form, you agree to our <a href="/privacy-policy" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>. We respect your privacy. Unsubscribe anytime.
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECTION 5 — TESTIMONIALS - Mobile optimized */}
      <section className="px-3 sm:px-4 py-6 sm:py-8 md:py-12 max-w-6xl mx-auto mb-6 sm:mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white">
          What Other Coaches Are Saying
        </h2>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 md:p-8 shadow-2xl bg-gray-900/80 border-2 border-purple-500/30 backdrop-blur-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-8 md:w-8 md:h-10 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-base md:text-lg text-gray-300 italic mb-4">
                    "I was spending 20+ hours weekly on client communication. Now it's all automated and I'm booking more clients than ever. This system pays for itself."
                  </blockquote>
                  <p className="text-sm md:text-base font-semibold text-white">- Alex, Fitness Coach</p>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 md:p-8 shadow-2xl bg-gray-900/80 border-2 border-purple-500/30 backdrop-blur-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-8 md:w-8 md:h-10 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-base md:text-lg text-gray-300 italic mb-4">
                    "The templates and scripts are gold. I've doubled my conversion rate and cut my work time in half. Wish I had this years ago."
                  </blockquote>
                  <p className="text-sm md:text-base font-semibold text-white">- Maria, Online Trainer</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6 — CASE STUDIES - Mobile optimized */}
      <section className="px-3 sm:px-4 py-6 sm:py-8 md:py-12 max-w-6xl mx-auto mb-6 sm:mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white">
          Real Client Wins & Case Studies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 md:p-8 shadow-2xl bg-gray-900/80 border-2 border-purple-500/30 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-10 md:w-10 md:h-12 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">Sarah</h3>
                <p className="text-sm md:text-base text-gray-300 mb-3">Personal Trainer</p>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  "Went from 3 clients to 18 clients in 3 months. The funnel handles all my follow-ups automatically."
                </p>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 md:p-8 shadow-2xl bg-gray-900/80 border-2 border-purple-500/30 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-10 md:w-10 md:h-12 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">Mike</h3>
                <p className="text-sm md:text-base text-gray-300 mb-3">Online Coach</p>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  "Revenue increased from $2k to $8k/month. The system books calls while I sleep."
                </p>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 md:p-8 shadow-2xl bg-gray-900/80 border-2 border-purple-500/30 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-8 h-10 md:w-10 md:h-12 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">Jennifer</h3>
                <p className="text-sm md:text-base text-gray-300 mb-3">Yoga Instructor</p>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  "Client retention went from 60% to 85%. The automated nurturing keeps them engaged."
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12 px-3 sm:px-4"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
          Start Booking More Clients Today
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Get your free 30-Day AI Blueprint to start building your automated client booking system in the next 24 hours.
        </p>
        <Button 
          onClick={() => setShowModal(true)}
          size="lg" 
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 md:py-5 px-8 md:px-12 text-xl md:text-2xl rounded-xl shadow-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          Get the Free Blueprint
        </Button>
      </motion.section>

      <Analytics />
    </div>
  );
}
