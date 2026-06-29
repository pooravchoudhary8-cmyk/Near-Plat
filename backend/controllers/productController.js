import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Fetch all products (with optional search & pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 100;
    const page = Number(req.query.pageNumber) || 1;
    
    // Search keyword logic
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    // Price range logic
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : 10000;
    const priceFilter = { price: { $gte: minPrice, $lte: maxPrice } };

    // Category/Type logic
    const categoryFilter = req.query.category ? { type: req.query.category } : {}; // using 'type' for simplicity since DB has types like 'sun', 'optical'

    // Sort logic
    const sortOrder = req.query.sort === 'lowest' 
      ? { price: 1 } 
      : req.query.sort === 'highest' 
      ? { price: -1 } 
      : req.query.sort === 'toprated'
      ? { rating: -1 }
      : { createdAt: -1 }; // newest default

    const queryFilter = { ...keyword, ...priceFilter, ...categoryFilter };

    const count = await Product.countDocuments(queryFilter);
    const products = await Product.find(queryFilter)
      .populate('category', 'name slug')
      .sort(sortOrder)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Find products in same category but exclude the current product
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category
    }).limit(4);

    res.json(relatedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
