import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Star, TrendingUp, DollarSign, UserCheck, Clock, BookOpen, Calculator, ArrowRight } from "lucide-react";
import { addEmailToCollection } from "@/lib/firebase";
import { sendWelcomeEmail } from "@/lib/email";
import { useToast } from "@/hooks/use-toast";
import { Analytics } from "@vercel/analytics/react";
import React from "react";

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

export default function SalesFunnelPlaybook() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to top when page loads
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Meta Pixel tracking
  React.useEffect(() => {
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
      await addEmailToCollection(data.email, data.name, data.phone, "Fitness_Funnel_Playbook");
      await sendWelcomeEmail(data.email, data.name, data.phone, "Fitness_Funnel_Playbook");
      
      toast({
        title: "Success!",
        description: "Your playbook is on its way. Check your email!",
      });
      
      reset();
      window.location.href = "https://www.sweepai.site";
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-6 shadow-2xl shadow-purple-500/80 ring-4 ring-purple-400/60 ring-offset-4 ring-offset-black">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">
            Get Your Free Sales Funnel Playbook
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Complete system to automate your client booking process + AI ROI Calculator to predict your revenue growth.
          </p>
        </div>

        {/* Opt-In Form Section */}
        <div className="mb-12">
          <Card className="p-6 md:p-8 shadow-2xl bg-gray-900/80 border-2 border-purple-500/30 backdrop-blur-sm ring-4 ring-purple-400/20 ring-offset-4 ring-offset-black shadow-purple-500/20">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
                Get {" "}
                <span className="text-4xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]">FREE</span>
                {" "}Instant Access
              </h2>
              <p className="text-lg text-gray-300">
                Enter your details below to receive your free playbook and AI ROI calculator instantly.
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
                {isSubmitting ? "Sending..." : "Send Me the Playbook"}
              </Button>
              
              <p className="text-sm text-gray-400 text-center">
                We respect your inbox. Unsubscribe anytime.
              </p>
            </form>
          </Card>
        </div>

        {/* Testimonials Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            What Other Coaches Are Saying
          </h2>
          <div className="space-y-6">
            <Card className="p-6 md:p-8 shadow-2xl bg-gray-900/80 border-2 border-purple-500/30 backdrop-blur-sm ring-4 ring-purple-400/20 ring-offset-4 ring-offset-black shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center ring-4 ring-purple-400/60 shadow-lg shadow-purple-500/50">
                    <Star className="w-6 h-8 md:w-8 md:h-10 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                    ))}
                  </div>
                  <blockquote className="text-base md:text-lg text-gray-300 italic mb-4">
                    "I was spending 20+ hours weekly on client communication. Now it's all automated and I'm booking more clients than ever. This system pays for itself."
                  </blockquote>
                  <p className="text-sm md:text-base font-semibold text-white">- Alex, Fitness Coach</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 md:p-8 shadow-2xl bg-gray-900/80 border-2 border-purple-500/30 backdrop-blur-sm ring-4 ring-purple-400/20 ring-offset-4 ring-offset-black shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center ring-4 ring-green-400/60 shadow-lg shadow-green-500/50">
                    <CheckCircle className="w-6 h-8 md:w-8 md:h-10 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                    ))}
                  </div>
                  <blockquote className="text-base md:text-lg text-gray-300 italic mb-4">
                    "The templates and scripts are gold. I've doubled my conversion rate and cut my work time in half. Wish I had this years ago."
                  </blockquote>
                  <p className="text-sm md:text-base font-semibold text-white">- Maria, Online Trainer</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* High-Value Results Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            High-Value Results You Can Expect
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center group hover:scale-105 transition-transform duration-500">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-purple-400/60 shadow-lg shadow-purple-500/50">
                <TrendingUp className="w-8 h-10 md:w-10 md:h-12 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-purple-400 mb-2">3-5x</h3>
              <p className="text-base md:text-lg font-semibold text-white mb-2">More Clients</p>
              <p className="text-sm md:text-base text-gray-300">Book more clients consistently with automated follow-ups</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-500">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-blue-400/60 shadow-lg shadow-blue-500/50">
                <Clock className="w-8 h-10 md:w-10 md:h-12 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-blue-400 mb-2">15-20hrs</h3>
              <p className="text-base md:text-lg font-semibold text-white mb-2">Time Saved</p>
              <p className="text-sm md:text-base text-gray-300">Weekly time savings on client communication</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-500">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-green-400/60 shadow-lg shadow-green-500/50">
                <DollarSign className="w-8 h-10 md:w-10 md:h-12 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-green-400 mb-2">40-60%</h3>
              <p className="text-base md:text-lg font-semibold text-white mb-2">Revenue Increase</p>
              <p className="text-sm md:text-base text-gray-300">Higher conversion rates and client retention</p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-500">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-orange-400/60 shadow-lg shadow-orange-500/50">
                <UserCheck className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-orange-400 mb-2">80%</h3>
              <p className="text-base md:text-lg font-semibold text-white mb-2">Client Retention</p>
              <p className="text-sm md:text-base text-gray-300">Better client relationships and long-term success</p>
            </div>
          </div>
        </div>

        {/* Case Studies Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            Real Client Wins & Case Studies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 md:p-8 shadow-2xl bg-gray-900/80 border-2 border-purple-500/30 backdrop-blur-sm ring-4 ring-purple-400/20 ring-offset-4 ring-offset-black shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-purple-400/60 shadow-lg shadow-purple-500/50">
                  <TrendingUp className="w-8 h-10 md:w-10 md:h-12 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">Sarah</h3>
                <p className="text-sm md:text-base text-gray-300 mb-3">Personal Trainer</p>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  "Went from 3 clients to 18 clients in 3 months. The funnel handles all my follow-ups automatically."
                </p>
              </div>
            </Card>
            
            <Card className="p-6 md:p-8 shadow-2xl bg-gray-900/80 border-2 border-purple-500/30 backdrop-blur-sm ring-4 ring-purple-400/20 ring-offset-4 ring-offset-black shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-green-400/60 shadow-lg shadow-green-500/50">
                  <DollarSign className="w-8 h-10 md:w-10 md:h-12 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">Mike</h3>
                <p className="text-sm md:text-base text-gray-300 mb-3">Online Coach</p>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  "Revenue increased from $2k to $8k/month. The system books calls while I sleep."
                </p>
              </div>
            </Card>
            
            <Card className="p-6 md:p-8 shadow-2xl bg-gray-900/80 border-2 border-purple-500/30 backdrop-blur-sm ring-4 ring-purple-400/20 ring-offset-4 ring-offset-black shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-purple-400/60 shadow-lg shadow-purple-500/50">
                  <UserCheck className="w-8 h-10 md:w-10 md:h-12 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">Jennifer</h3>
                <p className="text-sm md:text-base text-gray-300 mb-3">Yoga Instructor</p>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  "Client retention went from 60% to 85%. The automated nurturing keeps them engaged."
                </p>
              </div>
            </Card>
          </div>
        </div>



        {/* Final CTA Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
            Start Booking More Clients Today
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Get your free playbook and AI ROI calculator to start building your automated client booking system in the next 24 hours.
          </p>
          <Button 
            onClick={() => document.getElementById('name')?.focus()}
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 md:py-5 px-8 md:px-12 text-xl md:text-2xl rounded-xl shadow-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-purple-400/80 ring-4 ring-purple-400/50 ring-offset-4 ring-offset-black shadow-purple-500/60 shadow-blue-500/40"
          >
            Get the Free Playbook
          </Button>
        </div>
      </div>
      <Analytics />
    </div>
  );
}
