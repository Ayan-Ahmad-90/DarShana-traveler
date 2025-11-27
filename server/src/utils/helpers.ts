import crypto from 'crypto';

export const generateBookingId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BK-${timestamp}-${randomStr}`;
};

export const calculateDuration = (startTime: Date, endTime: Date): string => {
  const diff = Math.abs(endTime.getTime() - startTime.getTime());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

export const formatPrice = (price: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(price);
};

export const generateMockFlights = (origin: string, destination: string, date: Date) => {
  const airlines = [
    { name: 'IndiGo', code: 'IND', logo: '✈️' },
    { name: 'Air India', code: 'AI', logo: '🛫' },
    { name: 'SpiceJet', code: 'SG', logo: '🛩️' },
    { name: 'Vistara', code: 'UK', logo: '✈️' },
  ];

  return airlines.map((airline, idx) => {
    const departTime = new Date(date);
    departTime.setHours(6 + idx * 2, Math.random() * 60);

    const arriveTime = new Date(departTime);
    arriveTime.setHours(departTime.getHours() + 2 + Math.random() * 2);

    return {
      flightNumber: `${airline.code}${Math.floor(Math.random() * 9000) + 1000}`,
      airline: airline.name,
      airlineCode: airline.code,
      airlineLogo: airline.logo,
      origin,
      destination,
      departureTime: departTime,
      arrivalTime: arriveTime,
      duration: calculateDuration(departTime, arriveTime),
      stops: Math.random() > 0.7 ? 1 : 0,
      aircraft: 'Boeing 737 / Airbus A320',
      price: Math.floor(Math.random() * 8000) + 3000,
      currency: 'INR',
      availableSeats: Math.floor(Math.random() * 50) + 20,
      amenities: ['wifi', 'meal', 'entertainment', 'usb_charging'],
      class: 'economy',
      source: 'mock',
    };
  });
};

export const generateMockTrains = (origin: string, destination: string, date: Date) => {
  const trainTypes = ['shatabdi', 'rajdhani', 'intercity', 'express'];

  return trainTypes.map((type, idx) => {
    const departTime = new Date(date);
    departTime.setHours(6 + idx * 3, 0);

    const arriveTime = new Date(departTime);
    arriveTime.setHours(departTime.getHours() + 8 + Math.random() * 4);

    return {
      trainNumber: `${Math.floor(Math.random() * 90000) + 10000}`,
      trainName: `${origin}-${destination} ${type}`,
      source: origin,
      destination,
      departureTime: departTime,
      arrivalTime: arriveTime,
      duration: calculateDuration(departTime, arriveTime),
      trainType: type,
      classes: [
        { className: 'AC First', price: Math.floor(Math.random() * 5000) + 4000, availableSeats: 20 },
        { className: 'AC 2-Tier', price: Math.floor(Math.random() * 3000) + 2000, availableSeats: 40 },
        { className: 'AC 3-Tier', price: Math.floor(Math.random() * 2000) + 1200, availableSeats: 60 },
      ],
      stops: 3,
      frequency: 'daily',
      source_api: 'mock',
    };
  });
};
