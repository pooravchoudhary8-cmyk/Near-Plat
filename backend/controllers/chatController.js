import Product from '../models/Product.js';

// @desc    Simulate AI Chatbot response
// @route   POST /api/chat/ask
// @access  Public
export const askChatbot = async (req, res) => {
  try {
    const { message } = req.body;
    const lowerMessage = message.toLowerCase();

    let reply = "I'm your Near Plat AI Assistant. How can I help you find the perfect luxury item today?";

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      reply = "Hello! Welcome to Near Plat. Are you looking for sunglasses, watches, or fragrances today?";
    } else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      reply = "We offer free worldwide express shipping on all orders over $200. Standard delivery takes 3-5 business days.";
    } else if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      reply = "We have a 30-day free return policy. Items must be in their original condition and packaging.";
    } else if (lowerMessage.includes('sunglass') || lowerMessage.includes('shades')) {
      const products = await Product.find({ category: 'sunglasses' }).limit(1);
      if (products.length > 0) {
        reply = `Our most popular sunglass right now is the ${products[0].name}. Would you like me to show you more details?`;
      } else {
        reply = "We have an exclusive collection of luxury sunglasses. Please check our Collections page!";
      }
    } else if (lowerMessage.includes('watch')) {
      reply = "Our timepieces are crafted with Swiss precision. Visit the Watches collection for our latest chronographs.";
    } else if (lowerMessage.includes('discount') || lowerMessage.includes('sale') || lowerMessage.includes('promo')) {
      reply = "You can use code PLAT10 at checkout for 10% off your first order!";
    }

    // Simulate network delay for AI typing effect
    setTimeout(() => {
      res.json({ reply });
    }, 1500);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
