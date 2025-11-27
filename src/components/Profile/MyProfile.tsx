import React, { useState, useEffect } from 'react';
import { UserProfile, Trip, Destination } from '../types';
import { Edit2, Plus, Calendar, MapPin } from 'lucide-react';

const MyProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      setProfile(data);
      setEditFormData({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-600">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{profile.fullName}</h1>
                <p className="text-gray-600">Member since {new Date(profile.createdAt).getFullYear()}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Edit2 size={18} />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="space-y-4 border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.fullName}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, fullName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
              >
                Save Changes
              </button>
            </form>
          )}

          {/* Profile Info */}
          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-6">
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-gray-800 font-semibold">{profile.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="text-gray-800 font-semibold">{profile.phone}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Member Since</p>
                <p className="text-gray-800 font-semibold">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Trips */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Upcoming Trips</h2>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              <Plus size={18} />
              <span>New Trip</span>
            </button>
          </div>

          {profile.upcomingTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.upcomingTrips.map((trip) => (
                <div key={trip.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {trip.destination.name}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {trip.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>
                        {new Date(trip.startDate).toLocaleDateString()} -{' '}
                        {new Date(trip.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={16} />
                      <span>{trip.destination.country}</span>
                    </div>
                    <div className="text-gray-800 font-semibold">
                      ₹{trip.totalCost.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No upcoming trips yet.</p>
          )}
        </div>

        {/* Past Trips */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Past Trips</h2>

          {profile.pastTrips.length > 0 ? (
            <div className="space-y-3">
              {profile.pastTrips.map((trip) => (
                <div key={trip.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">{trip.destination.name}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(trip.startDate).toLocaleDateString()} -{' '}
                      {new Date(trip.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      ₹{trip.totalCost.toLocaleString()}
                    </p>
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No past trips yet.</p>
          )}
        </div>

        {/* Saved Destinations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Saved Destinations</h2>

          {profile.savedDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.savedDestinations.map((destination) => (
                <div key={destination.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800">{destination.name}</h3>
                    <p className="text-sm text-gray-600">{destination.country}</p>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {destination.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No saved destinations yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
