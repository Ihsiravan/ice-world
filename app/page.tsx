'use client'

import { HeroWithCarousel } from "@/components/HeroWithCarousel";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/gallery');
  };

  const handleViewCarousel = () => {
    router.push('/carousel-demo');
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroWithCarousel onGetStarted={handleGetStarted} />
      
      {/* Floating Demo Button */}
      
    </div>
  );
} 