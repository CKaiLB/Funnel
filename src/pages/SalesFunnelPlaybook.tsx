import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { addEmailToCollection } from "@/lib/firebase";
import { CheckCircle, BookOpen, Star, TrendingUp, Clock, DollarSign, UserCheck, ArrowRight } from "lucide-react";

const WEBHOOK_URL = import.meta.env.VITE_FUNNEL_EMAIL_WEBHOOK_URL;

export default function SalesFunnelPlaybook() {
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
          funnel_type: "Fitness_Funnel_Playbook",
          source: "funnel",
          timestamp: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Failed to submit. Please try again.");
      
      // Then, store email in Firebase
      await addEmailToCollection(values.email, values.name, values.phone, "Fitness_Funnel_Playbook");
      
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
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-4 md:mb-8 shadow-lg">
              <BookOpen className="w-8 h-10 md:w-12 md:h-14 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-8 bg-gradient-to-r from-green-600 via-blue-600 to-green-800 bg-clip-text text-transparent leading-tight px-2">
              Get Your FREE Fitness Sales Funnel Playbook
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto px-2 md:px-4 mb-6 md:mb-8 leading-relaxed">
              Transform your fitness business with our proven sales funnel system that books clients on autopilot.
            </p>
          </div>

          {/* High-Value Conversion Section */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-center text-gray-800">
              Why This Playbook Will Transform Your Business
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <CheckCircle className="w-5 h-6 md:w-6 md:h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">Proven Results</h3>
                    <p className="text-sm md:text-base text-gray-600">Tested by hundreds of fitness coaches who've increased their client base 3-5x.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <CheckCircle className="w-5 h-6 md:w-6 md:h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">Time Savings</h3>
                    <p className="text-sm md:text-base text-gray-600">Save 15-20 hours weekly on client communication and follow-ups.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <CheckCircle className="w-5 h-6 md:w-6 md:h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">Revenue Growth</h3>
                    <p className="text-sm md:text-base text-gray-600">Increase your monthly revenue by 40-60% with systematic client acquisition.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <CheckCircle className="w-5 h-6 md:w-6 md:h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">No Tech Skills Needed</h3>
                    <p className="text-sm md:text-base text-gray-600">Step-by-step instructions anyone can follow, regardless of technical experience.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <CheckCircle className="w-5 h-6 md:w-6 md:h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">Copy-Paste Templates</h3>
                    <p className="text-sm md:text-base text-gray-600">Ready-to-use messaging templates that convert prospects into paying clients.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <CheckCircle className="w-5 h-6 md:w-6 md:h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">Instant Access</h3>
                    <p className="text-sm md:text-base text-gray-600">Download immediately and start implementing your funnel today.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Capture Form */}
          <Card className="p-6 md:p-8 lg:p-12 shadow-2xl bg-white border-2 border-green-200 mb-12 md:mb-16">
            <div className="text-center mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <BookOpen className="w-6 h-8 md:w-8 md:h-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
                Get Your Free Playbook Now
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-4 md:mb-6">
                Enter your details below and get instant access to the complete sales funnel system.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base md:text-lg font-semibold">Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your full name" 
                            className="h-12 md:h-14 text-base md:text-lg"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{ 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base md:text-lg font-semibold">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Enter your email address" 
                            className="h-12 md:h-14 text-base md:text-lg"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    rules={{ required: "Phone number is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base md:text-lg font-semibold">Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel" 
                            placeholder="Enter your phone number" 
                            className="h-12 md:h-14 text-base md:text-lg"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 md:py-5 px-8 md:px-12 text-lg md:text-xl rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner className="w-5 h-5" />
                        <span>Getting your playbook...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Get My Free Playbook</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </Form>

            <div className="text-center text-sm md:text-base text-gray-500 mt-4 md:mt-6">
              Your playbook will be delivered instantly • No credit card required
            </div>
          </Card>

          {/* Additional Testimonials */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-center text-gray-800">
              What Coaches Are Saying
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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
                    <blockquote className="text-sm md:text-base text-gray-700 italic mb-3 md:mb-4">
                      "This funnel system is pure gold. I went from struggling to book calls to having a waiting list. The automation handles everything."
                    </blockquote>
                    <p className="text-sm md:text-base font-semibold text-gray-800">- David Park, Personal Trainer</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 md:p-8 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-8 md:w-8 md:h-10 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-sm md:text-base text-gray-700 italic mb-3 md:mb-4">
                      "My revenue doubled in 3 months using this system. The templates and scripts are worth 10x the price."
                    </blockquote>
                    <p className="text-sm md:text-base font-semibold text-gray-800">- Lisa Chen, Online Coach</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <p className="text-lg md:text-xl text-gray-600 mb-3 md:mb-4">
              Ready to start booking more clients on autopilot?
            </p>
            <p className="text-sm md:text-base text-gray-500">
              Complete the form above to get your free sales funnel playbook and start transforming your business today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
