import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { UnlockAnimation } from "@/components/ui/unlock-animation";
import { Confetti } from "@/components/ui/confetti";
import { CheckCircle, Calendar, Gift, Star, ArrowRight, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Congratulations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setShowConfetti(true);
  };

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  const handleBookConsultation = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Replace current tab with Calendly link
    window.location.href = "https://sweepai.site/interest-form";
    
    setIsLoading(false);
  };

  // Show unlock animation first
  if (showAnimation) {
    return <UnlockAnimation onAnimationComplete={handleAnimationComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Confetti Animation */}
      {showConfetti && (
        <Confetti onComplete={handleConfettiComplete} />
      )}

      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/2e025803-adcb-4eb0-8995-15991e0213a4.png" 
              alt="Sweep Logo" 
              className="h-20 w-auto"
            />
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4 md:mb-6">
              <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent px-2">
              🎉 You've Unlocked A Free AI Consultation!
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Congratulations! You now have exclusive access to a limited time FREE 45-minute strategy call with our AI automation experts.
            </p>
          </div>

          {/* Main CTA - Free Consultation */}
          <Card className="p-6 md:p-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl mb-8 md:mb-12">
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full mb-4 md:mb-6">
                <Calendar className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
                Your FREE $500 Call Awaits
              </h2>
              <p className="text-blue-100 mb-4 md:mb-6 text-base md:text-lg max-w-2xl mx-auto">
                This isn't just any call. You'll get a personalized AI automation strategy 
                specifically designed for your fitness business, normally valued at $500.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">What You'll Get in 45 Minutes:</h3>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base">Custom implementation strategy for your business</span>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base">Revenue opportunity analysis (find hidden $$$)</span>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base">Time-saving automation priorities</span>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base">Integration plan for new and existing software</span>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Why This Matters:</h3>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base">Average clients save 15+ hours per week</span>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base">Typical revenue increase: 40%</span>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base">Reduce member churn by up to 60%</span>
                </div>
                <div className="flex items-start space-x-2 md:space-x-3">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base">Automate 70% of administrative tasks</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleBookConsultation}
              size="lg" 
              disabled={isLoading}
              className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 md:py-6 text-lg md:text-xl mb-3 md:mb-4 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="md" color="primary" />
                  Booking Your Consultation...
                </>
              ) : (
                <>
                  Book My FREE $500 Consultation Now <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-blue-100 text-base md:text-lg font-medium">
                ⚡ Only 3 spots available per week - Secure yours now!
              </p>
              <p className="text-blue-200 text-sm md:text-base mt-2">
                No fluff. Just pure value and actionable strategies.
              </p>
            </div>
          </Card>


          {/* Stats */}
          <div className="text-center mb-8 md:mb-12">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-8">
              Join 5,000+ Successful Fitness Business Owners
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="text-center p-4">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">40%</div>
                <div className="text-sm md:text-base text-gray-600">Average Revenue Increase</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1 md:mb-2">15hrs</div>
                <div className="text-sm md:text-base text-gray-600">Weekly Time Savings</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1 md:mb-2">$1,000</div>
                <div className="text-sm md:text-base text-gray-600">Value of Your FREE Call</div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 p-6 md:p-8 rounded-xl">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
              Don't Let This Opportunity Slip Away
            </h3>
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 max-w-2xl mx-auto">
              This consultation could be the turning point for your fitness business. 
              In just 45 minutes, you'll have a clear roadmap to scale with AI automation.
            </p>
            <Button 
              onClick={handleBookConsultation}
              size="lg" 
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-semibold px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Schedule My FREE Consultation
                </>
              )}
            </Button>
            <p className="text-gray-500 text-xs md:text-sm mt-3">
              Normally $500 • Yours FREE today • Limited spots available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Congratulations;
