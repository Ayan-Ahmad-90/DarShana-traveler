import { useState } from 'react';
import { Calendar, Utensils, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Festival {
  _id: string;
  name: string;
  location: string;
  month: number;
  description: string;
  imageUrl: string;
}

interface Sightseeing {
  _id: string;
  name: string;
  location: string;
  category: string;
  rating: number;
  entryFee: number;
  imageUrl: string;
}

interface BudgetOption {
  _id: string;
  name: string;
  category: string;
  priceRange: { min: number; max: number };
  rating: number;
}

const TripPlannerWithSuggestions = () => {
  const { isAuthenticated } = useAuth();
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSuggestions = async () => {
    if (!location) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `http://localhost:3001/api/suggestions/complete?month=${month}&location=${location}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.suggestions);
      } else {
        setError('Failed to fetch suggestions');
      }
    } catch (err) {
      setError('Error fetching suggestions');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Please login to plan your trip</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Plan Your Perfect Trip</h1>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select 
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter destination"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchSuggestions}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="animate-spin" size={20} /> : 'Get Suggestions'}
              </button>
            </div>
          </div>
          {error && (
            <div className="flex gap-2 text-red-600">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}
        </div>

        {suggestions && (
          <div className="space-y-8">
            {/* Festivals */}
            {suggestions.festivals && suggestions.festivals.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={28} className="text-yellow-500" />
                  Festivals in {location}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestions.festivals.map((festival: Festival) => (
                    <div key={festival._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                      {festival.imageUrl && <img src={festival.imageUrl} alt={festival.name} className="w-full h-40 object-cover rounded-lg mb-3" />}
                      <h3 className="text-lg font-bold text-gray-900">{festival.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{festival.description}</p>
                      <p className="text-blue-600 font-semibold">{new Date(2024, festival.month - 1).toLocaleString('default', { month: 'long' })}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sightseeing */}
            {suggestions.sightseeing && suggestions.sightseeing.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  📍
                  Must-See Sightseeing
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestions.sightseeing.map((sight: Sightseeing) => (
                    <div key={sight._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                      {sight.imageUrl && <img src={sight.imageUrl} alt={sight.name} className="w-full h-40 object-cover rounded-lg mb-3" />}
                      <h3 className="text-lg font-bold text-gray-900">{sight.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-yellow-500">★ {sight.rating}</span>
                        <span className="text-green-600 font-semibold">₹{sight.entryFee}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{sight.category}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Budget Options */}
            {suggestions.budgetOptions && suggestions.budgetOptions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Utensils size={28} className="text-green-500" />
                  Budget-Friendly Options
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestions.budgetOptions.map((option: BudgetOption) => (
                    <div key={option._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                      <h3 className="text-lg font-bold text-gray-900">{option.name}</h3>
                      <p className="text-gray-600 text-sm mb-2 capitalize">{option.category}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-500">★ {option.rating}</span>
                        <span className="text-green-600 font-semibold">₹{option.priceRange.min}-{option.priceRange.max}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPlannerWithSuggestions;
