// India travel destinations with coordinates and metadata
export interface Destination {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  description: string;
  photoCount: number;
  color: string;
  region: string;
}

export const indiaDestinations: Destination[] = [
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    latitude: 15.2993,
    longitude: 74.1240,
    description: 'Beaches, nightlife, and Portuguese heritage',
    photoCount: 0,
    color: '#FF6B6B',
    region: 'West Coast'
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    latitude: 26.9124,
    longitude: 75.7873,
    description: 'Pink City with royal palaces and forts',
    photoCount: 0,
    color: '#FFE66D',
    region: 'North'
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    state: 'Ladakh',
    latitude: 34.1526,
    longitude: 77.5771,
    description: 'High-altitude desert and Buddhist monasteries',
    photoCount: 0,
    color: '#4ECDC4',
    region: 'North'
  },
  {
    id: 'kerala',
    name: 'Kerala',
    state: 'Kerala',
    latitude: 10.8505,
    longitude: 76.2711,
    description: 'Backwaters, beaches, and Ayurveda',
    photoCount: 0,
    color: '#45B7D1',
    region: 'South'
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    latitude: 25.3176,
    longitude: 82.9739,
    description: 'Spiritual capital on the Ganges',
    photoCount: 0,
    color: '#96CEB4',
    region: 'North'
  },
  {
    id: 'andaman',
    name: 'Andaman',
    state: 'Andaman & Nicobar Islands',
    latitude: 11.7401,
    longitude: 92.6586,
    description: 'Pristine beaches and marine life',
    photoCount: 0,
    color: '#FFA07A',
    region: 'Islands'
  }
];

// Get destination by name (case-insensitive)
export const getDestinationByName = (name: string): Destination | undefined => {
  return indiaDestinations.find(dest => 
    dest.name.toLowerCase() === name.toLowerCase() ||
    dest.state.toLowerCase() === name.toLowerCase()
  );
};

// Get destination by coordinates (approximate match)
export const getDestinationByCoordinates = (lat: number, lng: number): Destination | undefined => {
  return indiaDestinations.find(dest => {
    const distance = Math.sqrt(
      Math.pow(dest.latitude - lat, 2) + Math.pow(dest.longitude - lng, 2)
    );
    return distance < 2; // Within 2 degrees (roughly 200km)
  });
}; 