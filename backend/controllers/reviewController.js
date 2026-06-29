import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  const product = await Product.findById(productId);

  if (product) {
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = new Review({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment
    });

    await review.save();

    // Update product average rating
    const allReviews = await Review.find({ product: productId });
    product.numReviews = allReviews.length;
    product.rating = allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Get product reviews
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name avatar');
  res.json(reviews);
};
