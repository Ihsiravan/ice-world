import Slider_01 from "@/components/ui/ruixen-carousel-wave";

export default function DemoCarousel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Travel Memories Carousel
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore beautiful destinations with our interactive carousel
          </p>
        </div>
        <Slider_01 />
      </div>
    </div>
  );
} 