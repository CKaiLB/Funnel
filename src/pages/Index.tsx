import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, CheckCircle, DollarSign, Clock, UserCheck, X, Brain, Star, TrendingUp, Zap, Target, ArrowRight } from "lucide-react";
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

  const handleFreeDownload = () => {
    setShowUpsellModal(true);
    // Scroll to top when modal opens
    window.scrollTo(0, 0);
  };

  const handleUpsellInterest = () => {
    setShowUpsellModal(false);
    navigate("/ai-roadmap");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 md:space-x-3">
            <img src="/lovable-uploads/2e025803-adcb-4eb0-8995-15991e0213a4.png" alt="Sweep Logo" className="h-12 w-auto md:h-20" />
          </Link>
          <div className="text-sm md:text-base text-gray-600">
            Trusted by coaches growing to $5k–$20k/month
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 md:mb-8 shadow-lg">
              <BookOpen className="w-8 h-10 md:w-12 md:h-14 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight px-2 animate-fade-in">
              The #1 AI Optimized Sales System Every Fitness Coach Needs to Book More Clients on Autopilot
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto px-2 md:px-4 mb-6 md:mb-10 leading-relaxed">
              Step-by-step playbook to turn conversations into paying clients — without ads or complex tech.
            </p>
            
            {/* Product Image Card - Moved to Top */}
            <div className="mb-8 md:mb-12">
              <Card className="p-4 md:p-8 shadow-xl bg-white border-2 border-blue-200 max-w-sm md:max-w-md mx-auto">
                <div className="text-center">
                  <img 
                    src="/lovable-uploads/SalesFunnel.png" 
                    alt="Sales Funnel Playbook" 
                    className="w-32 h-32 md:w-48 md:h-48 object-contain mx-auto mb-4 rounded-lg"
                  />
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">Fitness Sales Funnel Playbook</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4">Complete system to automate your client booking process</p>
                  
                  {/* FREE Pricing Display */}
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <span className="text-2xl md:text-3xl font-bold text-green-600">FREE</span>
                    <span className="text-sm md:text-base text-gray-500 line-through">$97</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs md:text-sm font-semibold">Limited Time</span>
                  </div>
                  
                  <Button 
                    onClick={handleFreeDownload}
                    size="lg" 
                    className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 text-lg md:text-xl rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Get Your Free Playbook
                  </Button>
                  <p className="text-xs md:text-sm text-gray-500 mt-3">No credit card required • Instant access</p>
                </div>
              </Card>
            </div>

            {/* Social Proof Bar */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
              <p className="text-sm md:text-base text-gray-600 font-medium">
                🎯 Trusted by coaches growing to $5k–$20k/month
              </p>
            </div>
          </div>

          {/* High-Value Results Section */}
          <div className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12 text-center text-gray-800">
              High-Value Results You Can Expect
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center group hover:scale-105 transition-transform duration-500">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-10 md:w-10 md:h-12 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-2">3-5x</h3>
                <p className="text-base md:text-lg font-semibold text-gray-800 mb-2">More Clients</p>
                <p className="text-sm md:text-base text-gray-600">Book more clients consistently with automated follow-ups</p>
              </div>
              
              <div className="text-center group hover:scale-105 transition-transform duration-500">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-10 md:w-10 md:h-12 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-purple-600 mb-2">15-20hrs</h3>
                <p className="text-base md:text-lg font-semibold text-gray-800 mb-2">Time Saved</p>
                <p className="text-sm md:text-base text-gray-600">Weekly time savings on client communication</p>
              </div>
              
              <div className="text-center group hover:scale-105 transition-transform duration-500">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-10 md:w-10 md:h-12 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-green-600 mb-2">40-60%</h3>
                <p className="text-base md:text-lg font-semibold text-gray-800 mb-2">Revenue Increase</p>
                <p className="text-sm md:text-base text-gray-600">Higher conversion rates and client retention</p>
              </div>
              
              <div className="text-center group hover:scale-105 transition-transform duration-500">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-orange-600 mb-2">80%</h3>
                <p className="text-base md:text-lg font-semibold text-gray-800 mb-2">Client Retention</p>
                <p className="text-sm md:text-base text-gray-600">Better client relationships and long-term success</p>
              </div>
            </div>
          </div>

          {/* Pain/Problem Section */}
          <div className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12 text-center text-gray-800">
              Why Most Coaches Struggle to Book Clients Consistently
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center group hover:scale-105 transition-transform duration-500 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                  <X className="w-8 h-10 md:w-10 md:h-12 text-red-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">Leads Ghosting After First DM</h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">Your prospects show interest but disappear when you try to close. No system to keep them engaged.</p>
              </div>
              
              <div className="text-center group hover:scale-105 transition-transform duration-500 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                  <Target className="w-8 h-10 md:w-10 md:h-12 text-yellow-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">No System to Convert Interest</h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">You're getting leads but have no proven process to turn that initial interest into booked calls.</p>
              </div>
              
              <div className="text-center group hover:scale-105 transition-transform duration-500 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Zap className="w-8 h-10 md:w-10 md:h-12 text-blue-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">Relying on Random Ads</h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">Spending money on ads without a proven funnel to convert prospects into paying clients.</p>
              </div>
            </div>
          </div>

          {/* Promise/Value Section */}
          <div className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12 text-center text-gray-800">
              Here's What This Playbook Will Do For You
            </h2>
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-start space-x-4 md:space-x-6 group hover:translate-x-2 transition-transform duration-500" style={{animationDelay: '0.1s'}}>
                <CheckCircle className="w-6 h-8 md:w-8 md:h-10 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Set Up Your First Funnel in Under a Day</h3>
                  <p className="text-base md:text-lg text-gray-600">Step-by-step instructions to build a complete sales funnel without technical skills.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 md:space-x-6 group hover:translate-x-2 transition-transform duration-500" style={{animationDelay: '0.2s'}}>
                <CheckCircle className="w-6 h-8 md:w-8 md:h-10 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Proven Scripts That Convert</h3>
                  <p className="text-base md:text-lg text-gray-600">Copy-paste messaging templates that have booked hundreds of clients for other coaches.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 md:space-x-6 group hover:translate-x-2 transition-transform duration-500" style={{animationDelay: '0.3s'}}>
                <CheckCircle className="w-6 h-8 md:w-8 md:h-10 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Optimize for Client Progression</h3>
                  <p className="text-base md:text-lg text-gray-600">Learn the psychology and mechanics that make prospects say "yes" and stay clients long-term.</p>
                </div>
              </div>
            </div>
            
            {/* Mini CTA */}
            <div className="text-center mt-10 md:mt-12">
              <Button 
                onClick={handleFreeDownload}
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 text-lg md:text-xl rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Download the playbook now and install your funnel today
              </Button>
            </div>
          </div>

          {/* Visual Proof Section */}
          <div className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12 text-center text-gray-800">
              This is Exactly What You'll Build
            </h2>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl border-2 border-blue-200">
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-10 md:w-10 md:h-12 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Plug-and-Play Sales Funnel</h3>
                <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                  "The funnel system from this playbook completely transformed my business. I went from struggling to book calls to having a waiting list of prospects ready to work with me."
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm md:text-base text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                    <span className="text-gray-700"><strong>Time Saved:</strong> 18 hours/week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Case Studies Section */}
          <div className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12 text-center text-gray-800">
              Real Client Wins & Case Studies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <Card className="p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-10 md:w-10 md:h-12 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Sarah Martinez</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-3">Personal Trainer</p>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    "Went from 3 clients to 18 clients in 3 months. The funnel handles all my follow-ups automatically."
                  </p>
                </div>
              </Card>
              
              <Card className="p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-10 md:w-10 md:h-12 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Mike Rodriguez</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-3">Online Coach</p>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    "Revenue increased from $2k to $8k/month. The system books calls while I sleep."
                  </p>
                </div>
              </Card>
              
              <Card className="p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-8 h-10 md:w-10 md:h-12 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Jennifer Chen</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-3">Yoga Instructor</p>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    "Client retention went from 60% to 85%. The automated nurturing keeps them engaged."
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12 text-center text-gray-800">
              What Other Coaches Are Saying
            </h2>
            <div className="space-y-6 md:space-y-8">
              <Card className="p-6 md:p-8 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-8 md:w-8 md:h-10 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-base md:text-lg text-gray-700 italic mb-4">
                      "I was spending 20+ hours weekly on client communication. Now it's all automated and I'm booking more clients than ever. This system pays for itself."
                    </blockquote>
                    <p className="text-sm md:text-base font-semibold text-gray-800">- Alex Thompson, Fitness Coach</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 md:p-8 shadow-lg">
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
                    <blockquote className="text-base md:text-lg text-gray-700 italic mb-4">
                      "The templates and scripts are gold. I've doubled my conversion rate and cut my work time in half. Wish I had this years ago."
                    </blockquote>
                    <p className="text-sm md:text-base font-semibold text-gray-800">- Maria Santos, Online Trainer</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 md:mb-8 text-gray-800">
              Start Booking More Clients Today
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get your free playbook and start building your automated client booking system in the next 24 hours.
            </p>
            <Button 
              onClick={handleFreeDownload}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 md:py-5 px-8 md:px-12 text-xl md:text-2xl rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Get the Free Playbook
            </Button>
          </div>
        </div>
      </div>

      {/* Upsell Modal */}
      {showUpsellModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 lg:p-12 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="text-center">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowUpsellModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Want to Scale Even Faster?
              </h2>
              
              <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
                For only <strong>$5</strong> also get the AI implementation roadmap for fitness businesses - a complete guide that shows you exactly how to automate your entire sales process.
              </p>
              
              {/* Layered Book Images */}
              <div className="flex justify-center mb-6 md:mb-8">
                <div className="relative inline-block">
                  {/* Sales Funnel Book (Back Layer) */}
                  <div className="w-24 h-32 md:w-32 md:h-40 lg:w-40 lg:h-48 transform rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105">
                    <img 
                      src="/lovable-uploads/SalesFunnel.png" 
                      alt="SalesFunnel System" 
                      className="w-full h-full object-cover rounded-lg shadow-xl"
                    />
                  </div>
                  
                  {/* AI Roadmap Book (Front Layer - Top) */}
                  <div className="absolute -top-1 -left-1 w-24 h-32 md:w-32 md:h-40 lg:w-40 lg:h-48 transform -rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105">
                    <img 
                      src="/lovable-uploads/AIRoadmap.png" 
                      alt="AI Implementation Roadmap" 
                      className="w-full h-full object-cover rounded-lg shadow-xl"
                    />
                  </div>
                </div>
              </div>
              
              {/* Pricing and Discount */}
              <div className="text-center mb-6 md:mb-8">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 mb-2">$5</div>
                <div className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 mb-2 md:mb-3">AI Roadmap for Fitness Businesses</div>
                <div className="text-base md:text-lg text-gray-600 mb-2">Limited Time Offer</div>
                <div className="text-sm text-gray-500 line-through">Regular Price: $25</div>
                <div className="text-sm text-green-600 font-semibold">Save $20 Today!</div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-4 md:mb-6">
                <Button 
                  onClick={handleUpsellInterest}
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 font-bold py-3 md:py-4 px-6 md:px-8 text-lg md:text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  I'm Interested - $5
                </Button>
                <Button 
                  onClick={handleUpsellDecline}
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold py-3 md:py-4 px-6 md:px-8 text-lg md:text-xl"
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
