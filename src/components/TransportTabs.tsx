import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Train, Ship, Car, MapPin } from 'lucide-react';

interface TransportTabsProps {
  selectedTransport: string;
  onSelectTransport: (transport: string) => void;
}

const TransportTabs: React.FC<TransportTabsProps> = ({ selectedTransport, onSelectTransport }) => {
  const transports = [
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'train', label: 'Train', icon: Train },
    { id: 'cruise', label: 'Cruise', icon: Ship },
    { id: 'car', label: 'Car', icon: Car },
    { id: 'taxi', label: 'Taxi', icon: MapPin },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-wrap justify-center gap-4 mb-12"
    >
      {transports.map((transport, index) => (
        <motion.button
          key={transport.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.4 }}
          whileHover={{
            y: -4,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectTransport(transport.id)}
          className={`relative group px-6 py-4 rounded-2xl border transition-all duration-200 bg-white/80 backdrop-blur-sm ${
            selectedTransport === transport.id
              ? 'border-[#06b6d4] shadow-lg shadow-cyan-100 text-[#0f172a]'
              : 'border-slate-200 text-slate-600 hover:border-[#06b6d4]/60'
          }`}
        >
          {/* 3D Floating Effect */}
          <div className="relative z-10 flex flex-col items-center space-y-3">
            <motion.div
              animate={selectedTransport === transport.id ? {
                y: [0, -3, 0],
                rotate: [0, 5, 0]
              } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <transport.icon
                size={28}
                className={`transition-all duration-300 ${
                  selectedTransport === transport.id
                    ? 'text-[#06b6d4] drop-shadow-sm'
                    : 'text-slate-500 group-hover:text-[#06b6d4]'
                }`}
              />

              {/* Icon Glow */}
              {selectedTransport === transport.id && (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.6 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-cyan-100 rounded-full blur-sm"
                />
              )}
            </motion.div>

            <span className={`text-sm font-semibold transition-all duration-300 ${
              selectedTransport === transport.id
                ? 'text-[#0f172a]'
                : 'text-slate-500 group-hover:text-[#0f172a]'
            }`}>
              {transport.label}
            </span>
          </div>

          {/* Active underline */}
          {selectedTransport === transport.id && (
            <motion.div
              layoutId="activeTransport"
              className="absolute inset-x-6 bottom-2 h-0.5 rounded-full bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9]"
            />
          )}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default TransportTabs;