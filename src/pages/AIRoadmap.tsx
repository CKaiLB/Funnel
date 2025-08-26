import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, Star, TrendingUp, Brain, Zap, Target, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

// Meta Pixel TypeScript declarations
declare global {
  interface Window {
    fbq: any;
  }
  
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'buy-button-id': string;
        'publishable-key': string;
      };
    }
  }
}

export default function AIRoadmap() {
  const navigate = useNavigate();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

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

    return () => {
      // Cleanup script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-6 shadow-2xl shadow-purple-500/80 ring-4 ring-purple-400/60 ring-offset-4 ring-offset-black">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
            AI Implementation Roadmap for Fitness Businesses
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Complete guide to automate your entire sales process with AI-powered systems that work 24/7.
          </p>
        </div>

        {/* Paywall Section - First Card */}
        <div className="mb-12">
          <Card className="p-6 md:p-8 lg:p-12 shadow-2xl bg-gray-900/80 border-2 border-purple-400/80 backdrop-blur-sm ring-4 ring-purple-400/50 ring-offset-4 ring-offset-black shadow-purple-500/60 shadow-blue-500/40">
            <div className="text-center mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 ring-4 ring-purple-400/60 shadow-lg shadow-purple-500/50">
                <Lock className="w-6 h-8 md:w-8 md:h-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">
                Unlock Your AI Roadmap
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-4 md:mb-6">
                Complete the purchase to access your personalized AI implementation roadmap.
              </p>
            </div>

            {/* Product Card - AI Roadmap (Inside Paywall) */}
            <div className="mb-8">
              <Card className="p-6 shadow-2xl bg-gray-800/80 border-2 border-purple-400/60 backdrop-blur-sm max-w-md mx-auto ring-4 ring-purple-400/40 ring-offset-4 ring-offset-black shadow-purple-500/40 shadow-blue-500/20">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <img 
                      src="/lovable-uploads/ChatGPT Image Aug 7, 2025, 09_01_35 AM.png" 
                      alt="AI Implementation Roadmap" 
                      className="w-32 h-32 object-contain rounded-lg ring-4 ring-blue-400/60 shadow-lg shadow-blue-500/50"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">AI Implementation Roadmap</h3>
                  <p className="text-sm text-gray-300 mb-4">Complete guide to automate your entire sales process with AI</p>
                  
                  {/* Pricing Display */}
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <span className="text-2xl font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">$5</span>
                    <span className="text-sm text-gray-400 line-through">$25</span>
                    <span className="bg-purple-900/50 text-purple-400 px-2 py-1 rounded-full text-xs font-semibold border border-purple-400/50 ring-1 ring-purple-400/30">Limited Time</span>
                  </div>
                  {/* Stripe Buy Button */}
            <div className="text-center mb-4">
              {isCheckoutLoading && (
                <div className="mb-4 p-3 bg-blue-900/50 border border-blue-400/60 rounded-lg">
                  <p className="text-blue-300 text-sm">Loading checkout in this tab...</p>
                </div>
              )}
              <stripe-buy-button
                buy-button-id="buy_btn_1RxxcAJQvPIbNIWNKFppQnl4"
                publishable-key="pk_live_51RBNOCJQvPIbNIWNTirqPqobDrS2vACpNIWNKFppQnl4"
                client-reference-id="ai_roadmap_purchase"
              >
              </stripe-buy-button>
              <p className="text-xs text-gray-400 mt-2">Checkout opens in this tab • Secure payment processing</p>
            </div>
                </div>
              </Card>
            </div>

            <div className="text-center text-xs md:text-sm text-gray-500">
              Secure checkout powered by Stripe • 30-day money-back guarantee
            </div>
          </Card>
        </div>

        {/* AI Benefits Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            What This AI Roadmap Will Do For You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gray-900/80 border-2 border-purple-400/60 backdrop-blur-sm ring-4 ring-purple-400/40 ring-offset-4 ring-offset-black shadow-2xl shadow-purple-500/40 shadow-blue-500/20 hover:shadow-purple-500/60 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-purple-400/60 shadow-lg shadow-purple-500/50">
                  <Zap className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">24/7 Automation</h3>
                <p className="text-sm text-gray-300">AI systems that work around the clock to book clients while you sleep</p>
              </div>
            </Card>
            
            <Card className="p-6 bg-gray-900/80 border-2 border-purple-400/60 backdrop-blur-sm ring-4 ring-purple-400/40 ring-offset-4 ring-offset-black shadow-2xl shadow-purple-500/40 shadow-blue-500/20 hover:shadow-purple-500/60 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-blue-400/60 shadow-lg shadow-blue-500/50">
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Smart Targeting</h3>
                <p className="text-sm text-gray-300">AI-powered lead scoring and qualification for higher conversions</p>
              </div>
            </Card>
            
            <Card className="p-6 bg-gray-900/80 border-2 border-purple-400/60 backdrop-blur-sm ring-4 ring-purple-400/40 ring-offset-4 ring-offset-black shadow-2xl shadow-purple-500/40 shadow-blue-500/20 hover:shadow-purple-500/60 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-green-400/60 shadow-lg shadow-green-500/50">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Scalable Growth</h3>
                <p className="text-sm text-gray-300">Systems that grow with your business without additional manual work</p>
              </div>
            </Card>
          </div>
        </div>

        {/* AI Implementation Steps */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            Step-by-Step AI Implementation
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg border-2 border-purple-400/60 ring-4 ring-purple-400/40 ring-offset-4 ring-offset-black shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">AI Tool Selection</h3>
                <p className="text-gray-300">Choose the right AI tools for your specific fitness business needs</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg border-2 border-purple-400/60 ring-4 ring-purple-400/40 ring-offset-4 ring-offset-black shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">System Integration</h3>
                <p className="text-gray-300">Seamlessly integrate AI with your existing sales funnel</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg border-2 border-purple-400/60 ring-4 ring-purple-400/40 ring-offset-4 ring-offset-black shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">AI Training & Optimization</h3>
                <p className="text-gray-300">Train your AI systems and optimize for maximum performance</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Success Stories */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            AI Success Stories from Fitness Coaches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-gray-900/80 border-2 border-purple-400/60 backdrop-blur-sm ring-4 ring-purple-400/40 ring-offset-4 ring-offset-black shadow-2xl shadow-purple-500/40 shadow-blue-500/20 hover:shadow-purple-500/60 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-purple-400/60 shadow-lg shadow-purple-500/50">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  ))}
                </div>
                <blockquote className="text-gray-300 italic mb-4 text-sm leading-relaxed">
                  "The AI implementation roadmap showed me exactly how to automate my entire sales process. Now I'm booking clients 24/7 without lifting a finger."
                </blockquote>
                <div className="text-center">
                  <p className="font-semibold text-white">David Park</p>
                  <p className="text-sm text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">Personal Trainer</p>
                  <p className="text-xs text-gray-400">Revenue: $3k → $15k/month</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gray-900/80 border-2 border-purple-400/60 backdrop-blur-sm ring-4 ring-purple-400/40 ring-offset-4 ring-offset-black shadow-2xl shadow-purple-500/40 shadow-blue-500/20 hover:shadow-purple-500/60 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-green-400/60 shadow-lg shadow-green-500/50">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  ))}
                </div>
                <blockquote className="text-gray-300 italic mb-4 text-sm leading-relaxed">
                  "Following this AI roadmap, I automated 90% of my sales process. The systems work better than I ever could manually."
                </blockquote>
                <div className="text-center">
                  <p className="font-semibold text-white">Lisa Chen</p>
                  <p className="text-sm text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]">Online Coach</p>
                  <p className="text-xs text-gray-400">Automation: 90% of sales process</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <p className="text-base md:text-lg text-gray-300 mb-3 md:mb-4">
            Ready to transform your fitness business with AI automation?
          </p>
          <p className="text-sm md:text-base text-gray-500">
            Use the Stripe button above to complete your purchase and get instant access to your AI roadmap.
          </p>
        </div>
      </div>
      <Analytics />
    </div>
  );
}
