import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export interface HighlightItem {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  type: 'destination' | 'festival' | 'season';
  link?: string;
}

interface HighlightSliderProps {
  items?: HighlightItem[];
  onItemClick?: (item: HighlightItem) => void;
}

// Default highlight data with emoji icons
const DEFAULT_ITEMS: HighlightItem[] = [
  {
    id: 'jaipur',
    title: 'Jaipur',
    description: 'Explore the royal architecture and vibrant markets',
    icon: '🏰',
    type: 'destination',
    link: '/destinations/jaipur',
  },
  {
    id: 'kerala',
    title: 'Kerala',
    description: 'Backwaters, beaches, and tropical beauty',
    icon: '🌴',
    type: 'destination',
    link: '/destinations/kerala',
  },
  {
    id: 'taj-mahal',
    title: 'Taj Mahal',
    description: 'UNESCO World Heritage Site in Agra',
    icon: '💎',
    type: 'destination',
    link: '/destinations/agra',
  },
  {
    id: 'diwali',
    title: 'Diwali',
    description: 'Festival of Lights - Celebrate with us!',
    icon: '🎆',
    type: 'festival',
    link: '/festivals/diwali',
  },
  {
    id: 'winter',
    title: 'Winter',
    description: 'Best time to visit northern India',
    icon: '❄️',
    type: 'season',
    link: '/destinations',
  },
  {
    id: 'manali',
    title: 'Manali',
    description: 'Mountains, trekking, and natural beauty',
    icon: '⛰️',
    type: 'destination',
    link: '/destinations/manali',
  },
  {
    id: 'goa',
    title: 'Goa',
    description: 'Golden beaches and vibrant nightlife',
    icon: '🏖️',
    type: 'destination',
    link: '/destinations/goa',
  },
  {
    id: 'holi',
    title: 'Holi',
    description: 'Festival of Colors - Experience the joy',
    icon: '🎨',
    type: 'festival',
    link: '/festivals/holi',
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

  // Triple items for seamless infinite loop
  const loopedItems = [...items, ...items, ...items];
  const animationDuration = items.length * 3;

  return (
    <div 
      className="w-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(59, 42, 120, 0.95) 50%, rgba(29, 53, 87, 0.95) 100%)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Blurred gradient bar background */}
      <div 
        className="absolute inset-0 blur-3xl opacity-50"
        style={{
          background: 'linear-gradient(90deg, #6B21A8 0%, #3B82F6 50%, #6B21A8 100%)',
        }}
      />

      {/* Content container */}
      <div className="relative z-10 py-5 sm:py-7 px-4 sm:px-6">
        <div 
          className="w-full overflow-hidden rounded-2xl px-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex gap-3 sm:gap-6 items-center py-2"
            style={{
              animation: isPaused
                ? 'none'
                : `premium-scroll ${animationDuration}s linear infinite`,
              willChange: 'transform',
            }}
          >
            {loopedItems.map((item, idx) => (
              <button
                key={`${item.id}-${idx}`}
                onClick={() => handleItemClick(item)}
                className="group relative flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-full whitespace-nowrap flex-shrink-0 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-transparent"
                style={{
                  background: 'linear-gradient(135deg, #6B21A8 0%, #3B82F6 100%)',
                  boxShadow: '0 8px 32px rgba(107, 33, 168, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
                }}
                title={item.description}
                aria-label={item.description}
              >
                {/* Neon glow effect */}
                <div 
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent)',
                    boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1), 0 0 20px rgba(107, 33, 168, 0.4)',
                  }}
                />

                {/* Icon */}
                <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  {item.icon || '✨'}
                </span>

                {/* Title */}
                <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-orange-200 transition-colors duration-300">
                  {item.title}
                </span>

                {/* Hover indicator */}
                <Sparkles 
                  size={14} 
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0 text-orange-300"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Mobile guide */}
        <div className="text-center text-white/60 text-xs mt-3 sm:hidden">
          Swipe or hover to explore
        </div>
      </div>

      <style>{`
        @keyframes premium-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-${items.length * 100}px - ${items.length * 12}px));
          }
        }

        /* Smooth scrolling performance */
        @supports (animation-timeline: scroll()) {
          @keyframes premium-scroll-smooth {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-${items.length * 100}px - ${items.length * 12}px));
            }
          }
        }

        /* Mobile responsive animation */
        @media (max-width: 640px) {
          @keyframes premium-scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-${items.length * 85}px - ${items.length * 8}px));
            }
          }
        }
      `}</style>
    </div>
  );
};

export default HighlightSlider;
