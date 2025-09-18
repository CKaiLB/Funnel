import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, CheckCircle, DollarSign, Clock, UserCheck, X, Brain, Star, TrendingUp, Zap, Target, ArrowRight, Calculator, BarChart3, TrendingUp as TrendingUpIcon, Users as UsersIcon, Zap as ZapIcon, CheckCircle as CheckCircleIcon, ArrowRight as ArrowRightIcon, Download as DownloadIcon, BookOpen as BookOpenIcon, Target as TargetIcon, BarChart3 as BarChart3Icon, Calendar as CalendarIcon, Clock as ClockIcon, Award as AwardIcon, Shield as ShieldIcon, Globe as GlobeIcon, Smartphone as SmartphoneIcon, Monitor as MonitorIcon, Cloud as CloudIcon, Database as DatabaseIcon, Cpu as CpuIcon, BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon, AreaChart as AreaChartIcon, Activity as ActivityIcon, Quote } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";

// Meta Pixel TypeScript declarations
declare global {
  interface Window {
    fbq: any;
  }
}

export default function Index() {
  const navigate = useNavigate();
  const [showUpsellModal, setShowUpsellModal] = useState(false);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
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
    // Navigate directly to sales funnel playbook page
    navigate("/sales-funnel-playbook");
    // Scroll to top when navigating
    window.scrollTo(0, 0);
  };

  const handleUpsellDecline = () => {
    setShowUpsellModal(false);
    navigate("/sales-funnel-playbook");
    // Scroll to top when navigating
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-900 overflow-x-hidden">
      {/* Centered Sweep Logo */}
      <div className="flex justify-center pt-8 pb-6">
        <img 
          src="/lovable-uploads/2e025803-adcb-4eb0-8995-15991e0213a4.png" 
          alt="Sweep Logo" 
          className="h-20 w-auto"
        />
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-6 shadow-2xl shadow-purple-500/80 ring-4 ring-purple-400/60 ring-offset-4 ring-offset-gray-900">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
          The Complete 7-Figure AI Funnel Blueprint
          </h1>
          
          {/* Scroll Down Animation - 3 Arrows */}
          <div className="flex justify-center items-center space-x-2 mb-8">
            <div className="animate-bounce" style={{ animationDelay: '0ms' }}>
              <svg 
                className="w-16 h-16 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 16l-6-6h12l-6 6z"/>
              </svg>
            </div>
            <div className="animate-bounce" style={{ animationDelay: '150ms' }}>
              <svg 
                className="w-16 h-16 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 16l-6-6h12l-6 6z"/>
              </svg>
            </div>
            <div className="animate-bounce" style={{ animationDelay: '300ms' }}>
              <svg 
                className="w-16 h-16 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 16l-6-6h12l-6 6z"/>
              </svg>
            </div>
          </div>
          
          {/* Product Card - Sales Funnel Playbook + AI ROI Calculator */}
          <div className="mb-8">
            <Card className="p-6 shadow-2xl bg-gray-900/80 border-2 border-purple-400/80 backdrop-blur-sm max-w-md mx-auto shadow-purple-500/50 shadow-blue-500/30">
              <div className="text-center">
              <h3 className="text-lg md:text-4xl font-bold text-white mb-3">Fitness Sales Funnel Playbook</h3>
                <div className="flex justify-center mb-6">
                  <img 
                    src="/lovable-uploads/SalesFunnel.png" 
                    alt="Sales Funnel Playbook" 
                    className="w-40 h-40 object-contain rounded-lg ring-4 ring-purple-400/60 shadow-lg shadow-purple-500/50"
                  />
                </div>
                
                {/* FREE Pricing Display */}
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <span className="text-2xl md:text-3xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]">FREE</span>
                  <span className="text-sm md:text-base text-gray-400 line-through">$97</span>
                  <span className="bg-green-900/50 text-green-400 px-2 py-1 rounded-full text-xs md:text-sm font-semibold border border-green-400/50 ring-1 ring-green-400/30">Limited Time</span>
                </div>
                
                <Button 
                  onClick={handleFreeDownload}
                  size="lg" 
                  className="w-full md:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 text-lg md:text-xl rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Get Your Free Playbook
                </Button>
                <p className="text-xs md:text-sm text-gray-400 mt-3">No credit card required • Instant access</p>
              </div>
            </Card>
          </div>

          {/* Social Proof Bar */}
          <div className="bg-gray-900/80 rounded-xl p-4 shadow-2xl border-2 border-purple-400/60 backdrop-blur-sm  shadow-purple-500/40 shadow-blue-500/20">
            <p className="text-sm text-gray-300 font-medium">
              🎯 Trusted by coaches growing to $5k–$20k/month
            </p>
          </div>
        </div>

        {/* Client Testimonials Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            Real Results from Real Coaches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-gray-900/80 border-2 border-purple-400/60 backdrop-blur-sm  shadow-2xl shadow-purple-500/40 shadow-blue-500/20 hover:shadow-purple-500/60 transition-all duration-300">
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
                  "Went from 3 clients to 18 clients in 3 months. The funnel handles all my follow-ups automatically. I'm booking calls while I sleep!"
                </blockquote>
                <div className="text-center">
                  <p className="font-semibold text-white">Sarah</p>
                  <p className="text-sm text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">Personal Trainer</p>
                  <p className="text-xs text-gray-400">Revenue: $2k → $12k/month</p>
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
                  "Revenue increased from $2k to $8k/month. The system books calls while I sleep. Best investment I've ever made in my business."
                </blockquote>
                <div className="text-center">
                  <p className="font-semibold text-white">Mike</p>
                  <p className="text-sm text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]">Online Coach</p>
                  <p className="text-xs text-gray-400">Revenue: $2k → $8k/month</p>
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
                  "Client retention went from 60% to 85%. The automated nurturing keeps them engaged and coming back for more programs."
                </blockquote>
                <div className="text-center">
                  <p className="font-semibold text-white">Jennifer</p>
                  <p className="text-sm text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">Yoga Instructor</p>
                  <p className="text-xs text-gray-400">Retention: 60% → 85%</p>
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
                  "I was spending 20+ hours weekly on client communication. Now it's all automated and I'm booking more clients than ever."
                </blockquote>
                <div className="text-center">
                  <p className="font-semibold text-white">Alex</p>
                  <p className="text-sm text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]">Fitness Coach</p>
                  <p className="text-xs text-gray-400">Time Saved: 20hrs/week</p>
                </div>
              </div>
            </Card>
          </div>
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


        {/* Final CTA Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            Start Booking More Clients Today
          </h2>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Get your free playbook and AI ROI calculator to start building your automated client booking system.
          </p>
          <Button 
            onClick={handleFreeDownload}
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 text-xl rounded-xl shadow-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-purple-400/80 shadow-purple-500/60 shadow-blue-500/40"
          >
            Get Your Free Playbook
          </Button>
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
      <Analytics />
    </div>
  );
}
