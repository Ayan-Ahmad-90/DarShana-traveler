import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

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

// Default highlight data
const DEFAULT_ITEMS: HighlightItem[] = [
  {
    id: 'jaipur',
    title: '🏰 Jaipur - Pink City',
    description: 'Explore the royal architecture and vibrant markets',
    type: 'destination',
    link: '/destinations/jaipur',
  },
  {
    id: 'kerala',
    title: '🌴 Kerala - God\'s Own Country',
    description: 'Backwaters, beaches, and tropical beauty',
    type: 'destination',
    link: '/destinations/kerala',
  },
  {
    id: 'taj-mahal',
    title: '💎 Taj Mahal - Symbol of Love',
    description: 'UNESCO World Heritage Site in Agra',
    type: 'destination',
    link: '/destinations/agra',
  },
  {
    id: 'diwali',
    title: '🎆 Diwali Festival',
    description: 'Festival of Lights coming soon - Celebrate with us!',
    type: 'festival',
    link: '/festivals/diwali',
  },
  {
    id: 'winter',
    title: '❄️ Winter Season',
    description: 'Best time to visit northern India - Perfect weather',
    type: 'season',
    link: '/destinations',
  },
  {
    id: 'manali',
    title: '⛰️ Manali - Adventure Capital',
    description: 'Mountains, trekking, and natural beauty',
    type: 'destination',
    link: '/destinations/manali',
  },
  {
    id: 'goa',
    title: '🏖️ Goa - Beach Paradise',
    description: 'Golden beaches and vibrant nightlife',
    type: 'destination',
    link: '/destinations/goa',
  },
  {
    id: 'holi',
    title: '🎨 Holi Festival',
    description: 'Festival of Colors - Experience the joy',
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

  // Duplicate items for seamless loop
  const loopedItems = [...items, ...items];

  return (
    <div className="w-full bg-gradient-to-r from-blue-900 via-purple-800 to-blue-900 py-4 overflow-hidden border-b-2 border-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div
          className="flex gap-8 items-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            animation: isPaused
              ? 'none'
              : `scroll-left ${loopedItems.length * 4}s linear infinite`,
          }}
        >
          {loopedItems.map((item, idx) => (
            <button
              key={`${item.id}-${idx}`}
              onClick={() => handleItemClick(item)}
              className="flex items-center gap-3 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white whitespace-nowrap transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 flex-shrink-0 group"
              title={item.description}
            >
              <span className="text-lg">{item.title.split(' ')[0]}</span>
              <span className="text-sm font-medium hidden sm:inline">
                {item.title.substring(item.title.indexOf(' ') + 1)}
              </span>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Mobile info text */}
        <div className="text-center text-white/70 text-xs mt-2 sm:hidden">
          Swipe to explore
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default HighlightSlider;
