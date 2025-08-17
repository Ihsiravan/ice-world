'use client'

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Slider_01 from "@/components/ui/ruixen-carousel-wave";
const heroImage = "/assets/hero-travel.jpg";

interface HeroWithCarouselProps {
  onGetStarted: () => void;
}

export function HeroWithCarousel({ onGetStarted }: HeroWithCarouselProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Beautiful mountain landscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/40 to-background/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto w-full mt-16 md:mt-24">
        <div className="animate-fade-up mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
            <span className="gradient-text">Moments Across Miles</span>
            <br />
            </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Explore the world with me as I live my life—one journey, one story, one unforgettable moment at a time.

          </p>

          <div className="flex justify-center items-center mb-8">
            <Button 
              variant="hero" 
              size="lg"
              onClick={onGetStarted}
              className="animate-scale-in group relative overflow-hidden transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-primary/25 bg-gradient-to-r from-blue-900/90 via-blue-800/95 to-blue-900/90 text-white"
            >
              <span className="relative z-10 flex items-center">
                My Journey
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-800/30 via-blue-700/40 to-blue-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
          </div>
        </div>

        {/* Carousel Section */}
        <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
          
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
            <Slider_01 />
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full animate-float opacity-60 hover:scale-150 hover:opacity-100 transition-all duration-500 cursor-pointer" />
      <div className="absolute top-40 right-20 w-6 h-6 bg-sunset rounded-full animate-float opacity-40 hover:scale-150 hover:opacity-100 transition-all duration-500 cursor-pointer" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-32 left-20 w-5 h-5 bg-accent rounded-full animate-float opacity-50 hover:scale-150 hover:opacity-100 transition-all duration-500 cursor-pointer" style={{ animationDelay: "2s" }} />
      
      {/* Additional floating elements */}
      <div className="absolute top-60 left-1/4 w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full animate-float opacity-30 hover:scale-200 hover:opacity-80 transition-all duration-700 cursor-pointer" style={{ animationDelay: "0.5s" }} />
      <div className="absolute bottom-60 right-1/4 w-4 h-4 bg-gradient-to-r from-sunset to-primary rounded-full animate-float opacity-40 hover:scale-150 hover:opacity-90 transition-all duration-600 cursor-pointer" style={{ animationDelay: "1.5s" }} />
    </section>
  );
} 