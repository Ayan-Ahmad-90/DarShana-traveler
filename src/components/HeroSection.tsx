import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sparkles } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1F] via-[#0F1627] to-[#121B33]"></div>

      {/* World Map Texture */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzlDOTlBMCIgZmlsbC1vcGFjaXR5PSIwLjA0Ij4KPHBhdGggZD0iTTM2IDE0YzAtMi4yMS0xLjc5LTQtNFM0MiAxMS43OSA0MiAxNHMtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDBjLTIuMjEgMC00IDEuNzktNCA0czEuNzkgNCA0IDQtNCAxLjc5LTQgNFMxMy43OSA0MiAxNiA0MnMxNCAxLjc5IDE0IDQtNCAxLjc5LTQgNFoiLz4KPC9nPgo8L2c+Cjwvc3ZnPg==')] bg-repeat opacity-20"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Spotlight Effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center space-x-2 mb-8 px-6 py-3 bg-gradient-to-r from-[#D4AF37]/20 to-[#FFD700]/20 backdrop-blur-xl border border-[#D4AF37]/30 rounded-full"
        >
          <Sparkles className="h-5 w-5 text-[#D4AF37]" />
          <span className="text-[#D4AF37] font-semibold tracking-wide">Premium Travel Experience</span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D4AF37]/10 to-[#FFD700]/10 blur opacity-50"></div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
        >
          Travel{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Hub
            </span>
            {/* Neon Glow Effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg blur-xl opacity-30 animate-pulse"></div>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-xl sm:text-2xl lg:text-3xl text-[#F5F9FF]/80 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
        >
          Compare routes, prices & transport options — all in one platform
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center space-x-3">
              <MapPin className="h-5 w-5" />
              <span>Start Planning</span>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-[#D4AF37]/50 text-[#D4AF37] font-bold text-lg rounded-2xl backdrop-blur-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <Sparkles className="h-5 w-5" />
              <span>Explore Premium</span>
            </div>
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{
          rotate: [360, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-32 left-16 w-12 h-12 bg-gradient-to-r from-[#D4AF37]/20 to-[#FFD700]/20 rounded-full blur-xl"
      />
    </section>
  );
};

export default HeroSection;