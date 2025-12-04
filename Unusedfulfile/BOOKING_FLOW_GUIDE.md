# DarShana Travel - Secure Booking & Verification Flow Guide

This document explains the newly implemented secure booking flow, designed to ensure user safety, verify identities, and provide a seamless booking experience.

## 🌟 User Journey (How it Works)

The booking process has been transformed into a simple 4-step wizard:

### Step 1: Trip Details & Customization
*   **User Action**: Enters destination, dates, and guest count.
*   **New Feature**: Users can now request a **Local Guide**.
    *   Select **Language Preference** (Hindi, English, Local Dialect).
    *   Select **Gender Preference** (Male, Female, Any) for safety and comfort.
*   **Contact Info**: User confirms their name, email, and phone number for notifications.

### Step 2: Secure Payment
*   **User Action**: Chooses a payment method (UPI, Card, NetBanking).
*   **Simulation**: A secure payment modal appears (simulating Razorpay).
*   **Outcome**: Payment is processed, and the user moves to the verification stage.

### Step 3: Identity Verification (Safety Check)
*   **User Action**: Uploads required documents to verify their identity.
    1.  **Traveler Photo**: Clear face photo.
    2.  **ID Proof**: Aadhar Card, Passport, or Voter ID (Image/PDF).
    3.  **Payment Receipt**: Proof of payment (Screenshot/PDF).
*   **Backend Action**: Files are securely uploaded to the server (`backend/uploads`).

### Step 4: Ticket Generation
*   **Outcome**: Upon successful upload, the system automatically generates an **Official E-Ticket**.
*   **Features**:
    *   **QR Code**: For scanning at the destination.
    *   **Downloadable**: Users can download the ticket as a PDF/Print it immediately.
    *   **Confirmation**: Status updates to "CONFIRMED".

---

## 🔔 Notifications & Safety

Once the booking is confirmed:
1.  **SMS Notification**: Sent to the registered phone number with the Booking Reference.
2.  **Email Confirmation**: Sent to the registered email with trip details.
3.  **My Bookings**: The trip appears in the "My Bookings" section with a **"Download Ticket"** button.

---

## 🛠️ Technical Implementation

### Frontend (`src/pages/Booking.tsx`)
*   **State Management**: Uses a multi-step state (`step 1` to `step 4`) to guide the user.
*   **File Handling**: Uses `FormData` to send binary file data (images/PDFs) to the API.
*   **Ticket View**: A dedicated print-friendly view for the E-Ticket.

### Backend (`backend/controllers/bookingController.js`)
*   **Endpoint**: `POST /api/bookings/:id/documents`
*   **Middleware**: Uses `multer` to handle multipart form data and save files to `backend/uploads`.
*   **Logic**:
    *   Updates Booking status to `confirmed`.
    *   Updates Trip status to `confirmed`.
    *   Triggers `emailService` and `smsService`.

### API Service (`src/services/api.ts`)
*   **`bookingApi.uploadDocuments`**: A specialized function that handles `multipart/form-data` requests, bypassing the default JSON headers.

---

## ✅ How to Test

1.  **Start the Servers**:
    *   Backend: `cd backend && npm start`
    *   Frontend: `npm run dev`
2.  **Navigate**: Go to `http://localhost:5173/booking`.
3.  **Fill Form**: Enter dummy data for the trip. Check "Add Local Guide".
4.  **Pay**: Click "Proceed to Payment" -> "Pay Now".
5.  **Upload**: Select any dummy image/PDF for the 3 document fields.
6.  **Verify**:
    *   Wait for the "Ticket" to appear.
    *   Click "Download Ticket".
    *   Check the `backend/uploads` folder to see the saved files.
    *   Check the console for "Email sent" logs.

---

**Status**: 🟢 Ready for Deployment
