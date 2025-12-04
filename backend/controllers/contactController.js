// backend/controllers/contactController.js
const ContactMessage = require('../models/ContactMessage');
const nodemailer = require('nodemailer');

// Configure nodemailer (optional - for backend email)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
    const { subject, fullName, email, phone, message } = req.body;

    // Validation
    if (!subject || !fullName || !email || !phone || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create contact message
    const contactMessage = new ContactMessage({
      subject,
      fullName,
      email,
      phone,
      message,
      status: 'pending',
    });

    await contactMessage.save();

    // Send email to admin (optional - EmailJS is primary)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `New Contact Form: ${subject}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>From:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <p><small>Received: ${new Date().toLocaleString()}</small></p>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(201).json({
      id: contactMessage._id,
      status: 'pending',
      createdAt: contactMessage.createdAt,
      message: 'Thank you for contacting us. We will respond shortly.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit contact form', error: error.message });
  }
};

// Get all contact messages (admin only)
exports.getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
  }
};

// Mark message as read (admin)
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await ContactMessage.findByIdAndUpdate(
      messageId,
      { status: 'read' },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message marked as read', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark message', error: error.message });
  }
};

// Mark message as resolved (admin)
exports.markAsResolved = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await ContactMessage.findByIdAndUpdate(
      messageId,
      { status: 'resolved' },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message marked as resolved', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Failed to resolve message', error: error.message });
  }
};
