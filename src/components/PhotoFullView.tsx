'use client'


import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { UploadedPhoto } from '@/lib/imagekit';

interface PhotoFullViewProps {
  photo: UploadedPhoto | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export function PhotoFullView({ 
  photo, 
  isOpen, 
  onClose, 
  onPrevious, 
  onNext, 
  hasPrevious = false, 
  hasNext = false 
}: PhotoFullViewProps) {
  if (!photo) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft' && hasPrevious) {
      onPrevious?.();
    } else if (e.key === 'ArrowRight' && hasNext) {
      onNext?.();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-7xl w-full h-[90vh] p-0 overflow-hidden bg-black/95"
        onKeyDown={handleKeyDown}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Navigation Arrows */}
        {hasPrevious && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        )}

        {hasNext && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full"
          >
            <ArrowRight className="h-6 w-6" />
          </Button>
        )}

        <div className="flex h-full">
          {/* Image Section */}
          <div className="flex-1 flex items-center justify-center p-8 relative bg-gradient-to-br from-gray-900 to-black">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={photo.url}
                alt={photo.caption}
                className="h-auto max-h-[80vh] w-auto max-w-[70vw] object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Info Panel */}
          <div className="w-96 bg-white/95 backdrop-blur-sm p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Location Badge */}
              {photo.location && (
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className="bg-primary/10 text-primary font-semibold px-4 py-2"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {photo.location}
                  </Badge>
                </div>
              )}

              {/* Caption */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                  {photo.caption}
                </h2>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">{formatDate(photo.uploadedAt)}</span>
              </div>

              {/* Coordinates */}
              {photo.latitude && photo.longitude && (
                <div className="text-sm text-gray-600">
                  📍 {photo.latitude.toFixed(6)}, {photo.longitude.toFixed(6)}
                </div>
              )}

              {/* Tags */}
              {photo.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {photo.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="bg-gray-100 text-gray-700 hover:bg-primary hover:text-white transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}


            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 