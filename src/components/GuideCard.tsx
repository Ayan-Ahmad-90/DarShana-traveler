import { Star, MapPin } from 'lucide-react';

interface Guide {
  _id: string;
  name: string;
  location: string;
  specialization: string[];
  rating: number;
  totalReviews: number;
  pricePerDay: number;
  bio: string;
  verified: boolean;
}

interface GuideCardProps {
  guide: Guide;
  onClick?: () => void;
}

const GuideCard = ({ guide, onClick }: GuideCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{guide.name}</h3>
            {guide.verified && (
              <span className="text-green-600 text-sm font-semibold">✓ Verified</span>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">${guide.pricePerDay}</p>
            <p className="text-gray-500 text-sm">/day</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 text-gray-700">
          <MapPin size={18} className="text-red-500" />
          <span className="text-sm">{guide.location}</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            <Star size={18} className="text-yellow-500 fill-yellow-500" />
            <span className="ml-1 font-semibold text-gray-900">{guide.rating.toFixed(1)}</span>
          </div>
          <span className="text-gray-600 text-sm">({guide.totalReviews} reviews)</span>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{guide.bio}</p>

        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {guide.specialization.slice(0, 2).map(spec => (
              <span key={spec} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize">
                {spec}
              </span>
            ))}
            {guide.specialization.length > 2 && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                +{guide.specialization.length - 2}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default GuideCard;
