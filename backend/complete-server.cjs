// Complete Backend Server with Auth + Festival APIs (CommonJS)
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'darshana-travel-secret-key-2025';

// CORS - Allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ═══════════════════════════════════════════════════════════════════
// IN-MEMORY DATABASE (for demo - replace with MongoDB in production)
// ═══════════════════════════════════════════════════════════════════
const users = new Map();
const subscriptions = new Map();

// Add demo admin user
const demoAdminHash = bcrypt.hashSync('admin123', 10);
users.set('admin@darshana.com', {
  id: 'admin-001',
  fullName: 'Admin User',
  email: 'admin@darshana.com',
  phone: '9999999999',
  password: demoAdminHash,
  username: 'admin',
  usernameChangeCount: 0,
  role: 'admin',
  profileImage: null,
  createdAt: new Date().toISOString()
});

// Add demo regular user
const demoUserHash = bcrypt.hashSync('user123', 10);
users.set('user@darshana.com', {
  id: 'user-001',
  fullName: 'Demo User',
  email: 'user@darshana.com',
  phone: '8888888888',
  password: demoUserHash,
  username: 'demouser',
  usernameChangeCount: 0,
  role: 'user',
  profileImage: null,
  createdAt: new Date().toISOString()
});

// ═══════════════════════════════════════════════════════════════════
// AUTH MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ═══════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════════════════

// SIGNUP
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (users.has(email)) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user-${Date.now()}`;
    
    const newUser = {
      id: userId,
      fullName,
      email,
      phone,
      password: hashedPassword,
      username: email.split('@')[0],
      usernameChangeCount: 0,
      role: 'user',
      profileImage: null,
      createdAt: new Date().toISOString()
    };
    
    users.set(email, newUser);
    
    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      message: 'Signup successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const user = users.get(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// GET CURRENT USER (ME)
app.get('/api/auth/me', authMiddleware, (req, res) => {
  try {
    const user = Array.from(users.values()).find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// UPDATE PROFILE
app.put('/api/auth/update-profile', authMiddleware, async (req, res) => {
  try {
    const { fullName, phone, username } = req.body;
    
    const user = Array.from(users.values()).find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Handle username change with limit
    if (username && username !== user.username) {
      if (user.usernameChangeCount >= 2) {
        return res.status(400).json({ message: 'Username can only be changed 2 times' });
      }
      user.username = username;
      user.usernameChangeCount += 1;
    }
    
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    
    users.set(user.email, user);
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// GET PROFILE (Legacy endpoint)
app.get('/api/profile', authMiddleware, (req, res) => {
  try {
    const user = Array.from(users.values()).find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return profile with trips data structure
    res.json({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      upcomingTrips: [],
      pastTrips: [],
      savedDestinations: []
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// ═══════════════════════════════════════════════════════════════════
// FESTIVAL ROUTES
// ═══════════════════════════════════════════════════════════════════

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
    description: 'Victory of good over evil celebrated with Ramlila performances and burning of Ravana effigies.',
    subscribers: []
  },
  // This month (November 2025)
  {
    _id: 'diwali-2025',
    name: 'Diwali - Festival of Lights',
    region: 'North India',
    date: '2025-11-12',
    description: 'The biggest festival of India! Celebrate with diyas, fireworks, rangoli, sweets, and family gatherings.',
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
    description: 'Ancient Hindu festival dedicated to Sun God. Devotees fast and offer prayers at riverbanks.',
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
    description: 'Birth anniversary of Guru Nanak Dev Ji. Grand celebrations at Golden Temple Amritsar.',
    subscribers: []
  },
  // Next month (December 2025)
  {
    _id: 'hornbill-2025',
    name: 'Hornbill Festival',
    region: 'North-East India',
    date: '2025-12-01',
    description: 'The "Festival of Festivals" in Nagaland showcasing tribal culture, traditional dances, and local cuisine.',
    subscribers: []
  },
  {
    _id: 'rann-utsav-2025',
    name: 'Rann Utsav',
    region: 'West India',
    date: '2025-12-10',
    description: 'Experience the magical white desert of Kutch under full moon. Folk music, handicrafts, and tent stays.',
    subscribers: []
  },
  {
    _id: 'christmas-goa-2025',
    name: 'Christmas in Goa',
    region: 'West India',
    date: '2025-12-25',
    description: 'Celebrate Christmas with Portuguese-influenced traditions, midnight masses, and beach parties.',
    subscribers: []
  },
  {
    _id: 'konark-dance-2025',
    name: 'Konark Dance Festival',
    region: 'East India',
    date: '2025-12-20',
    description: 'Classical dance performances against the backdrop of the magnificent Sun Temple.',
    subscribers: []
  }
];

// Get festival alerts
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
app.post('/api/festivals/subscribe/:festivalId', authMiddleware, (req, res) => {
  const { festivalId } = req.params;
  const userId = req.user.userId;
  
  if (!subscriptions.has(userId)) {
    subscriptions.set(userId, []);
  }
  
  const userSubs = subscriptions.get(userId);
  if (!userSubs.includes(festivalId)) {
    userSubs.push(festivalId);
  }
  
  res.json({ 
    success: true, 
    message: 'Subscribed successfully',
    festivalId 
  });
});

// Unsubscribe from festival
app.delete('/api/festivals/unsubscribe/:festivalId', authMiddleware, (req, res) => {
  const { festivalId } = req.params;
  const userId = req.user.userId;
  
  if (subscriptions.has(userId)) {
    const userSubs = subscriptions.get(userId);
    const idx = userSubs.indexOf(festivalId);
    if (idx > -1) userSubs.splice(idx, 1);
  }
  
  res.json({ 
    success: true, 
    message: 'Unsubscribed successfully',
    festivalId 
  });
});

// ═══════════════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════════════
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'DarShana Travel API is running! 🚀',
    endpoints: {
      auth: ['/api/auth/signup', '/api/auth/login', '/api/auth/me', '/api/auth/update-profile'],
      festivals: ['/api/festivals/alerts']
    }
  });
});

// ═══════════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════════
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🚀 DarShana Travel Complete API Server                       ║
║  Port: ${PORT}                                                   ║
║                                                               ║
║  Demo Accounts:                                               ║
║  👤 Admin: admin@darshana.com / admin123                      ║
║  👤 User:  user@darshana.com / user123                        ║
║                                                               ║
║  Endpoints:                                                   ║
║  • POST /api/auth/signup                                      ║
║  • POST /api/auth/login                                       ║
║  • GET  /api/auth/me                                          ║
║  • PUT  /api/auth/update-profile                              ║
║  • GET  /api/festivals/alerts                                 ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});
