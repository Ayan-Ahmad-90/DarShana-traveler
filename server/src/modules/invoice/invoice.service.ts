import { v4 as uuid } from 'uuid';
import Booking from '../../models/Booking.js';
import Invoice from '../../models/Invoice.js';
import { generateInvoicePdf } from '../../utils/documentGenerator.js';
import { sendMail } from '../../config/mailer.js';

export const generateInvoiceForBooking = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId).populate('user');
  if (!booking) throw new Error('Booking not found');
  const invoiceNumber = `INV-${new Date().getFullYear()}-${uuid().slice(0, 8).toUpperCase()}`;
  const pdfPath = await generateInvoicePdf({
    invoiceNumber,
    bookingCode: booking.bookingCode,
    userName: (booking.user as any)?.fullName || 'Traveler',
    amount: booking.amountBreakdown.total,
    currency: booking.amountBreakdown.currency,
    gstAmount: booking.amountBreakdown.taxes
  });
  const invoice = await Invoice.create({
    booking: booking._id,
    invoiceNumber,
    amount: booking.amountBreakdown.total,
    currency: booking.amountBreakdown.currency,
    gstAmount: booking.amountBreakdown.taxes,
    taxDetails: {
      gst: booking.amountBreakdown.taxes,
      serviceCharge: booking.amountBreakdown.fees
    },
    downloadUrl: pdfPath,
    paymentStatus: booking.paymentStatus
  });
  booking.invoice = invoice._id;
  await booking.save();
  if (booking.user && (booking.user as any).email) {
    await sendMail({
      to: (booking.user as any).email,
      subject: 'Your DarShana Booking Invoice',
      html: `<p>Invoice ${invoiceNumber} attached for booking ${booking.bookingCode}</p>`,
      attachments: [
        {
          filename: `${invoiceNumber}.pdf`,
          path: pdfPath
        }
      ]
    });
  }
  return invoice;
};

export const listInvoices = async (filters: Record<string, unknown> = {}) => {
  return Invoice.find(filters).sort({ createdAt: -1 });
};
