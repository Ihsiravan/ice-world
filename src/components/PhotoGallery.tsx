'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Calendar, Tag, Share2, Download, X } from 'lucide-react';
import { UploadedPhoto, getThumbnailUrl } from '@/lib/imagekit';
import { samplePhotos } from '@/lib/sample-photos';
import { toast } from 'sonner';

interface PhotoGalleryProps {
  userId: string;
  tripId?: string;
  photos?: UploadedPhoto[];
}

export function PhotoGallery({ userId, tripId, photos: propPhotos }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<UploadedPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (propPhotos) {
      setPhotos(propPhotos);
      setLoading(false);
    } else {
      loadPhotos();
    }
  }, [userId, tripId, propPhotos]);

  const loadPhotos = () => {
    try {
      // Load sample photos first
      let allPhotos: UploadedPhoto[] = [...samplePhotos];
      
      // Then load any additional photos from localStorage
      const storedPhotos = localStorage.getItem(`photos_${userId}`);
      if (storedPhotos) {
        const userPhotos: UploadedPhoto[] = JSON.parse(storedPhotos);
        allPhotos = [...userPhotos, ...allPhotos];
      }
      
      const filteredPhotos = tripId 
        ? allPhotos.filter(photo => photo.tripId === tripId)
        : allPhotos;
      setPhotos(filteredPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = (photo: UploadedPhoto) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleDownload = async (photo: UploadedPhoto) => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = photo.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Photo downloaded!');
    } catch (error) {
      toast.error('Failed to download photo');
    }
  };

  const handleShare = async (photo: UploadedPhoto) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: photo.caption,
          text: `Check out this photo from ${photo.location}`,
          url: photo.url
        });
      } else {
        await navigator.clipboard.writeText(photo.url);
        toast.success('Photo URL copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share photo');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="aspect-square bg-muted rounded-lg mb-3"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Photos Yet</h3>
          <p>Upload your first photo to start building your travel gallery!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Card 
              className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group overflow-hidden"
              onClick={() => handlePhotoClick(photo)}
            >
            <CardContent className="p-4">
                              <div className="aspect-square mb-3 overflow-hidden rounded-lg">
                  <img
                    src={getThumbnailUrl(photo.url, 300, 300)}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                              <div className="space-y-2">
                  <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors duration-300">{photo.caption}</h3>
                  {photo.location && photo.location !== 'Unknown location' && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <MapPin className="h-3 w-3 group-hover:scale-110 transition-transform duration-300" />
                      <span className="line-clamp-1">{photo.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    <Calendar className="h-3 w-3 group-hover:scale-110 transition-transform duration-300" />
                    <span>{formatDate(photo.uploadedAt)}</span>
                  </div>
                  {photo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {photo.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs hover:scale-105 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                          {tag}
                        </Badge>
                      ))}
                      {photo.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs hover:scale-105 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                          +{photo.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Photo Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPhoto && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span className="line-clamp-1">{selectedPhoto.caption}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="aspect-video overflow-hidden rounded-lg">
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">{selectedPhoto.caption}</h3>
                                         {selectedPhoto.location && selectedPhoto.location !== 'Unknown location' && (
                       <div className="flex items-center gap-1 text-muted-foreground mb-2">
                         <MapPin className="h-4 w-4" />
                         <span>{selectedPhoto.location}</span>
                       </div>
                     )}
                    <div className="flex items-center gap-1 text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(selectedPhoto.uploadedAt)}</span>
                    </div>
                    {selectedPhoto.latitude && selectedPhoto.longitude && (
                      <div className="text-sm text-muted-foreground">
                        📍 {selectedPhoto.latitude.toFixed(6)}, {selectedPhoto.longitude.toFixed(6)}
                      </div>
                    )}
                  </div>
                  
                  {selectedPhoto.tags.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="h-4 w-4" />
                        <span className="font-medium">Tags</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedPhoto.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => handleDownload(selectedPhoto)}
                      className="flex-1 group hover:scale-105 hover:shadow-lg transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                    >
                      <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleShare(selectedPhoto)}
                      className="flex-1 group hover:scale-105 hover:shadow-lg transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                    >
                      <Share2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 