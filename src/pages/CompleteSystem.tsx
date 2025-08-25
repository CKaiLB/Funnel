import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Star, TrendingUp, DollarSign, UserCheck, Clock, BookOpen, Calculator, ArrowRight, Shield, Award, Zap } from "lucide-react";
import { addEmailToCollection } from "@/lib/firebase";
import { sendWelcomeEmail } from "@/lib/email";
import { useToast } from "@/hooks/use-toast";
import { Analytics } from "@vercel/analytics/react";

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
}

export default function CompleteSystem() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await addEmailToCollection(data.email, data.name, data.phone, "Complete_System");
      await sendWelcomeEmail(data.email, data.name, data.phone, "Complete_System");
      
      toast({
        title: "Success!",
        description: "Your complete system access is on its way. Check your email!",
      });
      
      reset();
      navigate("/congratulations");
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
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-6 shadow-2xl shadow-green-500/80 ring-4 ring-green-400/60 ring-offset-4 ring-offset-black">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-400 to-green-400 bg-clip-text text-transparent leading-tight drop-shadow-[0_0_20px_rgba(74,222,128,0.8)]">
            🎉 Payment Successful!
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Thank you for your purchase! You now have access to the complete AI implementation roadmap for fitness businesses.
          </p>
          
          {/* Success Card */}
          <div className="mb-8">
            <Card className="p-6 shadow-2xl bg-gray-900/80 border-2 border-green-400/80 backdrop-blur-sm max-w-md mx-auto ring-4 ring-green-400/50 ring-offset-4 ring-offset-black shadow-green-500/50 shadow-blue-500/30">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <img 
                    src="/lovable-uploads/AIRoadmap.png" 
                    alt="AI Implementation Roadmap" 
                    className="w-32 h-32 object-contain rounded-lg ring-4 ring-green-400/60 shadow-lg shadow-green-500/50"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI Implementation Roadmap</h3>
                <p className="text-sm text-gray-300 mb-4">Complete guide to automate your entire sales process with AI</p>
                
                {/* Access Status */}
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <span className="text-lg font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]">✓ ACCESS GRANTED</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Access Granted Card */}
        <div className="mb-12">
          <Card className="p-6 md:p-8 shadow-2xl bg-gray-900/80 border-2 border-purple-500/30 backdrop-blur-sm ring-4 ring-purple-400/20 ring-offset-4 ring-offset-black shadow-purple-500/20">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
                Get Instant Access
              </h2>
              <p className="text-lg text-gray-300">
                Fill out your information and we'll send the playbook directly to your inbox.
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className="mt-1 bg-gray-800/50 border-2 border-purple-500/30 text-white ring-4 ring-purple-400/20 ring-offset-2 ring-offset-black"
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className="mt-1 bg-gray-800/50 border-2 border-purple-500/30 text-white ring-4 ring-purple-400/20 ring-offset-2 ring-offset-black"
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-white">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    className="mt-1 bg-gray-800/50 border-2 border-purple-500/30 text-white ring-4 ring-purple-400/20 ring-offset-2 ring-offset-black"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 text-xl rounded-xl shadow-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-purple-400/80 ring-4 ring-purple-400/50 ring-offset-4 ring-offset-black shadow-purple-500/60 shadow-blue-500/40"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
              
              <p className="text-sm text-gray-400 text-center">
                You'll receive access to all three resources within the next few minutes
              </p>
            </form>
          </Card>
        </div>


        {/* What You Now Have Access To */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            What You Now Have Access To
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gray-900/80 border-2 border-purple-400/60 backdrop-blur-sm ring-4 ring-purple-400/40 ring-offset-4 ring-offset-black shadow-2xl shadow-purple-500/40 shadow-blue-500/20 hover:shadow-purple-500/60 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-purple-400/60 shadow-lg shadow-purple-500/50">
                  <BookOpen className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Sales Funnel Playbook</h3>
                <p className="text-sm text-gray-300">Complete system to automate your client booking process</p>
              </div>
            </Card>
            
            <Card className="p-6 bg-gray-900/80 border-2 border-purple-400/60 backdrop-blur-sm ring-4 ring-purple-400/40 ring-offset-4 ring-offset-black shadow-2xl shadow-purple-500/40 shadow-blue-500/20 hover:shadow-purple-500/60 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-blue-400/60 shadow-lg shadow-blue-500/50">
                  <Calculator className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">AI ROI Calculator</h3>
                <p className="text-sm text-gray-300">Predict your revenue growth and calculate exact ROI</p>
              </div>
            </Card>
            
            <Card className="p-6 bg-gray-900/80 border-2 border-purple-400/60 backdrop-blur-sm ring-4 ring-purple-400/40 ring-offset-4 ring-offset-black shadow-2xl shadow-purple-500/40 shadow-blue-500/20 hover:shadow-purple-500/60 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-green-400/60 shadow-lg shadow-green-500/50">
                  <Zap className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Implementation Roadmap</h3>
                <p className="text-sm text-gray-300">Step-by-step guide to automate your sales process</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            Your Next Steps to Success
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg border-2 border-purple-400/60 ring-4 ring-purple-400/40 ring-offset-4 ring-offset-black shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Check Your Email</h3>
                <p className="text-gray-300">You'll receive access to all three resources within the next few minutes</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg border-2 border-purple-400/60 ring-4 ring-purple-400/40 ring-offset-4 ring-offset-black shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Start with the Playbook</h3>
                <p className="text-gray-300">Begin implementing your sales funnel system using the step-by-step guide</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg border-2 border-purple-400/60 ring-4 ring-purple-400/40 ring-offset-4 ring-offset-black shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Follow the AI Roadmap</h3>
                <p className="text-gray-300">Use the AI implementation guide to automate your entire sales process</p>
              </div>
            </div>
          </div>
        </div>

      
        {/* Final CTA Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            Ready to Transform Your Fitness Business?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            You now have everything you need to automate your sales process and scale your business to new heights.
          </p>
          <Button 
            onClick={() => document.getElementById('name')?.focus()}
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 md:py-5 px-8 md:px-12 text-xl md:text-2xl rounded-xl shadow-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-purple-400/80 ring-4 ring-purple-400/50 ring-offset-4 ring-offset-black shadow-purple-500/60 shadow-blue-500/40"
          >
            Get Started Today
          </Button>
        </div>
      </div>
      <Analytics />
    </div>
  );
}
