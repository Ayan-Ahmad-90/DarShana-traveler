// Simple Festival Alerts Server (CommonJS)
const express = require('express');
const cors = require('cors');

const app = express();

// CORS - Allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Sample festivals data
const sampleFestivals = [
  // Past month (October 2025)
  {
    _id: 'durga-puja-2025',
    name: 'Durga Puja',
    region: 'East India',
    date: '2025-10-21',
    description: 'The grand festival celebrating Goddess Durga with elaborate pandals, cultural performances, and community gatherings across Kolkata and Bengal.',
    subscribers: []
  },
  {
    _id: 'dussehra-2025',
    name: 'Dussehra / Vijayadashami',
    region: 'North India',
    date: '2025-10-23',
    description: 'Victory of good over evil celebrated with Ramlila performances and burning of Ravana effigies in Delhi, Varanasi.',
    subscribers: []
  },
  // This month (November 2025)
  {
    _id: 'diwali-2025',
    name: 'Diwali - Festival of Lights',
    region: 'North India',
    date: '2025-11-12',
    description: 'The biggest festival of India! Celebrate with diyas, fireworks, rangoli, sweets, and family gatherings. Best in Jaipur, Varanasi, Amritsar.',
    subscribers: []
  },
  {
    _id: 'bhai-dooj-2025',
    name: 'Bhai Dooj',
    region: 'North India',
    date: '2025-11-14',
    description: 'A celebration of the bond between brothers and sisters, with tilak ceremonies and gift exchanges.',
    subscribers: []
  },
  {
    _id: 'chhath-puja-2025',
    name: 'Chhath Puja',
    region: 'East India',
    date: '2025-11-16',
    description: 'Ancient Hindu festival dedicated to Sun God. Devotees fast and offer prayers at riverbanks. Best seen in Bihar and Eastern UP.',
    subscribers: []
  },
  {
    _id: 'kartik-purnima-2025',
    name: 'Kartik Purnima',
    region: 'Central India',
    date: '2025-11-27',
    description: 'Sacred full moon day with Dev Deepawali celebrations in Varanasi. Thousands of diyas light up the ghats.',
    subscribers: []
  },
  {
    _id: 'guru-nanak-jayanti-2025',
    name: 'Guru Nanak Jayanti',
    region: 'North India',
    date: '2025-11-15',
    description: 'Birth anniversary of Guru Nanak Dev Ji. Grand celebrations at Golden Temple Amritsar with langar and prayers.',
    subscribers: []
  },
  // Next month (December 2025)
  {
    _id: 'hornbill-2025',
    name: 'Hornbill Festival',
    region: 'North-East India',
    date: '2025-12-01',
    description: 'The "Festival of Festivals" in Nagaland showcasing tribal culture, traditional dances, music, and local cuisine. A must-visit!',
    subscribers: []
  },
  {
    _id: 'rann-utsav-2025',
    name: 'Rann Utsav',
    region: 'West India',
    date: '2025-12-10',
    description: 'Experience the magical white desert of Kutch under full moon. Folk music, handicrafts, and luxury tent stays await.',
    subscribers: []
  },
  {
    _id: 'christmas-goa-2025',
    name: 'Christmas in Goa',
    region: 'West India',
    date: '2025-12-25',
    description: 'Celebrate Christmas with Portuguese-influenced traditions, midnight masses at heritage churches, and beach parties.',
    subscribers: []
  },
  {
    _id: 'konark-dance-2025',
    name: 'Konark Dance Festival',
    region: 'East India',
    date: '2025-12-20',
    description: 'Classical dance performances against the backdrop of the magnificent Sun Temple. Odissi, Bharatanatyam, and more.',
    subscribers: []
  },
  {
    _id: 'pongal-2026',
    name: 'Pongal',
    region: 'South India',
    date: '2026-01-15',
    description: 'Tamil harvest festival celebrating prosperity. Traditional kolam designs, bull-taming Jallikattu, and delicious Pongal dishes.',
    subscribers: []
  },
  {
    _id: 'makar-sankranti-2026',
    name: 'Makar Sankranti / Uttarayan',
    region: 'West India',
    date: '2026-01-14',
    description: 'Kite flying festival marking the sun\'s transition. Best experienced in Gujarat with millions of colorful kites in the sky.',
    subscribers: []
  }
];

// Subscribed festivals store (in-memory)
const subscriptions = {};

// Festival Alerts endpoint
app.get('/api/festivals/alerts', (req, res) => {
  const { region } = req.query;
  
  let festivals = [...sampleFestivals];
  
  if (region) {
    festivals = festivals.filter(f => 
      f.region.toLowerCase().includes(region.toLowerCase())
    );
  }
  
  res.json({ 
    success: true,
    alerts: festivals 
  });
});

// Subscribe to festival
app.post('/api/festivals/subscribe/:festivalId', (req, res) => {
  const { festivalId } = req.params;
  const userId = req.headers.authorization?.split(' ')[1] || 'anonymous';
  
  if (!subscriptions[userId]) {
    subscriptions[userId] = [];
  }
  
  if (!subscriptions[userId].includes(festivalId)) {
    subscriptions[userId].push(festivalId);
  }
  
  res.json({ 
    success: true, 
    message: 'Subscribed successfully',
    festivalId 
  });
});

// Unsubscribe from festival
app.delete('/api/festivals/unsubscribe/:festivalId', (req, res) => {
  const { festivalId } = req.params;
  const userId = req.headers.authorization?.split(' ')[1] || 'anonymous';
  
  if (subscriptions[userId]) {
    subscriptions[userId] = subscriptions[userId].filter(id => id !== festivalId);
  }
  
  res.json({ 
    success: true, 
    message: 'Unsubscribed successfully',
    festivalId 
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Festival API running! 🎉' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🎉 Festival Alerts Server Started     ║
║  Port: ${PORT}                            ║
║  Try: http://localhost:${PORT}/api/festivals/alerts
╚════════════════════════════════════════╝
  `);
});
