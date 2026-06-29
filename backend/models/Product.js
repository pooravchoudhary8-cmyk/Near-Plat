import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, default: 'Near Plat' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  type: { type: String }, // e.g. Aviator, Round Frame
  description: { type: String, default: 'A premium luxury item from Near Plat.' },
  specifications: { type: Map, of: String },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 100 },
  images: [{
    url: { type: String, required: true },
    label: { type: String }
  }],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  variants: [{
    color: String,
    size: String,
    lensType: String,
    frameType: String,
    stock: Number
  }]
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

export default mongoose.model('Product', productSchema);
