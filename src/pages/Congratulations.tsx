import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Download, Star, ArrowRight } from "lucide-react";

export default function Congratulations() {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <header className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 md:space-x-3">
            <img src="/lovable-uploads/2e025803-adcb-4eb0-8995-15991e0213a4.png" alt="Sweep Logo" className="h-12 w-auto md:h-20" />
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-6 md:mb-8 shadow-lg">
            <CheckCircle className="w-10 h-12 md:w-16 md:h-20 text-white" />
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-green-800 bg-clip-text text-transparent leading-tight">
            Congratulations! 🎉
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
            Your playbook is on its way! Check your email for instant access to your complete sales funnel system.
          </p>

          {/* What's Next Section */}
          <div className="bg-white rounded-2xl p-6 md:p-8 lg:p-12 shadow-2xl border-2 border-green-200 mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 md:mb-6">
              What Happens Next?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-10 md:w-10 md:h-12 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">1. Check Your Email</h3>
                <p className="text-sm md:text-base text-gray-600">Your playbook download link has been sent to your inbox</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-10 md:w-10 md:h-12 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">2. Download & Study</h3>
                <p className="text-sm md:text-base text-gray-600">Review the complete system and implementation guide</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-8 h-10 md:w-10 md:h-12 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">3. Start Implementing</h3>
                <p className="text-sm md:text-base text-gray-600">Follow the step-by-step process to build your funnel</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 md:p-6 border-2 border-green-200">
              <p className="text-base md:text-lg text-gray-700 font-medium">
                💡 <strong>Pro Tip:</strong> Start implementing within the next 24 hours for maximum momentum and results!
              </p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-200 mb-8 md:mb-12">
            <div className="flex items-center justify-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-6 md:w-6 md:h-8 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-base md:text-lg lg:text-xl text-gray-700 italic mb-4 leading-relaxed">
              "I implemented this funnel system in one weekend and booked 3 new clients the following week. The step-by-step approach made it so easy!"
            </blockquote>
            <p className="text-sm md:text-base font-semibold text-gray-800">- Sarah Johnson, Personal Trainer</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 md:space-y-6">
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 md:py-5 px-8 md:px-12 text-lg md:text-xl rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Back to Home
            </Link>
            
            <div className="text-sm md:text-base text-gray-500">
              Need help? Contact us at support@sweep.ai
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
