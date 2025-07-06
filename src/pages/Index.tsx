import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Zap, TrendingUp, Users, Clock, Target, Mail, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 sticky top-0 bg-white/80 backdrop-blur-sm z-40 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/dist/lovable-uploads/Sweep_LOGO.png" 
              alt="Sweep Logo" 
              className="h-12 md:h-20 w-auto"
            />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <a href="#newsletter" className="text-gray-600 hover:text-blue-600 transition-colors">Newsletter</a>
            <a href="#results" className="text-gray-600 hover:text-blue-600 transition-colors">Results</a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3 pt-4">
              <a 
                href="#newsletter" 
                className="text-gray-600 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Newsletter
              </a>
              <a 
                href="#results" 
                className="text-gray-600 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Results
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4 md:mb-6">
            <Mail className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight px-2">
            Get Your FREE Weekly AI Toolkit
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 md:mb-8 leading-relaxed px-4">
            Join 5,000+ fitness business owners receiving cutting-edge AI automation strategies, 
            tools, and case studies that generate 40% more revenue every month.
          </p>
          
          {/* Primary CTA */}
          <div className="max-w-sm md:max-w-md mx-auto mb-8 md:mb-12 px-4">
            <Card className="p-6 md:p-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-300 shadow-xl">
              <Zap className="w-10 h-10 md:w-12 md:h-12 mb-4 mx-auto" />
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Weekly AI Toolkit Newsletter</h3>
              <p className="mb-4 md:mb-6 text-blue-100 text-sm md:text-base">
                Get proven AI automation tools, implementation strategies, and updates
              </p>
              <Link to="/newsletter">
                <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold text-base md:text-lg py-3 md:py-4 touch-manipulation">
                  Get My Free AI Toolkit →
                </Button>
              </Link>
            </Card>
          </div>

          {/* Secondary offer */}
          <div className="mb-8 md:mb-12 px-4">
            <p className="text-gray-600 mb-4 text-sm md:text-base">Or watch our free training first:</p>
            <Link to="/training">
              <Button variant="outline" size="lg" className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 font-semibold w-full sm:w-auto touch-manipulation">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Watch 15-Minute Free Training
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 md:gap-8 text-sm text-gray-500 px-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>No spam, ever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Unsubscribe anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="hidden sm:inline">Trusted by fitness businesses nationwide</span>
              <span className="sm:hidden">Trusted nationwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section id="newsletter" className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-800">What You'll Get Every Week</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Proven AI automation strategies that fitness business owners are using to scale efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-8 md:mb-12">
            <div className="text-center p-4 md:p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 text-gray-800">AI Automation Strategies</h3>
              <p className="text-sm md:text-base text-gray-600">
                Step-by-step guides for automating member management, retention campaigns, and personalized experiences
              </p>
            </div>

            <div className="text-center p-4 md:p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Clock className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 text-gray-800">Time-Saving Tools</h3>
              <p className="text-sm md:text-base text-gray-600">
                AI-powered tools for scheduling, operations management, and administrative tasks that save 15+ hours weekly
              </p>
            </div>

            <div className="text-center p-4 md:p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Target className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 text-gray-800">Revenue Growth Cases</h3>
              <p className="text-sm md:text-base text-gray-600">
                Real case studies showing how fitness businesses increased revenue by 40% using our AI systems
              </p>
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="text-center px-4">
            <Link to="/newsletter">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-semibold py-3 md:py-4 px-6 md:px-8 text-base md:text-lg w-full sm:w-auto touch-manipulation">
                Join 5,000+ Fitness Owners - Get Your Free Toolkit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-800">The Results Our Clients Get</h2>
              <p className="text-lg md:text-xl text-gray-600 px-4">
                Fitness businesses using our weekly AI strategies see dramatic improvements
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2 text-gray-800">40% Revenue Increase</h3>
                    <p className="text-sm md:text-base text-gray-600">Average revenue growth within 90 days of implementation</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2 text-gray-800">15 Hours Saved Weekly</h3>
                    <p className="text-sm md:text-base text-gray-600">Time recovered from manual tasks and administrative work</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2 text-gray-800">25% Manual Labor Reduction</h3>
                    <p className="text-sm md:text-base text-gray-600">Reduced time spent on manual tasks and administrative works</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
                <blockquote className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 italic">
                  "It was super easy & I know very little about setting up technology. If I could get sweep integrated into my site using their services, then anyone else could too."
                </blockquote>
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                    BB
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm md:text-base">Brandon Bergeron</div>
                    <div className="text-gray-600 text-xs md:text-sm">Owner, St Paul Brazillian Jiu Jitsu</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Scale Your Fitness Business with AI?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join 5,000+ fitness business owners getting our proven AI automation strategies every week
            </p>
            
            <Link to="/newsletter">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 text-lg mb-4">
                Get My Free Weekly AI Toolkit
              </Button>
            </Link>
            
            <div className="mt-4">
              <Link to="/training" className="text-blue-200 hover:text-white underline">
                Or watch our free 27-minute training first
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img 
                src="/lovable-uploads/2e025803-adcb-4eb0-8995-15991e0213a4.png" 
                alt="Sweep Logo" 
                className="h-8 w-auto"
              />
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 Sweep. All rights reserved. | Privacy Policy | Terms of Service
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
