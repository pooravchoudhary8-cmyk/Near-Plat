import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    variant: {
      color: String,
      size: String,
      lensType: String,
      frameType: String
    }
  }],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['PayPal', 'Stripe', 'Crypto']
  },
  transactionHash: {
    type: String
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  itemsPrice: { type: Number, required: true, default: 0.0 },
  taxPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  couponApplied: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  statusHistory: [{
    status: { type: String },
    updatedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });

export default mongoose.model('Order', orderSchema);
