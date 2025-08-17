'use client'

import { useState } from 'react';
import { Destination, indiaDestinations } from '@/lib/india-destinations';
import { MapPin, Camera } from 'lucide-react';

interface IndiaMapProps {
  selectedDestination: Destination | null;
  onDestinationSelect: (destination: Destination | null) => void;
  photoCounts: Record<string, number>;
}

export function IndiaMap({ selectedDestination, onDestinationSelect, photoCounts }: IndiaMapProps) {
  const [hoveredDestination, setHoveredDestination] = useState<string | null>(null);

  const handleDestinationClick = (destination: Destination) => {
    if (selectedDestination?.id === destination.id) {
      onDestinationSelect(null); // Deselect if already selected
    } else {
      onDestinationSelect(destination);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg border border-blue-200">
        {/* India SVG Map */}
        <svg
          viewBox="0 0 800 600"
          className="w-full h-auto"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
        >
          {/* India outline - simplified shape */}
          <path
            d="M 150 200 Q 200 180 250 190 Q 300 200 350 210 Q 400 220 450 230 Q 500 240 550 250 Q 600 260 650 270 Q 700 280 720 300 Q 730 320 720 340 Q 710 360 700 380 Q 690 400 680 420 Q 670 440 660 460 Q 650 480 640 500 Q 630 520 620 540 Q 610 560 600 580 Q 590 600 580 620 Q 570 640 560 660 Q 550 680 540 700 Q 530 720 520 740 Q 510 760 500 780 Q 490 800 480 820 Q 470 840 460 860 Q 450 880 440 900 Q 430 920 420 940 Q 410 960 400 980 Q 390 1000 380 1020 Q 370 1040 360 1060 Q 350 1080 340 1100 Q 330 1120 320 1140 Q 310 1160 300 1180 Q 290 1200 280 1220 Q 270 1240 260 1260 Q 250 1280 240 1300 Q 230 1320 220 1340 Q 210 1360 200 1380 Q 190 1400 180 1420 Q 170 1440 160 1460 Q 150 1480 140 1500 Q 130 1520 120 1540 Q 110 1560 100 1580 Q 90 1600 80 1620 Q 70 1640 60 1660 Q 50 1680 40 1700 Q 30 1720 20 1740 Q 10 1760 0 1780 L 0 200 Z"
            fill="url(#indiaGradient)"
            stroke="#3B82F6"
            strokeWidth="2"
            className="transition-all duration-300 hover:fill-blue-200"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="indiaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DBEAFE" />
              <stop offset="50%" stopColor="#BFDBFE" />
              <stop offset="100%" stopColor="#93C5FD" />
            </linearGradient>
          </defs>
        </svg>

        {/* Destination Markers */}
        {indiaDestinations.map((destination) => {
          const isSelected = selectedDestination?.id === destination.id;
          const isHovered = hoveredDestination === destination.id;
          const photoCount = photoCounts[destination.id] || 0;
          
          // Convert lat/lng to SVG coordinates (simplified mapping)
          const x = ((destination.longitude - 68) / (97 - 68)) * 700 + 50;
          const y = ((destination.latitude - 8) / (37 - 8)) * 500 + 50;

          return (
            <div
              key={destination.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${x}px`, top: `${y}px` }}
              onClick={() => handleDestinationClick(destination)}
              onMouseEnter={() => setHoveredDestination(destination.id)}
              onMouseLeave={() => setHoveredDestination(null)}
            >
              {/* Marker */}
              <div
                className={`relative transition-all duration-300 ${
                  isSelected 
                    ? 'scale-125' 
                    : isHovered 
                    ? 'scale-110' 
                    : 'scale-100'
                }`}
              >
                {/* Marker background */}
                <div
                  className={`w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-all duration-300 ${
                    isSelected 
                      ? 'bg-primary shadow-xl shadow-primary/50' 
                      : isHovered 
                      ? 'bg-primary/80 shadow-lg' 
                      : 'bg-white hover:bg-primary/20'
                  }`}
                  style={{ backgroundColor: isSelected ? undefined : destination.color }}
                >
                  <MapPin 
                    className={`w-6 h-6 transition-all duration-300 ${
                      isSelected 
                        ? 'text-white scale-110' 
                        : isHovered 
                        ? 'text-white scale-105' 
                        : 'text-gray-600 group-hover:text-white'
                    }`}
                  />
                </div>

                {/* Photo count badge */}
                {photoCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                    {photoCount}
                  </div>
                )}

                {/* Location name tooltip */}
                {(isHovered || isSelected) && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap z-10 animate-fade-up">
                    <div className="font-semibold">{destination.name}</div>
                    <div className="text-xs opacity-80">{destination.description}</div>
                    {photoCount > 0 && (
                      <div className="text-xs opacity-60 flex items-center gap-1 mt-1">
                        <Camera className="w-3 h-3" />
                        {photoCount} photo{photoCount !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Click a marker to filter photos by location</span>
        </div>
        {selectedDestination && (
          <button
            onClick={() => onDestinationSelect(null)}
            className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
          >
            View All Photos
          </button>
        )}
      </div>
    </div>
  );
} 