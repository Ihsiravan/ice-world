'use client'

import { useState, useEffect } from 'react';
import { PhotoUploadModal } from '@/components/PhotoUploadModal';
import { Button } from '@/components/ui/button';
import { Camera, ArrowLeft, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LocationSidebar } from '@/components/LocationSidebar';
import { EnhancedPhotoCard } from '@/components/EnhancedPhotoCard';
import { PhotoFullView } from '@/components/PhotoFullView';
import { samplePhotos } from '@/lib/sample-photos';
import { UploadedPhoto } from '@/lib/imagekit';

export default function GalleryPage() {
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [allPhotos, setAllPhotos] = useState<UploadedPhoto[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<UploadedPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<UploadedPhoto | null>(null);

  // Load photos on component mount
  useEffect(() => {
    const storedPhotos = localStorage.getItem('photos_himalika-user');
    const userPhotos = storedPhotos ? JSON.parse(storedPhotos) : [];
    const combinedPhotos = [...userPhotos, ...samplePhotos];
    setAllPhotos(combinedPhotos);
    setFilteredPhotos(combinedPhotos);
  }, [refreshTrigger]);

  // Filter photos when location changes
  useEffect(() => {
    if (selectedLocation) {
      const filtered = allPhotos.filter(photo => 
        photo.location === selectedLocation
      );
      setFilteredPhotos(filtered);
    } else {
      setFilteredPhotos(allPhotos);
    }
  }, [selectedLocation, allPhotos]);

  const handlePhotoUploaded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleLocationSelect = (location: string | null) => {
    setSelectedLocation(location);
  };

  const handlePhotoClick = (photo: UploadedPhoto) => {
    setSelectedPhoto(photo);
  };

  const handlePreviousPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex > 0) {
      setSelectedPhoto(filteredPhotos[currentIndex - 1]);
    }
  };

  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex < filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[currentIndex + 1]);
    }
  };

  const handleCloseFullView = () => {
    setSelectedPhoto(null);
  };

  const currentPhotoIndex = selectedPhoto ? filteredPhotos.findIndex(p => p.id === selectedPhoto.id) : -1;
  const hasPrevious = currentPhotoIndex > 0;
  const hasNext = currentPhotoIndex < filteredPhotos.length - 1;

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
                  Journey
                </h1>
                <p className="text-sm text-muted-foreground">
                  Explore your travel memories
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PhotoUploadModal 
                onPhotoUploaded={handlePhotoUploaded}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <LocationSidebar
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
        />

        {/* Gallery Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Location Header */}
          {selectedLocation && (
            <div className="mb-8 text-center animate-fade-up">
              <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
                <MapPin className="h-8 w-8 text-primary" />
                {selectedLocation}
              </h2>
              <p className="text-muted-foreground">
                {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''} from this destination
              </p>
            </div>
          )}

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPhotos.map((photo, index) => (
              <EnhancedPhotoCard
                key={`${photo.id}-${refreshTrigger}`}
                photo={photo}
                index={index}
                onPhotoClick={handlePhotoClick}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredPhotos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No photos found</h3>
                <p>No photos available for this location</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Page Photo View */}
      <PhotoFullView
        photo={selectedPhoto}
        isOpen={!!selectedPhoto}
        onClose={handleCloseFullView}
        onPrevious={handlePreviousPhoto}
        onNext={handleNextPhoto}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
      />
    </div>
  );
} 