'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar } from 'lucide-react';
import { UploadedPhoto, getThumbnailUrl } from '@/lib/imagekit';
import { toast } from 'sonner';

interface EnhancedPhotoCardProps {
  photo: UploadedPhoto;
  index: number;
  onPhotoClick: (photo: UploadedPhoto) => void;
}

export function EnhancedPhotoCard({ photo, index, onPhotoClick }: EnhancedPhotoCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div
      className="animate-fade-up group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Card 
        className="cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border-0 bg-white/80 backdrop-blur-sm shadow-lg"
        onClick={() => onPhotoClick(photo)}
      >
        <CardContent className="p-0">
          {/* Image Container */}
          <div className="relative aspect-[3/2] overflow-hidden">
            <img
              src={getThumbnailUrl(photo.url, 600, 400)}
              alt={photo.caption}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Location Badge */}
            {photo.location && (
              <div className="absolute top-4 left-4">
                <Badge 
                  variant="secondary" 
                  className="bg-white/95 text-slate-800 font-semibold px-4 py-2 backdrop-blur-sm border-0 shadow-xl text-sm"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {photo.location}
                </Badge>
              </div>
            )}


          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Caption */}
            <h3 className="font-bold text-slate-800 line-clamp-3 group-hover:text-primary transition-colors duration-300 leading-relaxed text-lg">
              {photo.caption}
            </h3>

            {/* Meta Information */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{formatDate(photo.uploadedAt)}</span>
              </div>
            </div>
            
            {/* Tags */}
            {photo.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {photo.tags.slice(0, 3).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-sm px-3 py-1 bg-gradient-to-r from-slate-100 to-slate-50 border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 font-medium"
                  >
                    {tag}
                  </Badge>
                ))}
                {photo.tags.length > 3 && (
                  <Badge 
                    variant="outline" 
                    className="text-sm px-3 py-1 bg-gradient-to-r from-slate-100 to-slate-50 border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 font-medium"
                  >
                    +{photo.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Hover Effect Line */}
            <div className="h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 