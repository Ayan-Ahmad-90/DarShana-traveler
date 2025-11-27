import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MapPin, Calendar, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { festivalApi } from '../services/api';

interface Festival {
  _id: string;
  name: string;
  region: string;
  date: string;
  description: string;
  subscribers: string[];
}

const FestivalAlerts: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [subscribedFestivals, setSubscribedFestivals] = useState<string[]>([]);

  const regions = [
    'North India',
    'South India',
    'East India',
    'West India',
    'Central India',
    'North-East India'
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchFestivals();
  }, [isAuthenticated, navigate, selectedRegion]);

  const fetchFestivals = async () => {
    setIsLoading(true);
    const response = await festivalApi.getAlerts(selectedRegion);
    if (response.success && response.data) {
      const data = response.data as any;
      setFestivals(data.alerts || []);
    } else {
      setError((response as any).error || 'Failed to fetch festivals');
    }
    setIsLoading(false);
  };

  const handleSubscribe = async (festival: Festival) => {
    const response = await festivalApi.subscribeToFestival(festival._id, selectedRegion);
    if (response.success) {
      setSubscribedFestivals([...subscribedFestivals, festival._id]);
    } else {
      setError((response as any).error || 'Failed to subscribe');
    }
  };

  const handleUnsubscribe = async (festival: Festival) => {
    const response = await festivalApi.unsubscribeFromFestival(festival._id);
    if (response.success) {
      setSubscribedFestivals(subscribedFestivals.filter(id => id !== festival._id));
    } else {
      setError((response as any).error || 'Failed to unsubscribe');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <Loader size={40} className="animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Festival Alerts</h1>
          <p className="text-gray-600">Subscribe to festival notifications in your region</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Region Filter */}
        <div className="mb-8 bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Select Region</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedRegion('')}
              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                selectedRegion === ''
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  selectedRegion === region
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Festivals List */}
        {festivals.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600">No festivals found</p>
            <p className="text-sm text-gray-500 mt-2">Try selecting a different region</p>
          </div>
        ) : (
          <div className="space-y-4">
            {festivals.map((festival) => {
              const isSubscribed = subscribedFestivals.includes(festival._id);
              return (
                <div
                  key={festival._id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{festival.name}</h3>
                      <p className="text-gray-600 mb-4">{festival.description}</p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={18} className="text-purple-600" />
                          <span className="text-gray-700">{festival.region}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={18} className="text-purple-600" />
                          <span className="text-gray-700">
                            {new Date(festival.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (isSubscribed) {
                          handleUnsubscribe(festival);
                        } else {
                          handleSubscribe(festival);
                        }
                      }}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                        isSubscribed
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      <Bell size={18} />
                      {isSubscribed ? 'Subscribed' : 'Subscribe'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FestivalAlerts;
