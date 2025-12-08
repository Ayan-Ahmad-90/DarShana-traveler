import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Phone, MapPin, Shield, Heart, 
  Siren, Share2, Battery, 
  Compass, Stethoscope, X
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  lat: number;
  lng: number;
}

interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [activeTab, setActiveTab] = useState<'emergency' | 'women' | 'forest' | 'medical'>('emergency');
  const [compassHeading, setCompassHeading] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  // Mock Emergency Contacts
  const contacts: EmergencyContact[] = [
    { name: "Mom", phone: "+919876543210", relation: "Parent" },
    { name: "Dad", phone: "+919876543211", relation: "Parent" },
    { name: "Brother", phone: "+919876543212", relation: "Sibling" }
  ];

  useEffect(() => {
    if (!isOpen) return;

    // Get initial location
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    // Battery Status
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }

    // Compass
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha) {
        setCompassHeading(event.alpha);
      }
    };
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isOpen]);

  const handleSOSClick = () => {
    setIsSOSActive(true);
    let count = 5;
    setSosCountdown(count);
    
    const timer = setInterval(() => {
      count--;
      setSosCountdown(count);
      if (count === 0) {
        clearInterval(timer);
        triggerEmergencyProtocol();
      }
    }, 1000);
  };

  const cancelSOS = () => {
    setIsSOSActive(false);
    setSosCountdown(5);
  };

  const triggerEmergencyProtocol = async () => {
    // 1. Call Emergency Number
    window.location.href = "tel:112";

    // 2. Share Location via Web Share API
    if (navigator.share && location) {
      try {
        await navigator.share({
          title: 'EMERGENCY SOS',
          text: `I need help! My current location is: https://www.google.com/maps?q=${location.lat},${location.lng}`,
          url: `https://www.google.com/maps?q=${location.lat},${location.lng}`
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const handleFakeCall = () => {
    alert("Fake Call Initiated... (Ring Ring)");
  };

  const shareLiveLocation = async () => {
    if (!location) return;
    const shareUrl = `${window.location.origin}/track/user-123`;
    if (navigator.share) {
      await navigator.share({
        title: 'Track My Live Location',
        text: 'I am sharing my live location with you for safety.',
        url: shareUrl
      });
    } else {
      alert(`Link copied: ${shareUrl}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-gray-900 text-white w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto border border-gray-700">
              
              {/* Header */}
              <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
                <h1 className="text-xl font-bold flex items-center gap-2 text-red-500">
                  <Shield className="w-6 h-6" /> Safety Dashboard
                </h1>
                <div className="flex items-center gap-3">
                  {batteryLevel && (
                    <span className={`flex items-center gap-1 text-xs ${batteryLevel < 20 ? 'text-red-500' : 'text-green-500'}`}>
                      <Battery className="w-3 h-3" /> {batteryLevel}%
                    </span>
                  )}
                  <button 
                    onClick={onClose}
                    className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-4 space-y-6 custom-scrollbar">
                
                {/* Big SOS Button */}
                <div className="flex justify-center py-4">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSOSClick}
                    className="w-40 h-40 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_40px_rgba(239,68,68,0.4)] flex flex-col items-center justify-center border-4 border-red-400 animate-pulse"
                  >
                    <Siren className="w-14 h-14 text-white mb-1" />
                    <span className="text-2xl font-black text-white tracking-wider">SOS</span>
                    <span className="text-[10px] text-red-100 mt-1">TAP FOR HELP</span>
                  </motion.button>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => window.location.href = "tel:100"} className="bg-gray-800 p-3 rounded-xl flex flex-col items-center gap-2 hover:bg-gray-700 transition-colors border border-gray-700">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm">Police (100)</span>
                  </button>
                  <button onClick={() => window.location.href = "tel:102"} className="bg-gray-800 p-3 rounded-xl flex flex-col items-center gap-2 hover:bg-gray-700 transition-colors border border-gray-700">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                      <Heart className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm">Ambulance</span>
                  </button>
                  <button onClick={shareLiveLocation} className="bg-gray-800 p-3 rounded-xl flex flex-col items-center gap-2 hover:bg-gray-700 transition-colors border border-gray-700">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm">Share Loc</span>
                  </button>
                  <button onClick={handleFakeCall} className="bg-gray-800 p-3 rounded-xl flex flex-col items-center gap-2 hover:bg-gray-700 transition-colors border border-gray-700">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-sm">Fake Call</span>
                  </button>
                </div>

                {/* Feature Tabs */}
                <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                  {['emergency', 'women', 'forest', 'medical'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-medium transition-colors ${
                        activeTab === tab 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="bg-gray-800/50 rounded-xl p-4 min-h-[200px] border border-gray-700">
                  {activeTab === 'emergency' && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold flex items-center gap-2 text-gray-300">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" /> Emergency Contacts
                      </h3>
                      <div className="space-y-2">
                        {contacts.map((contact, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-700/50 p-2 rounded-lg border border-gray-600/50">
                            <div>
                              <div className="font-medium text-sm">{contact.name}</div>
                              <div className="text-[10px] text-gray-400">{contact.relation}</div>
                            </div>
                            <a href={`tel:${contact.phone}`} className="bg-green-600 p-1.5 rounded-full hover:bg-green-500">
                              <Phone className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'women' && (
                    <div className="space-y-3">
                      <div className="bg-pink-500/10 border border-pink-500/30 p-3 rounded-lg">
                        <h3 className="text-pink-400 font-bold text-sm mb-1">Safe Zone Alert</h3>
                        <p className="text-xs text-gray-300 mb-2">Alert nearby verified volunteers.</p>
                        <button className="w-full bg-pink-600 hover:bg-pink-500 py-1.5 rounded text-sm font-medium transition-colors">
                          Trigger Silent Alert
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'forest' && (
                    <div className="space-y-3">
                      <div className="h-40 bg-gray-900 rounded-lg overflow-hidden relative border border-gray-700">
                        {location ? (
                          <MapContainer 
                            key={`${location.lat}-${location.lng}`}
                            center={[location.lat, location.lng]} 
                            zoom={13} 
                            style={{ height: '100%', width: '100%' }}
                          >
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; OpenStreetMap contributors'
                            />
                            <Marker position={[location.lat, location.lng]}>
                              <Popup>You are here</Popup>
                            </Marker>
                          </MapContainer>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                            Loading Map...
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center bg-gray-700/50 p-2 rounded-lg border border-gray-600/50">
                        <div className="flex items-center gap-2 text-sm">
                          <Compass className="w-4 h-4 text-blue-400" />
                          <span>Heading</span>
                        </div>
                        <span className="font-mono text-lg">{Math.round(compassHeading)}°</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'medical' && (
                    <div className="space-y-3">
                      <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                        <h3 className="text-red-400 font-bold text-sm mb-2 flex items-center gap-2">
                          <Stethoscope className="w-4 h-4" /> Medical ID
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-gray-400 block">Blood Group</span>
                            <span className="font-bold">O+</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block">Allergies</span>
                            <span className="font-bold">Penicillin</span>
                          </div>
                        </div>
                      </div>
                      <button className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                        <MapPin className="w-4 h-4" /> Find Hospital
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* SOS Overlay (Full Screen) */}
          <AnimatePresence>
            {isSOSActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] bg-red-900/95 backdrop-blur-md flex flex-col items-center justify-center p-6"
              >
                <div className="text-3xl font-bold mb-8 animate-pulse text-white">SENDING SOS IN</div>
                <div className="text-9xl font-black mb-12 text-white">{sosCountdown}</div>
                <button 
                  onClick={cancelSOS}
                  className="bg-white text-red-600 px-12 py-4 rounded-full text-xl font-bold shadow-xl hover:scale-105 transition-transform"
                >
                  CANCEL
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default SafetyModal;
