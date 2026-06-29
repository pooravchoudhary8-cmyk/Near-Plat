import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper function to calculate totals
const calcTotals = (items) => {
  const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const grandTotal = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));
  return { totalPrice: itemsPrice, taxPrice, shippingPrice, grandTotal };
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  const { productId, quantity, variant } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        variant,
        quantity,
        price: product.price
      });
    }

    const totals = calcTotals(cart.items);
    cart.totalPrice = totals.totalPrice;
    cart.taxPrice = totals.taxPrice;
    cart.shippingPrice = totals.shippingPrice;
    cart.grandTotal = totals.grandTotal;

    await cart.save();
    await cart.populate('items.product', 'name images price');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);

    const totals = calcTotals(cart.items);
    cart.totalPrice = totals.totalPrice;
    cart.taxPrice = totals.taxPrice;
    cart.shippingPrice = totals.shippingPrice;
    cart.grandTotal = totals.grandTotal;

    await cart.save();
    await cart.populate('items.product', 'name images price');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      cart.taxPrice = 0;
      cart.shippingPrice = 0;
      cart.grandTotal = 0;
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
