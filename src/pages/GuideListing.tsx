import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GuideCard from '../components/GuideCard';

interface Guide {
  _id: string;
  name: string;
  location: string;
  specialization: string[];
  languages: string[];
  rating: number;
  totalReviews: number;
  pricePerDay: number;
  bio: string;
  profileImage: string;
  verified: boolean;
}

const GuideListing = () => {
  const { isAuthenticated } = useAuth();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchGuides();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterGuides();
  }, [guides, searchLocation, selectedSpecialization]);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/guides/by-location?location=', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setGuides(data.guides || []);
      }
    } catch (err) {
      setError('Failed to fetch guides');
    } finally {
      setLoading(false);
    }
  };

  const filterGuides = () => {
    let filtered = guides;

    if (searchLocation.trim()) {
      filtered = filtered.filter(guide =>
        guide.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    if (selectedSpecialization) {
      filtered = filtered.filter(guide =>
        guide.specialization.includes(selectedSpecialization)
      );
    }

    setFilteredGuides(filtered);
  };

  if (!isAuthenticated) {
    return <div className="text-center py-12">Please login to browse guides</div>;
  }

  const specializations = ['historical', 'adventure', 'cultural', 'nature', 'religious', 'food', 'other'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">🧳 Discover Local Guides</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex gap-2">
            <AlertCircle className="text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search by Location</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="e.g., Delhi, Goa, Jaipur..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec} className="capitalize">
                    {spec.charAt(0).toUpperCase() + spec.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Results</label>
              <div className="px-4 py-2 bg-gray-100 rounded-lg">
                <p className="text-lg font-semibold text-gray-900">{filteredGuides.length} guides found</p>
              </div>
            </div>
          </div>
        </div>

        {/* Guides Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <Loader className="animate-spin text-purple-600" size={48} />
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-lg">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-2xl text-gray-600 mb-2">No guides found</p>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map(guide => (
              <GuideCard
                key={guide._id}
                guide={guide}
                onClick={() => setSelectedGuide(guide)}
              />
            ))}
          </div>
        )}

        {/* Guide Detail Modal */}
        {selectedGuide && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedGuide.name}</h2>
                    {selectedGuide.verified && (
                      <span className="text-green-600 text-sm font-semibold">✓ Verified Guide</span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedGuide(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin size={20} className="text-blue-600" />
                    <span className="text-lg">{selectedGuide.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={20} className="text-yellow-500" />
                    <span className="text-lg font-semibold">{selectedGuide.rating.toFixed(1)} ({selectedGuide.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">${selectedGuide.pricePerDay}</span>
                    <span className="text-gray-600">/day</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700">{selectedGuide.bio}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Specializations</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedGuide.specialization.map(spec => (
                        <span key={spec} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm capitalize">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedGuide.languages.map(lang => (
                        <span key={lang} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  onClick={() => setSelectedGuide(null)}
                >
                  Book This Guide
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideListing;
