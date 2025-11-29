import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane,
  Train,
  Ship,
  Bike,
  Car,
  Search,
  MapPin,
  Rocket,
  AlertCircle,
  Sparkles,
  Calendar,
  Users,
} from 'lucide-react';
import { flightApi, trainApi, transportApi } from '../services/api';

// ============= UTILITY FUNCTIONS =============

const useMouseTilt = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const rotationX = ((e.clientY - centerY) / (rect.height / 2)) * 8;
      const rotationY = ((e.clientX - centerX) / (rect.width / 2)) * -8;

      setRotation({ x: rotationX, y: rotationY });
    };

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref]);

  return rotation;
};

// ============= ANIMATED BACKGROUND =============

const BackgroundParallax: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-hero">
      {/* Animated gradient blobs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 100, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
      />
    </div>
  );
};

// ============= TRAVEL MODE TABS =============

interface TravelModesProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
  travelModes: Array<{ id: string; label: string; icon: React.ComponentType<any> }>;
}

const TravelModeTabs: React.FC<TravelModesProps> = ({ selectedMode, onSelectMode, travelModes }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12"
    >
      {travelModes.map(({ id, label, icon: Icon }) => (
        <motion.button
          key={id}
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectMode(id)}
          className={`relative py-4 px-3 rounded-2xl flex flex-col items-center gap-2 transition-all duration-300 backdrop-blur-sm border ${
            selectedMode === id
              ? 'border-teal-400 bg-gradient-to-br from-teal-500/30 to-teal-600/20 shadow-lg shadow-teal-500/50'
              : 'border-white/10 bg-white/5 hover:border-teal-400/50 hover:bg-white/10 shadow-sm'
          }`}
        >
          {selectedMode === id && (
            <motion.div
              layoutId="activeMode"
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-400/10 to-teal-600/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}

          <motion.div
            animate={selectedMode === id ? { y: [0, -5, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative z-10"
          >
            <Icon
              size={28}
              className={`transition-colors duration-300 ${
                selectedMode === id ? 'text-teal-300' : 'text-slate-400'
              }`}
            />
          </motion.div>

          <span
            className={`text-xs sm:text-sm font-medium relative z-10 transition-colors duration-300 ${
              selectedMode === id ? 'text-teal-200' : 'text-slate-300'
            }`}
          >
            {label}
          </span>

          {selectedMode === id && (
            <motion.div
              className="absolute bottom-1 left-1/2 w-1 h-1 bg-teal-300 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
      ))}
    </motion.div>
  );
};

// ============= SEARCH CARD =============

interface SearchCardProps {
  fromCity: string;
  toCity: string;
  travelDate: string;
  passengers: number;
  isLoading: boolean;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onPassengersChange: (value: number) => void;
  onSearch: () => void;
}

const SearchCard: React.FC<SearchCardProps> = ({
  fromCity,
  toCity,
  travelDate,
  passengers,
  isLoading,
  onFromChange,
  onToChange,
  onDateChange,
  onPassengersChange,
  onSearch,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="relative mb-12"
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 glass-card shadow-2xl" />

      {/* Animated gradient overlay */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))',
          backgroundSize: '200% 200%',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 md:p-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3 mb-8"
        >
          <Sparkles className="text-primary" size={24} />
          <h2 className="text-2xl font-bold text-white">Plan Your Journey</h2>
        </motion.div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* From City */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            className="group"
          >
            <label className="block text-sm font-medium text-teal-300 mb-2">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400 w-5 h-5" />
              <input
                type="text"
                value={fromCity}
                onChange={(e) => onFromChange(e.target.value)}
                placeholder="Departure city"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition-all duration-300 group-hover:border-white/30"
              />
            </div>
          </motion.div>

          {/* To City */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="group"
          >
            <label className="block text-sm font-medium text-teal-300 mb-2">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400 w-5 h-5" />
              <input
                type="text"
                value={toCity}
                onChange={(e) => onToChange(e.target.value)}
                placeholder="Destination city"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition-all duration-300 group-hover:border-white/30"
              />
            </div>
          </motion.div>

          {/* Date */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
            className="group"
          >
            <label className="block text-sm font-medium text-teal-300 mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400 w-5 h-5" />
              <input
                type="date"
                value={travelDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition-all duration-300 group-hover:border-white/30"
              />
            </div>
          </motion.div>

          {/* Passengers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="group"
          >
            <label className="block text-sm font-medium text-teal-300 mb-2">Passengers</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400 w-5 h-5" />
              <select
                value={passengers}
                onChange={(e) => onPassengersChange(parseInt(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition-all duration-300 group-hover:border-white/30"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num} className="bg-slate-900">
                    {num} {num === 1 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>

        {/* Search Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onSearch}
            disabled={isLoading}
            className="group relative px-8 py-3 btn-primary rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Content */}
            <div className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Search size={20} />
                  </motion.div>
                  Searching...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Search
                </>
              )}
            </div>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============= RESULT CARD WITH 3D TILT =============

interface ResultCardProps {
  result: any;
  index: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotation = useMouseTilt(cardRef);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      style={{
        rotateX: rotation.x,
        rotateY: rotation.y,
        perspective: 1200,
      }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 group-hover:border-teal-400/50 transition-all duration-300" />

      {/* Animated glow on hover */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10"
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="text-xl font-bold text-white mb-1"
            >
              {result.name || result.airline || result.provider || 'Travel Option'}
            </motion.h3>
            <p className="text-sm text-slate-300">
              {result.category || result.type || 'Premium Travel'}
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="text-teal-400"
          >
            <Sparkles size={24} />
          </motion.div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.25 }}
            className="space-y-1"
          >
            <p className="text-xs text-slate-400">Departure</p>
            <p className="text-sm font-semibold text-white">
              {result.departure || result.from || 'Not available'}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="space-y-1"
          >
            <p className="text-xs text-slate-400">Arrival</p>
            <p className="text-sm font-semibold text-white">
              {result.arrival || result.to || 'Not available'}
            </p>
          </motion.div>
        </div>

        {/* Duration & Price */}
        <div className="flex items-end justify-between pt-4 border-t border-white/10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.35 }}
            className="space-y-1"
          >
            <p className="text-xs text-slate-400">Duration</p>
            <p className="text-sm font-semibold text-teal-300">
              {result.duration || result.time || '5h 30m'}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-right space-y-1"
          >
            <p className="text-xs text-slate-400">Price</p>
            <p className="text-2xl font-bold text-teal-400">
              ₹{result.price || result.cost || '5,999'}
            </p>
          </motion.div>
        </div>

        {/* Book Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-4 py-2 px-4 btn-primary font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
        >
          Book Now
        </motion.button>
      </div>
    </motion.div>
  );
};

// ============= ERROR DISPLAY =============

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3"
  >
    <AlertCircle className="text-red-400" size={24} />
    <span className="text-red-100">{message}</span>
  </motion.div>
);

// ============= MAIN TRAVEL HUB COMPONENT =============

const TravelHub: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState('flight');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const travelModes = [
    { id: 'flight', label: 'Flights', icon: Plane },
    { id: 'train', label: 'Train', icon: Train },
    { id: 'cruise', label: 'Cruise', icon: Ship },
    { id: 'private', label: 'Jet', icon: Rocket },
    { id: 'cab', label: 'Taxi', icon: Car },
    { id: 'bike', label: 'Bike', icon: Bike },
  ];

  const handleSearch = async () => {
    setError('');
    setIsLoading(true);
    setHasSearched(true);

    if (!fromCity || !toCity || !travelDate) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      let response: any;

      switch (selectedMode) {
        case 'flight':
          response = await flightApi.search(fromCity, toCity, travelDate, passengers);
          break;
        case 'train':
          response = await trainApi.search(fromCity, toCity, travelDate, passengers);
          break;
        case 'cab':
          response = await transportApi.searchCabs(fromCity, toCity, travelDate);
          break;
        case 'cruise':
          response = await transportApi.searchCruises(fromCity, toCity, travelDate);
          break;
        case 'private':
          response = await transportApi.searchJets(fromCity, toCity, travelDate);
          break;
        case 'bike': {
          const endDate = new Date(travelDate);
          endDate.setDate(endDate.getDate() + 1);
          response = await transportApi.searchBikes(
            fromCity,
            toCity,
            travelDate,
            endDate.toISOString().split('T')[0]
          );
          break;
        }
        default:
          throw new Error('Invalid mode');
      }

      if (response.success && response.data) {
        setResults(response.data.data || response.data);
      } else {
        setError(response.error || 'No results found');
        setResults([]);
      }
    } catch (err: any) {
      setError(err.message || 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BackgroundParallax />

      <div className="relative z-10 min-h-screen pt-20 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-teal-500/20 border border-teal-500/50 rounded-full"
            >
              <Sparkles size={18} className="text-teal-400" />
              <span className="text-sm font-medium text-teal-300">Premium Travel Experience</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4">
              Travel <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Hub</span>
            </h1>

            <p className="text-xl text-slate-300">
              Compare routes, prices & transport options — all in one stunning platform
            </p>
          </motion.div>

          {/* Travel Mode Tabs */}
          <TravelModeTabs
            selectedMode={selectedMode}
            onSelectMode={setSelectedMode}
            travelModes={travelModes}
          />

          {/* Search Card */}
          <SearchCard
            fromCity={fromCity}
            toCity={toCity}
            travelDate={travelDate}
            passengers={passengers}
            isLoading={isLoading}
            onFromChange={setFromCity}
            onToChange={setToCity}
            onDateChange={setTravelDate}
            onPassengersChange={setPassengers}
            onSearch={handleSearch}
          />

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {error && <ErrorAlert message={error} />}

            {hasSearched && isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-64 bg-white/5 rounded-2xl border border-white/10 animate-pulse"
                  />
                ))}
              </motion.div>
            )}

            {hasSearched && !isLoading && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {results.map((result, index) => (
                  <ResultCard key={index} result={result} index={index} />
                ))}
              </motion.div>
            )}

            {hasSearched && !isLoading && results.length === 0 && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Plane className="mx-auto mb-4 text-teal-400/50" size={48} />
                <p className="text-xl text-slate-300">No results found. Try different filters!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default TravelHub;
