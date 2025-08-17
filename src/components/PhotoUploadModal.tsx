'use client'

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Camera, MapPin, Upload, X, Loader2, Tag } from 'lucide-react';
import { uploadPhotoToImageKit, compressImage, PhotoData } from '@/lib/imagekit';
import { indiaDestinations, getDestinationByCoordinates } from '@/lib/india-destinations';
import { toast } from 'sonner';

interface PhotoUploadModalProps {
  onPhotoUploaded?: () => void;
  tripId?: string;
  userId?: string;
}

export function PhotoUploadModal({ onPhotoUploaded, tripId, userId = 'anonymous' }: PhotoUploadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          
          // Try to auto-detect destination
          const destination = getDestinationByCoordinates(lat, lng);
          if (destination) {
            setSelectedDestination(destination.id);
            setLocation(destination.name);
            toast.success(`Location detected: ${destination.name}`);
          } else {
            toast.success('Location captured! Please select a destination.');
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Could not get current location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a photo');
      return;
    }

    if (!caption.trim()) {
      toast.error('Please add a caption');
      return;
    }

    setIsUploading(true);

    try {
      // Compress the image before uploading
      const compressedFile = await compressImage(selectedFile);
      
      const photoData: PhotoData = {
        caption: caption.trim(),
        location: location.trim() || 'Unknown location',
        latitude,
        longitude,
        tripId: selectedDestination || tripId,
        tags
      };

      const uploadedPhoto = await uploadPhotoToImageKit(compressedFile, photoData, userId);
      
      // Save to localStorage for demo purposes
      const storedPhotos = localStorage.getItem(`photos_${userId}`);
      const existingPhotos = storedPhotos ? JSON.parse(storedPhotos) : [];
      const updatedPhotos = [uploadedPhoto, ...existingPhotos];
      localStorage.setItem(`photos_${userId}`, JSON.stringify(updatedPhotos));
      
      toast.success('Photo uploaded successfully!');
      setIsOpen(false);
      resetForm();
      onPhotoUploaded?.();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setCaption('');
    setLocation('');
    setSelectedDestination('');
    setLatitude(undefined);
    setLongitude(undefined);
    setTags([]);
    setNewTag('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="travel" className="gap-2">
          <Camera className="h-4 w-4" />
          Upload Photo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Upload New Photo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <Label htmlFor="photo-upload">Select Photo</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              {!selectedFile ? (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Photo
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      JPG, PNG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg object-cover"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Photo
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Caption Section */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption *</Label>
            <Textarea
              id="caption"
              placeholder="Describe this moment..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
            />
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="Where was this taken?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={getCurrentLocation}
                  title="Get current location"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Destination Selection */}
            <div className="space-y-2">
              <Label>Select Destination</Label>
              <div className="grid grid-cols-2 gap-2">
                {indiaDestinations.map((dest) => (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => {
                      setSelectedDestination(dest.id);
                      setLocation(dest.name);
                    }}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                      selectedDestination === dest.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: dest.color }}
                      />
                      <div>
                        <div className="font-medium text-sm">{dest.name}</div>
                        <div className="text-xs text-muted-foreground">{dest.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {(latitude && longitude) && (
              <div className="text-sm text-muted-foreground">
                📍 Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </div>
            )}
          </div>

          {/* Tags Section */}
          <div className="space-y-4">
            <Label>Tags</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  disabled={!newTag.trim()}
                >
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !caption.trim() || isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 