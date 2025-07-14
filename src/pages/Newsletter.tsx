import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CheckCircle, Mail, Calendar, Star, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { addEmailToCollection } from "@/lib/firebase";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      setIsLoading(true);
      setError("");
      
      try {
        // Store email and name in Firebase
        await addEmailToCollection(email, name, 'PDF');
        
        // Simulate additional processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsLoading(false);
        navigate("/congratulations");
      } catch (error) {
        console.error('Error submitting form:', error);
        setError("There was an error processing your request. Please try again.");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/2e025803-adcb-4eb0-8995-15991e0213a4.png" 
              alt="Sweep Logo" 
              className="h-20 w-auto"
            />
          </Link>
          <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4 md:mb-6">
              <Mail className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent px-2">
              Get Your FREE AI Automation Toolkit
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-4 md:mb-6 px-4">
              Join 5,000+ business owners who are scaling with AI automation and get your personalized roadmap to 40% more revenue.
            </p>
            <div className="inline-flex items-center space-x-2 bg-green-100 px-3 md:px-4 py-2 rounded-full text-sm md:text-base">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              <span className="text-green-800 font-semibold">Includes FREE 45-min strategy call</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Form */}
            <Card className="p-6 md:p-8 shadow-xl bg-white order-2 lg:order-1">
              <div className="mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-800">
                  Get Instant Access 
                </h2>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                  Enter your details below to gain access to our weekly curation of AI implementation strategies, tips, tricks, and tools to automate your business operations.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your first name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12 text-base md:text-lg touch-manipulation"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 text-base md:text-lg touch-manipulation"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-semibold py-3 md:py-4 text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Get My Free Weekly AI Toolkit<ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                    </>
                  )}
                </Button>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                    {error}
                  </div>
                )}
              </form>

              <div className="mt-4 md:mt-6 space-y-2 md:space-y-3">
                <div className="flex items-start space-x-2 md:space-x-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-gray-600">Instant access to your personalized roadmap</span>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-gray-600">Access to premium Sweep services</span>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-gray-600">No spam, unsubscribe anytime</span>
                </div>
              </div>
            </Card>

            {/* Value Proposition */}
            <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                What You'll Get Immediately:
              </h3>

              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-semibold mb-1 md:mb-2 text-gray-800">FREE 30-Day Implementation Roadmap (Typically $500)</h4>
                    <p className="text-sm md:text-base text-gray-600">
                      Step-by-step guide showing exactly how to automate your fitness business operations and increase revenue by 40%.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-semibold mb-1 md:mb-2 text-gray-800">Premium Sweep Services</h4>
                    <p className="text-sm md:text-base text-gray-600">
                      Personal consultation with our AI experts to create a custom automation plan for your specific business needs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-semibold mb-1 md:mb-2 text-gray-800">Weekly Updates</h4>
                    <p className="text-sm md:text-base text-gray-600">
                      Discover new tools and techniques every week to help your business adopt AI and scale on auto-pilot.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 md:p-6 rounded-xl border-l-4 border-blue-500">
                <h4 className="font-bold text-base md:text-lg mb-2 text-gray-800">Limited Time Offer</h4>
                <p className="text-sm md:text-base text-gray-700">
                  Everything is yours free but only through signing up to our weekly Newsletter!
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-12 md:mt-16 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-8">
              Join Successful Fitness Business Owners Getting Results
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="text-center p-4">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">5,000+</div>
                <div className="text-sm md:text-base text-gray-600">Systems Automated</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1 md:mb-2">40%</div>
                <div className="text-sm md:text-base text-gray-600">Average Revenue Increase</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1 md:mb-2">15hrs</div>
                <div className="text-sm md:text-base text-gray-600">Weekly Time Savings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
