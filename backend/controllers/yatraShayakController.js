exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    
    const lowerMsg = message.toLowerCase();
    let response = "I'm Yatra Shayak. How can I help you with your journey?";

    if (lowerMsg.includes('safety')) {
      response = "For safety, always keep emergency numbers handy. You can check the Safety section in our app.";
    } else if (lowerMsg.includes('booking')) {
      response = "You can manage your bookings in the 'My Trips' section.";
    } else if (lowerMsg.includes('festival')) {
      response = "Check out our Festivals page for upcoming events!";
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      response = "Namaste! I am Yatra Shayak, your personal travel assistant.";
    }

    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: 'Chat failed', error: error.message });
  }
};
