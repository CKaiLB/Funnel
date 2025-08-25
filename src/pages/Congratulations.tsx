import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Lock, Unlock, Star, Zap, Users, TrendingUp, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";

// Meta Pixel TypeScript declarations
declare global {
  interface Window {
    fbq: any;
  }
}

export default function Congratulations() {
  const [unlockStep, setUnlockStep] = useState(0);
  const [showInvitation, setShowInvitation] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const handleUnlock = () => {
    setIsUnlocking(true);
    
    // Simulate unlocking sequence
    setTimeout(() => setUnlockStep(1), 500);
    setTimeout(() => setUnlockStep(2), 1500);
    setTimeout(() => setUnlockStep(3), 2500);
    setTimeout(() => {
      setUnlockStep(4);
      setShowVideo(true);
      setIsUnlocking(false);
    }, 3500);
  };

  const handleCalendlyRedirect = () => {
    window.open('https://calendly.com/sweepautomation/new-meeting', '_blank');
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Auto-play failed, user will need to click play
        setIsPlaying(false);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 sm:py-6 md:py-8 lg:py-12 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            🎉 Congratulations!
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            You've successfully unlocked access to the sales system bonus features.
          </p>
        </div>

        {/* Unlocking Sequence */}
        <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <Card className="p-4 sm:p-6 md:p-8 shadow-xl bg-white border-2 border-blue-200">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                🔐 Unlocking Your Secret Offer...
              </h2>
              
              {/* Unlock Progress - Mobile Optimized */}
              <div className="grid grid-cols-2 sm:flex sm:justify-center sm:items-center gap-4 sm:gap-4 md:gap-8 mb-6 sm:mb-8">
                <div className={`flex flex-col items-center ${unlockStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-14 h-14 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full border-4 flex items-center justify-center mb-2 transition-all duration-500 ${unlockStep >= 1 ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-gray-100'}`}>
                    {unlockStep >= 1 ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" /> : <Lock className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />}
                  </div>
                  <span className="text-xs sm:text-sm md:text-base font-medium text-center">System Access</span>
                </div>
                
                <div className={`flex flex-col items-center ${unlockStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-14 h-14 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full border-4 flex items-center justify-center mb-2 transition-all duration-500 ${unlockStep >= 2 ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-gray-100'}`}>
                    {unlockStep >= 2 ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" /> : <Lock className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />}
                  </div>
                  <span className="text-xs sm:text-sm md:text-base font-medium text-center">Templates</span>
                </div>
                
                <div className={`flex flex-col items-center ${unlockStep >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-14 h-14 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full border-4 flex items-center justify-center mb-2 transition-all duration-500 ${unlockStep >= 3 ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-gray-100'}`}>
                    {unlockStep >= 3 ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" /> : <Lock className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />}
                  </div>
                  <span className="text-xs sm:text-sm md:text-base font-medium text-center">Scripts</span>
                </div>
                
                <div className={`flex flex-col items-center ${unlockStep >= 4 ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-14 h-14 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full border-4 flex items-center justify-center mb-2 transition-all duration-500 ${unlockStep >= 4 ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-gray-100'}`}>
                    {unlockStep >= 4 ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" /> : <Lock className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />}
                  </div>
                  <span className="text-xs sm:text-sm md:text-base font-medium text-center">Bonus</span>
                </div>
              </div>

              {/* Unlock Button - Mobile Optimized */}
              {!showVideo && (
                <Button
                  onClick={handleUnlock}
                  disabled={isUnlocking}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 text-base sm:text-lg md:text-xl rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] sm:min-h-[60px] md:min-h-[64px]"
                >
                  {isUnlocking ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span>Unlocking...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Unlock className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Unlock Bonus Features</span>
                    </div>
                  )}
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* VSL Video - Revealed After Unlock */}
        {showVideo && (
          <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 animate-fade-in-up">
            <Card className="p-4 sm:p-6 md:p-8 shadow-xl bg-white border-2 border-blue-200">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                  🎬 Watch Your Exclusive Bonus Video
                </h2>
                <p className="text-base sm:text-lg md:text-lg text-gray-600 mb-6 sm:mb-8 px-2">
                  Discover the complete system that will transform your fitness business.
                </p>
                
                {/* Video Container */}
                <div className="relative max-w-2xl mx-auto">
                  <video
                    ref={videoRef}
                    className="w-full rounded-xl shadow-lg"
                    onLoadedData={handleVideoLoad}
                    playsInline
                    preload="metadata"
                  >
                    <source src="/VSL.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center space-x-4">
                    <Button
                      onClick={togglePlayPause}
                      size="sm"
                      variant="secondary"
                      className="bg-black/70 hover:bg-black/80 text-white border-0 backdrop-blur-sm"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    
                    <Button
                      onClick={toggleMute}
                      size="sm"
                      variant="secondary"
                      className="bg-black/70 hover:bg-black/80 text-white border-0 backdrop-blur-sm"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs sm:text-sm text-gray-500 mt-4">
                  💡 <strong>Pro Tip:</strong> Watch the entire video to see what the call's all about
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Hidden Invitation - Revealed After Video */}
        {showVideo && (
          <div className="animate-fade-in-up">
            <Card className="p-4 sm:p-6 md:p-8 shadow-xl bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
              <div className="text-center">
                <div className="mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Star className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
                    🎁 Special Invitation Unlocked!
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-4 sm:mb-6 px-2">
                    You've unlocked a limited time opportunity...
                  </p>
                </div>

                {/* Invitation Content */}
                <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                    🚀 Work Directly with the Sweep Team
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6">
                    Get a <span className="font-bold text-green-600">FREE Sales Systems Consultation</span> worth $497
                  </p>
                  
                  {/* Benefits - Mobile Optimized Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
                    <div className="flex items-center justify-center sm:justify-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-xs sm:text-sm md:text-base font-medium text-gray-700">Custom Strategy</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-xs sm:text-sm md:text-base font-medium text-gray-700">1-on-1 Session</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-xs sm:text-sm md:text-base font-medium text-gray-700">Growth Plan</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-100 to-blue-100 p-3 sm:p-4 rounded-lg">
                    <p className="text-xs sm:text-sm md:text-base text-gray-800 font-medium">
                      💡 <strong>What You'll Get:</strong> Personalized funnel strategy, automation setup roadmap, and proven conversion tactics for your fitness business.
                    </p>
                  </div>
                </div>

                {/* Main CTA - Mobile Optimized */}
                <div className="mb-4 sm:mb-6">
                  <Button
                    onClick={handleCalendlyRedirect}
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 text-base sm:text-lg md:text-xl rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-h-[56px] sm:min-h-[60px] md:min-h-[64px]"
                  >
                    🗓️ Book Your FREE Consultation Now
                  </Button>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-2 sm:mt-3 px-2">
                    Limited spots available • No sales pitch • Pure value
                  </p>
                </div>

                {/* Trust Indicators - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 md:space-x-8 text-xs sm:text-sm md:text-base text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span>100% Free</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span>No Obligation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span>Instant Booking</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* What Happens Next - Mobile Optimized */}
        {showVideo && (
          <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 animate-fade-in-up">
            <Card className="p-4 sm:p-6 md:p-8 shadow-lg bg-white">
              <div className="text-center">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                  🎯 What Happens Next?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-xl sm:text-2xl font-bold text-blue-600">1</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Book Your Session</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Choose a time that works for you</p>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-xl sm:text-2xl font-bold text-green-600">2</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Get Your Strategy</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Receive personalized funnel guidance</p>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-xl sm:text-2xl font-bold text-purple-600">3</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Implement & Scale</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Start booking more clients automatically</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
      <Analytics />
    </div>
  );
}
