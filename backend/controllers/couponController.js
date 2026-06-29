import Coupon from '../models/Coupon.js';

// @desc    Apply coupon code
// @route   POST /api/coupons/apply
// @access  Public
export const applyCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      res.status(404);
      throw new Error('Invalid coupon code');
    }

    if (!coupon.isActive || new Date() > coupon.expiryDate) {
      res.status(400);
      throw new Error('Coupon expired or inactive');
    }

    if (orderAmount < coupon.minimumOrderAmount) {
      res.status(400);
      throw new Error(`Minimum order amount of $${coupon.minimumOrderAmount} required`);
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      res.status(400);
      throw new Error('Coupon usage limit reached');
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    res.json({
      success: true,
      code: coupon.code,
      discountAmount,
      message: 'Coupon applied successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
