import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Play, CheckCircle, Clock, Users, TrendingUp, Mail, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { addEmailToCollection } from "@/lib/firebase";

const WEBHOOK_URL = import.meta.env.VITE_FUNNEL_EMAIL_WEBHOOK_URL;

const Training = () => {
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
        // First, submit to webhook
        const response = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            funnel_type: "Training",
            source: "funnel",
            timestamp: new Date().toISOString(),
          }),
        });
        if (!response.ok) throw new Error("Failed to submit. Please try again.");
        
        // Then, store email in Firebase
        await addEmailToCollection(email, name, 'Training');
        
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/dist/lovable-uploads/2e025803-adcb-4eb0-8995-15991e0213a4.png" 
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
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mb-4 md:mb-6">
              <Play className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent px-2">
              FREE: The 3 AI Systems That Are Transforming Fitness Businesses Right Now
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 mb-6">
              In just 15 minutes, discover the exact AI automation systems that helped fitness business owners increase revenue by 40% in 90 days—while saving 15+ hours weekly.
            </p>
            <div className="inline-flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-full text-sm md:text-base mb-6">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
              <span className="text-red-800 font-semibold">Limited Time: Training Available for Next 24 Hours Only</span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Main Form Card */}
            <Card className="p-6 md:p-8 shadow-xl bg-white mb-6 md:mb-8">
              <div className="text-center mb-6 md:mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-3 md:mb-4">
                  <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-gray-800">
                  Get Instant Access to the Training
                </h2>
                <p className="text-sm md:text-lg text-gray-600 mb-4">
                  Enter your details below and we'll send the complete 15-minute training directly to your inbox within 2 minutes
                </p>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 font-medium">
                    🎯 <strong>What You'll Get:</strong> 3 proven AI systems + Implementation guide + Case studies
                  </p>
                </div>
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
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-semibold py-3 md:py-4 text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      Sending Training...
                    </>
                  ) : (
                    "Send Me The FREE Training Now →"
                  )}
                </Button>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                    {error}
                  </div>
                )}
              </form>

              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No spam, ever</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Instant delivery</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Training Benefits */}
            <Card className="p-4 md:p-6 bg-white shadow-lg">
              <h4 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-gray-800 text-center">What You'll Learn in This Training:</h4>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-start space-x-2 md:space-x-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base text-gray-700">The #1 AI system for automating member onboarding and reducing churn by 60%</span>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base text-gray-700">Smart scheduling automation that eliminates no-shows and optimizes capacity</span>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base text-gray-700">Content creation systems that automate social media marketing 24/7</span>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base text-gray-700">Real case studies from fitness businesses achieving 40% revenue growth</span>
                </div>
              </div>

              <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-200 text-center">
                <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
                  <div>
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-purple-600 mx-auto mb-1 md:mb-2" />
                    <span className="text-xs md:text-sm text-gray-700 font-medium">15 minutes</span>
                  </div>
                  <div>
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-600 mx-auto mb-1 md:mb-2" />
                    <span className="text-xs md:text-sm text-gray-700 font-medium">300+ trained</span>
                  </div>
                  <div>
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-purple-600 mx-auto mb-1 md:mb-2" />
                    <span className="text-xs md:text-sm text-gray-700 font-medium">40% avg growth</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Social Proof */}
          <div className="mt-12 md:mt-16">
            <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8 text-gray-800">
              What Fitness Business Owners Are Saying:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <Card className="p-4 md:p-6 bg-white shadow-lg">
                <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                    MR
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm md:text-base">Mike Rodriguez</div>
                    <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                  </div>
                </div>
                <p className="text-sm md:text-base text-gray-700 italic">
                  "This training opened my eyes to possibilities I never knew existed. 
                  We implemented just one system and saw a 25% increase in member retention within 30 days."
                </p>
              </Card>

              <Card className="p-4 md:p-6 bg-white shadow-lg">
                <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                    JL
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm md:text-base">Jessica Lee</div>
                    <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                  </div>
                </div>
                <p className="text-sm md:text-base text-gray-700 italic">
                  "I was skeptical about AI, but this training made it so clear and actionable. 
                  The scheduling automation alone saved me 10 hours per week."
                </p>
              </Card>

              <Card className="p-4 md:p-6 bg-white shadow-lg">
                <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                    DT
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm md:text-base">David Thompson</div>
                    <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                  </div>
                </div>
                <p className="text-sm md:text-base text-gray-700 italic">
                  "The revenue optimization strategies from this training helped us identify 
                  $15K in additional monthly revenue we were leaving on the table."
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Training;
