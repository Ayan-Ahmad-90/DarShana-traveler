import fs from 'fs';
import path from 'path';
// @ts-ignore - no type declarations available for 'pdfkit'
import PDFDocument from 'pdfkit';
// @ts-ignore - no type declarations available for 'qrcode'
import QRCode from 'qrcode';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface InvoicePayload {
  invoiceNumber: string;
  bookingCode: string;
  userName: string;
  amount: number;
  currency: string;
  gstAmount: number;
  downloadDir?: string;
}

export const generateInvoicePdf = async ({
  invoiceNumber,
  bookingCode,
  userName,
  amount,
  currency,
  gstAmount,
  downloadDir
}: InvoicePayload) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const outputDir = downloadDir || path.join(__dirname, '../../tmp');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const filePath = path.join(outputDir, `${invoiceNumber}.pdf`);
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(20).text('DarShana Travel - Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Invoice No: ${invoiceNumber}`);
  doc.text(`Booking Code: ${bookingCode}`);
  doc.text(`Customer: ${userName}`);
  doc.moveDown();
  doc.text(`Amount: ${currency} ${amount.toFixed(2)}`);
  doc.text(`GST: ${currency} ${gstAmount.toFixed(2)}`);
  doc.moveDown();
  doc.text('Thank you for traveling sustainably with DarShana!');

  doc.end();

  await new Promise<void>((resolve) => stream.on('finish', () => resolve()));
  return filePath;
};

export const generateTicketQr = async (payload: Record<string, unknown>) => {
  return QRCode.toDataURL(JSON.stringify(payload));
};
