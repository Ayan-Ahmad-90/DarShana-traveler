import { v4 as uuid } from 'uuid';
import Booking from '../../models/Booking.js';
import Ticket from '../../models/Ticket.js';
import { generateTicketQr } from '../../utils/documentGenerator.js';
import { sendMail } from '../../config/mailer.js';

export const generateTicketForBooking = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId).populate('user');
  if (!booking) throw new Error('Booking not found');

  const ticketNumber = `TKT-${uuid().slice(0, 8).toUpperCase()}`;
  const qrCode = await generateTicketQr({ bookingId, bookingCode: booking.bookingCode, ticketNumber });
  const ticket = await Ticket.create({
    booking: booking._id,
    ticketNumber,
    qrCodeUrl: qrCode,
    passengers: [{ name: (booking.user as any)?.fullName || 'Traveler' }],
    travelInfo: {
      from: booking.travelDetails.from,
      to: booking.travelDetails.to,
      date: booking.travelDetails.startDate
    },
    guideInfo: booking.guide
      ? {
          guideId: booking.guide,
          name: 'Assigned Guide'
        }
      : undefined
  });
  booking.ticket = ticket._id;
  await booking.save();

  if ((booking.user as any)?.email) {
    await sendMail({
      to: (booking.user as any).email,
      subject: 'Your DarShana E-Ticket',
      html: `<p>Ticket ${ticketNumber} for booking ${booking.bookingCode}</p><img src="${qrCode}" alt="QR" />`
    });
  }
  return ticket;
};

export const listTickets = (filters: Record<string, unknown> = {}) => {
  return Ticket.find(filters).sort({ createdAt: -1 });
};
