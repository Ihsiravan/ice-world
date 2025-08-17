import { TripCard } from "./TripCard";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Trip {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  tags: string[];
  description: string;
}

interface TimelineProps {
  trips: Trip[];
  onAddTrip: () => void;
  onViewTrip: (tripId: string) => void;
}

export function Timeline({ trips, onAddTrip, onViewTrip }: TimelineProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
            Your Travel Timeline
          </h1>
          <p className="text-muted-foreground">
            Relive your adventures through beautiful memories
          </p>
        </div>
        
        <Button 
          variant="travel"
          onClick={onAddTrip}
          className="w-fit"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Trip
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search trips, locations, or tags..."
            className="pl-10 rounded-2xl border-border/50 bg-background/50 backdrop-blur-sm"
          />
        </div>
        
        <Button variant="outline" size="default">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Trips Grid */}
      {trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, index) => (
            <div 
              key={trip.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TripCard 
                trip={trip} 
                onViewDetails={onViewTrip}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-lavender rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="h-8 w-8 text-primary-foreground" />
          </div>
          
          <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
            Start Your Journey
          </h3>
          
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first travel memory and begin building your beautiful timeline of adventures.
          </p>
          
          <Button 
            variant="hero"
            onClick={onAddTrip}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Trip
          </Button>
        </div>
      )}
    </div>
  );
}