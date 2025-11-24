// src/components/Map.tsx
import React from 'react';
import { MapPin } from 'lucide-react';

const Map: React.FC<{ location?: string }> = ({ location = 'India' }) => {
  const locationCoordinates: Record<string, { lat: number; lng: number }> = {
    'India': { lat: 20.5937, lng: 78.9629 },
    'Delhi': { lat: 28.6139, lng: 77.209 },
    'Mumbai': { lat: 19.076, lng: 72.8777 },
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Kolkata': { lat: 22.5726, lng: 88.3639 },
  };

  const coords = locationCoordinates[location] || locationCoordinates['India'];
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 2},${coords.lat - 2},${coords.lng + 2},${coords.lat + 2}&layer=mapnik`;

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg">
      <iframe
        title={`Map of ${location}`}
        className="w-full h-[400px]"
        frameBorder="0"
        src={mapUrl}
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="p-4 bg-white dark:bg-gray-800 flex items-center gap-2">
        <MapPin size={20} className="text-red-500" />
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          {location}
        </p>
      </div>
    </div>
  );
};

export default Map;
