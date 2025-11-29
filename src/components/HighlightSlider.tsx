import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Calendar, Wind, Mountain } from 'lucide-react';

export interface HighlightItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  type: 'destination' | 'festival' | 'season' | 'experience';
  link?: string;
  color?: 'blue' | 'slate' | 'neutral' | 'accent' | 'light';
}

interface HighlightSliderProps {
  items?: HighlightItem[];
  onItemClick?: (item: HighlightItem) => void;
}

// Professional travel & tourism highlight data
const DEFAULT_ITEMS: HighlightItem[] = [
  {
    id: 'jaipur',
    title: 'Jaipur',
    description: 'Royal Pink City',
    badge: 'Must Visit',
    icon: <MapPin size={20} />,
    type: 'destination',
    link: '/destinations/jaipur',
    color: 'blue',
  },
  {
    id: 'kerala',
    title: 'Kerala',
    description: 'God\'s Own Country',
    badge: 'Paradise',
    icon: <Wind size={20} />,
    type: 'destination',
    link: '/destinations/kerala',
    color: 'slate',
  },
  {
    id: 'taj-mahal',
    title: 'Taj Mahal',
    description: 'Symbol of Love',
    badge: 'Heritage',
    icon: <Sparkles size={20} />,
    type: 'destination',
    link: '/destinations/agra',
    color: 'neutral',
  },
  {
    id: 'diwali',
    title: 'Diwali Festival',
    description: 'Festival of Lights',
    badge: 'Nov-Dec',
    icon: <Calendar size={20} />,
    type: 'festival',
    link: '/festivals/diwali',
    color: 'blue',
  },
  {
    id: 'manali',
    title: 'Manali',
    description: 'Mountain Adventure',
    badge: 'Popular',
    icon: <Mountain size={20} />,
    type: 'destination',
    link: '/destinations/manali',
    color: 'accent',
  },
  {
    id: 'goa',
    title: 'Goa',
    description: 'Beach Escape',
    badge: 'Relaxation',
    icon: <Wind size={20} />,
    type: 'destination',
    link: '/destinations/goa',
    color: 'slate',
  },
  {
    id: 'holi',
    title: 'Holi Festival',
    description: 'Colors of Joy',
    badge: 'Mar-Apr',
    icon: <Calendar size={20} />,
    type: 'festival',
    link: '/festivals/holi',
    color: 'neutral',
  },
  {
    id: 'shimla',
    title: 'Shimla',
    description: 'Hill Station Beauty',
    badge: 'Scenic',
    icon: <Mountain size={20} />,
    type: 'destination',
    link: '/destinations/shimla',
    color: 'light',
  },
  {
    id: 'varanasi',
    title: 'Varanasi',
    description: 'Spiritual Journey',
    badge: 'Sacred',
    icon: <Sparkles size={20} />,
    type: 'destination',
    link: '/destinations/varanasi',
    color: 'accent',
  },
];

const HighlightSlider: React.FC<HighlightSliderProps> = ({
  items = DEFAULT_ITEMS,
  onItemClick,
}) => {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);

  const handleItemClick = (item: HighlightItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
    if (item.link) {
      navigate(item.link);
    }
  };

  // Professional Light & Dark Color Palette
  const colorGradients: Record<string, string> = {
    blue: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',      // Professional Blue
    slate: 'linear-gradient(135deg, #334155 0%, #475569 100%)',     // Professional Slate
    neutral: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',   // Professional Neutral
    accent: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',    // Professional Dark
    light: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',     // Professional Light
  };

  const colorShadows: Record<string, string> = {
    blue: 'rgba(30, 64, 175, 0.3)',
    slate: 'rgba(51, 65, 85, 0.3)',
    neutral: 'rgba(30, 41, 59, 0.3)',
    accent: 'rgba(15, 23, 42, 0.3)',
    light: 'rgba(241, 245, 249, 0.3)',
  };

  // Triple items for seamless infinite loop
  const loopedItems = [...items, ...items, ...items];
  const animationDuration = items.length * 4;

  return (
    <div 
      className="w-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.98) 0%, rgba(241, 245, 249, 0.98) 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '2px solid rgba(51, 65, 85, 0.15)',
      }}
    >
      {/* Premium gradient overlay background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(30, 64, 175, 0.08), transparent 50%), radial-gradient(circle at 80% 50%, rgba(51, 65, 85, 0.08), transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Animated background elements */}
      <div 
        className="absolute top-0 left-0 w-full h-1 opacity-30"
        style={{
          background: 'linear-gradient(90deg, transparent, #EA580C, #A855F7, #3B82F6, transparent)',
        }}
      />

      {/* Main content container */}
      <div className="relative z-10 py-3 sm:py-4 px-3 sm:px-6 lg:px-8">
        {/* Header label */}
        <div className="mb-2 flex items-center gap-2 px-2">
          <div className="w-1 h-4 bg-gradient-to-b from-orange-500 to-orange-400 rounded-full" />
          <span className="text-xs font-bold tracking-widest uppercase text-orange-400">
            ✈️ Explore Destinations
          </span>
        </div>

        {/* Slider container */}
        <div 
          className="w-full overflow-hidden rounded-2xl px-1"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex gap-4 sm:gap-6 lg:gap-8 items-center py-1.5"
            style={{
              animation: isPaused
                ? 'none'
                : `smooth-flow ${animationDuration}s linear infinite`,
              willChange: 'transform',
            }}
          >
            {loopedItems.map((item, idx) => {
              const gradient = colorGradients[item.color || 'blue'];
              const shadowColor = colorShadows[item.color || 'blue'];

              return (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => handleItemClick(item)}
                  className="group relative flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl whitespace-nowrap flex-shrink-0 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent hover:scale-105 active:scale-95"
                  style={{
                    background: gradient,
                    boxShadow: `
                      0 12px 32px ${shadowColor},
                      inset 0 1px 2px rgba(255, 255, 255, 0.25),
                      0 0 20px ${shadowColor.replace('0.4', '0.15')}
                    `,
                    backdropFilter: 'blur(4px)',
                  }}
                  title={item.description}
                  aria-label={`${item.title} - ${item.description}`}
                >
                  {/* Premium glow effect on hover */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent 70%)',
                      boxShadow: `inset 0 0 24px rgba(255, 255, 255, 0.15), 0 0 24px ${shadowColor}`,
                    }}
                  />

                  {/* Badge label */}
                  {item.badge && (
                    <div className="absolute -top-2 -right-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white/90 border border-white/20">
                      {item.badge}
                    </div>
                  )}

                  {/* Icon */}
                  <div className="text-white group-hover:scale-125 transition-transform duration-300 flex-shrink-0 flex items-center justify-center">
                    {item.icon}
                  </div>

                  {/* Title and description */}
                  <div className="flex flex-col items-start hidden sm:flex">
                    <span className="text-sm sm:text-base font-bold text-white group-hover:text-orange-200 transition-colors duration-300">
                      {item.title}
                    </span>
                    {item.description && (
                      <span className="text-xs text-white/70 group-hover:text-white/90 transition-colors duration-300">
                        {item.description}
                      </span>
                    )}
                  </div>

                  {/* Mobile layout - title only */}
                  <span className="text-xs sm:hidden font-bold text-white group-hover:text-orange-200 transition-colors duration-300">
                    {item.title}
                  </span>

                  {/* Hover sparkle effect */}
                  <Sparkles 
                    size={16} 
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0 text-white/80 ml-auto hidden sm:block"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile hint */}
        <div className="text-center text-white/50 text-xs mt-2 sm:hidden">
          ← Swipe to explore more →
        </div>
      </div>

      <style>{`
        @keyframes smooth-flow {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-${items.length * 85}px - ${items.length * 16}px));
          }
        }

        /* Mobile responsive animation */
        @media (max-width: 640px) {
          @keyframes smooth-flow {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-${items.length * 70}px - ${items.length * 12}px));
            }
          }
        }

        /* Smooth GPU-accelerated animation */
        @supports (animation-timeline: scroll()) {
          .highlight-slider-container {
            animation-timeline: view();
          }
        }

        /* Prevent jank */
        * {
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </div>
  );
};

export default HighlightSlider;
