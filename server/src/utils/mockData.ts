export const heroRecommendations = [
  {
    destination: 'Leh, Ladakh',
    bestSeason: 'June - September',
    idealBudgetInr: 55000,
    highlights: ['Monasteries', 'High passes', 'Astro stays']
  },
  {
    destination: 'Coorg, Karnataka',
    bestSeason: 'October - March',
    idealBudgetInr: 32000,
    highlights: ['Coffee estates', 'Rainforest hikes', 'Kodava cuisine']
  }
];

export const heroSeasonTips = [
  { season: 'Winter', suggestion: 'Try snow drives across Kashmir & Himachal' },
  { season: 'Monsoon', suggestion: 'Go for Konkan coastal rail journeys' },
  { season: 'Summer', suggestion: 'Leverage night trains + hill homestays' }
];

export const journeyTransportOptions = [
  {
    type: 'flight',
    provider: 'IndiGo',
    durationHours: 2.1,
    priceInr: 5400,
    carbonKg: 92
  },
  {
    type: 'train',
    provider: 'Vande Bharat',
    durationHours: 5.5,
    priceInr: 1850,
    carbonKg: 24
  },
  {
    type: 'bus',
    provider: 'KSRTC Airavat',
    durationHours: 8,
    priceInr: 1450,
    carbonKg: 30
  },
  {
    type: 'cab',
    provider: 'DarShana Partner Fleet',
    durationHours: 6,
    priceInr: 7800,
    carbonKg: 70
  }
];

export const travelCategories = [
  { id: 'adventure', name: 'Adventure', description: 'Himalayan treks, scuba circuits, desert drives' },
  { id: 'beaches', name: 'Beaches', description: 'Konkan, Andamans, Lakshadweep' },
  { id: 'hills', name: 'Hill Stations', description: 'Darjeeling to Coonoor with toy trains' },
  { id: 'pilgrimage', name: 'Pilgrimage', description: 'Char Dham, Jyotirlinga, Sufi trails' },
  { id: 'heritage', name: 'Heritage', description: 'Fort circuits, UNESCO clusters, craft towns' }
];

export const galleryItems = [
  { id: 'pangong', label: 'Pangong Lake Galaxy', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee' },
  { id: 'varanasi', label: 'Varanasi Ghat Aarti', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e' },
  { id: 'alleppey', label: 'Alleppey Backwaters', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' },
  { id: 'spiti', label: 'Spiti Moonland', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429' }
];

export const specialFeatureAbilities = {
  mood: ['Joyful', 'Stressed', 'Adventurous'],
  planners: ['AI itinerary', 'Green route calculator', 'Expense estimator']
};

export const defaultReviews = [
  {
    title: 'Flawless Kashmir loop',
    rating: 5,
    comment: 'Houseboat to Gondola and everything synced perfectly.',
    author: 'Priya Malhotra'
  },
  {
    title: 'Coorg workcation bliss',
    rating: 4.8,
    comment: 'Fiber-ready stays plus curated plantation walks.',
    author: 'Arjun Narayanan'
  }
];

export const defaultBlogs = [
  {
    title: 'Konkan Monsoon Playbook',
    slug: 'konkan-monsoon',
    excerpt: 'NH66 pit-stops, forts, and pet-friendly stays.',
    heroImage: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
    tags: ['Roadtrip', 'Monsoon'],
    body: 'Full content coming soon.'
  },
  {
    title: 'Northeast Permit 101',
    slug: 'northeast-permits',
    excerpt: 'Understand ILP, PAP, and eco fees for 2025.',
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    tags: ['Permits', 'Northeast'],
    body: 'Full content coming soon.'
  }
];

export const mockDestinations = [
  {
    name: 'Leh & Nubra',
    state: 'Ladakh',
    region: 'Trans-Himalaya',
    shortDescription: 'High passes, monasteries, astro stays, and glamping by Pangong.',
    highlights: ['Khardung La drive', 'Pangong lake glamping', 'Shanti Stupa sunsets'],
    bestSeason: 'Jun - Sep',
    climate: 'Cold desert',
    priceRange: '₹45k - ₹65k',
    rating: 4.95,
    heroImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    gallery: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429'
    ],
    tags: ['Adventure', 'Stargazing']
  },
  {
    name: 'Coorg plantations',
    state: 'Karnataka',
    region: 'Western Ghats',
    shortDescription: 'Rainforest villas, coffee trails, and heritage Kodava cuisine.',
    highlights: ['Coffee cupping', 'Tadiandamol trek', 'River rafting'],
    bestSeason: 'Oct - Mar',
    climate: 'Tropical highland',
    priceRange: '₹28k - ₹42k',
    rating: 4.8,
    heroImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    gallery: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e'
    ],
    tags: ['Workcation', 'Wellness']
  },
  {
    name: 'Sohra & Mawlynnong',
    state: 'Meghalaya',
    region: 'North East',
    shortDescription: 'Living root bridges, waterfalls, and clean village walks in the clouds.',
    highlights: ['Double decker root bridge', 'Clean village trail', 'Waterfall hopping'],
    bestSeason: 'Sep - Apr',
    climate: 'Subtropical highland',
    priceRange: '₹32k - ₹48k',
    rating: 4.9,
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
    ],
    tags: ['Nature', 'Culture']
  }
];

export const mockPackages = [
  {
    title: 'Kashmir Silk Route · 6D',
    slug: 'kashmir-silk-route',
    duration: '6 days / 5 nights',
    price: 82500,
    description: 'Houseboats, gondolas, saffron farms, and artisan walks.',
    inclusions: ['Breakfast & dinner', 'Dedicated SUV', 'Permits'],
    exclusions: ['Flights', 'Personal shopping'],
    itinerary: [
      'Day 1: Srinagar arrival + shikara',
      'Day 2: Gulmarg gondola & kahwa tasting',
      'Day 3: Sonamarg day trip',
      'Day 4: Pahalgam hike',
      'Day 5: Srinagar heritage walk',
      'Day 6: Departure'
    ],
    heroImage: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
    tags: ['Premium', 'Nature']
  },
  {
    title: 'Kerala Backwater Wellness · 7D',
    slug: 'kerala-backwater-wellness',
    duration: '7 days / 6 nights',
    price: 74000,
    description: 'Munnar, Alleppey houseboat, Ayurveda retreats, and beaches.',
    inclusions: ['All meals on houseboat', 'Ayurveda consult', 'Cultural evenings'],
    exclusions: ['Flights to Kochi', 'Optional scuba'],
    itinerary: [
      'Day 1: Kochi heritage trail',
      'Day 2: Munnar tea estates',
      'Day 3: Spice plantation & Kathakali',
      'Day 4: Alleppey premium houseboat',
      'Day 5: Kumarakom birding',
      'Day 6: Marari Ayurveda sessions',
      'Day 7: Departure'
    ],
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    tags: ['Wellness', 'Slow travel']
  }
];
