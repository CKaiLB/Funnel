import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { addEmailToCollection } from "@/lib/firebase";
import { CheckCircle, Brain, Zap, TrendingUp, Clock, Target, Star, Lock } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";

// Meta Pixel TypeScript declarations
declare global {
  interface Window {
    fbq: any;
  }
}

const WEBHOOK_URL = import.meta.env.VITE_FUNNEL_EMAIL_WEBHOOK_URL;

export default function AIRoadmap() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  // Load Stripe script and render button
  useEffect(() => {
    // Load Stripe script
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    document.head.appendChild(script);

    // Render Stripe button after script loads
    script.onload = () => {
      const buttonContainer = document.getElementById('stripe-button-container');
      if (buttonContainer) {
        buttonContainer.innerHTML = `
          <stripe-buy-button
            buy-button-id="buy_btn_1RxxcAJQvPIbNIWNKFppQnl4"
            publishable-key="pk_live_51RBNOCJQvPIbNIWNTirqPqobDrS2vACpNiMRrlCGY0j7Q1JBn6HvUSyOAAjb53FfsSuytcJSfGO0NWEuBqX9YdhP00mdfLfS2M"
            client-reference-id="ai_roadmap_purchase"
          >
          </stripe-buy-button>
        `;
        
        // Add success handler for Stripe button
        const stripeButton = buttonContainer.querySelector('stripe-buy-button');
        if (stripeButton) {
          stripeButton.addEventListener('load', () => {
            // Listen for successful payment
            window.addEventListener('message', (event) => {
              if (event.data && event.data.type === 'stripe-buy-button:success') {
                // Redirect to complete system page after successful payment
                navigate('/complete-system');
              }
            });
          });
        }
      }
    };

    return () => {
      // Cleanup script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [navigate]);

  async function onSubmit(values) {
    setIsLoading(true);
    setError("");
    try {
      // First, submit to webhook
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          funnel_type: "AI_Roadmap",
          source: "funnel",
          timestamp: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Failed to submit. Please try again.");
      
      // Then, store email in Firebase
      await addEmailToCollection(values.email, values.name, values.phone, "AI_Roadmap");
      
      setIsLoading(false);
      navigate("/congratulations");
    } catch (err) {
      setError(err.message || "There was an error. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 md:space-x-3">
            <img src="/lovable-uploads/2e025803-adcb-4eb0-8995-15991e0213a4.png" alt="Sweep Logo" className="h-12 w-auto md:h-20" />
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 md:mb-8 shadow-lg">
              <Brain className="w-8 h-10 md:w-12 md:h-14 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight px-2">
              AI Roadmap for Fitness Businesses
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto px-2 md:px-4 mb-6 md:mb-8 leading-relaxed">
              Complete implementation guide to automate your entire sales process and scale your fitness business with AI.
            </p>
          </div>

          {/* Paywall Section */}
          <Card className="p-6 md:p-8 lg:p-12 shadow-2xl bg-white border-2 border-blue-200 mb-12 md:mb-16">
            <div className="text-center mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Lock className="w-6 h-8 md:w-8 md:h-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
                Unlock Your AI Roadmap
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-4 md:mb-6">
                Complete the purchase to access your personalized AI implementation roadmap.
              </p>
            </div>

            <div className="flex justify-center">
                <img src="/lovable-uploads/AIRoadmap.png" alt="AI Roadmap" className="h-40 w-auto md:h-40" />
            </div>

            {/* Stripe Buy Button */}
            <div className="text-center mb-4 md:mb-4">
              <div id="stripe-button-container" className="flex justify-center">
                {/* Stripe button will be rendered here */}
              </div>
            </div>

            <div className="text-center text-xs md:text-sm text-gray-500">
              Secure checkout powered by Stripe • 30-day money-back guarantee
            </div>
          </Card>

          {/* What You'll Get Section */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-8 md:mb-12 lg:mb-16 text-center text-gray-800">
              What's Inside Your AI Roadmap
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <CheckCircle className="w-5 h-6 md:w-6 md:h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">AI Tool Selection Guide</h3>
                    <p className="text-sm md:text-base text-gray-600">Choose the right AI tools for your specific fitness business needs and budget.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <CheckCircle className="w-5 h-6 md:w-6 md:h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">Implementation Timeline</h3>
                    <p className="text-sm md:text-base text-gray-600">90-day roadmap with specific milestones and expected results.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <CheckCircle className="w-5 h-6 md:w-6 md:h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">ROI Projections</h3>
                    <p className="text-sm md:text-base text-gray-600">Expected revenue increase and time savings based on similar businesses.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <CheckCircle className="w-5 h-6 md:w-6 md:h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">Integration Checklists</h3>
                    <p className="text-sm md:text-base text-gray-600">Step-by-step checklists for each AI system integration.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <CheckCircle className="w-5 h-6 md:w-6 md:h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">Troubleshooting Guide</h3>
                    <p className="text-sm md:text-base text-gray-600">Common issues and solutions for smooth AI implementation.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <CheckCircle className="w-5 h-6 md:w-6 md:h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">Success Metrics</h3>
                    <p className="text-sm md:text-base text-gray-600">Key performance indicators to track your AI automation success.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <p className="text-base md:text-lg text-gray-600 mb-3 md:mb-4">
              Ready to transform your fitness business with AI automation?
            </p>
            <p className="text-sm text-gray-500">
              Use the Stripe button above to complete your purchase and get instant access to your AI roadmap.
            </p>
          </div>
        </div>
      </div>
      <Analytics />
    </div>
  );
}
