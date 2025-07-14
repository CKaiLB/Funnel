import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { addEmailToCollection } from "@/lib/firebase";
import { CheckCircle, Zap, TrendingUp, Users, Clock, Target, Mail, Brain, Rocket, Shield, DollarSign, ArrowRight, Star, Play } from "lucide-react";

const WEBHOOK_URL = import.meta.env.VITE_FUNNEL_EMAIL_WEBHOOK_URL;

export default function Roadmap() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      businessContext: "",
    },
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
          funnel_type: "Roadmap",
          source: "funnel",
          timestamp: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Failed to submit. Please try again.");
      
      // Then, store email in Firebase
      await addEmailToCollection(values.email, values.name, "Roadmap");
      
      setIsLoading(false);
      navigate("/congratulations");
    } catch (err) {
      setError(err.message || "There was an error. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/lovable-uploads/2e025803-adcb-4eb0-8995-15991e0213a4.png" alt="Sweep Logo" className="h-20 w-auto" />
          </Link>
          <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 md:mb-6">
              <Brain className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight px-2">
              Get Your Personalized AI Implementation Roadmap
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 mb-8">
              Already watched the training? Get a custom roadmap tailored specifically to your fitness business. Our AI experts custom designed a step-by-step implementation plan—delivered to your inbox.
            </p>
            <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full text-sm md:text-base mb-6">
              <Target className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              <span className="text-blue-800 font-semibold">Personalized for Your Business • Instant Delivery</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Form Section */}
            <div className="order-2 lg:order-1">
              <Card className="p-6 md:p-8 shadow-xl bg-white lg:sticky lg:top-8">
                <div className="text-center mb-6 md:mb-8">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 text-gray-800">
                    Get Your Custom AI Roadmap
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                    Tell us about your business and receive a personalized automation strategy delivered to your inbox.
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200 mb-4">
                    <p className="text-sm text-blue-800 font-medium">
                      🎯 <strong>What You'll Get:</strong> Custom implementation plan + Tool recommendations + Timeline + ROI projections
                    </p>
                  </div>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField name="name" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base">First Name *</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter your first name" required {...field} className="h-12 text-base md:text-lg touch-manipulation" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField name="email" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base">Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email address" required {...field} className="h-12 text-base md:text-lg touch-manipulation" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField name="businessContext" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base">Tell us about your business *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What type of fitness business do you run? Current challenges? What would you like to automate? (This helps us personalize your roadmap)" 
                            required 
                            {...field} 
                            className="min-h-[100px] text-base md:text-lg touch-manipulation" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <Button type="submit" size="lg" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-semibold py-3 md:py-4 text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation">
                      {isLoading ? (<><LoadingSpinner size="sm" color="white" /> Creating Your Roadmap...</>) : "Get My Personalized Roadmap →"}
                    </Button>
                    
                    {error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}
                  </form>
                </Form>

                <div className="mt-6 space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-xs md:text-sm text-gray-600">Delivered within 24 hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-xs md:text-sm text-gray-600">Personalized for your business</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-xs md:text-sm text-gray-600">Includes implementation timeline</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Content Section */}
            <div className="space-y-6 md:space-y-8 lg:space-y-12 order-1 lg:order-2">
              {/* Why Get a Custom Roadmap Section */}
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-800">
                  Why You Need a Personalized AI Roadmap
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Tailored to Your Business</h3>
                      <p className="text-gray-600 text-xs md:text-sm">Generic advice doesn't work. Get a roadmap specifically designed for your fitness business type, size, and goals.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Save Months of Trial & Error</h3>
                      <p className="text-gray-600 text-xs md:text-sm">Skip the learning curve. Our experts have already tested these systems with hundreds of fitness businesses.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Maximize Your ROI</h3>
                      <p className="text-gray-600 text-xs md:text-sm">Get specific recommendations for tools and strategies that will deliver the highest return for your investment.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What You'll Get Section */}
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-800">
                  What's Included in Your Custom Roadmap
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <Card className="p-3 md:p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                      <Rocket className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0" />
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base">Implementation Strategy</h3>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600">Step-by-step plan tailored to your business type and current systems.</p>
                  </Card>
                  <Card className="p-3 md:p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                      <Target className="w-5 h-5 md:w-6 md:h-6 text-green-600 flex-shrink-0" />
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base">Tool Recommendations</h3>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600">Curated list of AI tools that work best for your specific needs and budget.</p>
                  </Card>
                  <Card className="p-3 md:p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                      <Zap className="w-5 h-5 md:w-6 md:h-6 text-purple-600 flex-shrink-0" />
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base">Timeline & Milestones</h3>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600">Realistic timeline with specific milestones and expected results.</p>
                  </Card>
                  <Card className="p-3 md:p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <div className="flex items-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                      <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-orange-600 flex-shrink-0" />
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base">ROI Projections</h3>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600">Expected revenue increase and time savings based on similar businesses.</p>
                  </Card>
                </div>
              </div>

              {/* Sweep Services Section */}
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-800">
                  How Sweep Makes Implementation Effortless
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Done-For-You Setup</h3>
                      <p className="text-gray-600 text-xs md:text-sm">Our experts handle the technical implementation so you don't need to learn complex systems.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Dedicated Success Manager</h3>
                      <p className="text-gray-600 text-xs md:text-sm">Personal support throughout your automation journey with regular check-ins and optimizations.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">Continuous Optimization</h3>
                      <p className="text-gray-600 text-xs md:text-sm">We monitor and improve your automations to ensure maximum efficiency and results.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 md:p-6 rounded-xl">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4 text-center">
                  Trusted by 5,000+ Business Owners
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-center">
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1">40%</div>
                    <div className="text-xs md:text-sm text-gray-600">Average Revenue Increase</div>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-green-600 mb-1">15hrs</div>
                    <div className="text-xs md:text-sm text-gray-600">Weekly Time Saved</div>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1">60%</div>
                    <div className="text-xs md:text-sm text-gray-600">Reduced Customer Churn</div>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <Card className="p-4 md:p-6 bg-white shadow-lg">
                <div className="flex items-center space-x-3 mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                    BB
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm md:text-base">Brandon Bergeron</div>
                    <div className="text-gray-600 text-xs md:text-sm">Owner, St Paul Brazilian Jiu Jitsu</div>
                  </div>
                </div>
                <blockquote className="text-gray-700 italic mb-3 md:mb-4 text-sm md:text-base">
                  "The personalized roadmap was a game-changer. It was super easy & I know very little about setting up technology. If I could get sweep integrated into my site using their services, then anyone else could too."
                </blockquote>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 