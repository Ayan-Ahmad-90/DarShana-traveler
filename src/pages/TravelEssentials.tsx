import { Clock, DollarSign, Filter, MapPin, Star } from 'lucide-react';
import React, { useState } from 'react';

// Transport Card Component
const TransportCard: React.FC<{
  id: string;
  type: 'bus' | 'train' | 'flight' | 'cab' | 'bike';
  from: string;
  to: string;
  price: number;
  timing: string;
  availability: number;
  duration: string;
  rating: number;
  image: string;
}> = ({ type, from, to, price, timing, availability, duration, rating, image }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const getTypeColor = () => {
    switch (type) {
      case 'bus': return 'bg-blue-50 border-blue-200';
      case 'train': return 'bg-green-50 border-green-200';
      case 'flight': return 'bg-purple-50 border-purple-200';
      case 'cab': return 'bg-yellow-50 border-yellow-200';
      case 'bike': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'bus': return '🚌';
      case 'train': return '🚆';
      case 'flight': return '✈️';
      case 'cab': return '🚕';
      case 'bike': return '🏍️';
      default: return '🚗';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getTypeColor()} hover:shadow-lg transition-shadow`}>
      <div className="flex gap-4">
        <img src={image} alt={type} className="w-24 h-24 object-cover rounded" />
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getTypeIcon()}</span>
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">{from}</span> → <span className="font-semibold">{to}</span>
                </p>
                <p className="text-xs text-gray-500">{duration}</p>
              </div>
            </div>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="text-xl hover:scale-125 transition"
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">{timing}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-semibold">₹{price}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐ {rating}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded ${availability > 5 ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800'}`}>
              {availability} seats available
            </span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stay Card Component
const StayCard: React.FC<{
  id: string;
  name: string;
  type: 'hotel' | 'resort' | 'homestay' | 'budget' | 'luxury';
  price: number;
  rating: number;
  facilities: string[];
  images: string[];
  location: string;
}> = ({ name, type, price, rating, facilities, images, location }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getTypeLabel = () => {
    switch (type) {
      case 'hotel': return '🏨 Hotel';
      case 'resort': return '🏖️ Resort';
      case 'homestay': return '🏠 Homestay';
      case 'budget': return '💰 Budget';
      case 'luxury': return '✨ Luxury';
      default: return 'Stay';
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48 bg-gray-200">
        <img
          src={images[currentImageIndex]}
          alt={name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 text-2xl hover:scale-125 transition bg-white rounded-full p-1"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
        {images.length > 1 && (
          <div className="absolute bottom-2 left-2 right-2 flex gap-1">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`h-2 flex-1 rounded ${idx === currentImageIndex ? 'bg-white' : 'bg-gray-400'}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-gray-600">{getTypeLabel()}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{rating}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {location}
        </p>

        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-2">Facilities:</p>
          <div className="flex flex-wrap gap-1">
            {facilities.map((facility, idx) => (
              <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {facility}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-green-600">₹{price} <span className="text-xs text-gray-600 font-normal">/night</span></p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-semibold">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Food Card Component
const FoodCard: React.FC<{
  id: string;
  name: string;
  type: 'restaurant' | 'streetfood' | 'cuisine' | 'dish';
  priceRange: string;
  rating: number;
  cuisine: string;
  location: string;
  recommendedItems: string[];
  image: string;
  isVeg: boolean;
}> = ({ name, type, priceRange, rating, cuisine, location, recommendedItems, image, isVeg }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const getTypeIcon = () => {
    switch (type) {
      case 'restaurant': return '🍽️';
      case 'streetfood': return '🍢';
      case 'cuisine': return '🌮';
      case 'dish': return '🍜';
      default: return '🍽️';
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-xl transition-shadow bg-white">
      <div className="relative h-40 bg-gray-200">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          <span className="text-2xl">{getTypeIcon()}</span>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="text-2xl hover:scale-125 transition"
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>
        <span className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-semibold ${isVeg ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {isVeg ? '🌱 Veg' : '🍖 Non-Veg'}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-gray-600">{cuisine}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-sm">{rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {location}
        </p>

        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-1">Must Try:</p>
          <p className="text-xs text-gray-700">
            {recommendedItems.join(', ')}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-green-600 font-semibold">{priceRange}</span>
          <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm font-semibold">
            View Menu
          </button>
        </div>
      </div>
    </div>
  );
};

// Filter Component
const FilterBar: React.FC<{
  activeTab: 'transport' | 'stay' | 'food';
  onFilterChange: (filters: any) => void;
}> = ({ activeTab, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-blue-600 font-semibold mb-4 hover:text-blue-700"
      >
        <Filter className="w-5 h-5" />
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {activeTab === 'transport' && (
            <>
              <input type="text" placeholder="From" className="border rounded px-3 py-2" />
              <input type="text" placeholder="To" className="border rounded px-3 py-2" />
              <input type="date" className="border rounded px-3 py-2" />
              <select className="border rounded px-3 py-2">
                <option>All Transport</option>
                <option>Bus</option>
                <option>Train</option>
                <option>Flight</option>
                <option>Cab</option>
              </select>
            </>
          )}

          {activeTab === 'stay' && (
            <>
              <input type="text" placeholder="Location" className="border rounded px-3 py-2" />
              <input type="date" placeholder="Check-in" className="border rounded px-3 py-2" />
              <input type="date" placeholder="Check-out" className="border rounded px-3 py-2" />
              <select className="border rounded px-3 py-2">
                <option>All Types</option>
                <option>Hotel</option>
                <option>Resort</option>
                <option>Homestay</option>
              </select>
            </>
          )}

          {activeTab === 'food' && (
            <>
              <input type="text" placeholder="Location/Restaurant" className="border rounded px-3 py-2" />
              <select className="border rounded px-3 py-2">
                <option>All Cuisines</option>
                <option>Indian</option>
                <option>Chinese</option>
                <option>Continental</option>
                <option>Street Food</option>
              </select>
              <select className="border rounded px-3 py-2">
                <option>All Types</option>
                <option>Veg</option>
                <option>Non-Veg</option>
              </select>
              <select className="border rounded px-3 py-2">
                <option>Price Range</option>
                <option>₹ (Budget)</option>
                <option>₹₹ (Moderate)</option>
                <option>₹₹₹ (Premium)</option>
              </select>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Main Travel Essentials Page
const TravelEssentials: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transport' | 'stay' | 'food'>('transport');

  // Sample data
  const transportData = [
    {
      id: '1',
      type: 'bus' as const,
      from: 'Delhi',
      to: 'Agra',
      price: 500,
      timing: '06:00 AM',
      availability: 12,
      duration: '4 hours',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1464219414232-588def7b9b12?w=200'
    },
    {
      id: '2',
      type: 'train' as const,
      from: 'Delhi',
      to: 'Jaipur',
      price: 450,
      timing: '08:30 AM',
      availability: 25,
      duration: '5 hours',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1570125909519-c90900bc6012?w=200'
    },
    {
      id: '3',
      type: 'flight' as const,
      from: 'Delhi',
      to: 'Mumbai',
      price: 3500,
      timing: '10:00 AM',
      availability: 8,
      duration: '2 hours',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1552886290-24a98155ffed?w=200'
    },
  ];

  const stayData = [
    {
      id: '1',
      name: 'The Grand Palace Hotel',
      type: 'hotel' as const,
      price: 3500,
      rating: 4.6,
      facilities: ['WiFi', 'AC', 'Parking', 'Restaurant'],
      images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300'],
      location: 'Jaipur'
    },
    {
      id: '2',
      name: 'Mountain View Resort',
      type: 'resort' as const,
      price: 5000,
      rating: 4.8,
      facilities: ['Pool', 'Spa', 'Yoga', 'WiFi'],
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'],
      location: 'Himachal Pradesh'
    },
    {
      id: '3',
      name: 'Cozy Homestay',
      type: 'homestay' as const,
      price: 1200,
      rating: 4.4,
      facilities: ['WiFi', 'Kitchen', 'Parking'],
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300'],
      location: 'Varanasi'
    },
  ];

  const foodData = [
    {
      id: '1',
      name: 'Agra Petha House',
      type: 'restaurant' as const,
      priceRange: '₹₹',
      rating: 4.7,
      cuisine: 'North Indian',
      location: 'Agra',
      recommendedItems: ['Petha', 'Biryani', 'Kulfi'],
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300',
      isVeg: true
    },
    {
      id: '2',
      name: 'Street Food Corner',
      type: 'streetfood' as const,
      priceRange: '₹',
      rating: 4.5,
      cuisine: 'Indian Street Food',
      location: 'Jaipur',
      recommendedItems: ['Chaat', 'Samosa', 'Jalebi'],
      image: 'https://images.unsplash.com/photo-1603043283882-f0c63bae66f3?w=300',
      isVeg: true
    },
    {
      id: '3',
      name: 'The Mughal Kitchen',
      type: 'restaurant' as const,
      priceRange: '₹₹₹',
      rating: 4.8,
      cuisine: 'Mughlai',
      location: 'Delhi',
      recommendedItems: ['Butter Chicken', 'Biryani', 'Naan'],
      image: 'https://images.unsplash.com/photo-1585238341710-4dd0bd180d8d?w=300',
      isVeg: false
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">🌍 Travel Essentials</h1>
          <p className="text-blue-100">Everything you need for your perfect journey</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <div className="flex gap-2 mb-6 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('transport')}
            className={`px-6 py-3 font-semibold border-b-4 transition ${
              activeTab === 'transport'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-blue-600'
            }`}
          >
            🚗 Transport
          </button>
          <button
            onClick={() => setActiveTab('stay')}
            className={`px-6 py-3 font-semibold border-b-4 transition ${
              activeTab === 'stay'
                ? 'text-green-600 border-green-600'
                : 'text-gray-600 border-transparent hover:text-green-600'
            }`}
          >
            🏨 Stay
          </button>
          <button
            onClick={() => setActiveTab('food')}
            className={`px-6 py-3 font-semibold border-b-4 transition ${
              activeTab === 'food'
                ? 'text-orange-600 border-orange-600'
                : 'text-gray-600 border-transparent hover:text-orange-600'
            }`}
          >
            🍽️ Food
          </button>
        </div>

        {/* Filter Bar */}
        <FilterBar activeTab={activeTab} onFilterChange={() => {}} />

        {/* Content */}
        <div className="mb-12">
          {activeTab === 'transport' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Find Your Transport</h2>
              <div className="space-y-4">
                {transportData.map(transport => (
                  <TransportCard key={transport.id} {...transport} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stay' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Find Your Stay</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stayData.map(stay => (
                  <StayCard key={stay.id} {...stay} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'food' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Discover Local Food</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {foodData.map(food => (
                  <FoodCard key={food.id} {...food} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Additional Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-2">✅</div>
            <h3 className="text-lg font-semibold mb-2">Best Prices</h3>
            <p className="text-gray-600 text-sm">Get the best deals on transport, stays, and food across India</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="text-lg font-semibold mb-2">Top Rated</h3>
            <p className="text-gray-600 text-sm">All options are verified and rated by real travelers like you</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Easy Booking</h3>
            <p className="text-gray-600 text-sm">Quick and hassle-free booking with 24/7 customer support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelEssentials;
