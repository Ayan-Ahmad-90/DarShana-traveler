import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Phone, MapPin, Shield, Heart, 
  Siren, Share2, Battery, Signal, 
  Compass, Mountain, Stethoscope, HelpCircle
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';

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

interface BatteryManager extends EventTarget {
  level: number;
}

interface NavigatorWithBattery extends Navigator {
  getBattery: () => Promise<BatteryManager>;
}

const SafetyDashboard: React.FC = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [activeTab, setActiveTab] = useState<'emergency' | 'women' | 'forest' | 'medical'>('emergency');
  const [compassHeading, setCompassHeading] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  // Emergency Contacts (Real Helplines + Mock Personal)
  const contacts: EmergencyContact[] = [
    { name: "National Emergency", phone: "112", relation: "All Services" },
    { name: "Police", phone: "100", relation: "Emergency" },
    { name: "Ambulance", phone: "108", relation: "Medical" },
    { name: "Women Helpline", phone: "1091", relation: "Support" },
    { name: "Cyber Crime", phone: "1930", relation: "Support" },
    { name: "Fire Service", phone: "101", relation: "Emergency" },
    { name: "Mom", phone: "+919876543210", relation: "Parent" },
    { name: "Dad", phone: "+919876543211", relation: "Parent" }
  ];

  useEffect(() => {
    // Get initial location
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );
    }

    // Battery Status
    if ('getBattery' in navigator) {
      (navigator as NavigatorWithBattery).getBattery().then((battery: BatteryManager) => {
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
  }, []);

  // Siren Effect Hook
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let oscillator: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;
    let lfo: OscillatorNode | null = null;
    let lfoGain: GainNode | null = null;

    if (isSOSActive) {
      try {
        // Initialize Audio Context
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new AudioContext();
        
        // Create Audio Nodes
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();
        lfo = audioCtx.createOscillator();
        lfoGain = audioCtx.createGain();

        // Configure Siren Sound (Sawtooth wave for harshness)
        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 880; // Base frequency (A5)

        // Configure LFO for the "Wailing" effect
        lfo.type = 'triangle';
        lfo.frequency.value = 2; // 2Hz wail speed
        lfoGain.gain.value = 200; // Frequency modulation depth

        // Connect the graph
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency); // Modulate pitch
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Set Volume to Maximum
        gainNode.gain.value = 1.0;

        // Start playing
        oscillator.start();
        lfo.start();

      } catch (e) {
        console.error("Siren playback failed:", e);
      }
    }

    // Cleanup function to stop sound
    return () => {
      // Cleanup operations may fail if resources are already disposed - this is safe to ignore
      if (oscillator) { try { oscillator.stop(); } catch { /* Already stopped */ } }
      if (lfo) { try { lfo.stop(); } catch { /* Already stopped */ } }
      if (audioCtx) { try { audioCtx.close(); } catch { /* Already closed */ } }
    };
  }, [isSOSActive]);

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

    // 3. Send to Backend
    try {
      await fetch('/api/safety/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'SOS',
          location,
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      console.error('Failed to log emergency:', err);
    }
  };

  const handleFakeCall = () => {
    // Simulate incoming call screen
    alert("Fake Call Initiated... (Ring Ring)");
  };

  const shareLiveLocation = async () => {
    if (!location) return;
    // In a real app, this would generate a unique link
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
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="bg-gray-800 p-4 sticky top-0 z-50 shadow-lg flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2 text-red-500">
          <Shield className="w-6 h-6" /> Safety Dashboard
        </h1>
        <div className="flex gap-3 text-sm items-center">
          <Link to="/safety-guide" className="flex items-center gap-1 text-gray-400 hover:text-white mr-2">
            <HelpCircle className="w-4 h-4" /> Guide
          </Link>
          {batteryLevel && (
            <span className={`flex items-center gap-1 ${batteryLevel < 20 ? 'text-red-500' : 'text-green-500'}`}>
              <Battery className="w-4 h-4" /> {batteryLevel}%
            </span>
          )}
          <span className="flex items-center gap-1 text-blue-400">
            <Signal className="w-4 h-4" /> GPS Active
          </span>
        </div>
      </div>

      {/* SOS Overlay */}
      <AnimatePresence>
        {isSOSActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-red-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6"
          >
            <div className="text-4xl font-bold mb-8 animate-pulse">SENDING SOS IN</div>
            <div className="text-9xl font-black mb-12">{sosCountdown}</div>
            <button 
              onClick={cancelSOS}
              className="bg-white text-red-600 px-12 py-4 rounded-full text-xl font-bold shadow-xl hover:scale-105 transition-transform"
            >
              CANCEL
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        
        {/* Big SOS Button */}
        <div className="flex justify-center py-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSOSClick}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_50px_rgba(239,68,68,0.5)] flex flex-col items-center justify-center border-4 border-red-400 animate-pulse"
          >
            <Siren className="w-16 h-16 text-white mb-2" />
            <span className="text-2xl font-black text-white tracking-wider">SOS</span>
            <span className="text-xs text-red-100 mt-1">TAP FOR HELP</span>
          </motion.button>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => window.location.href = "tel:112"} className="bg-gray-800 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Shield className="w-6 h-6" />
            </div>
            <span className="font-medium">Police (112)</span>
          </button>
          <button onClick={() => window.location.href = "tel:108"} className="bg-gray-800 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
              <Heart className="w-6 h-6" />
            </div>
            <span className="font-medium">Ambulance (108)</span>
          </button>
          <button onClick={shareLiveLocation} className="bg-gray-800 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="font-medium">Share Location</span>
          </button>
          <button onClick={handleFakeCall} className="bg-gray-800 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Phone className="w-6 h-6" />
            </div>
            <span className="font-medium">Fake Call</span>
          </button>
        </div>

        {/* Feature Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
          {['emergency', 'women', 'forest', 'medical'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'emergency' | 'women' | 'forest' | 'medical')}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Safety
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800 rounded-2xl p-4 min-h-[300px]">
          {activeTab === 'emergency' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <AlertTriangle className="text-yellow-500" /> Emergency Contacts
              </h3>
              <div className="space-y-2">
                {contacts.map((contact, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-xs text-gray-400">{contact.relation}</div>
                    </div>
                    <a href={`tel:${contact.phone}`} className="bg-green-600 p-2 rounded-full hover:bg-green-500">
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-600">
                + Add Emergency Contact
              </button>
            </div>
          )}

          {activeTab === 'women' && (
            <div className="space-y-4">
              <div className="bg-pink-500/10 border border-pink-500/30 p-4 rounded-xl">
                <h3 className="text-pink-400 font-bold mb-2">Safe Zone Alert</h3>
                <p className="text-sm text-gray-300 mb-3">Alert nearby verified volunteers and safe zones immediately.</p>
                <button className="w-full bg-pink-600 hover:bg-pink-500 py-2 rounded-lg font-medium transition-colors">
                  Trigger Silent Alert
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-xs text-gray-400">Safe Zones Nearby</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white">5 min</div>
                  <div className="text-xs text-gray-400">Avg Response Time</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'forest' && (
            <div className="space-y-4">
              <div className="h-48 bg-gray-900 rounded-xl overflow-hidden relative">
                {location ? (
                  <MapContainer 
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
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Loading Map...
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Compass className="text-blue-400" />
                  <span>Heading</span>
                </div>
                <span className="font-mono text-xl">{Math.round(compassHeading)}°</span>
              </div>
              <div className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mountain className="text-green-400" />
                  <span>Altitude</span>
                </div>
                <span className="font-mono text-xl">~450m</span>
              </div>
            </div>
          )}

          {activeTab === 'medical' && (
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
                <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" /> Medical ID
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400 block">Blood Group</span>
                    <span className="font-bold">O+</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Allergies</span>
                    <span className="font-bold">Penicillin</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 block">Medical Conditions</span>
                    <span className="font-bold">Asthma (Mild)</span>
                  </div>
                </div>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" /> Find Nearest Hospital
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                View eCPR Instructions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafetyDashboard;
