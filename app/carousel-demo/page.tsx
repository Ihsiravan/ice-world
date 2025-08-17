'use client'

import DemoCarousel from "@/components/ui/demo-carousel";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CarouselDemoPage() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleBackToHome}
                className="rounded-full group hover:scale-110 hover:shadow-lg transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                title="Back to Home"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </Button>
              <div className="animate-fade-up">
                <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Carousel Demo
                </h1>
                <p className="text-sm text-muted-foreground">
                  Interactive photo carousel showcase
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <DemoCarousel />
    </div>
  );
} 