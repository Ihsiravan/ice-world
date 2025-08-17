'use client'

import { useState } from 'react';
import { MapPin, Camera, ChevronRight } from 'lucide-react';
import { samplePhotos } from '@/lib/sample-photos';

interface LocationSidebarProps {
  selectedLocation: string | null;
  onLocationSelect: (location: string | null) => void;
}

// Get unique locations from photos
const getUniqueLocations = () => {
  const locations = samplePhotos.map(photo => photo.location);
  return [...new Set(locations)].sort();
};

// Get photo count for a location
const getPhotoCount = (location: string) => {
  return samplePhotos.filter(photo => photo.location === location).length;
};

export function LocationSidebar({ selectedLocation, onLocationSelect }: LocationSidebarProps) {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const locations = getUniqueLocations();

  return (
    <div className="w-80 bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200 p-6 overflow-y-auto">
      {/* Header */}
      

      {/* All Photos Option */}
      <div className="mb-6">
        <button
          onClick={() => onLocationSelect(null)}
          className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left group ${
            selectedLocation === null
              ? 'border-primary bg-primary/10 text-primary shadow-lg'
              : 'border-slate-200 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                selectedLocation === null
                  ? 'bg-primary text-white'
                  : 'bg-slate-200 group-hover:bg-primary/20'
              }`}>
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">All Photos</div>
                <div className="text-sm text-muted-foreground">
                  {samplePhotos.length} memories
                </div>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${
              selectedLocation === null ? 'rotate-90 text-primary' : 'text-muted-foreground'
            }`} />
          </div>
        </button>
      </div>

      {/* Location List */}
      <div className="space-y-3">
        {locations.map((location, index) => {
          const photoCount = getPhotoCount(location);
          const isSelected = selectedLocation === location;
          const isHovered = hoveredLocation === location;

          return (
            <div
              key={location}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                onClick={() => onLocationSelect(location)}
                onMouseEnter={() => setHoveredLocation(location)}
                onMouseLeave={() => setHoveredLocation(null)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left group hover:scale-[1.02] ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary shadow-lg'
                    : 'border-slate-200 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-slate-200 group-hover:bg-primary/20'
                    }`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{location}</div>
                      <div className="text-sm text-muted-foreground">
                        {photoCount} photo{photoCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${
                    isSelected ? 'rotate-90 text-primary' : 'text-muted-foreground'
                  }`} />
                </div>

                {/* Preview Images */}
                {isSelected && (
                  <div className="mt-3 flex gap-2">
                    {samplePhotos
                      .filter(photo => photo.location === location)
                      .slice(0, 3)
                      .map((photo, photoIndex) => (
                        <div
                          key={photo.id}
                          className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-sm"
                          style={{ animationDelay: `${photoIndex * 0.1}s` }}
                        >
                          <img
                            src={photo.url}
                            alt={photo.caption}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    {photoCount > 3 && (
                      <div className="w-12 h-12 rounded-lg bg-primary/20 border-2 border-white shadow-sm flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          +{photoCount - 3}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            {locations.length} destinations
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Explore your travel memories
          </div>
        </div>
      </div>
    </div>
  );
} 