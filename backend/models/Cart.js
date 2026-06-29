import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: {
      color: String,
      size: String,
      lensType: String,
      frameType: String
    },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    price: { type: Number, required: true }
  }],
  totalPrice: { type: Number, default: 0 },
  taxPrice: { type: Number, default: 0 },
  shippingPrice: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);
