import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, useAnimation } from "framer-motion";
import { ArrowRight, Clock, Target, DollarSign } from "lucide-react";
import { computeRoi } from "@/lib/roi";
import { Analytics } from "@vercel/analytics/react";
import { QuizModal } from "@/components/QuizModal";

// Meta Pixel TypeScript declarations
declare global {
  interface Window {
    fbq: any;
  }
}

export default function Index() {
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [deprivationAmount, setDeprivationAmount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
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

  // Auto-open quiz modal after 5 seconds
  useEffect(() => {
    const autoOpenTimer = setTimeout(() => {
      if (!hasAutoOpened) {
        setShowQuizModal(true);
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
              setIsCounting(true);
              const duration = 2000; // 2 seconds
              const steps = 60;
              const increment = targetAmount / steps;
              let current = 0;
              
              countIntervalRef.current = setInterval(() => {
                current += increment;
                if (current >= targetAmount) {
                  setDeprivationAmount(targetAmount);
                  setIsCounting(false);
                  if (countIntervalRef.current) {
                    clearInterval(countIntervalRef.current);
                  }
                } else {
                  setDeprivationAmount(Math.floor(current));
                }
              }, duration / steps);
              
              // Stop observing once animation starts
              observer.disconnect();
            }
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of section is visible
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

  // Animation for calculator graphic float
  const calculatorControls = useAnimation();

  useEffect(() => {
    calculatorControls.start({
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    });
  }, [calculatorControls]);

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

  const openQuizModal = () => {
    setShowQuizModal(true);
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

      {/* SECTION 1 — HERO - Optimized for mobile above fold */}
      <section className="px-3 sm:px-4 py-4 sm:py-6 md:py-8 lg:py-12 max-w-6xl mx-auto">
        <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-12">
          {/* Headline - slides in from left */}
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 lg:mb-6 text-white leading-tight px-2"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Build Your Free AI Revenue Report for Online Fitness Coaches
          </motion.h1>
          
          {/* Subheadline - fades in */}
          <motion.p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-4 sm:mb-5 md:mb-6 lg:mb-8 max-w-3xl mx-auto px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            See exactly how much revenue you're leaving on the table and how top coaches are scaling to 7-figures on autopilot...
          </motion.p>

          {/* AI Revenue Report Graphic - floats upward, smaller on mobile */}
          <motion.div
            className="flex justify-center mb-4 sm:mb-5 md:mb-6 lg:mb-8"
            animate={calculatorControls}
          >
            <div className="relative">
              <img 
                src="/AIRevenueReport.png" 
                alt="AI Revenue Report" 
                className="w-48 h-auto sm:w-64 md:w-80 lg:w-96 xl:w-[28rem] rounded-xl sm:rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl"></div>
              <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-lg"></div>
            </div>
          </motion.div>

          {/* CTA Button - pulses every 5 seconds, responsive sizing */}
          <motion.div
            animate={buttonControls}
            className="mb-3 sm:mb-4 md:mb-6 px-2"
          >
            <Button 
              onClick={openQuizModal}
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 sm:py-4 md:py-5 lg:py-6 px-6 sm:px-8 md:px-10 lg:px-12 text-base sm:text-lg md:text-xl lg:text-2xl rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 sm:border-4 border-blue-400/80 shadow-blue-500/60"
            >
              Get My Free AI Scaling Report <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-2 inline" />
            </Button>
          </motion.div>

          {/* Social Proof Line */}
          <motion.p 
            className="text-xs sm:text-sm md:text-base text-gray-400 mb-2 sm:mb-3 md:mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="text-yellow-400 font-semibold">Fitness Coaches Nationwide</span> have scaled using this system
          </motion.p>

          {/* Footer Microcopy */}
          <motion.p 
            className="text-xs sm:text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Free. No Tech Skills Needed. 60 seconds.
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
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">Find Your Hidden Revenue</h3>
                <p className="text-sm sm:text-base text-gray-300">See exactly how much revenue you're losing by not automating.</p>
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
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">Spot Operational Leaks</h3>
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
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">Get Your 30-Day AI Blueprint</h3>
                <p className="text-sm sm:text-base text-gray-300">The exact system top coaches use to scale from 10 to 50+ clients without hiring.</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — LIGHT DEPRIVATION - Mobile optimized */}
      <motion.section 
        className="px-3 sm:px-4 py-8 sm:py-10 md:py-12 lg:py-16 max-w-6xl mx-auto mb-6 sm:mb-8 md:mb-12 rounded-xl sm:rounded-2xl relative overflow-hidden"
        initial={{ backgroundColor: "rgb(17, 24, 39)" }}
        animate={{ 
          backgroundColor: `rgb(${Math.min(255, 17 + (deprivationAmount / 1000) * 2)}, ${Math.min(255, 24 + (deprivationAmount / 1000) * 2)}, ${Math.min(255, 39 + (deprivationAmount / 1000) * 2)})`
        }}
        transition={{ duration: 2 }}
      >
        <div ref={deprivationSectionRef} className="text-center relative z-10">
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-white mb-3 sm:mb-4 md:mb-6 px-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Every month you delay, you're losing…
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-red-500 mb-3 sm:mb-4 md:mb-6 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] px-2">
              ${deprivationAmount.toLocaleString()}
            </div>
          </motion.div>

          <motion.p 
            className="text-base sm:text-lg md:text-xl text-white mb-4 sm:mb-5 md:mb-6 lg:mb-8 px-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Top online fitness coaches are scaling to 7-figures on autopilot while you're still trading time for money.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            <span className="text-red-400 font-bold">The gap widens every day.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="px-2"
          >
            <Button 
              onClick={openQuizModal}
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 sm:py-4 md:py-5 lg:py-6 px-6 sm:px-8 md:px-10 lg:px-12 text-base sm:text-lg md:text-xl lg:text-2xl rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 sm:border-4 border-red-400/80 shadow-red-500/60"
            >
              Get My Free AI Scaling Report <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-2 inline" />
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Quiz Modal */}
      <QuizModal isOpen={showQuizModal} onClose={() => setShowQuizModal(false)} />

      <Analytics />
    </div>
  );
}
