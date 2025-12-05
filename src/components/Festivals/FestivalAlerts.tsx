import { Bell, Calendar, MapPin, Thermometer, Wind, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { Festival, Notification } from '../../types';

const FestivalAlerts: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [weatherById, setWeatherById] = useState<Record<string, { temp: number; wind: number; label: string }>>({});
  const [mapQuery, setMapQuery] = useState('India festivals');

  useEffect(() => {
    fetchNotifications();
    fetchFestivals();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchFestivals = async () => {
    try {
      const response = await fetch('/api/festivals', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      setFestivals(data);
      if (Array.isArray(data) && data.length) {
        const firstUpcoming = data.find((f: Festival) => new Date(f.startDate) > new Date());
        setMapQuery(firstUpcoming?.location || firstUpcoming?.name || data[0].location || 'India festivals');
        hydrateWeather(data);
      }
    } catch (error) {
      console.error('Failed to fetch festivals:', error);
      // Mock data
      const mockFestivals: Festival[] = [
        {
          id: '1',
          name: 'Diwali',
          location: 'Across India',
          startDate: new Date('2024-11-01'),
          endDate: new Date('2024-11-02'),
          description: 'Festival of Lights - the most celebrated festival in India',
          image: 'https://via.placeholder.com/300x200',
          significance: 'Celebrates the victory of light over darkness',
        },
        {
          id: '2',
          name: 'Holi',
          location: 'Mathura, Uttar Pradesh',
          startDate: new Date('2025-03-14'),
          endDate: new Date('2025-03-15'),
          description: 'Festival of Colors - spread happiness and colors',
          image: 'https://via.placeholder.com/300x200',
          significance: 'Spring festival celebrating new beginnings',
        },
        {
          id: '3',
          name: 'Onam',
          location: 'Kerala',
          startDate: new Date('2025-08-29'),
          endDate: new Date('2025-09-12'),
          description: 'Harvest festival with beautiful boat races and flower carpets',
          image: 'https://via.placeholder.com/300x200',
          significance: 'Celebrates the homecoming of King Mahabali',
        },
        {
          id: '4',
          name: 'Pushkar Camel Fair',
          location: 'Pushkar, Rajasthan',
          startDate: new Date('2025-10-28'),
          endDate: new Date('2025-11-11'),
          description: 'Largest camel fair with cultural performances and trading',
          image: 'https://via.placeholder.com/300x200',
          significance: 'One of the most colorful festivals of India',
        },
        {
          id: '5',
          name: 'Hornbill Festival',
          location: 'Nagaland',
          startDate: new Date('2024-12-01'),
          endDate: new Date('2024-12-10'),
          description: 'Celebrates the tribal culture of Nagaland',
          image: 'https://via.placeholder.com/300x200',
          significance: 'Northeast India\'s most vibrant cultural festival',
        },
        {
          id: '6',
          name: 'Biju Patnaik Jatra',
          location: 'Odisha',
          startDate: new Date('2025-01-15'),
          endDate: new Date('2025-01-25'),
          description: 'Religious fair with temple visits and celebrations',
          image: 'https://via.placeholder.com/300x200',
          significance: 'Ancient festival with spiritual significance',
        },
      ];
      setFestivals(mockFestivals);
      hydrateWeather(mockFestivals);
      setMapQuery(mockFestivals[0]?.location || 'India festivals');
    }
  };

  const coordsByRegion: Record<string, { lat: number; lon: number }> = {
    india: { lat: 20.5937, lon: 78.9629 },
    delhi: { lat: 28.6139, lon: 77.209 },
    mathura: { lat: 27.4924, lon: 77.6737 },
    kerala: { lat: 10.8505, lon: 76.2711 },
    rajasthan: { lat: 26.9124, lon: 75.7873 },
    nagaland: { lat: 26.1584, lon: 94.5624 },
    odisha: { lat: 20.9517, lon: 85.0985 },
    goa: { lat: 15.2993, lon: 74.124 },
    kutch: { lat: 23.7337, lon: 69.8597 },
  };

  const pickCoords = (location: string) => {
    const key = location.toLowerCase();
    if (key.includes('mathura')) return coordsByRegion.mathura;
    if (key.includes('delhi')) return coordsByRegion.delhi;
    if (key.includes('kerala')) return coordsByRegion.kerala;
    if (key.includes('rajasthan') || key.includes('pushkar')) return coordsByRegion.rajasthan;
    if (key.includes('nagaland')) return coordsByRegion.nagaland;
    if (key.includes('odisha')) return coordsByRegion.odisha;
    if (key.includes('goa')) return coordsByRegion.goa;
    if (key.includes('kutch')) return coordsByRegion.kutch;
    return coordsByRegion.india;
  };

  const hydrateWeather = async (list: Festival[]) => {
    const slice = list.slice(0, 6); // limit requests
    const nextWeather: Record<string, { temp: number; wind: number; label: string }> = {};
    await Promise.all(
      slice.map(async (fest) => {
        try {
          const coords = pickCoords(fest.location || '');
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`
          );
          if (!res.ok) return;
          const data = await res.json();
          if (!data?.current_weather) return;
          nextWeather[fest.id] = {
            temp: data.current_weather.temperature,
            wind: data.current_weather.windspeed,
            label: `Updated ${new Date(data.current_weather.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          };
        } catch (err) {
          // ignore per-festival weather failures
        }
      })
    );
    if (Object.keys(nextWeather).length) {
      setWeatherById((prev) => ({ ...prev, ...nextWeather }));
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleSetReminder = async (festivalId: string, location: string) => {
    try {
      const response = await fetch('/api/festival-reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          festivalId,
          location,
        }),
      });

      if (response.ok) {
        alert('Reminder set! You will be notified about this festival.');
      }
    } catch (error) {
      console.error('Failed to set reminder:', error);
    }
  };

  const upcomingFestivals = festivals.filter(
    (f) => new Date(f.startDate) > new Date()
  );

  const pastFestivals = festivals.filter(
    (f) => new Date(f.startDate) <= new Date()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading festival alerts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 flex items-center">
              <Zap className="mr-3 text-orange-600" size={40} />
              Festival Alerts & Travel Notifications
            </h1>
            <p className="text-xl text-gray-600">
              Never miss out on festivals and special events happening near you
            </p>
          </div>
          <div className="relative">
            <Bell size={32} className="text-orange-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Map spotlight */}
        <div className="mb-10 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Location spotlight</p>
              <p className="text-sm font-semibold text-gray-800">{mapQuery}</p>
            </div>
            <span className="text-xs text-gray-500">Tap any festival card to update</span>
          </div>
          <iframe
            title={`Map of ${mapQuery}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
            className="w-full h-64 md:h-80"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Notifications Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Recent Alerts ({unreadCount})
              </h2>

              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border-l-4 cursor-pointer transition ${
                        notification.read
                          ? 'border-gray-300 bg-gray-50'
                          : 'border-blue-600 bg-blue-50'
                      }`}
                      onClick={() =>
                        !notification.read &&
                        markAsRead(notification.id)
                      }
                    >
                      <p className="font-semibold text-gray-800 text-sm">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-gray-600 space-y-2">
                  <p>No alerts yet.</p>
                  <p className="text-gray-500">Live alerts will appear here when your backend sends them.</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Upcoming Festivals */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calendar className="mr-3 text-orange-600" size={28} />
                Upcoming Festivals
              </h2>

              {upcomingFestivals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingFestivals.map((festival) => (
                    <div
                      key={festival.id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
                      onClick={() => setMapQuery(festival.location || festival.name)}
                    >
                      <img
                        src={festival.image}
                        alt={festival.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-800">
                            {festival.name}
                          </h3>
                          <span className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full">
                            Upcoming
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600 mb-3">
                          <MapPin size={16} className="mr-2" />
                          <span>{festival.location}</span>
                        </div>

                        <div className="flex items-center text-gray-600 mb-3">
                          <Calendar size={16} className="mr-2" />
                          <span>
                            {new Date(festival.startDate).toLocaleDateString()} -{' '}
                            {new Date(festival.endDate).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-3">{festival.description}</p>

                        <div className="rounded-lg overflow-hidden border border-gray-200 mb-4">
                          <iframe
                            title={`Map of ${festival.location}`}
                            src={`https://www.google.com/maps?q=${encodeURIComponent(festival.location)}&output=embed`}
                            className="w-full h-40"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>

                        {weatherById[festival.id] && (
                          <div className="flex items-center gap-4 text-sm text-gray-700 mb-3">
                            <div className="flex items-center gap-1">
                              <Thermometer size={16} className="text-orange-600" />
                              {Math.round(weatherById[festival.id].temp)}°C
                            </div>
                            <div className="flex items-center gap-1">
                              <Wind size={16} className="text-orange-600" />
                              {Math.round(weatherById[festival.id].wind)} km/h
                            </div>
                            <span className="text-xs text-gray-500">{weatherById[festival.id].label}</span>
                          </div>
                        )}

                        <p className="text-sm text-gray-600 mb-4">
                          <span className="font-semibold">Significance:</span>{' '}
                          {festival.significance}
                        </p>

                        <button
                          onClick={() =>
                            handleSetReminder(festival.id, festival.location)
                          }
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition"
                        >
                          Set Reminder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                  <Bell size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg">No upcoming festivals scheduled</p>
                </div>
              )}
            </div>

            {/* Past Festivals */}
            {pastFestivals.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Recent & Past Festivals
                </h2>

                <div className="space-y-3">
                  {pastFestivals.slice(0, 5).map((festival) => (
                    <div
                      key={festival.id}
                      className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {festival.name}
                        </h3>
                        <div className="text-sm text-gray-600 flex items-center mt-1">
                          <MapPin size={14} className="mr-1" />
                          {festival.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {new Date(festival.startDate).toLocaleDateString()}
                        </p>
                        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          Past
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Festival Tips */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Bell size={32} className="text-orange-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Smart Alerts</h3>
            <p className="text-gray-600 text-sm">
              Get customized alerts based on your location and interests
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <Calendar size={32} className="text-orange-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Plan Ahead</h3>
            <p className="text-gray-600 text-sm">
              Set reminders and plan your trips around major festivals
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <MapPin size={32} className="text-orange-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Explore</h3>
            <p className="text-gray-600 text-sm">
              Discover unique festivals across different regions of India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestivalAlerts;
