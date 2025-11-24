import { useState, useMemo, useEffect, useRef } from 'react';
import { Calendar, MapPin, Grid, Map as MapIcon, X, TrendingUp, Download, Share2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import domtoimage from 'dom-to-image';

// --- Leaflet marker icon fix ---
const DefaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- DATA ARRAYS ---
const festivalsData = [
    {
        id: 1,
        name: "Diwali (दीपावली)",
        type: "Religious (Hindu, Sikh, Jain)",
        month: "October/November",
        location: "Pan-India",
        desc: "The festival of lights, celebrating the victory of light over darkness and good over evil. Associated with Goddess Lakshmi and Lord Rama's return.",
        img: "https://placehold.co/500x300/f8c050/ffffff?text=Diwali+Lights",
        lat: 20.5937,
        lng: 78.9629
    },
    {
        id: 2,
        name: "Holi (होली)",
        type: "Cultural/Religious (Hindu)",
        month: "March",
        location: "Pan-India, especially North India",
        desc: "The festival of colors, signifying the arrival of spring and the triumph of good over evil (Holika Dahan). People play with dry and wet colors.",
        img: "https://placehold.co/500x300/ff69b4/ffffff?text=Holi+Colors",
        lat: 28.6139,
        lng: 77.209
    },
    {
        id: 3,
        name: "Durga Puja (दुर्गा पूजा)",
        type: "Religious (Hindu)",
        month: "September/October",
        location: "Kolkata, West Bengal",
        desc: "Celebration of Goddess Durga's victory over the buffalo demon Mahishasura. Marked by grand Pandal installations and idol immersion.",
        img: "https://placehold.co/500x300/800080/ffffff?text=Durga+Pooja+Pandal",
        lat: 22.5726,
        lng: 88.3639
    },
    {
        id: 4,
        name: "Pushkar Camel Fair (पुष्कर मेला)",
        type: "Cultural/Livestock",
        month: "November",
        location: "Pushkar, Rajasthan",
        desc: "A vibrant five-day livestock fair featuring camel trading, cultural performances, music, and competitions near the Pushkar Lake.",
        img: "https://placehold.co/500x300/ffa500/000000?text=Pushkar+Fair",
        lat: 26.4907,
        lng: 74.5539
    },
    {
        id: 5,
        name: "Onam (ओणम)",
        type: "Cultural/Harvest (Hindu)",
        month: "August/September",
        location: "Kerala",
        desc: "Harvest festival marked by elaborate flower carpets (Pookalam), the grand Onam Sadhya feast, and spectacular snake boat races (Vallamkali).",
        img: "https://placehold.co/500x300/4CAF50/ffffff?text=Onam+Pookalam",
        lat: 10.8505,
        lng: 76.2711
    },
    {
        id: 6,
        name: "Ganesh Chaturthi (गणेश चतुर्थी)",
        type: "Religious (Hindu)",
        month: "August/September",
        location: "Mumbai, Maharashtra, Karnataka",
        desc: "A 10-day celebration of the birth of Lord Ganesha, marked by the installation of large idols and a final grand immersion ceremony (Visarjan).",
        img: "https://placehold.co/500x300/9932CC/ffffff?text=Ganesh+Idol",
        lat: 19.076,
        lng: 72.8777
    },
    {
        id: 7,
        name: "Eid al-Fitr (ईद उल-फित्र)",
        type: "Religious (Islam)",
        month: "Variable (Lunar)",
        location: "Pan-India",
        desc: "The 'Festival of Breaking the Fast' marks the end of Ramadan. Celebrated with congregational prayers, feasting, and the giving of charity (Zakat al-Fitr).",
        img: "https://placehold.co/500x300/228B22/ffffff?text=Eid+Celebration",
        lat: 28.7041,
        lng: 77.1025
    },
    {
        id: 8,
        name: "Christmas",
        type: "Religious (Christian)",
        month: "December",
        location: "Goa, Mumbai, Northeast India",
        desc: "Celebration of the birth of Jesus Christ. Marked by midnight mass, carol singing, decorated Christmas trees, and gift-giving.",
        img: "https://placehold.co/500x300/D22B2B/ffffff?text=Christmas+Tree",
        lat: 15.2993,
        lng: 74.124
    },
    {
        id: 9,
        name: "Gurupurab (गुरुपर्व)",
        type: "Religious (Sikh)",
        month: "October/November",
        location: "Punjab, Pan-India",
        desc: "Celebration of the birth of the Sikh Gurus. Marked by processions (Nagar Kirtan) and reading of the Guru Granth Sahib.",
        img: "https://placehold.co/500x300/3CB371/ffffff?text=Gurpurab+Nagar+Kirtan",
        lat: 30.7333,
        lng: 76.7794
    },
    {
        id: 10,
        name: "Pongal (पोंगल)",
        type: "Harvest (Hindu)",
        month: "January",
        location: "Tamil Nadu",
        desc: "A four-day harvest festival dedicated to the Sun God (Surya). The second day is the main day, where rice is boiled until it spills over.",
        img: "https://placehold.co/500x300/FFD700/000000?text=Pongal+Dish",
        lat: 13.0827,
        lng: 80.2707
    },
    {
        id: 11,
        name: "Navratri (नवरात्रि)",
        type: "Religious (Hindu)",
        month: "September/October",
        location: "Gujarat, Maharashtra",
        desc: "A nine-night festival worshipping Goddess Durga. Famous for the traditional folk dances Garba and Dandiya Raas, especially in Gujarat.",
        img: "https://placehold.co/500x300/4682B4/ffffff?text=Garba+Dance",
        lat: 23.0225,
        lng: 72.5714
    },
    {
        id: 12,
        name: "Kumbh Mela (कुंभ मेला)",
        type: "Religious (Hindu)",
        month: "Variable (Cycle)",
        location: "Allahabad, Haridwar, Ujjain, Nashik",
        desc: "One of the largest peaceful gatherings in the world, held once every three years on a rotating basis at four river-bank pilgrimage sites.",
        img: "https://placehold.co/500x300/87CEEB/000000?text=Kumbh+Mela+Snan",
        lat: 25.4358,
        lng: 81.8463
    },
    {
        id: 13,
        name: "Rath Yatra (रथ यात्रा)",
        type: "Religious (Hindu)",
        month: "June/July",
        location: "Puri, Odisha",
        desc: "The annual chariot festival of Lord Jagannath, his brother Balabhadra, and sister Subhadra. The deities are carried in massive, decorated chariots.",
        img: "https://placehold.co/500x300/CD5C5C/ffffff?text=Rath+Yatra+Puri",
        lat: 19.8142,
        lng: 85.831
    },
    {
        id: 14,
        name: "Hornbill Festival",
        type: "Cultural (Tribal)",
        month: "December",
        location: "Nagaland",
        desc: "A week-long annual festival showcasing the rich cultural heritage and traditions of the 16 Naga tribes with folk dances, sports, and crafts.",
        img: "https://placehold.co/500x300/90EE90/000000?text=Hornbill+Dance",
        lat: 26.1824,
        lng: 94.5714
    },
    {
        id: 15,
        name: "Eid al-Adha (बकरी ईद)",
        type: "Religious (Islam)",
        month: "Variable (Lunar)",
        location: "Pan-India",
        desc: "The 'Festival of Sacrifice,' honoring Prophet Ibrahim's willingness to sacrifice his son. It involves animal sacrifice and distribution of meat.",
        img: "https://placehold.co/500x300/A52A2A/ffffff?text=Eid+al-Adha",
        lat: 24.5,
        lng: 79.0
    },
];

// ----------------------------------------------------------------------------------
// 2. 10 CULTURAL HIGHLIGHTS (सांस्कृतिक झलकियाँ) - Key non-festival cultural aspects
// ----------------------------------------------------------------------------------
const culturalHighlights = [
  {
    name: "Classical Dance Forms (शास्त्रीय नृत्य)",
    aspect: "Performing Arts",
    description: "Includes Bharatanatyam, Kathak, Kathakali, Odissi, Manipuri, Mohiniyattam, and Kuchipudi, each telling stories through intricate mudras and expressions.",
    img: "https://placehold.co/500x300/fddc9a/362c2c?text=Classical+Dance",
    lat: 13.0802,
    lng: 80.2838
  },
  {
    name: "Yoga and Ayurveda (योग और आयुर्वेद)",
    aspect: "Wellness & Philosophy",
    description: "Ancient Indian systems for health and well-being. Yoga focuses on physical, mental, and spiritual practices, while Ayurveda is a traditional medicine system.",
    img: "https://placehold.co/500x300/aed581/452e00?text=Yoga+Ayurveda",
    lat: 30.3165,
    lng: 78.0322
  },
  {
    name: "Indian Cuisine (भारतीय व्यंजन)",
    aspect: "Gastronomy",
    description: "Known for its vast regional diversity—from North Indian curries and bread to South Indian idli/dosa, Bengali fish, and Goan vindaloo. Focuses on spices and balance of six tastes.",
    img: "https://placehold.co/500x300/ff9800/ffffff?text=Indian+Cuisine",
    lat: 28.6139,
    lng: 77.209
  },
  {
    name: "Bollywood & Regional Cinema (सिनेमा)",
    aspect: "Mass Media & Arts",
    description: "The world's largest film industry, headquartered in Mumbai, influencing music, fashion, and social narratives globally. Includes vibrant regional cinemas like Tamil, Telugu, and Bengali.",
    img: "https://placehold.co/500x300/ff0266/fff8e1?text=Bollywood+Cinema",
    lat: 19.076,
    lng: 72.8777
  },
  {
    name: "Traditional Textiles & Sari (वस्त्र और साड़ी)",
    aspect: "Fashion & Craft",
    description: "India's rich textile heritage features handloom fabrics like Silk (Banarasi, Kanjivaram), Cotton (Khadi), and intricate works like Pashmina shawls and bandhani dying.",
    img: "https://placehold.co/500x300/fffde7/5c4037?text=Textiles+Sari",
    lat: 25.3176,
    lng: 82.9739
  },
  {
    name: "Kathputli (कठपुतली) & Puppetry",
    aspect: "Folk Arts",
    description: "Traditional string puppetry, most prominent in Rajasthan, used for storytelling and conveying social messages through intricate wooden dolls.",
    img: "https://placehold.co/500x300/ffe082/3e2723?text=Kathputli+Puppet",
    lat: 26.9124,
    lng: 75.7873
  },
  {
    name: "Hindustani & Carnatic Music (शास्त्रीय संगीत)",
    aspect: "Music",
    description: "The two main branches of Indian classical music. Hindustani (North India) focuses on improvisational Ragas, while Carnatic (South India) is based on composed Kriti songs.",
    img: "https://placehold.co/500x300/90caf9/23275e?text=Indian+Music",
    lat: 22.5726,
    lng: 88.3639
  },
  {
    name: "Kalarippayattu (कलरीपयट्टु)",
    aspect: "Martial Arts",
    description: "One of the oldest surviving martial arts in the world, originating in Kerala. Involves strikes, kicks, weapon training, and healing methods.",
    img: "https://placehold.co/500x300/4caf50/fff8e1?text=Kalarippayattu",
    lat: 10.8505,
    lng: 76.2711
  },
  {
    name: "Tribal Art Forms (जनजातीय कला)",
    aspect: "Visual Arts",
    description: "Includes distinct styles like Warli painting (Maharashtra), Gond art (Madhya Pradesh), and Madhubani painting (Bihar), reflecting tribal life and myths.",
    img: "https://placehold.co/500x300/e0e0e0/232323?text=Tribal+Art",
    lat: 20.9042,
    lng: 74.7749
  },
  {
    name: "Miniature Painting (लघु चित्रकला)",
    aspect: "Visual Arts",
    description: "Detailed, colorful paintings developed under Mughal, Rajput, and Pahari royal courts, depicting epics, portraits, and courtly life on small scale.",
    img: "https://placehold.co/500x300/fffde7/346a02?text=Miniature+Painting",
    lat: 26.9124,
    lng: 75.7873
  },
];

const historicalPlaces = [
  {
    id: 1,
    name: "Taj Mahal",
    era: "Mughal Empire",
    location: "Agra, Uttar Pradesh",
    description: "An iconic white marble mausoleum commissioned by Emperor Shah Jahan in memory of his wife Mumtaz Mahal (UNESCO World Heritage Site).",
    img: "https://placehold.co/500x300/f9fafb/747779?text=Taj+Mahal",
    lat: 27.1751,
    lng: 78.0421
  },
  {
    id: 2,
    name: "Red Fort (लाल किला)",
    era: "Mughal Empire",
    location: "Delhi",
    description: "A historic fort in Old Delhi that served as the main residence of the Mughal Emperors for nearly 200 years. The Prime Minister addresses the nation here on Independence Day (UNESCO World Heritage Site).",
    img: "https://placehold.co/500x300/c8e6c9/273437?text=Red+Fort",
    lat: 28.6562,
    lng: 77.241
  },
  {
    id: 3,
    name: "Qutub Minar",
    era: "Delhi Sultanate",
    location: "Delhi",
    description: "A 73-meter tall minaret and complex, the tallest brick minaret in the world, started by Qutub-ud-din Aibak (UNESCO World Heritage Site).",
    img: "https://placehold.co/500x300/b39ddb/333449?text=Qutub+Minar",
    lat: 28.5244,
    lng: 77.1855
  },
  {
    id: 4,
    name: "Humayun's Tomb",
    era: "Mughal Empire",
    location: "Delhi",
    description: "The tomb of the Mughal Emperor Humayun, often considered the first garden-tomb on the Indian subcontinent (UNESCO World Heritage Site).",
    img: "https://placehold.co/500x300/ffe0b2/3e2723?text=Humayun's+Tomb",
    lat: 28.5933,
    lng: 77.2507
  },
  {
    id: 5,
    name: "Fatehpur Sikri",
    era: "Mughal Empire",
    location: "Near Agra, Uttar Pradesh",
    description: "A city founded by Mughal Emperor Akbar, which served as the capital from 1571 to 1585, now perfectly preserved in red sandstone (UNESCO World Heritage Site).",
    img: "https://placehold.co/500x300/e1bee7/241f34?text=Fatehpur+Sikri",
    lat: 27.0936,
    lng: 77.6611
  },
  {
    id: 6,
    name: "Agra Fort",
    era: "Mughal Empire",
    location: "Agra, Uttar Pradesh",
    description: "The primary residence of the emperors of the Mughal Dynasty until 1638. A massive red sandstone fortress (UNESCO World Heritage Site).",
    img: "https://placehold.co/500x300/afbcaa/fff8e1?text=Agra+Fort",
    lat: 27.1795,
    lng: 78.0211
  },
  {
    id: 7,
    name: "Group of Monuments at Hampi",
    era: "Vijayanagara Empire",
    location: "Hampi, Karnataka",
    description: "The ruins of the magnificent capital city of the Vijayanagara Empire, featuring stunning temples and stone chariots (UNESCO World Heritage Site).",
    img: "https://placehold.co/500x300/ffe082/463629?text=Hampi",
    lat: 15.335,
    lng: 76.4629
  },
  {
    id: 8,
    name: "Khajuraho Group of Monuments",
    era: "Chandela Dynasty",
    location: "Khajuraho, Madhya Pradesh",
    description: "A group of Hindu and Jain temples famous for their intricate and erotic sculptures (UNESCO World Heritage Site).",
    img: "https://placehold.co/500x300/d1c4e9/fff8e1?text=Khajuraho",
    lat: 24.8318,
    lng: 79.9386
  },
  {
    id: 9,
    name: "Ajanta Caves",
    era: "Satavahana & Vakataka Dynasties",
    location: "Maharashtra",
    description: "Rock-cut Buddhist cave monuments featuring beautifully preserved paintings and sculptures depicting the Jataka tales (UNESCO World Heritage Site).",
    img: "https://placehold.co/500x300/ffe082/a17937?text=Ajanta+Caves",
    lat: 20.5534,
    lng: 75.7033
  },
  {
    id: 10,
    name: "Ellora Caves",
    era: "Rashtrakuta Dynasty",
    location: "Maharashtra",
    description: "One of the largest rock-cut monastery-temple cave complexes in the world, featuring Buddhist, Hindu, and Jain monuments (UNESCO World Heritage Site).",
    img: "https://placehold.co/500x300/ffcdd2/19052c?text=Ellora+Caves",
    lat: 20.0268,
    lng: 75.1786
  },
  {
    id: 11,
    name: "Sanchi Stupa",
    era: "Mauryan Empire",
    location: "Sanchi, Madhya Pradesh",
    description: "The oldest stone structure in India, commissioned by Emperor Ashoka, famous for its grand stupa and ornamental gateways (UNESCO World Heritage Site).",
    img: "https://placehold.co/500x300/fffde7/806600?text=Sanchi+Stupa",
    lat: 23.4793,
    lng: 77.7391
  },
  {
    id: 12,
    name: "Konark Sun Temple",
    era: "Eastern Ganga Dynasty",
    location: "Konark, Odisha",
    description: "Dedicated to the Sun God Surya, this temple is designed as a colossal chariot with twelve pairs of intricately carved stone wheels (UNESCO World Heritage Site).",
    img: "https://placehold.co/500x300/ffe082/3e2723?text=Konark+Sun+Temple",
    lat: 19.8876,
    lng: 86.0945
  },
  {
    id: 13,
    name: "Meenakshi Amman Temple",
    era: "Pandyan/Nayak Dynasties",
    location: "Madurai, Tamil Nadu",
    description: "A historic Hindu temple with 14 magnificent Gopurams (gate towers) covered with thousands of mythological figures.",
    img: "https://placehold.co/500x300/ffe0b2/44492c?text=Meenakshi+Temple",
    lat: 9.9195,
    lng: 78.1191
  },
  {
    id: 14,
    name: "Victoria Memorial",
    era: "British Raj",
    location: "Kolkata, West Bengal",
    description: "A large marble building constructed between 1906 and 1921, dedicated to the memory of Queen Victoria.",
    img: "https://placehold.co/500x300/fffde7/00122c?text=Victoria+Memorial",
    lat: 22.5448,
    lng: 88.3426
  },
  {
    id: 15,
    name: "Gateway of India",
    era: "British Raj",
    location: "Mumbai, Maharashtra",
    description: "An iconic arch monument built to commemorate the landing of King-Emperor George V and Queen-Empress Mary at Apollo Bunder in 1911.",
    img: "https://placehold.co/500x300/fbe9e7/4c4c4c?text=Gateway+of+India",
    lat: 18.9217,
    lng: 72.8347
  },
  {
    id: 16,
    name: "Jallianwala Bagh",
    era: "Modern History",
    location: "Amritsar, Punjab",
    description: "A garden of national importance marking the site of the 1919 massacre by British forces.",
    img: "https://placehold.co/500x300/ffcdd2/573940?text=Jallianwala+Bagh",
    lat: 31.6202,
    lng: 74.8797
  },
  {
    id: 17,
    name: "Charminar",
    era: "Qutb Shahi Dynasty",
    location: "Hyderabad, Telangana",
    description: "A monument and mosque built in 1591, known as the 'Arc de Triomphe of the East', and the city's global icon.",
    img: "https://placehold.co/500x300/cfd8dc/3b4249?text=Charminar",
    lat: 17.3616,
    lng: 78.4747
  },
  {
    id: 18,
    name: "Golconda Fort",
    era: "Kakatiya/Qutb Shahi Dynasties",
    location: "Hyderabad, Telangana",
    description: "A magnificent fort, originally a mud fort, famous for its acoustics and being the source of world-renowned diamonds like the Koh-i-Noor.",
    img: "https://placehold.co/500x300/d7ccc8/221e1f?text=Golconda+Fort",
    lat: 17.3833,
    lng: 78.4011
  },
  {
    id: 19,
    name: "Amer Fort (आमेर का किला)",
    era: "Kachhwaha Dynasty",
    location: "Jaipur, Rajasthan",
    description: "A beautiful fort built of red sandstone and marble, known for its artistic Hindu style elements (UNESCO World Heritage Site).",
    img: "https://placehold.co/500x300/fffde7/2c1a00?text=Amer+Fort",
    lat: 26.9855,
    lng: 75.8507
  },
  {
    id: 20,
    name: "Chittorgarh Fort",
    era: "Mewar Kingdom",
    location: "Chittorgarh, Rajasthan",
    description: "The largest fort in India and a UNESCO World Heritage Site, famed for its association with Rajput history, courage, and sacrifice.",
    img: "https://placehold.co/500x300/dedfeb/25232f?text=Chittorgarh+Fort",
    lat: 24.8896,
    lng: 74.6472
  },
  {
    id: 21,
    name: "Nalanda University Ruins",
    era: "Gupta/Pala Empires",
    location: "Bihar",
    description: "The ruins of an ancient Buddhist monastic university, a major center of learning from the 5th to 13th centuries (UNESCO World Heritage Site).",
    img: "https://placehold.co/500x300/f9fafb/3b3333?text=Nalanda+Ruins",
    lat: 25.1357,
    lng: 85.443
  },
  {
    id: 22,
    name: "Shore Temple",
    era: "Pallava Dynasty",
    location: "Mahabalipuram, Tamil Nadu",
    description: "A structural temple complex built with blocks of granite, overlooking the Bay of Bengal (UNESCO World Heritage Site).",
    img: "https://placehold.co/500x300/b3e5fc/1c2331?text=Shore+Temple",
    lat: 12.6176,
    lng: 80.1994
  },
];

const filterCategories = [
  { label: "All Types", value: "all" },
  { label: "Festivals", value: "festival" },
  { label: "Cultures", value: "culture" },
  { label: "Historical Places", value: "historical" },
];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];
const getNextMonthName = () => {
  const nextMonthIndex = (new Date().getMonth() + 1) % 12;
  return months[nextMonthIndex];
};

type FestivalDataType = typeof festivalsData;
type CultureType = typeof culturalHighlights[0] & { id: number; cardType: "culture" };
type HistoricalType = typeof historicalPlaces[0] & { cardType: "historical" };
type CardType = (typeof festivalsData[0] & { cardType: "festival" }) | CultureType | HistoricalType;

// --- Map FlyTo function ---
const FlyToLocation = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 6);
  }, [position, map]);
return null;
};

const NextMonthHighlight = ({ festivalsData }: { festivalsData: FestivalDataType }) => {
  const nextMonthName = getNextMonthName();
  const nextMonthFestivals = useMemo(
    () => festivalsData.filter(f => f.month.includes(nextMonthName)),
    [nextMonthName, festivalsData]
  );
  if (nextMonthFestivals.length === 0) {
    return (
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-8 rounded-lg shadow-sm flex items-center gap-3">
        <TrendingUp size={20} className="text-orange-600 flex-shrink-0" />
        <p className="text-sm text-orange-800 font-medium">
          <b>Next Month ({nextMonthName})</b>: No major events scheduled yet. Check back for updates!
        </p>
      </div>
    );
  }
  const festivalNames = nextMonthFestivals.map(f => f.name).join(', ');
  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded-lg shadow-lg flex items-start gap-3 animate-pulse-slow">
      <TrendingUp size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
      <div className='flex-grow'>
        <p className="text-sm text-green-800 font-bold">
          ✨ UPCOMING EVENTS - {nextMonthName.toUpperCase()} ✨
        </p>
        <p className="text-xs text-green-700 mt-1">
          Don't miss: <b>{festivalNames}</b>. Plan your travels now!
        </p>
      </div>
    </div>
  );
};

// --- Live Location Marker ---
function LiveLocationMarker({ setShareUrl }: { setShareUrl: (url: string) => void }) {
  const map = useMap();
  const [pos, setPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setPos([coords.latitude, coords.longitude]);
      map.flyTo([coords.latitude, coords.longitude], 10);
      setShareUrl(`${window.location.origin}?lat=${coords.latitude}&lng=${coords.longitude}`);
    });
  }, [map, setShareUrl]);

  if (!pos) return null;
  return (
    <Marker position={pos}>
      <Popup>
        Your Live Location<br />
        <span>{pos[0]}, {pos[1]}</span>
      </Popup>
    </Marker>
  );
}

// --- MAIN COMPONENT ---
const Festivals = () => {
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showMore, setShowMore] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [showLiveLocation, setShowLiveLocation] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const mapRef = useRef<L.Map>(null);

  // Create cards for all types
  const allCards: CardType[] = [
    ...festivalsData.map(f => ({ ...f, cardType: "festival" as const })),
    ...culturalHighlights.map((f, i) => ({ ...f, cardType: "culture" as const, id: 1000 + i })),
    ...historicalPlaces.map((f, i) => ({ ...f, cardType: "historical" as const, id: 2000 + i })),
  ] as CardType[];

  // --- SEARCH & FILTER HOOK ---
  const filteredCards = useMemo(() => {
    let cards = allCards;
    if (filterType !== 'all') cards = cards.filter(card => card.cardType === filterType);
    if (searchText.trim()) {
      return cards.filter(card =>
        card.name.toLowerCase().includes(searchText.toLowerCase()) ||
        ('location' in card && card.location && card.location.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
    return cards;
  }, [filterType, searchText, allCards]);

  const showCards = showMore ? filteredCards : filteredCards.slice(0, 6);
  const highlightedCard = selectedCard || filteredCards[0];
  const initialMapCenter: [number, number] = (highlightedCard && highlightedCard.lat && highlightedCard.lng
    ? [highlightedCard.lat, highlightedCard.lng]
    : [21, 78]) as [number, number];

  useEffect(() => { setSelectedCard(null); setHoveredCardId(null); }, [showMap, filterType]);

  // --- MAP SNAPSHOT ---
  function handleDownloadMap() {
    const mapNode = document.querySelector('.leaflet-container');
    if (!mapNode) return;
    domtoimage.toPng(mapNode)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'map.png';
        link.href = dataUrl;
        link.click();
      });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative">
      {/* SEARCH BAR */}
      <div className="mb-4 flex gap-3 justify-center items-center">
        <input
          type="text"
          placeholder="Search by name/location…"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="px-4 py-2 rounded border"
        />
        <button
          className={`px-4 py-2 rounded-lg font-bold border text-sm ${showLiveLocation ? 'bg-teal-700 text-white border-teal-700' : 'bg-white border-stone-200 text-teal-800'}`}
          onClick={() => setShowLiveLocation(x => !x)}
        >
          <Share2 size={16} /> Live Location
        </button>
        {shareUrl && (
          <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline ml-2 text-sm">
            Share My Location
          </a>
        )}
      </div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-stone-800 mb-4">🇮🇳 Indian Festival Explorer 🇮🇳</h1>
        <p className="text-stone-600">Immerse yourself in the vibrant colors of Indian culture, religion, and history.</p>
      </div>
      <NextMonthHighlight festivalsData={festivalsData} />
      {/* CATEGORY FILTER */}
      <div className="flex gap-3 mb-8 justify-center flex-wrap">
        {filterCategories.map(cat => (
          <button
            key={cat.value}
            className={`px-4 py-2 rounded-lg font-bold border text-sm ${filterType === cat.value ? 'bg-teal-700 text-white border-teal-700' : 'bg-white text-stone-700 border-stone-200'}`}
            onClick={() => { setFilterType(cat.value); setShowMore(false); }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* LIST OR MAP VIEW */}
      {!showMap ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {showCards.map(card => (
              <div
                key={card.id || card.name}
                className="bg-white rounded-xl shadow-lg border border-stone-100 overflow-hidden hover:shadow-2xl transition-all group cursor-pointer"
                onMouseEnter={() => card.id && setHoveredCardId(card.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => setSelectedCard(card)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={card.img || 'https://placehold.co/500x300?text=Culture+or+Historical'}
                    alt={card.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = 'https://via.placeholder.com/500x300?text=Festival+Image';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                    <span className="text-white text-xs bg-orange-600 px-2 py-1 rounded-full mb-2 inline-block font-semibold">
                        {card.cardType === "festival" ? ('type' in card ? card.type : "")
                          : card.cardType === "culture" ? ('aspect' in card ? card.aspect : "")
                          : card.cardType === "historical" ? ('era' in card ? card.era : "") : ""}
                      </span>
                    <h3 className="text-2xl font-bold text-white font-serif">{card.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  {card.cardType === "festival" && (
                    <>
                      <div className="flex items-center gap-4 text-sm text-stone-500 mb-3">
                        <span className="flex items-center gap-1"><Calendar size={14} className="text-teal-600" /> {card.month}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} className="text-red-500" /> {card.location}</span>
                      </div>
                      <p className="text-stone-600 text-sm mb-4 line-clamp-2">{card.desc}</p>
                    </>
                  )}
                  {card.cardType === "culture" && (
                    <p className="text-stone-600 text-sm mb-4">{card.description}</p>
                  )}
                  {card.cardType === "historical" && (
                    <>
                      <div className="flex items-center gap-2 text-sm text-stone-500 mb-2">
                        <span><MapPin size={14} className="text-red-500" /> {card.location}</span>
                      </div>
                      <p className="text-stone-600 text-sm mb-4 line-clamp-2">{card.description}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          {filteredCards.length > 6 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowMore(prev => !prev)}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg shadow font-bold"
              >
                {showMore ? "Show Less" : "See More"}
              </button>
            </div>
          )}
        </>
      ) : (
        // --- MAP VIEW ---
        <div className="w-full h-[600px] rounded-2xl flex flex-col border border-stone-300 overflow-hidden shadow-xl">
          <MapContainer
            center={initialMapCenter}
            zoom={5}
            scrollWheelZoom
            style={{ flexGrow: 1, zIndex: 1 }}
            ref={mapRef}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredCards
              .filter(card => card.lat && card.lng)
              .map(card => (
                <Marker
                  key={card.id}
                  position={[card.lat, card.lng]}
                  opacity={hoveredCardId === card.id ? 1.0 : 0.8}
                  eventHandlers={{
                    mouseover: () => card.id && setHoveredCardId(card.id),
                    mouseout: () => setHoveredCardId(null),
                    click: () => setSelectedCard(card)
                  }}
                >
                  <Popup>
                    <div className="font-sans">
                      <h3 className="font-bold text-teal-700 mb-1">{card.name}</h3>
                      <p className="text-xs text-stone-600 italic">
                        {(card.cardType === 'festival' || card.cardType === 'historical') && 'location' in card 
                          ? card.location 
                          : ""}
                      </p>
                      <p className="text-sm mt-1">
                        {card.cardType === 'festival' && 'desc' in card
                          ? (card.desc as string).substring(0, 50)
                          : 'description' in card
                          ? (card.description as string).substring(0, 50)
                          : ""}...
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            {/* Only fly to on SELECT, not hover */}
            {selectedCard && selectedCard.lat && selectedCard.lng && (
              <FlyToLocation position={[selectedCard.lat, selectedCard.lng]} />
            )}
            {showLiveLocation && <LiveLocationMarker setShareUrl={setShareUrl} />}
          </MapContainer>
          <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-between items-center">
            <div className="flex items-center gap-3 text-stone-600">
              <Download size={20} className="text-blue-500" />
              <button onClick={handleDownloadMap} className="px-4 py-2 bg-blue-500 text-white rounded ml-2">
                Download Map
              </button>
            </div>
            <button onClick={() => setShowMap(false)} className="text-teal-700 font-medium hover:underline text-sm">Return to List</button>
          </div>
        </div>
      )}

      {/* VIEW TOGGLE BUTTONS */}
      <div className="flex mt-10 mb-2 justify-center">
        <div className="bg-stone-100 p-1 rounded-lg flex shadow-inner">
          <button
            onClick={() => setShowMap(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${!showMap ? 'bg-white shadow-md text-teal-700' : 'text-stone-500 hover:bg-stone-200'}`}
          >
            <Grid size={16} /> List View
          </button>
          <button
            onClick={() => setShowMap(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${showMap ? 'bg-white shadow-md text-teal-700' : 'text-stone-500 hover:bg-stone-200'}`}
          >
            <MapIcon size={16} /> Map View
          </button>
        </div>
      </div>

      {/* CARD MODAL */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="relative h-32">
              <img
                src={selectedCard?.img || 'https://placehold.co/500x300?text=Culture+or+Historical'}
                className="w-full h-full object-cover"
                alt={selectedCard?.name}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center p-6">
                <h2 className="text-2xl font-bold text-white font-serif">{selectedCard?.name}</h2>
              </div>
              <button onClick={() => setSelectedCard(null)} className="absolute top-4 right-4 bg-black/20 text-white p-1 rounded-full hover:bg-black/40 transition">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="text-sm">
                {selectedCard?.cardType === "festival" && (
                  <>
                    <b>Month:</b> {selectedCard.month}<br />
                    <b>Location:</b> {selectedCard.location}<br /><br />
                    {selectedCard.desc}
                  </>
                )}
                {selectedCard?.cardType === "culture" && (
                  <>
                    <b>Aspect:</b> {selectedCard.aspect}<br /><br />
                    {selectedCard.description}
                  </>
                )}
                {selectedCard?.cardType === "historical" && (
                  <>
                    <b>Era:</b> {selectedCard.era}<br />
                    <b>Location:</b> {selectedCard.location}<br /><br />
                    {selectedCard.description}
                  </>
                )}
              </div>
            </div>
            <div className="bg-stone-50 p-4 border-t border-stone-100 flex justify-end">
              <button onClick={() => setSelectedCard(null)} className="px-4 py-2 bg-stone-200 text-stone-800 rounded-lg text-sm font-medium hover:bg-stone-300 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Festivals;
