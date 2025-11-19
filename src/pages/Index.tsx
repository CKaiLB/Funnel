import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { UnlockAnimation } from "@/components/ui/unlock-animation";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, CheckCircle, DollarSign, Clock, UserCheck, X, Brain, Star, TrendingUp, Zap, Target, ArrowRight, Calculator, BarChart3, TrendingUp as TrendingUpIcon, Users as UsersIcon, Zap as ZapIcon, CheckCircle as CheckCircleIcon, ArrowRight as ArrowRightIcon, Download as DownloadIcon, BookOpen as BookOpenIcon, Target as TargetIcon, BarChart3 as BarChart3Icon, Calendar as CalendarIcon, Clock as ClockIcon, Award as AwardIcon, Shield as ShieldIcon, Globe as GlobeIcon, Smartphone as SmartphoneIcon, Monitor as MonitorIcon, Cloud as CloudIcon, Database as DatabaseIcon, Cpu as CpuIcon, BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon, AreaChart as AreaChartIcon, Activity as ActivityIcon, Quote, ChevronDown, ChevronUp } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import { addEmailToCollection } from "@/lib/firebase";
import { sendWelcomeEmail } from "@/lib/email";
import { useToast } from "@/hooks/use-toast";

// Stripe TypeScript declarations
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'buy-button-id': string;
        'publishable-key': string;
      };
    }
  }
}

// Meta Pixel TypeScript declarations
declare global {
  interface Window {
    fbq: any;
  }
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  consultation: boolean;
}

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [showPlaybookModal, setShowPlaybookModal] = useState(false);
  const [isPlaybookModalVisible, setIsPlaybookModalVisible] = useState(false);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [wantsConsultation, setWantsConsultation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [showStripeButton, setShowStripeButton] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      consultation: false,
    },
  });

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-show playbook modal after 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPlaybookModal(true);
      // Trigger fade-in animation after modal is shown
      setTimeout(() => {
        setIsPlaybookModalVisible(true);
      }, 10);
    }, 3000); // 1.5 seconds delay

    return () => clearTimeout(timer);
  }, []);

  // Reset animation state when modal closes
  useEffect(() => {
    if (!showPlaybookModal) {
      setIsPlaybookModalVisible(false);
    }
  }, [showPlaybookModal]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setShowStripeButton(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle Stripe payment success
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'stripe-buy-button:success') {
        // Payment successful - show success message and redirect to complete system
        console.log('Payment successful!');
        setIsCheckoutLoading(false);
        navigate('/complete-system');
      }
    };

    // Listen for Stripe checkout completion
    window.addEventListener('message', handleMessage);
    
    // Also listen for Stripe checkout close events
    const handleCheckoutClose = () => {
      console.log('Stripe checkout closed');
      setIsCheckoutLoading(false);
    };

    // Listen for checkout initiation
    const handleCheckoutStart = () => {
      console.log('Stripe checkout starting');
      setIsCheckoutLoading(true);
    };

    window.addEventListener('stripe-buy-button:close', handleCheckoutClose);
    window.addEventListener('stripe-buy-button:load', handleCheckoutStart);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('stripe-buy-button:close', handleCheckoutClose);
      window.removeEventListener('stripe-buy-button:load', handleCheckoutStart);
    };
  }, [navigate]);

  // Load Stripe script
  useEffect(() => {
    // Check if Stripe script is already loaded
    if (document.querySelector('script[src*="stripe.com"]')) {
      return;
    }

    // Load Stripe script
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // Meta Pixel tracking
  useEffect(() => {
    // Load Meta Pixel script
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
      // If Meta Pixel already exists, just track page view
      window.fbq('track', 'PageView');
    }

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = 'https://www.facebook.com/tr?id=1424382612134633&ev=PageView&noscript=1';
    noscript.appendChild(img);
    document.head.appendChild(noscript);

    return () => {
      // Cleanup if needed
      if (noscript.parentNode) {
        noscript.parentNode.removeChild(noscript);
      }
    };
  }, []);

  // Handle upsell modal
  const handleUpsellInterest = () => {
    setShowUpsellModal(false);
    navigate("/ai-roadmap");
    // Scroll to top when navigating
    window.scrollTo(0, 0);
  };

  const handleFreeDownload = () => {
    setShowPlaybookModal(true);
    // Scroll to top when modal opens
    window.scrollTo(0, 0);
  };

  const handleUnlockComplete = useCallback(() => {
    // Redirect based on whether they checked the consultation checkbox
    const redirectUrl = wantsConsultation 
      ? "https://www.sweepai.site/calculator"
      : "https://www.sweepai.site/interest-form";
    
    console.log("Unlock animation complete, redirecting to:", redirectUrl);
    console.log("Wants consultation:", wantsConsultation);
    
    // Use replace instead of href to ensure redirect happens
    try {
      window.location.replace(redirectUrl);
    } catch (error) {
      console.error("Redirect error:", error);
      // Fallback to href if replace fails
      window.location.href = redirectUrl;
    }
  }, [wantsConsultation]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Store whether they want consultation before showing animation
      setWantsConsultation(data.consultation || false);
      
      await addEmailToCollection(data.email, data.name, data.phone, "Fitness_Funnel_Playbook");
      await sendWelcomeEmail(data.email, data.name, data.phone, "Fitness_Funnel_Playbook");
      
      toast({
        title: "Success!",
        description: "Your playbook is on its way. Check your email!",
      });
      
      reset();
      setShowPlaybookModal(false);
      setShowUnlockAnimation(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpsellDecline = () => {
    setShowUpsellModal(false);
    navigate("/sales-funnel-playbook");
    // Scroll to top when navigating
    window.scrollTo(0, 0);
  };

  // Format countdown timer
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 overflow-x-hidden">
      {/* Unlock Animation */}
      {showUnlockAnimation && (
        <UnlockAnimation onAnimationComplete={handleUnlockComplete} />
      )}
      {/* Centered Sweep Logo */}
      <div className="flex justify-center pt-4 pb-3 md:pt-8 md:pb-6">
        <img 
          src="/lovable-uploads/2e025803-adcb-4eb0-8995-15991e0213a4.png" 
          alt="Sweep Logo" 
          className="h-12 w-auto md:h-20"
        />
      </div>

      <div className="px-4 py-3 md:py-6 max-w-4xl mx-auto">
        {/* Hero Section - Product Layout */}
        <div className="mb-6 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-8 text-center bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
            The Complete 7-Figure AI Funnel Blueprint
          </h1>
          
          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-center mb-6 md:mb-12">
            {/* Product Image - First on Mobile, Left Side on Desktop */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-1">
              <div className="relative">
                <img 
                  src="/playbook.png" 
                  alt="AI Funnel Playbook" 
                  className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain rounded-2xl ring-4 ring-purple-400/60 shadow-2xl shadow-purple-500/50"
                />
                {/* Decorative elements like in the image */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-lg"></div>
              </div>
            </div>

            {/* Product Details - Second on Mobile, Right Side on Desktop */}
            <div className="text-center lg:text-left order-2 lg:order-2">
              <div className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-purple-400/30 shadow-lg shadow-purple-500/20">
                Online Playbook
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
                AI FUNNEL PLAYBOOK
              </h2>
              <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
                CLOSE CLIENTS ON AUTOPILOT
              </p>
              <p className="text-gray-300 mb-6">By Sweep AI</p>
              
              {/* Pricing */}
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                <span className="text-lg text-gray-400 line-through">$97</span>
                <span className="text-5xl md:text-6xl font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(74,222,128,0.8)] animate-pulse">FREE</span>
                <span className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 rounded-full text-sm font-bold border-2 border-green-400/50 shadow-2xl shadow-green-500/30">
                  Limited Time
                </span>
              </div>

              {/* Countdown Timer */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">
                  {showStripeButton ? "Time's up! Complete your purchase now." : "Free access expires in:"}
                </p>
                <div className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-2 border-purple-400/60 rounded-lg px-4 py-2 shadow-lg shadow-purple-500/30">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400 font-bold text-lg drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              {showStripeButton ? (
                <div className="text-center lg:text-left">
                  {isCheckoutLoading && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/60 rounded-lg">
                      <p className="text-purple-300 text-sm">Loading checkout...</p>
                    </div>
                  )}
                  <stripe-buy-button
                    buy-button-id="buy_btn_1RxxcAJQvPIbNIWNKFppQnl4"
                    publishable-key="pk_live_51RBNOCJQvPIbNIWNTirqPqobDrS2vACpNiMRrlCGY0j7Q1JBn6HvUSyOAAjb53FfsSuytcJSfGO0NWEuBqX9YdhP00mdfLfS2M"
                  >
                  </stripe-buy-button>
                  <p className="text-xs text-gray-400 mt-2">Secure payment processing</p>
                </div>
              ) : (
                <div className="text-center lg:text-left">
                  <Button 
                    onClick={handleFreeDownload}
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-black py-4 px-6 md:py-6 md:px-12 text-2xl md:text-2xl lg:text-3xl rounded-2xl shadow-2xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 w-full lg:w-auto border-4 border-purple-400/80 shadow-purple-500/60"
                  >
                    <ArrowRight className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 mr-2 md:mr-3" />
                    <span className="hidden sm:inline">GET ACCESS NOW</span>
                    <span className="sm:hidden">GET ACCESS</span>
                  </Button>
                  <p className="text-xs md:text-sm text-gray-400 mt-3 font-semibold">No credit card required • Instant access</p>
                </div>
              )}
            </div>
          </div>

          {/* What You'll Learn Section */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 text-center border-b border-purple-400/30 pb-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">
              What You'll Learn Inside the Playbook
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="flex items-start space-x-3 p-4 bg-gray-900/50 rounded-lg border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                <p className="text-gray-300">How to install systems that close leads 24/7 and keep those that convert</p>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gray-900/50 rounded-lg border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                <p className="text-gray-300">The 3 trust-building strategies that instantly make clients see your value</p>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gray-900/50 rounded-lg border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                <p className="text-gray-300">Ways to position your services as the best choice without lowering your prices</p>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gray-900/50 rounded-lg border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                <p className="text-gray-300">Step-by-step guidance to convert interest into long-term commitment</p>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gray-900/50 rounded-lg border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                <p className="text-gray-300">Mistakes to avoid that push clients away without you realizing</p>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gray-900/50 rounded-lg border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                <p className="text-gray-300">AI automation strategies to scale your business to 7-figures</p>
              </div>
            </div>
          </div>
        </div>

        {/* Client Testimonials Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            Real Results from Real Coaches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-gray-900/80 border-2 border-purple-400/60 backdrop-blur-sm shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-purple-400/60 shadow-lg shadow-purple-500/50">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  ))}
                </div>
                <blockquote className="text-gray-300 italic mb-4 text-sm leading-relaxed">
                  "Sweep is built specifically for coaches. Other solutions felt overly complicated or too generic, but Sweep’s setup was intuitive and directly addressed the areas where I needed structure."
                </blockquote>
                <div className="text-center">
                  <p className="font-semibold text-white">Dan</p>
                  <p className="text-sm text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">Personal Trainer</p>
                  <p className="text-xs text-gray-400">Revenue: $250 → $2,000/month</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gray-900/80 border-2 border-purple-400/60 backdrop-blur-sm shadow-2xl shadow-purple-500/40 shadow-green-500/20 hover:shadow-purple-500/60 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-green-400/60 shadow-lg shadow-green-500/50">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  ))}
                </div>
                <blockquote className="text-gray-300 italic mb-4 text-sm leading-relaxed">
                  "Sweep was very customer facing, fast response time, and everything works seemlessly. There’s nobody really doing what they’re doing yet. It’s very hard to find a level of professionalism and communication like this."
                </blockquote>
                <div className="text-center">
                  <p className="font-semibold text-white">Zach</p>
                  <p className="text-sm text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]">Fitness Coach</p>
                  <p className="text-xs text-gray-400">Leads: 100 → 450/month</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gray-900/80 border-2 border-purple-400/60 backdrop-blur-sm  shadow-2xl shadow-purple-500/40 shadow-blue-500/20 hover:shadow-purple-500/60 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-blue-400/60 shadow-lg shadow-blue-500/50">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  ))}
                </div>
                <blockquote className="text-gray-300 italic mb-4 text-sm leading-relaxed">
                  "It feels great because I now have a clear vision and it’s just a matter of time and effort before I start to see success. "
                </blockquote>
                <div className="text-center">
                  <p className="font-semibold text-white">Boon</p>
                  <p className="text-sm text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">Online Coach</p>
                  <p className="text-xs text-gray-400">4x Client Base in 30 days</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gray-900/80 border-2 border-purple-400/60 backdrop-blur-sm  shadow-2xl shadow-purple-500/40 shadow-orange-500/20 hover:shadow-purple-500/60 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-orange-400/60 shadow-lg shadow-orange-500/50">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  ))}
                </div>
                <blockquote className="text-gray-300 italic mb-4 text-sm leading-relaxed">
                  "It was super easy & I know very little about setting up technology. If I could get sweep integrated into my site using their services, then anyone else could too."
                </blockquote>
                <div className="text-center">
                  <p className="font-semibold text-white">Brandon</p>
                  <p className="text-sm text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]">Gym Owner</p>
                  <p className="text-xs text-gray-400">Time Saved: 20hrs/week</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* CTA Section After Testimonials */}
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            Ready to Join These Successful Coaches?
          </h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Get your free playbook and start building your automated client booking system today.
          </p>
          {showStripeButton ? (
            <div className="text-center">
              {isCheckoutLoading && (
                <div className="mb-4 p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/60 rounded-lg max-w-md mx-auto">
                  <p className="text-purple-300 text-sm">Loading checkout...</p>
                </div>
              )}
              <stripe-buy-button
                buy-button-id="buy_btn_1RxxcAJQvPIbNIWNKFppQnl4"
                publishable-key="pk_live_51RBNOCJQvPIbNIWNTirqPqobDrS2vACpNiMRrlCGY0j7Q1JBn6HvUSyOAAjb53FfsSuytcJSfGO0NWEuBqX9YdhP00mdfLfS2M"
              >
              </stripe-buy-button>
              <p className="text-xs text-gray-400 mt-2">Secure payment processing</p>
            </div>
          ) : (
            <Button 
              onClick={handleFreeDownload}
              size="lg" 
              className="position-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-black py-4 px-8 text-xl md:text-2xl rounded-2xl shadow-2xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-purple-400/80 shadow-purple-500/60"
            >
              <ArrowRight className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3" />
              DOWNLOAD YOUR FREE PLAYBOOK
            </Button>
          )}
        </div>

        {/* Pain Points Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            Why Most Coaches Struggle to Book Clients Consistently
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gray-900/80 border-2 border-purple-400/60 backdrop-blur-sm  shadow-2xl shadow-purple-500/40 shadow-red-500/20 hover:shadow-purple-500/60 transition-all duration-300">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-red-400/60 shadow-lg shadow-red-500/50">
                  <X className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Leads Ghosting</h3>
                <p className="text-sm text-gray-300">Leads disappear after the first DM with no follow-up system</p>
              </div>
            </Card>
            
            <Card className="p-6 bg-gray-900/80 border-2 border-purple-400/60 backdrop-blur-sm  shadow-2xl shadow-purple-500/40 shadow-orange-500/20 hover:shadow-purple-500/60 transition-all duration-300">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-orange-400/60 shadow-lg shadow-orange-500/50">
                  <Target className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No Conversion System</h3>
                <p className="text-sm text-gray-300">Relying on word-of-mouth or random ads without a proven funnel</p>
              </div>
            </Card>
            
            <Card className="p-6 bg-gray-900/80 border-2 border-purple-400/60 backdrop-blur-sm  shadow-2xl shadow-purple-500/40 shadow-blue-500/20 hover:shadow-purple-500/60 transition-all duration-300">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-blue-400/60 shadow-lg shadow-blue-500/50">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Time Wasted</h3>
                <p className="text-sm text-gray-300">Hours spent on manual follow-ups instead of automated systems</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            Here's What You'll Get
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg border-2 border-purple-400/60  shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Complete Sales Funnel System</h3>
                <p className="text-gray-300">Step-by-step playbook to set up your first funnel in under a day</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg border-2 border-purple-400/60  shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">AI ROI Calculator</h3>
                <p className="text-gray-300">Predict your revenue growth and calculate exact ROI from implementing the system</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg border-2 border-purple-400/60  shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Proven Conversion Scripts</h3>
                <p className="text-gray-300">Templates and scripts that move conversations to booked calls automatically</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8 text-center text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
            <Collapsible className="bg-gray-900/50 rounded-lg border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 md:p-6 text-left hover:bg-gray-800/30 transition-colors">
                <span className="text-base md:text-lg font-semibold text-white pr-2">How quickly will I see results after implementing this system?</span>
                <ChevronDown className="h-5 w-5 text-purple-400 transition-transform duration-200 group-data-[state=open]:rotate-180 flex-shrink-0" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 md:px-6 pb-4 md:pb-6">
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  Most coaches see their first automated bookings within week of implementation. The system is designed to work immediately - you'll start receiving qualified leads and automated follow-ups as soon as you activate the funnel. Within the first week, you should see a 3-4x increase in lead conversions.
                </p>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible className="bg-gray-900/50 rounded-lg border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
              <CollapsibleTrigger className="flex w-full items-center justify-between p-4 md:p-6 text-left hover:bg-gray-800/30 transition-colors">
                <span className="text-base md:text-lg font-semibold text-white pr-2">Do I need technical skills to set this up?</span>
                <ChevronDown className="h-5 w-5 text-purple-400 transition-transform duration-200 group-data-[state=open]:rotate-180 flex-shrink-0" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 md:px-6 pb-4 md:pb-6">
                <p className="text-gray-300 leading-relaxed">
                  Not at all! The playbook includes step-by-step video tutorials and copy-paste templates. Even if you've never used automation software before, you'll have everything set up in a few hours. We've made it so simple that over 90% of our users complete the setup without any technical support.
                </p>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible className="bg-gray-900/50 rounded-lg border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
              <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left hover:bg-gray-800/30 transition-colors">
                <span className="text-lg font-semibold text-white">What if this doesn't work for my specific fitness niche?</span>
                <ChevronDown className="h-5 w-5 text-purple-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6">
                <p className="text-gray-300 leading-relaxed">
                  This system has been tested and proven across all coaching niches - from bodybuilding and nutrition to yoga instruction and calisthenics. The core principles of client psychology and conversion remain the same regardless of your specialty. We include niche-specific templates and examples for 15+ different coaching types.
                </p>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible className="bg-gray-900/50 rounded-lg border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
              <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left hover:bg-gray-800/30 transition-colors">
                <span className="text-lg font-semibold text-white">Will this work if I'm just starting my online coaching business?</span>
                <ChevronDown className="h-5 w-5 text-purple-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6">
                <p className="text-gray-300 leading-relaxed">
                  Absolutely! In fact, this system is perfect for new coaches because it gives you a professional, automated presence from day one. You'll appear more established and trustworthy than coaches who've been in business for years but don't have proper systems. Many of our most successful users started with zero clients and built to 6-figures using this exact system.
                </p>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible className="bg-gray-900/50 rounded-lg border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
              <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left hover:bg-gray-800/30 transition-colors">
                <span className="text-lg font-semibold text-white">What if I'm already booked out with clients?</span>
                <ChevronDown className="h-5 w-5 text-purple-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6">
                <p className="text-gray-300 leading-relaxed">
                  This system is actually perfect for booked-out coaches! It helps you raise your prices, create a waitlist, and build passive income streams. Instead of taking on more 1-on-1 clients, you can create group programs, online courses, and automated coaching sequences that generate revenue while you sleep. Many coaches use this to transition from trading time for money to building scalable systems.
                </p>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible className="bg-gray-900/50 rounded-lg border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
              <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left hover:bg-gray-800/30 transition-colors">
                <span className="text-lg font-semibold text-white">What's the difference between this and other funnel courses?</span>
                <ChevronDown className="h-5 w-5 text-purple-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6">
                <p className="text-gray-300 leading-relaxed">
                  This isn't just another funnel course - it's a complete business automation system specifically designed for fitness coaches. We include the exact scripts, email sequences, and automation workflows that have generated over $2M in revenue for our clients. Plus, you get the AI ROI calculator to predict your exact revenue growth, which no other course provides.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            Start Booking More Clients Today
          </h2>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Get your free playbook and AI ROI calculator to start building your automated client booking system.
          </p>
          {showStripeButton ? (
            <div className="text-center">
              {isCheckoutLoading && (
                <div className="mb-4 p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/60 rounded-lg max-w-md mx-auto">
                  <p className="text-purple-300 text-sm">Loading checkout...</p>
                </div>
              )}
              <stripe-buy-button
                buy-button-id="buy_btn_1RxxcAJQvPIbNIWNKFppQnl4"
                publishable-key="pk_live_51RBNOCJQvPIbNIWNTirqPqobDrS2vACpNiMRrlCGY0j7Q1JBn6HvUSyOAAjb53FfsSuytcJSfGO0NWEuBqX9YdhP00mdfLfS2M"
              >
              </stripe-buy-button>
              <p className="text-xs text-gray-400 mt-2">Secure payment processing</p>
            </div>
          ) : (
            <Button 
              onClick={handleFreeDownload}
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-black py-6 px-12 text-2xl md:text-3xl rounded-2xl shadow-2xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-purple-400/80 shadow-purple-500/60"
            >
              GET IT FOR FREE
            </Button>
          )}
        </div>
      </div>

      {/* Upsell Modal */}
      {showUpsellModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 md:p-8 lg:p-12 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto border-2 border-purple-400/80 shadow-2xl shadow-purple-500/60 shadow-blue-500/40">
            <div className="text-center">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowUpsellModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                Want a Closer Look at AI?
              </h2>
              
              <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed">
                For only <strong className="text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">$5</strong> also get the AI adoption roadmap for online coaches - a complete guide to building AI automations into your workflows.
              </p>
              
              {/* Layered Book Images */}
              <div className="flex justify-center mb-6 md:mb-8">
                <div className="relative inline-block">
                  {/* Sales Funnel Book (Back Layer) */}
                  <div className="w-24 h-32 md:w-32 md:h-40 lg:w-40 lg:h-48 transform rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105">
                    <img 
                      src="/lovable-uploads/SalesFunnel.png" 
                      alt="SalesFunnel System" 
                      className="w-full h-full object-cover rounded-lg shadow-2xl ring-4 ring-purple-400/60 shadow-purple-500/50"
                    />
                  </div>
                  
                  {/* AI Roadmap Book (Front Layer - Top) */}
                  <div className="absolute -top-1 -left-1 w-24 h-32 md:w-32 md:h-40 lg:w-40 lg:h-48 transform -rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105">
                    <img 
                      src="/lovable-uploads/ChatGPT Image Aug 7, 2025, 09_01_35 AM.png" 
                      alt="AI Implementation Roadmap" 
                      className="w-full h-full object-cover rounded-lg shadow-2xl ring-4 ring-blue-400/60 shadow-blue-500/50"
                    />
                  </div>
                </div>
              </div>
              
              {/* Pricing and Discount */}
              <div className="text-center mb-6 md:mb-8">
                <div className="text-lg md:text-xl lg:text-2xl font-semibold text-white mb-2 md:mb-3">AI Adoption Roadmap for Coaches</div>
                <div className="text-base md:text-lg text-gray-300 mb-2">Limited Time Offer</div>
                <div className="text-sm text-gray-400 line-through">Regular Price: $25</div>
                <div className="text-sm text-green-400 font-semibold drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]">Save $20 Today!</div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-4 md:mb-6">
                <Button 
                  onClick={handleUpsellInterest}
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold py-3 md:py-4 px-6 md:px-8 text-lg md:text-xl shadow-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-purple-400/80 shadow-purple-500/60 shadow-blue-500/40"
                >
                  I'm Interested - $5
                </Button>
                <Button 
                  onClick={handleUpsellDecline}
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-gray-600 text-gray-300 hover:bg-gray-800 font-semibold py-3 md:py-4 px-6 md:px-8 text-lg md:text-xl shadow-lg shadow-gray-500/20"
                >
                  No Thanks
                </Button>
              </div>
              
              {/* Bottom Subtext */}
              <p className="text-xs md:text-sm text-gray-500 text-center">
                Secure checkout powered by Stripe • 30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Playbook Modal */}
      {showPlaybookModal && (
        <div className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 transition-opacity duration-500 ${isPlaybookModalVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className={`bg-gray-900 rounded-2xl p-6 md:p-8 lg:p-12 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border-2 border-purple-400/80 shadow-2xl shadow-purple-500/60 shadow-blue-500/40 transition-all duration-500 ${isPlaybookModalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="text-center">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowPlaybookModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                Get Your Blueprint to <span className="text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.8)]">7-Figure</span> Scaling
              </h2>
              
              <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">
                Get <span className="text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)] font-semibold">Free</span> access to the AI enabled system scaling hundreds of top coaches to 7-figures in 2025. Completely automte your daily workflows and build a top 1% business. 
              </p>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="modal-name" className="text-white">Name</Label>
                    <Input
                      id="modal-name"
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      className="mt-1 bg-gray-800/50 border-2 border-purple-500/30 text-white ring-4 ring-purple-400/20"
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="modal-email" className="text-white">Email</Label>
                    <Input
                      id="modal-email"
                      type="email"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className="mt-1 bg-gray-800/50 border-2 border-purple-500/30 text-white ring-4 ring-purple-400/20"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="modal-phone" className="text-white">Phone</Label>
                    <Input
                      id="modal-phone"
                      type="tel"
                      {...register("phone")}
                      className="mt-1 bg-gray-800/50 border-2 border-purple-500/30 text-white ring-4 ring-purple-400/20"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                
                {/* Consultation Checkbox */}
                <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-lg border border-purple-400/30">
                  <Checkbox
                    id="consultation"
                    {...register("consultation")}
                    className="border-purple-400 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <Label 
                    htmlFor="consultation" 
                    className="text-sm text-gray-300 cursor-pointer flex-1"
                  >
                    I want a <span className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)] font-semibold">FREE</span> AI consultation to identify scaling + automation opportunities in my coaching buisness
                  </Label>
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 text-xl rounded-xl shadow-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-purple-400/80 ring-4 ring-purple-400/50 shadow-purple-500/60 shadow-blue-500/40"
                >
                  {isSubmitting ? "Sending..." : "Send Me the Playbook"}
                </Button>
                
                <p className="text-sm text-gray-400 text-center pt-10">
                  By submitting, you agree to our AI sales automations and marketing emails.
                </p>
                <p className="text-sm text-gray-400 text-center">
                  We respect your inbox. Unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
      <Analytics />
    </div>
  );
}
