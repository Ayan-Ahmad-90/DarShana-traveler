import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  DollarSign,
  Users,
  Star,
  Clock,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Edit,
  LogOut,
} from 'lucide-react';
import { GuideRequest, LocalGuide, GuideStats } from '../../types';

const GuideDashboard: React.FC = () => {
  const [guide, setGuide] = useState<LocalGuide | null>(null);
  const [stats, setStats] = useState<GuideStats | null>(null);
  const [requests, setRequests] = useState<GuideRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'profile' | 'earnings'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuideData();
  }, []);

  const fetchGuideData = async () => {
    try {
      const token = localStorage.getItem('authToken');

      // Fetch guide profile
      const guideRes = await fetch('/api/guides/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (guideRes.ok) {
        setGuide(await guideRes.json());
      }

      // Fetch stats
      const statsRes = await fetch('/api/guides/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }

      // Fetch requests
      const requestsRes = await fetch('/api/guides/requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (requestsRes.ok) {
        setRequests(await requestsRes.json());
      }
    } catch (error) {
      console.error('Failed to fetch guide data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/guide-requests/${requestId}/accept`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId ? { ...r, status: 'accepted' } : r
          )
        );
      }
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/guide-requests/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId ? { ...r, status: 'rejected' } : r
          )
        );
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <BarChart3 size={48} className="text-teal-600" />
        </div>
      </div>
    );
  }

  // Overview Tab
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-stone-600 text-sm font-medium">Total Requests</p>
              <p className="text-3xl font-bold text-stone-900 mt-2">
                {stats?.totalRequests || 0}
              </p>
            </div>
            <Users size={32} className="text-blue-600 opacity-20" />
          </div>
          <p className="text-sm text-blue-600 mt-2">
            {stats?.acceptedRequests || 0} accepted
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-stone-600 text-sm font-medium">Completed Trips</p>
              <p className="text-3xl font-bold text-stone-900 mt-2">
                {stats?.completedTrips || 0}
              </p>
            </div>
            <CheckCircle size={32} className="text-green-600 opacity-20" />
          </div>
          <p className="text-sm text-green-600 mt-2">
            {stats?.responseRate || 0}% response rate
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-stone-600 text-sm font-medium">Total Earnings</p>
              <p className="text-3xl font-bold text-stone-900 mt-2">
                ₹{(stats?.totalEarnings || 0).toLocaleString()}
              </p>
            </div>
            <DollarSign size={32} className="text-yellow-600 opacity-20" />
          </div>
          <p className="text-sm text-yellow-600 mt-2">This month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-stone-600 text-sm font-medium">Rating</p>
              <div className="flex items-center mt-2">
                <p className="text-3xl font-bold text-stone-900">
                  {stats?.rating || 0}
                </p>
                <Star size={24} className="text-yellow-500 fill-yellow-500 ml-2" />
              </div>
            </div>
            <TrendingUp size={32} className="text-purple-600 opacity-20" />
          </div>
          <p className="text-sm text-purple-600 mt-2">
            {stats?.reviewCount || 0} reviews
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
          <h3 className="font-semibold text-teal-900 mb-2 flex items-center gap-2">
            <Clock size={18} />
            Response Time
          </h3>
          <p className="text-2xl font-bold text-teal-700">
            {guide?.responseTime || '1 hour'}
          </p>
          <p className="text-sm text-teal-600 mt-2">Average response time</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <DollarSign size={18} />
            Daily Rate
          </h3>
          <p className="text-2xl font-bold text-blue-700">
            ₹{guide?.pricePerDay || 0}
          </p>
          <p className="text-sm text-blue-600 mt-2">Per day</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
            <TrendingUp size={18} />
            Total Trips
          </h3>
          <p className="text-2xl font-bold text-green-700">
            {guide?.totalTrips || 0}
          </p>
          <p className="text-sm text-green-600 mt-2">Guided successfully</p>
        </div>
      </div>

      {/* Earnings Chart Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-stone-900 mb-4">Earnings This Month</h3>
        <div className="h-64 bg-gradient-to-b from-teal-50 to-stone-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 size={48} className="text-stone-300 mx-auto mb-2" />
            <p className="text-stone-500">Earnings chart loading...</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Requests Tab
  const renderRequests = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-stone-900">Recent Requests</h2>
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
          Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="bg-stone-50 rounded-lg p-12 text-center border-2 border-dashed border-stone-300">
          <MessageSquare size={48} className="mx-auto text-stone-300 mb-3" />
          <p className="text-stone-600 font-medium">No requests yet</p>
          <p className="text-stone-500 text-sm">
            When travelers request your services, they'll appear here
          </p>
        </div>
      ) : (
        requests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-stone-600 text-sm">Traveler Email</p>
                <p className="font-semibold text-stone-900">{request.userId}</p>
              </div>

              <div>
                <p className="text-stone-600 text-sm">Destination</p>
                <p className="font-semibold text-stone-900">
                  {request.destination || 'Not specified'}
                </p>
              </div>

              <div>
                <p className="text-stone-600 text-sm">Trip Dates</p>
                <p className="font-semibold text-stone-900">
                  {request.startDate
                    ? `${new Date(request.startDate).toLocaleDateString()} - ${new Date(
                        request.endDate!
                      ).toLocaleDateString()}`
                    : 'TBD'}
                </p>
              </div>

              <div>
                <p className="text-stone-600 text-sm">Travelers</p>
                <p className="font-semibold text-stone-900">{request.travelers || 1}</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
              <p className="text-stone-600 text-sm font-medium mb-1">Message</p>
              <p className="text-stone-800">{request.message}</p>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  request.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : request.status === 'accepted'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>

              {request.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <AlertCircle size={18} />
                    Decline
                  </button>
                </div>
              )}
            </div>

            <p className="text-stone-500 text-xs mt-3">
              Received: {new Date(request.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );

  // Profile Tab
  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-stone-900">Your Profile</h2>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2">
            <Edit size={18} />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-stone-600 text-sm">Full Name</p>
            <p className="font-semibold text-stone-900 mt-1">{guide?.name}</p>
          </div>

          <div>
            <p className="text-stone-600 text-sm">Email</p>
            <p className="font-semibold text-stone-900 mt-1">{guide?.email}</p>
          </div>

          <div>
            <p className="text-stone-600 text-sm">Phone</p>
            <p className="font-semibold text-stone-900 mt-1">{guide?.phone}</p>
          </div>

          <div>
            <p className="text-stone-600 text-sm">Primary Location</p>
            <p className="font-semibold text-stone-900 mt-1">{guide?.location}</p>
          </div>

          <div>
            <p className="text-stone-600 text-sm">Experience</p>
            <p className="font-semibold text-stone-900 mt-1">
              {guide?.experience || 'N/A'} years
            </p>
          </div>

          <div>
            <p className="text-stone-600 text-sm">Verification Status</p>
            <p className="font-semibold text-stone-900 mt-1">
              {guide?.verified ? (
                <span className="text-green-600 flex items-center gap-2">
                  <CheckCircle size={18} />
                  Verified
                </span>
              ) : (
                <span className="text-yellow-600 flex items-center gap-2">
                  <AlertCircle size={18} />
                  Pending Verification
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-stone-200">
          <p className="text-stone-600 text-sm mb-2">Bio</p>
          <p className="text-stone-800">{guide?.bio}</p>
        </div>

        <div className="mt-6 pt-6 border-t border-stone-200">
          <p className="text-stone-600 text-sm mb-3">Specialties</p>
          <div className="flex flex-wrap gap-2">
            {guide?.specialties.map((specialty) => (
              <span
                key={specialty}
                className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-stone-200">
          <p className="text-stone-600 text-sm mb-3">Languages</p>
          <div className="flex flex-wrap gap-2">
            {guide?.languages.map((language) => (
              <span
                key={language}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Earnings Tab
  const renderEarnings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <p className="text-green-600 text-sm font-medium">Total Earnings</p>
          <p className="text-3xl font-bold text-green-900 mt-2">
            ₹{(stats?.totalEarnings || 0).toLocaleString()}
          </p>
          <p className="text-sm text-green-700 mt-2">All time</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">This Month</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">
            ₹{((stats?.totalEarnings || 0) / 3).toLocaleString()}
          </p>
          <p className="text-sm text-blue-700 mt-2">Estimated</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <p className="text-purple-600 text-sm font-medium">Average Per Trip</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">
            ₹{stats?.completedTrips ? Math.round((stats.totalEarnings || 0) / stats.completedTrips) : 0}
          </p>
          <p className="text-sm text-purple-700 mt-2">{stats?.completedTrips || 0} trips</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-stone-900 mb-4">Payment Method</h3>
        <div className="space-y-4">
          <div className="p-4 border-2 border-teal-200 bg-teal-50 rounded-lg">
            <p className="font-semibold text-stone-900">Bank Account</p>
            <p className="text-stone-600 text-sm mt-2">XXX XXX 12345</p>
            <button className="text-teal-600 hover:text-teal-700 text-sm font-medium mt-2">
              Update Payment Method
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-stone-900 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {[
            { date: 'Nov 24, 2025', amount: 5000, trip: 'Goa Beach Tour' },
            { date: 'Nov 20, 2025', amount: 3500, trip: 'Kerala Backwater Tour' },
            { date: 'Nov 15, 2025', amount: 4200, trip: 'Rajasthan Desert Safari' },
          ].map((transaction, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center p-4 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <div>
                <p className="font-semibold text-stone-900">{transaction.trip}</p>
                <p className="text-stone-600 text-sm">{transaction.date}</p>
              </div>
              <p className="font-bold text-green-600 text-lg">
                +₹{transaction.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Guide Dashboard</h1>
              <p className="text-stone-600 mt-1">Welcome back, {guide?.name}!</p>
            </div>
            <button className="px-4 py-2 text-stone-700 hover:text-stone-900 flex items-center gap-2">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6 border-b border-stone-200">
          <div className="flex gap-0">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'requests', label: 'Requests', icon: MessageSquare },
              { id: 'profile', label: 'Profile', icon: Users },
              { id: 'earnings', label: 'Earnings', icon: DollarSign },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() =>
                  setActiveTab(id as 'overview' | 'requests' | 'profile' | 'earnings')
                }
                className={`flex-1 px-4 py-4 font-medium flex items-center justify-center gap-2 transition-colors border-b-2 ${
                  activeTab === id
                    ? 'text-teal-600 border-teal-600 bg-teal-50'
                    : 'text-stone-600 border-transparent hover:text-stone-900'
                }`}
              >
                <Icon size={20} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'requests' && renderRequests()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'earnings' && renderEarnings()}
        </div>
      </div>
    </div>
  );
};

export default GuideDashboard;
