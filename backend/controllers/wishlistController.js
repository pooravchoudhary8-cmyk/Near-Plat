import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'name price images type');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
export const addToWishlist = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    if (!wishlist.products.includes(req.params.productId)) {
      wishlist.products.push(req.params.productId);
      await wishlist.save();
    }
    
    await wishlist.populate('products', 'name price images type');
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== req.params.productId
    );
    await wishlist.save();
    await wishlist.populate('products', 'name price images type');
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
