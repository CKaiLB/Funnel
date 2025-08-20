import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { addEmailToCollection } from "@/lib/firebase";
import { CheckCircle, Brain, Zap, TrendingUp, Clock, Target, Star, Lock } from "lucide-react";

const WEBHOOK_URL = import.meta.env.VITE_FUNNEL_EMAIL_WEBHOOK_URL;

export default function CompleteSystem() {
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
          funnel_type: "Complete_System",
          source: "funnel",
          timestamp: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Failed to submit. Please try again.");
      
      // Then, store email in Firebase
      await addEmailToCollection(values.email, values.name, values.phone, "Complete_System");
      
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
              <CheckCircle className="w-8 h-10 md:w-12 md:h-14 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-8 bg-gradient-to-r from-green-600 via-blue-600 to-green-800 bg-clip-text text-transparent leading-tight px-2">
              Payment Complete! 🎉
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto px-2 md:px-4 mb-6 md:mb-8 leading-relaxed">
              Thank you for your purchase! Now let's get you set up with your complete AI implementation system.
            </p>
          </div>

          {/* Success Message */}
          <Card className="p-6 md:p-8 lg:p-12 shadow-2xl bg-white border-2 border-green-200 mb-12 md:mb-16">
            <div className="text-center mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <CheckCircle className="w-6 h-8 md:w-8 md:h-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
                Your AI Roadmap is Ready!
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-4 md:mb-6">
                We've received your payment and are preparing your complete AI implementation system. 
                Just one more step to get everything delivered to your inbox.
              </p>
            </div>

            {/* What You'll Get */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 md:p-6 lg:p-8 mb-6 md:mb-8 border-2 border-green-200">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 md:mb-6 text-center">
                What You're About to Receive:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <CheckCircle className="w-5 h-6 md:w-6 md:h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-base md:text-lg font-bold text-gray-800 mb-1 md:mb-2">AI Roadmap PDF</h4>
                    <p className="text-sm md:text-base text-gray-600">Complete implementation guide with step-by-step instructions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <CheckCircle className="w-5 h-6 md:w-6 md:h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-base md:text-lg font-bold text-gray-800 mb-1 md:mb-2">Implementation Checklists</h4>
                    <p className="text-sm md:text-base text-gray-600">Ready-to-use checklists for each phase</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <CheckCircle className="w-5 h-6 md:w-6 md:h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-base md:text-lg font-bold text-gray-800 mb-1 md:mb-2">ROI Calculator</h4>
                    <p className="text-sm md:text-base text-gray-600">Project your expected returns and time savings</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <CheckCircle className="w-5 h-6 md:w-6 md:h-8 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-base md:text-lg font-bold text-gray-800 mb-1 md:mb-2">Priority Support</h4>
                    <p className="text-sm md:text-base text-gray-600">Direct access to our implementation team</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Form */}
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
                        <span>Setting up your system...</span>
                      </div>
                    ) : (
                      "Get My AI Roadmap Now"
                    )}
                  </button>
                </div>
              </form>
            </Form>

            <div className="text-center text-sm md:text-base text-gray-500 mt-4 md:mt-6">
              Your AI roadmap will be delivered instantly after form submission
            </div>
          </Card>

          {/* Final CTA */}
          <div className="text-center">
            <p className="text-base md:text-lg text-gray-600 mb-3 md:mb-4">
              Ready to transform your fitness business with AI automation?
            </p>
            <p className="text-sm md:text-base text-gray-500">
              Complete the form above to receive your complete AI implementation system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
