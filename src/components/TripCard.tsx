import { Calendar, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface TripCardProps {
  trip: Trip;
  onViewDetails: (tripId: string) => void;
}

export function TripCard({ trip, onViewDetails }: TripCardProps) {
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: startDate.getFullYear() !== endDate.getFullYear() ? 'numeric' : undefined 
    };
    
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
  };

  return (
    <div className="group relative card-travel overflow-hidden hover:scale-[1.02] transition-all duration-300">
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-soft rounded-2xl overflow-hidden mb-4">
        {trip.coverImage ? (
          <img 
            src={trip.coverImage} 
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-lavender flex items-center justify-center">
            <MapPin className="h-8 w-8 text-primary-foreground opacity-60" />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        
        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {trip.tags.slice(0, 2).map((tag) => (
            <span 
              key={tag}
              className="bg-background/80 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded-full border border-border/50"
            >
              {tag}
            </span>
          ))}
          {trip.tags.length > 2 && (
            <span className="bg-background/80 backdrop-blur-sm text-muted-foreground text-xs px-2 py-1 rounded-full border border-border/50">
              +{trip.tags.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-xl font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
          {trip.title}
        </h3>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{trip.location}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
          </div>
        </div>
        
        <p className="text-muted-foreground line-clamp-2 leading-relaxed">
          {trip.description}
        </p>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onViewDetails(trip.id)}
          className="w-full mt-4 group-hover:border-primary group-hover:text-primary"
        >
          View Details
        </Button>
      </div>
    </div>
  );
}