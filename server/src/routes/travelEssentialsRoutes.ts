import { Request, Response, Router } from 'express';

const router = Router();

// Transport Data
const transportData = [
  { id: '1', type: 'bus', from: 'Delhi', to: 'Agra', price: 500, timing: '06:00 AM', availability: 12, duration: '4 hours', rating: 4.5, image: 'https://images.unsplash.com/photo-1464219414232-588def7b9b12?w=300', company: 'RedBus Express', amenities: ['WiFi', 'AC', 'USB Charging'], operatorRating: 4.6 },
  { id: '2', type: 'train', from: 'Delhi', to: 'Jaipur', price: 450, timing: '08:30 AM', availability: 25, duration: '5 hours', rating: 4.7, image: 'https://images.unsplash.com/photo-1570125909519-c90900bc6012?w=300', company: 'Indian Railways', amenities: ['Meals', 'Bedding', 'Toilet'], operatorRating: 4.8 },
  { id: '3', type: 'flight', from: 'Delhi', to: 'Mumbai', price: 3500, timing: '10:00 AM', availability: 8, duration: '2 hours', rating: 4.8, image: 'https://images.unsplash.com/photo-1552886290-24a98155ffed?w=300', company: 'Air India', amenities: ['Meals', 'Entertainment', 'WiFi'], operatorRating: 4.9 },
  { id: '4', type: 'bus', from: 'Delhi', to: 'Lucknow', price: 600, timing: '09:00 AM', availability: 15, duration: '6 hours', rating: 4.4, image: 'https://images.unsplash.com/photo-1464219414232-588def7b9b12?w=300', company: 'GoiBus', amenities: ['AC', 'WiFi', 'Reclining Seats'], operatorRating: 4.5 },
  { id: '5', type: 'cab', from: 'Delhi', to: 'Agra', price: 2000, timing: 'On Demand', availability: 50, duration: '3.5 hours', rating: 4.6, image: 'https://images.unsplash.com/photo-1549399542-7e3f8b83ad38?w=300', company: 'Uber', amenities: ['AC', 'GPS', 'Water'], operatorRating: 4.7 },
];

// Stay Data
const stayData = [
  { id: '1', name: 'The Grand Palace Hotel', type: 'hotel', price: 3500, rating: 4.6, facilities: ['WiFi', 'AC', 'Parking', 'Restaurant', 'Gym'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300'], location: 'Jaipur City Center', city: 'Jaipur', reviews: 328, cancellation: 'Free cancellation till 48 hrs', checkIn: '2:00 PM', checkOut: '12:00 PM', distance: '2 km from city center' },
  { id: '2', name: 'Mountain View Resort', type: 'resort', price: 5000, rating: 4.8, facilities: ['Pool', 'Spa', 'Yoga', 'WiFi', 'Restaurant', 'Adventure Sports'], images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'], location: 'Himachal Pradesh', city: 'Shimla', reviews: 542, cancellation: 'Free cancellation till 72 hrs', checkIn: '1:00 PM', checkOut: '11:00 AM', distance: '5 km from main market' },
  { id: '3', name: 'Cozy Homestay', type: 'homestay', price: 1200, rating: 4.4, facilities: ['WiFi', 'Kitchen', 'Parking', 'AC'], images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300'], location: 'Varanasi Ghat Area', city: 'Varanasi', reviews: 156, cancellation: 'Free cancellation till 24 hrs', checkIn: '3:00 PM', checkOut: '1:00 PM', distance: '500 m from river' },
  { id: '4', name: 'Luxury Palace Hotel', type: 'luxury', price: 8000, rating: 4.9, facilities: ['5-Star Restaurant', 'Spa', 'Pool', 'Concierge', 'Room Service'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300'], location: 'Delhi', city: 'Delhi', reviews: 890, cancellation: 'Free cancellation till 96 hrs', checkIn: '2:00 PM', checkOut: '11:00 AM', distance: '1 km from airport' },
  { id: '5', name: 'Budget Inn', type: 'budget', price: 800, rating: 4.2, facilities: ['WiFi', 'AC', 'Breakfast'], images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300'], location: 'Mumbai', city: 'Mumbai', reviews: 210, cancellation: 'Free cancellation till 12 hrs', checkIn: '12:00 PM', checkOut: '11:00 AM', distance: '3 km from station' },
];

// Local Food Data
const foodData = [
  // Delhi
  { id: 'd1', dishName: 'Chole Bhature', shopName: 'Sitaram Diwan Chand', city: 'Delhi', priceRange: '₹', rating: 4.8, cuisine: 'North Indian', isVeg: true, reviews: 2340, authenticity: 'Authentic', established: 1980, address: 'Old Delhi', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },
  { id: 'd2', dishName: 'Butter Chicken', shopName: 'Moti Mahal', city: 'Delhi', priceRange: '₹₹', rating: 4.9, cuisine: 'Mughlai', isVeg: false, reviews: 3200, authenticity: 'Authentic', established: 1947, address: 'Daryaganj', image: 'https://images.unsplash.com/photo-1585238341710-4dd0bd180d8d?w=300' },
  { id: 'd3', dishName: 'Parathas', shopName: 'Paranthe Wali Gali', city: 'Delhi', priceRange: '₹', rating: 4.7, cuisine: 'North Indian', isVeg: true, reviews: 1890, authenticity: 'Authentic', established: 1886, address: 'Chandni Chowk', image: 'https://images.unsplash.com/photo-1618599810694-b5d8e3c8ceff?w=300' },

  // Agra
  { id: 'a1', dishName: 'Petha', shopName: 'Panchhi Petha', city: 'Agra', priceRange: '₹', rating: 4.6, cuisine: 'Dessert', isVeg: true, reviews: 1200, authenticity: 'Authentic', established: 1960, address: 'Kinari Bazar', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300' },
  { id: 'a2', dishName: 'Mughlai Food', shopName: 'Pinch of Spice', city: 'Agra', priceRange: '₹₹', rating: 4.7, cuisine: 'Mughlai', isVeg: false, reviews: 1540, authenticity: 'Modern', established: 2005, address: 'Taj Ganj', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },

  // Lucknow
  { id: 'l1', dishName: 'Tunday Kabab', shopName: 'Tunday Kababi', city: 'Lucknow', priceRange: '₹₹', rating: 4.8, cuisine: 'Awadhi', isVeg: false, reviews: 2100, authenticity: 'Authentic', established: 1905, address: 'Aminabad', image: 'https://images.unsplash.com/photo-1585238341710-4dd0bd180d8d?w=300' },

  // Jaipur
  { id: 'j1', dishName: 'Dal Baati Churma', shopName: 'Chokhi Dhani', city: 'Jaipur', priceRange: '₹₹', rating: 4.8, cuisine: 'Rajasthani', isVeg: true, reviews: 1800, authenticity: 'Authentic', established: 1994, address: 'Tonk Road', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300' },

  // Mumbai
  { id: 'm1', dishName: 'Vada Pav', shopName: 'Ashok Vada Pav', city: 'Mumbai', priceRange: '₹', rating: 4.6, cuisine: 'Marathi', isVeg: true, reviews: 1400, authenticity: 'Authentic', established: 1966, address: 'Dadar', image: 'https://images.unsplash.com/photo-1599599810694-b5d8e3c8ceff?w=300' },

  // Hyderabad
  { id: 'h1', dishName: 'Biryani', shopName: 'Paradise Biryani', city: 'Hyderabad', priceRange: '₹₹', rating: 4.9, cuisine: 'Hyderabadi', isVeg: false, reviews: 2800, authenticity: 'Authentic', established: 1953, address: 'Secunderabad', image: 'https://images.unsplash.com/photo-1612874742237-415baab477b1?w=300' },

  // Chennai
  { id: 'ch1', dishName: 'Dosa', shopName: 'Murugan Idli Shop', city: 'Chennai', priceRange: '₹', rating: 4.8, cuisine: 'South Indian', isVeg: true, reviews: 1700, authenticity: 'Authentic', established: 1965, address: 'T. Nagar', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },
];

// GET all transport options
router.get('/transport', (req: Request, res: Response) => {
  try {
    const { from, to, type, priceMin, priceMax } = req.query;
    let filtered = [...transportData];

    if (from) filtered = filtered.filter(t => t.from.toLowerCase().includes(String(from).toLowerCase()));
    if (to) filtered = filtered.filter(t => t.to.toLowerCase().includes(String(to).toLowerCase()));
    if (type) filtered = filtered.filter(t => t.type === type);
    if (priceMin) filtered = filtered.filter(t => t.price >= Number(priceMin));
    if (priceMax) filtered = filtered.filter(t => t.price <= Number(priceMax));

    res.status(200).json({ success: true, data: filtered, count: filtered.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching transport data', error });
  }
});

// GET specific transport
router.get('/transport/:id', (req: Request, res: Response) => {
  try {
    const transport = transportData.find(t => t.id === req.params.id);
    if (!transport) {
      return res.status(404).json({ success: false, message: 'Transport not found' });
    }
    res.status(200).json({ success: true, data: transport });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching transport', error });
  }
});

// GET all stays
router.get('/stays', (req: Request, res: Response) => {
  try {
    const { city, type, priceMin, priceMax, rating } = req.query;
    let filtered = [...stayData];

    if (city) filtered = filtered.filter(s => s.city.toLowerCase().includes(String(city).toLowerCase()));
    if (type) filtered = filtered.filter(s => s.type === type);
    if (priceMin) filtered = filtered.filter(s => s.price >= Number(priceMin));
    if (priceMax) filtered = filtered.filter(s => s.price <= Number(priceMax));
    if (rating) filtered = filtered.filter(s => s.rating >= Number(rating));

    res.status(200).json({ success: true, data: filtered, count: filtered.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stay data', error });
  }
});

// GET specific stay
router.get('/stays/:id', (req: Request, res: Response) => {
  try {
    const stay = stayData.find(s => s.id === req.params.id);
    if (!stay) {
      return res.status(404).json({ success: false, message: 'Stay not found' });
    }
    res.status(200).json({ success: true, data: stay });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stay', error });
  }
});

// GET all food options
router.get('/food', (req: Request, res: Response) => {
  try {
    const { city, cuisine, isVeg, priceRange, rating } = req.query;
    let filtered = [...foodData];

    if (city) filtered = filtered.filter(f => f.city.toLowerCase().includes(String(city).toLowerCase()));
    if (cuisine) filtered = filtered.filter(f => f.cuisine.toLowerCase().includes(String(cuisine).toLowerCase()));
    if (isVeg) filtered = filtered.filter(f => f.isVeg === (String(isVeg).toLowerCase() === 'true'));
    if (priceRange) filtered = filtered.filter(f => f.priceRange === priceRange);
    if (rating) filtered = filtered.filter(f => f.rating >= Number(rating));

    res.status(200).json({ success: true, data: filtered, count: filtered.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching food data', error });
  }
});

// GET specific food
router.get('/food/:id', (req: Request, res: Response) => {
  try {
    const food = foodData.find(f => f.id === req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    res.status(200).json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching food', error });
  }
});

// POST booking (for transport/stays/food)
router.post('/booking', (req: Request, res: Response) => {
  try {
    const { type, itemId, userId, date } = req.body;

    if (!type || !itemId || !userId || !date) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const bookingId = `BK${Date.now()}`;
    res.status(201).json({
      success: true,
      message: 'Booking initiated successfully',
      data: {
        bookingId,
        type,
        itemId,
        userId,
        date,
        status: 'pending',
        createdAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating booking', error });
  }
});

// GET cities list
router.get('/cities', (req: Request, res: Response) => {
  try {
    const cities = [...new Set(foodData.map(f => f.city))].sort();
    res.status(200).json({ success: true, data: cities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching cities', error });
  }
});

export default router;
