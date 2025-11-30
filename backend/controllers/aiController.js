import jwt from 'jsonwebtoken';

// AI Trip Planner function
const generateAITripPlan = (start, destination, duration, prefs) => {
  // Mock AI-generated plan
  const days = parseInt(duration) || 3;
  const plan = [];

  for (let i = 1; i <= days; i++) {
    plan.push({
      day: i,
      activities: [
        {
          time: '09:00',
          activity: `Morning activity in ${destination}`,
          location: destination,
          description: `Explore local attractions`,
        },
        {
          time: '12:00',
          activity: 'Lunch',
          location: 'Local restaurant',
          description: 'Try local cuisine',
        },
        {
          time: '15:00',
          activity: 'Afternoon sightseeing',
          location: destination,
          description: 'Visit popular spots',
        },
        {
          time: '19:00',
          activity: 'Dinner and relaxation',
          location: 'Restaurant',
          description: 'Enjoy evening',
        },
      ],
    });
  }

  return {
    bestRoutes: [`Flight from ${start} to ${destination}`, `Train alternative`],
    dayWisePlan: plan,
    images: [`https://example.com/${destination}-1.jpg`, `https://example.com/${destination}-2.jpg`],
    highlights: [`Visit ${destination} landmarks`, 'Try local food', 'Cultural experiences'],
  };
};

// AI Plan endpoint
export const generateAIPlan = async (req, res) => {
  try {
    const { start, destination, duration, preferences } = req.body;

    if (!start || !destination) {
      return res.status(400).json({ message: 'Start and destination are required' });
    }

    const plan = generateAITripPlan(start, destination, duration, preferences);

    res.json(plan);
  } catch (error) {
    console.error('Error generating AI plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default { generateAIPlan };