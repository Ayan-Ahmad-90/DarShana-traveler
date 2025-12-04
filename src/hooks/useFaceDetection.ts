/**
 * useFaceDetection Hook
 * Handles face-api.js model loading and emotion detection from video/image
 *
 * Usage:
 * const { loading, analyzeFromVideo, analyzeFromImage } = useFaceDetection();
 * const faces = await analyzeFromImage(base64ImageData);
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import type { RefObject } from 'react';
import * as faceapi from 'face-api.js';
import type {
  DetectedFace,
  EmotionScores,
  AIAnalysisResult,
} from '../types/moodAnalyzer';

const MODELS_PATH = '/models'; // Must point to `public/models` when built with Vite

type AnalysisResult = AIAnalysisResult;

export interface Destination {
  id: string;
  title: string;
  img: string;
  label: string;
  tags: string[];
  mood: number[];
  energy: [number, number];
  social: [number, number];
  adventure: [number, number];
  description?: string;
  state?: string;
  bestTime?: string;
  pricePerDay?: number;
}

export const DESTINATIONS: Destination[] = [
  {
    id: "ladakh",
    title: "Ladakh, J&K",
    img: "https://pin.it/3woq6h8Tm",
    label: "Adventure",
    tags: ["Trekking", "Motorcycle Tours", "Camping"],
    mood: [2, 4],
    energy: [7, 10],
    social: [3, 8],
    adventure: [7, 10],
    state: "Jammu & Kashmir",
    bestTime: "Jun-Sep",
    pricePerDay: 3500,
    description: "High-altitude desert with stunning monasteries, crystal lakes, and adrenaline-pumping adventures."
  },
  {
    id: "rishikesh",
    title: "Rishikesh, Uttarakhand",
    img: "https://pin.it/1IDhaQ710",
    label: "Spiritual",
    tags: ["Yoga", "River Rafting", "Temple Visits"],
    mood: [1, 5],
    energy: [2, 10],
    social: [1, 8],
    adventure: [2, 8],
    state: "Uttarakhand",
    bestTime: "Oct-May",
    pricePerDay: 2000,
    description: "Yoga capital of India with spiritual vibes, adventure activities, and holistic wellness."
  },
  {
    id: "goa",
    title: "Goa Beaches",
    img: "https://pin.it/7tjp3lCRU",
    label: "Relaxation",
    tags: ["Beach", "Water Sports", "Nightlife"],
    mood: [0, 6],
    energy: [5, 10],
    social: [4, 10],
    adventure: [1, 7],
    state: "Goa",
    bestTime: "Nov-Mar",
    pricePerDay: 2500,
    description: "Tropical paradise with pristine beaches, water sports, vibrant nightlife, and Portuguese heritage."
  },
  {
    id: "varanasi",
    title: "Varanasi, UP",
    img: "https://pin.it/6eTALXowH",
    label: "Culture",
    tags: ["Ganga Aarti", "Temples", "Ghats"],
    mood: [1, 4],
    energy: [2, 8],
    social: [1, 7],
    adventure: [2, 5],
    state: "Uttar Pradesh",
    bestTime: "Oct-Mar",
    pricePerDay: 1500,
    description: "Holiest city in India with ancient temples, Ganga Aarti, and profound spiritual experiences."
  },
  {
    id: "jaipur",
    title: "Jaipur, Rajasthan",
    img: "https://pin.it/7CER9yfR1",
    label: "Heritage",
    tags: ["Palaces", "Forts", "Food"],
    mood: [0, 2],
    energy: [4, 10],
    social: [1, 10],
    adventure: [3, 7],
    state: "Rajasthan",
    bestTime: "Oct-Mar",
    pricePerDay: 2000,
    description: "Pink City with grand palaces, forts, and incredible Rajasthani cuisine experiences."
  },
  {
    id: "kerala",
    title: "Kerala Backwaters",
    img: "https://pin.it/2ILHcCJk5",
    label: "Nature",
    tags: ["Houseboat", "Ayurveda", "Lakes"],
    mood: [1, 4],
    energy: [2, 8],
    social: [1, 7],
    adventure: [1, 5],
    state: "Kerala",
    bestTime: "Jun-Sep",
    pricePerDay: 3000,
    description: "Serene backwaters with houseboats, Ayurvedic spas, and lush green landscapes."
  },
  {
    id: "mumbai",
    title: "Mumbai",
    img: "https://pin.it/37ziqQlrw",
    label: "Urban Life",
    tags: ["Nightlife", "Bollywood", "Street Food"],
    mood: [0, 6],
    energy: [5, 10],
    social: [5, 10],
    adventure: [1, 6],
    state: "Maharashtra",
    bestTime: "Nov-Apr",
    pricePerDay: 2800,
    description: "Vibrant metropolitan hub with Bollywood culture, street food, and cosmopolitan energy."
  },
  {
    id: "kolkata",
    title: "Kolkata",
    img: "https://pin.it/I3A9Nkx8b",
    label: "Culture",
    tags: ["Festivals", "Colonial Heritage", "Food"],
    mood: [5, 6],
    energy: [3, 10],
    social: [6, 10],
    adventure: [1, 6],
    state: "West Bengal",
    bestTime: "Oct-Mar",
    pricePerDay: 1800,
    description: "Cultural capital with colonial heritage, vibrant arts scene, and exceptional cuisine."
  },
  {
    id: "agra",
    title: "Agra, Taj Mahal",
    img: "https://pin.it/3hfZ3W0pT",
    label: "Monument",
    tags: ["Architecture", "History", "UNESCO World Heritage"],
    mood: [2, 4],
    energy: [3, 9],
    social: [1, 7],
    adventure: [2, 6],
    state: "Uttar Pradesh",
    bestTime: "Oct-Mar",
    pricePerDay: 2000,
    description: "Home to the iconic Taj Mahal and magnificent Mughal architecture."
  },
  {
    id: "shimla",
    title: "Shimla, Himachal",
    img: "https://pin.it/3P8CWwXUw",
    label: "Hill Station",
    tags: ["Snow", "Toy Train", "Mall Road"],
    mood: [0, 4],
    energy: [3, 9],
    social: [1, 8],
    adventure: [2, 8],
    state: "Himachal Pradesh",
    bestTime: "Mar-Jun, Oct-Dec",
    pricePerDay: 2200,
    description: "Charming hill station with snow, toy train rides, and colonial charm."
  },
  {
    id: "manali",
    title: "Manali, Himachal",
    img: "https://pin.it/4kgApWjxS",
    label: "Adventure",
    tags: ["Paragliding", "Snow", "Hiking"],
    mood: [2, 4],
    energy: [5, 10],
    social: [2, 10],
    adventure: [5, 10],
    state: "Himachal Pradesh",
    bestTime: "Mar-Jun, Sep-Nov",
    pricePerDay: 2500,
    description: "Adventure paradise with paragliding, snow, and breathtaking mountain trekking."
  },
  {
    id: "darjeeling",
    title: "Darjeeling, West Bengal",
    img: "https://pin.it/52ftiWVLl",
    label: "Tea Gardens",
    tags: ["Toy Train", "Mountain Views", "Tea Estate"],
    mood: [1, 4],
    energy: [2, 8],
    social: [1, 6],
    adventure: [3, 8],
    state: "West Bengal",
    bestTime: "Apr-Jun, Sep-Nov",
    pricePerDay: 2000,
    description: "Tea garden hub with iconic toy train and stunning Kanchenjunga views."
  },
  {
    id: "ooty",
    title: "Ooty, Tamil Nadu",
    img: "https://pin.it/19k661Qzs",
    label: "Nature",
    tags: ["Botanical Gardens", "Mountain Train", "Lakes"],
    mood: [1, 3],
    energy: [2, 8],
    social: [1, 7],
    adventure: [2, 6],
    state: "Tamil Nadu",
    bestTime: "Apr-Jun, Sep-Nov",
    pricePerDay: 1800,
    description: "Queen of Hill Stations with botanical gardens and serene mountain beauty."
  },
  {
    id: "hampi",
    title: "Hampi, Karnataka",
    img: "https://pin.it/PQPJ08Y9V",
    label: "Heritage",
    tags: ["Ancient Temples", "Ruins", "UNESCO Site"],
    mood: [4, 5],
    energy: [2, 7],
    social: [1, 7],
    adventure: [2, 6],
    state: "Karnataka",
    bestTime: "Oct-Feb",
    pricePerDay: 1500,
    description: "UNESCO World Heritage Site with stunning temple ruins and historical charm."
  },
  {
    id: "andaman",
    title: "Andaman Islands",
    img: "https://pin.it/6knWrblS8",
    label: "Beach",
    tags: ["Scuba Diving", "Snorkeling", "Islands"],
    mood: [0, 5],
    energy: [5, 10],
    social: [2, 10],
    adventure: [4, 10],
    state: "Andaman & Nicobar",
    bestTime: "Nov-May",
    pricePerDay: 3500,
    description: "Tropical island paradise with world-class diving and pristine beaches."
  },
  {
    id: "leh",
    title: "Leh, Ladakh",
    img: "https://pin.it/3dFZc1cwb",
    label: "Mountains",
    tags: ["Monasteries", "Adventure", "Pangong Lake"],
    mood: [2, 4],
    energy: [5, 10],
    social: [2, 8],
    adventure: [7, 10],
    state: "Ladakh",
    bestTime: "Jun-Sep",
    pricePerDay: 3200,
    description: "Gateway to Ladakh with ancient monasteries and high-altitude adventures."
  },
  {
    id: "sikkim",
    title: "Sikkim",
    img: "https://pin.it/5LFPZFVV2",
    label: "Nature",
    tags: ["Monasteries", "Lakes", "Himalayan Views"],
    mood: [1, 4],
    energy: [3, 9],
    social: [1, 7],
    adventure: [2, 6],
    state: "Sikkim",
    bestTime: "Mar-Jun, Sep-Nov",
    pricePerDay: 2300,
    description: "Biodiversity hotspot with sacred lakes, monasteries, and Himalayan splendor."
  },
  {
    id: "pushkar",
    title: "Pushkar, Rajasthan",
    img: "https://pin.it/5HF0eWQQP",
    label: "Festival",
    tags: ["Camel Fair", "Sacred Lake", "Temples"],
    mood: [3, 5],
    energy: [2, 8],
    social: [2, 10],
    adventure: [2, 7],
    state: "Rajasthan",
    bestTime: "Oct-Nov",
    pricePerDay: 1800,
    description: "Famous for Camel Fair with spiritual and festive atmosphere."
  },
  {
    id: "udaipur",
    title: "Udaipur, Rajasthan",
    img: "https://pin.it/5QRAvIpOv",
    label: "Romantic",
    tags: ["Lakes", "Palaces", "Culture"],
    mood: [0, 5],
    energy: [2, 8],
    social: [1, 7],
    adventure: [2, 6],
    state: "Rajasthan",
    bestTime: "Oct-Mar",
    pricePerDay: 2200,
    description: "Venice of the East with magnificent palaces, lakes, and romantic ambiance."
  },
  {
    id: "mysore",
    title: "Mysore, Karnataka",
    img: "https://pin.it/6clwgnUVX",
    label: "Culture",
    tags: ["Palace", "Dasara Festival", "Zoo"],
    mood: [1, 6],
    energy: [2, 8],
    social: [2, 9],
    adventure: [1, 6],
    state: "Karnataka",
    bestTime: "Sep-Nov",
    pricePerDay: 1700,
    description: "Palace City with grand architecture, festivals, and cultural richness."
  },
  {
    id: "puducherry",
    title: "Puducherry",
    img: "https://pin.it/3uHsUfXDc",
    label: "Beach",
    tags: ["French Town", "Beaches", "Auroville"],
    mood: [0, 5],
    energy: [3, 10],
    social: [2, 10],
    adventure: [1, 7],
    state: "Puducherry",
    bestTime: "Nov-Feb",
    pricePerDay: 1900,
    description: "Former French colony with charming architecture, beaches, and spiritual Auroville."
  },
  {
    id: "mahabaleshwar",
    title: "Mahabaleshwar, Maharashtra",
    img: "https://pin.it/6dLW33ehT",
    label: "Nature",
    tags: ["Strawberry Farms", "Sunrise Views", "Forest"],
    mood: [1, 5],
    energy: [2, 10],
    social: [1, 8],
    adventure: [1, 6],
    state: "Maharashtra",
    bestTime: "Oct-May",
    pricePerDay: 1900,
    description: "Hill station with strawberry farms, sunrise viewpoints, and forest trekking."
  },
  {
    id: "dharamsala",
    title: "Dharamsala, Himachal",
    img: "https://pin.it/33I8JzwlR",
    label: "Spiritual",
    tags: ["Monasteries", "Trekking", "Tea Gardens"],
    mood: [1, 4],
    energy: [2, 8],
    social: [1, 6],
    adventure: [2, 8],
    state: "Himachal Pradesh",
    bestTime: "Mar-Jun, Sep-Nov",
    pricePerDay: 2000,
    description: "Spiritual hub with Tibetan monasteries and mountain trekking trails."
  },
  {
    id: "haridwar",
    title: "Haridwar, Uttarakhand",
    img: "https://pin.it/7fHrZzik6",
    label: "Spiritual",
    tags: ["Ganga Aarti", "Temples", "Kumbh Mela"],
    mood: [4, 5],
    energy: [2, 8],
    social: [2, 10],
    adventure: [1, 5],
    state: "Uttarakhand",
    bestTime: "Oct-Mar",
    pricePerDay: 1600,
    description: "Gateway to Himalayas with sacred Ganga Aarti and spiritual rejuvenation."
  },
  {
    id: "jaisalmer",
    title: "Jaisalmer, Rajasthan",
    img: "https://pin.it/7j9XacxlS",
    label: "Desert",
    tags: ["Camel Safari", "Forts", "Sand Dunes"],
    mood: [2, 4],
    energy: [4, 10],
    social: [2, 10],
    adventure: [5, 10],
    state: "Rajasthan",
    bestTime: "Oct-Mar",
    pricePerDay: 2100,
    description: "Golden Desert with camel safaris, forts, and sand dune adventures."
  },
  {
    id: "khajuraho",
    title: "Khajuraho, MP",
    img: "https://pin.it/3h9d6BU9n",
    label: "Heritage",
    tags: ["Temples", "Sculpture Art", "UNESCO Site"],
    mood: [3, 5],
    energy: [2, 8],
    social: [1, 7],
    adventure: [2, 6],
    state: "Madhya Pradesh",
    bestTime: "Oct-Mar",
    pricePerDay: 1700,
    description: "UNESCO site with exquisite medieval temples and artistic sculptures."
  },
  {
    id: "coorg",
    title: "Coorg, Karnataka",
    img: "https://pin.it/3gJBzixfk",
    label: "Nature",
    tags: ["Coffee Farms", "Hills", "River Rafting"],
    mood: [1, 4],
    energy: [2, 8],
    social: [2, 7],
    adventure: [1, 7],
    state: "Karnataka",
    bestTime: "Sep-Nov, Apr-May",
    pricePerDay: 2100,
    description: "Coffee country with lush plantations, waterfalls, and adventure activities."
  },
  {
    id: "kanchenjunga",
    title: "Kanchenjunga National Park, Sikkim",
    img: "https://pin.it/2pZFPNhi7",
    label: "Wildlife",
    tags: ["Himalayan Views", "Trekking", "Nature Trails"],
    mood: [2, 4],
    energy: [3, 10],
    social: [1, 7],
    adventure: [4, 10],
    state: "Sikkim",
    bestTime: "Mar-May, Sep-Nov",
    pricePerDay: 2800,
    description: "Pristine alpine wilderness with third-highest peak and biodiversity."
  },
  {
    id: "sundarbans",
    title: "Sundarbans, West Bengal",
    img: "https://pin.it/6UIVlfU8n",
    label: "Wildlife",
    tags: ["Mangroves", "Tiger Reserve", "Boat Safari"],
    mood: [2, 4],
    energy: [3, 9],
    social: [1, 7],
    adventure: [4, 10],
    state: "West Bengal",
    bestTime: "Nov-Feb",
    pricePerDay: 2400,
    description: "Mangrove forest with Bengal tigers and thrilling wildlife safaris."
  },
  {
    id: "auli",
    title: "Auli, Uttarakhand",
    img: "https://pin.it/3IctDsQPN",
    label: "Snow",
    tags: ["Skiing", "Mountains", "Nature"],
    mood: [2, 4],
    energy: [6, 10],
    social: [2, 8],
    adventure: [7, 10],
    state: "Uttarakhand",
    bestTime: "Dec-Feb",
    pricePerDay: 3000,
    description: "India's premier skiing destination with snow sports and mountain beauty."
  },
  {
    id: "kutch",
    title: "Kutch, Gujarat",
    img: "https://pin.it/4z4izmlSA",
    label: "Festival",
    tags: ["Rann Utsav", "White Desert", "Culture"],
    mood: [3, 5],
    energy: [2, 10],
    social: [2, 10],
    adventure: [2, 7],
    state: "Gujarat",
    bestTime: "Nov-Feb",
    pricePerDay: 2000,
    description: "White salt desert with colorful Rann Utsav festival celebrating culture."
  },
  {
    id: "amritsar",
    title: "Amritsar, Punjab",
    img: "https://pin.it/313RWW92q",
    label: "Spiritual",
    tags: ["Golden Temple", "Wagah Border", "Punjabi Food"],
    mood: [4, 5],
    energy: [2, 10],
    social: [2, 10],
    adventure: [1, 5],
    state: "Punjab",
    bestTime: "Oct-Mar",
    pricePerDay: 1800,
    description: "Holiest Sikh shrine with vibrant culture and spectacular Wagah border ceremony."
  },
  {
    id: "bodh-gaya",
    title: "Bodh Gaya, Bihar",
    img: "https://pin.it/6IYhJN5i7",
    label: "Spiritual",
    tags: ["Buddhist Temple", "Meditation", "Heritage"],
    mood: [4, 5],
    energy: [2, 8],
    social: [1, 8],
    adventure: [1, 5],
    state: "Bihar",
    bestTime: "Oct-Mar",
    pricePerDay: 1400,
    description: "Most sacred Buddhist site where Buddha attained enlightenment."
  },
  {
    id: "tawang",
    title: "Tawang, Arunachal Pradesh",
    img: "https://pin.it/7vI9sMUM2",
    label: "Mountains",
    tags: ["Monasteries", "Himalayan Views", "Culture"],
    mood: [2, 4],
    energy: [6, 10],
    social: [2, 8],
    adventure: [7, 10],
    state: "Arunachal Pradesh",
    bestTime: "Apr-Jun, Sep-Oct",
    pricePerDay: 2500,
    description: "Himalayan monastery town with pristine beauty and Buddhist culture."
  },
  {
    id: "munnar",
    title: "Munnar, Kerala",
    img: "https://pin.it/5BzKZlpyj",
    label: "Nature",
    tags: ["Tea Gardens", "Hiking", "Waterfalls"],
    mood: [1, 4],
    energy: [2, 8],
    social: [1, 7],
    adventure: [2, 7],
    state: "Kerala",
    bestTime: "Sep-Nov, Mar-May",
    pricePerDay: 2200,
    description: "Tea country with rolling plantations, misty mountains, and waterfalls."
  },
  {
    id: "gangtok",
    title: "Gangtok, Sikkim",
    img: "https://pin.it/539jRIRGN",
    label: "Mountains",
    tags: ["Culture", "Monuments", "Nature"],
    mood: [0, 4],
    energy: [2, 8],
    social: [2, 7],
    adventure: [2, 7],
    state: "Sikkim",
    bestTime: "Mar-Jun, Sep-Nov",
    pricePerDay: 2000,
    description: "Vibrant hill city with cultural monasteries and natural beauty."
  },
  {
    id: "puri",
    title: "Puri, Odisha",
    img: "https://pin.it/2HDWUQlfs",
    label: "Festival",
    tags: ["Jagannath Temple", "Beach", "Culture"],
    mood: [3, 5],
    energy: [2, 10],
    social: [2, 10],
    adventure: [2, 7],
    state: "Odisha",
    bestTime: "Oct-Mar",
    pricePerDay: 1500,
    description: "Temple city with Rath Yatra festival and spiritual beach experiences."
  },
  {
    id: "ranthambore",
    title: "Ranthambore National Park",
    img: "https://pin.it/1E20b68Rj",
    label: "Wildlife",
    tags: ["Tiger Safari", "Jungle", "Nature"],
    mood: [2, 4],
    energy: [5, 10],
    social: [2, 9],
    adventure: [6, 10],
    state: "Rajasthan",
    bestTime: "Oct-Mar",
    pricePerDay: 2600,
    description: "Premier tiger sanctuary with thrilling safari experiences."
  },
  {
    id: "kaziranga",
    title: "Kaziranga National Park",
    img: "https://pin.it/5LNmJtSOT",
    label: "Wildlife",
    tags: ["Rhino Safari", "Bird Watching", "Nature"],
    mood: [2, 3],
    energy: [3, 10],
    social: [1, 7],
    adventure: [4, 10],
    state: "Assam",
    bestTime: "Oct-Mar",
    pricePerDay: 2300,
    description: "Rhino habitat and UNESCO site with incredible biodiversity."
  },
  {
    id: "mount-abu",
    title: "Mount Abu, Rajasthan",
    img: "https://pin.it/6WdtnfI8W",
    label: "Hill Station",
    tags: ["Boating", "Dilwara Temples", "Viewpoint"],
    mood: [1, 4],
    energy: [2, 8],
    social: [1, 7],
    adventure: [2, 6],
    state: "Rajasthan",
    bestTime: "Apr-Jun, Sep-Nov",
    pricePerDay: 1900,
    description: "Rajasthan's only hill station with temples and serene environment."
  },
  {
    id: "jodhpur",
    title: "Jodhpur, Rajasthan",
    img: "https://pin.it/4XFNT0R2i",
    label: "Heritage",
    tags: ["Blue City", "Forts", "Palaces"],
    mood: [2, 5],
    energy: [4, 10],
    social: [2, 10],
    adventure: [3, 8],
    state: "Rajasthan",
    bestTime: "Oct-Mar",
    pricePerDay: 2000,
    description: "Blue City with majestic fort and vibrant desert culture."
  },
  {
    id: "chennai",
    title: "Chennai, Tamil Nadu",
    img: "https://pin.it/62drxiuHs",
    label: "Urban",
    tags: ["Beach", "Culture", "Temples"],
    mood: [0, 5],
    energy: [3, 10],
    social: [2, 10],
    adventure: [1, 7],
    state: "Tamil Nadu",
    bestTime: "Nov-Feb",
    pricePerDay: 1900,
    description: "Metropolis with temples, beaches, and rich South Indian culture."
  },
  {
    id: "hyderabad",
    title: "Hyderabad, Telangana",
    img: "https://pin.it/7GsfZuAbU",
    label: "Culture",
    tags: ["Birla Mandir", "Charminar", "Cuisine"],
    mood: [1, 6],
    energy: [2, 8],
    social: [4, 9],
    adventure: [1, 6],
    state: "Telangana",
    bestTime: "Nov-Feb",
    pricePerDay: 1800,
    description: "City of pearls with Charminar monument and world-class cuisine."
  },
  {
    id: "kodaikanal",
    title: "Kodaikanal, Tamil Nadu",
    img: "https://pin.it/2ykDQJFqJ",
    label: "Nature",
    tags: ["Lake", "Forest", "Hiking"],
    mood: [2, 3],
    energy: [2, 8],
    social: [2, 7],
    adventure: [2, 7],
    state: "Tamil Nadu",
    bestTime: "Sep-Mar",
    pricePerDay: 1800,
    description: "Princess of hill stations with pristine lake and forest trails."
  },
  {
    id: "alleppey",
    title: "Alleppey, Kerala",
    img: "https://pin.it/5racSe4iH",
    label: "Backwaters",
    tags: ["Houseboat", "Canals", "Ayurveda"],
    mood: [1, 5],
    energy: [2, 8],
    social: [1, 8],
    adventure: [1, 5],
    state: "Kerala",
    bestTime: "Nov-Mar",
    pricePerDay: 2800,
    description: "Venice of the East with houseboat cruises and Ayurvedic treatments."
  },
  {
    id: "spiti-valley",
    title: "Spiti Valley, Himachal",
    img: "https://pin.it/7BjPUaRQg",
    label: "Adventure",
    tags: ["Road Trip", "Buddhist Monasteries", "Lakes"],
    mood: [2, 4],
    energy: [7, 10],
    social: [1, 7],
    adventure: [7, 10],
    state: "Himachal Pradesh",
    bestTime: "May-Sep",
    pricePerDay: 2700,
    description: "High-altitude desert valley with monasteries and thrilling road trips."
  },
  {
    id: "tirupati",
    title: "Tirupati, Andhra Pradesh",
    img: "https://pin.it/10IWIhapE",
    label: "Spiritual",
    tags: ["Balaji Temple", "Religious", "Heritage"],
    mood: [4, 5],
    energy: [2, 8],
    social: [1, 8],
    adventure: [1, 5],
    state: "Andhra Pradesh",
    bestTime: "Nov-Feb",
    pricePerDay: 1500,
    description: "Holiest Hindu pilgrimage destination with one of world's richest temples."
  },
  {
    id: "matheran",
    title: "Matheran, Maharashtra",
    img: "https://pin.it/3KHIP7zAB",
    label: "Nature",
    tags: ["Forest", "Hiking", "Toy Train"],
    mood: [1, 5],
    energy: [2, 8],
    social: [1, 8],
    adventure: [1, 6],
    state: "Maharashtra",
    bestTime: "Oct-May",
    pricePerDay: 1700,
    description: "Eco-friendly hill station with no vehicles and pristine forest trails."
  },
  {
    id: "lakshadweep",
    title: "Lakshadweep Islands",
    img: "https://pin.it/6B9R0Qpv4",
    label: "Beach",
    tags: ["Snorkeling", "Scuba Diving", "Islands"],
    mood: [0, 5],
    energy: [8, 10],
    social: [4, 10],
    adventure: [8, 10],
    state: "Lakshadweep",
    bestTime: "Oct-May",
    pricePerDay: 4000,
    description: "Tropical island chain with pristine coral reefs and water sports."
  },
  {
    id: "rameswaram",
    title: "Rameswaram, Tamil Nadu",
    img: "https://pin.it/47RBOKgpN",
    label: "Spiritual",
    tags: ["Temple", "Beach", "Heritage"],
    mood: [4, 5],
    energy: [2, 8],
    social: [1, 8],
    adventure: [1, 5],
    state: "Tamil Nadu",
    bestTime: "Nov-Feb",
    pricePerDay: 1600,
    description: "Sacred pilgrimage site with temple and beautiful beaches."
  }
];

export interface UseFaceDetectionReturnV2 {
  loadingModels: boolean;
  modelsLoaded: boolean;
  error: string | null;
  faceCount: number | null;
  analyzeImage: (
    image: HTMLImageElement | HTMLVideoElement
  ) => Promise<AnalysisResult | null>;
  analyzeFromImage: (
    imageDataUrl: string
  ) => Promise<AnalysisResult | null>;
  analyzeFromVideo: (
    videoRef: RefObject<HTMLVideoElement>
  ) => Promise<AnalysisResult | null>;
  detectFacesFromVideo: (
    videoRef: RefObject<HTMLVideoElement>
  ) => Promise<number>;
  // expose a manual loader for advanced usage
  loadModels: () => Promise<void>;
}

/**
 * useFaceDetection
 * - Loads models from `/models` (public folder)
 * - Exposes `modelsLoaded` and `loadingModels` flags
 * - Exposes `analyzeImage` which waits for models and runs detection
 *
 * Notes:
 * - Ensure all model files (the *.bin and *weights_manifest.json) are present in `public/models`.
 * - In production the `/models` path must resolve to those files (Vite serves public/ at root).
 */
export function useFaceDetection(): UseFaceDetectionReturnV2 {
  const [loadingModels, setLoadingModels] = useState<boolean>(false);
  const [modelsLoaded, setModelsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [faceCount, setFaceCount] = useState<number | null>(null);
  const loadOnceRef = useRef<boolean>(false);

  const loadModels = useCallback(async (): Promise<void> => {
    if (loadOnceRef.current) return;
    setLoadingModels(true);
    setError(null);

    try {
      // Check if backend is already initialized to avoid context loss
      // @ts-ignore
      const currentBackend = faceapi.tf.getBackend();
      if (currentBackend === 'webgl' || currentBackend === 'cpu') {
        console.log(`TensorFlow.js backend already active: ${currentBackend}`);
      } else {
        // Try WebGL first for performance, fallback to CPU if it fails
        try {
          console.log('Attempting to set TensorFlow.js backend to WebGL...');
          // @ts-ignore
          await faceapi.tf.setBackend('webgl');
          // @ts-ignore
          await faceapi.tf.ready();
          // @ts-ignore
          console.log('✓ TensorFlow.js backend:', faceapi.tf.getBackend());
        } catch (webglError) {
          console.warn('WebGL backend failed, falling back to CPU...', webglError);
          // @ts-ignore
          await faceapi.tf.setBackend('cpu');
          // @ts-ignore
          await faceapi.tf.ready();
          // @ts-ignore
          console.log('✓ TensorFlow.js backend (fallback):', faceapi.tf.getBackend());
        }
      }

      // Load each model with its own try/catch so we can report corrupt/partial downloads
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_PATH);
        console.log('✓ Loaded ssdMobilenetv1');
      } catch (err) {
        console.error('Failed to load ssdMobilenetv1 from', MODELS_PATH, err);
        throw new Error('ssdMobilenetv1 failed to load');
      }

      try {
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_PATH);
        console.log('✓ Loaded faceLandmark68Net');
      } catch (err) {
        console.error('Failed to load faceLandmark68Net from', MODELS_PATH, err);
        throw new Error('faceLandmark68Net failed to load');
      }

      try {
        await faceapi.nets.faceExpressionNet.loadFromUri(MODELS_PATH);
        console.log('✓ Loaded faceExpressionNet');
      } catch (err) {
        console.error('Failed to load faceExpressionNet from', MODELS_PATH, err);
        throw new Error('faceExpressionNet failed to load');
      }

      // If we reach here, all models loaded successfully
      loadOnceRef.current = true;
      setModelsLoaded(true);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Models could not be loaded';
      setError(
        `${message}. Models could not be loaded. Check that all .bin and manifest files are present in public/models and not corrupted.`
      );
      setModelsLoaded(false);
      console.error('Model loading error:', err);
      // rethrow so callers can handle if needed
      throw err;
    } finally {
      setLoadingModels(false);
    }
  }, []);

  // Auto-load models on mount (runs once)
  useEffect(() => {
    // load in background but don't block render; analyzeImage will await if needed
    void loadModels().catch(() => {
      /* error already set in loadModels */
    });
  }, [loadModels]);

  // Helper to normalize face-api detection -> DetectedFace
  const toDetectedFace = (d: faceapi.WithFaceExpressions<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>>): DetectedFace => {
    const box = d.detection.box;
    const exprs = d.expressions as unknown as Record<string, number>;
    const emotions: EmotionScores = {
      happy: exprs.happy ?? 0,
      sad: exprs.sad ?? 0,
      angry: exprs.angry ?? 0,
      surprised: exprs.surprised ?? 0,
      neutral: exprs.neutral ?? 0,
      fear: exprs.fear ?? 0,
      disgust: exprs.disgust ?? 0,
    };

    return {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
      emotions,
      confidence: d.detection.score,
    };
  };

  /**
   * analyzeImage
   * - Accepts an `HTMLImageElement` or `HTMLVideoElement`.
   * - Waits for models to be loaded; if models failed to load, returns null.
   * - Returns an aggregated AIAnalysisResult or null on failure.
   */
  const analyzeImage = useCallback(async (image: HTMLImageElement | HTMLVideoElement): Promise<AnalysisResult | null> => {
    try {
      // Ensure models are loaded before trying to detect
      if (!modelsLoaded) {
        console.log('Models not loaded, loading now...');
        await loadModels();
      }

      if (!modelsLoaded) {
        // Still not loaded after attempt
        setError('Models failed to load. Please refresh the page.');
        return null;
      }

      // Detect faces with expressions
      console.log('Detecting faces...');
      const detections = await faceapi
        .detectAllFaces(image)
        .withFaceLandmarks()
        .withFaceExpressions();

      if (!detections || detections.length === 0) {
        setError('No face detected. Please try another image or angle.');
        return null;
      }

      console.log(`Detected ${detections.length} face(s)`);
      const faces = detections.map(toDetectedFace);
      setFaceCount(detections.length);

      // Aggregate emotions across detected faces (mean)
      const agg: EmotionScores = faces.reduce(
        (acc, f) => {
          acc.happy += f.emotions.happy;
          acc.sad += f.emotions.sad;
          acc.angry += f.emotions.angry;
          acc.surprised += f.emotions.surprised;
          acc.neutral += f.emotions.neutral;
          acc.fear += f.emotions.fear;
          acc.disgust += f.emotions.disgust;
          return acc;
        },
        { happy: 0, sad: 0, angry: 0, surprised: 0, neutral: 0, fear: 0, disgust: 0 }
      );

      const facesCount = faces.length;
      const emotionsMean: EmotionScores = {
        happy: agg.happy / facesCount,
        sad: agg.sad / facesCount,
        angry: agg.angry / facesCount,
        surprised: agg.surprised / facesCount,
        neutral: agg.neutral / facesCount,
        fear: agg.fear / facesCount,
        disgust: agg.disgust / facesCount,
      };

      // Choose top emotion
      const topEmotion = Object.entries(emotionsMean).sort((a, b) => b[1] - a[1])[0];
      const detectedMood = topEmotion ? `${topEmotion[0]}` : 'neutral';

      const result: AnalysisResult = {
        detectedMood,
        confidence: faces.reduce((s, f) => s + f.confidence, 0) / facesCount,
        emotions: emotionsMean,
        reasoning: `Detected ${facesCount} face(s); top emotion: ${detectedMood}`,
        energyLevel: Math.round((emotionsMean.happy - emotionsMean.sad + 1) * 5),
        socialScore: Math.round((emotionsMean.happy + emotionsMean.neutral) * 5),
        adventureScore: Math.round((emotionsMean.surprised + emotionsMean.happy) * 5),
        recommendations: [],
      };

      setError(null);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Face detection failed';
      setError(message);
      console.error('analyzeImage error:', err);
      return null;
    }
  }, [error, loadModels, modelsLoaded]);

  /**
   * analyzeFromImage
   * - Accepts a base64 data URL string
   * - Converts to HTMLImageElement and runs analysis
   */
  const analyzeFromImage = useCallback(async (imageDataUrl: string): Promise<AnalysisResult | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = async () => {
        const result = await analyzeImage(img);
        resolve(result);
      };
      img.onerror = () => {
        setError('Failed to load image');
        resolve(null);
      };
      img.src = imageDataUrl;
    });
  }, [analyzeImage]);

  /**
   * analyzeFromVideo
   * - Accepts a React RefObject<HTMLVideoElement>
   * - Guards against null ref and runs analysis safely
   */
  const analyzeFromVideo = useCallback(async (videoRef: RefObject<HTMLVideoElement>): Promise<AnalysisResult | null> => {
    if (!videoRef.current) {
      console.warn('⚠️ analyzeFromVideo called but videoRef.current is null');
      setError('Video element not available for analysis');
      return null;
    }

    // Ensure video is ready with actual dimensions
    if (videoRef.current.readyState < 2) {
      console.warn('⚠️ Video not ready yet (readyState:', videoRef.current.readyState, ')');
      setError('Video not ready. Please wait for camera to initialize.');
      return null;
    }

    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      console.warn('⚠️ Video has no dimensions');
      setError('Video has no dimensions. Please check camera.');
      return null;
    }

    console.log('📹 Analyzing video from ref:', {
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight,
      readyState: videoRef.current.readyState
    });

    return analyzeImage(videoRef.current);
  }, [analyzeImage]);

  /**
   * detectFacesFromVideo
   * - Quick face count detection from video ref
   * - Returns number of faces detected (used for live preview)
   */
  const detectFacesFromVideo = useCallback(async (videoRef: RefObject<HTMLVideoElement>): Promise<number> => {
    if (!videoRef.current) {
      console.warn('⚠️ detectFacesFromVideo: videoRef.current is null');
      setFaceCount(null);
      return 0;
    }

    if (!modelsLoaded) {
      console.log('Models not loaded yet for face detection');
      return 0;
    }

    if (videoRef.current.readyState < 2) {
      return 0;
    }

    try {
      const detections = await faceapi.detectAllFaces(videoRef.current);
      const count = detections?.length || 0;
      setFaceCount(count);
      console.log(`👤 Detected ${count} face(s) in video`);
      return count;
    } catch (err) {
      console.error('Face detection error:', err);
      return 0;
    }
  }, [modelsLoaded]);

  return {
    loadingModels,
    modelsLoaded,
    error,
    faceCount,
    analyzeImage,
    analyzeFromImage,
    analyzeFromVideo,
    detectFacesFromVideo,
    loadModels,
  };
}
