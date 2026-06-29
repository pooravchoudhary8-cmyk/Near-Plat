import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RelatedProducts from "../components/RelatedProducts.jsx";
import VirtualTryOn from "../components/VirtualTryOn.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingCart, Heart, Camera } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from '../api/axios.js';
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCurrency } from "../context/CurrencyContext.jsx";
import { Helmet } from "react-helmet-async";
import { toast } from 'sonner';

// Static imports for product front images (Vite bundles these correctly at build time)
import monarchFront from "@/assets/products/monarch/front.jpg";
import visionaryFront from "@/assets/products/visionary/front.jpg";
import enigmaFront from "@/assets/products/enigma/front.jpg";
import classicFront from "@/assets/products/classic/front.jpg";

// Static imports for Armani (all angles are local files)
import armaniFront from "@/assets/products/armani/front.jpg";
import armaniSide from "@/assets/products/armani/side.jpg";
import armaniAngle from "@/assets/products/armani/angle.jpg";
import armaniDetail from "@/assets/products/armani/detail.jpg";

const productAngleImages = {
  // Products 1–4: only the Front image (index 0) is a local asset
  1: { 0: monarchFront },
  2: { 0: visionaryFront },
  3: { 0: enigmaFront },
  4: { 0: classicFront },
  // Product 5 (Armani): all four angles are local assets
  5: {
    0: armaniFront,
    1: armaniSide,
    2: armaniAngle,
    3: armaniDetail,
  },
};

function resolveImageSrc(productId, angleIndex, imageUrl) {
  return productAngleImages[productId]?.[angleIndex] ?? imageUrl;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, wishlist } = useWishlist();
  
  const { data: product, refetch, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await axios.get(`/products/${id}`);
      return res.data;
    }
  });

  const { data: reviews, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const res = await axios.get(`/reviews/${id}`);
      return res.data;
    }
  });

  const [selectedAngle, setSelectedAngle] = useState(0);
  const [direction, setDirection] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubscription, setIsSubscription] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

  const isSaved = wishlist?.products?.some(p => p._id === id || p === id);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to write a review");
    try {
      await axios.post('/reviews', { productId: id, rating, comment }, { withCredentials: true });
      toast.success("Review submitted!");
      setComment("");
      refetchReviews();
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground font-body uppercase tracking-widest text-sm">Loading Product...</p>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-destructive font-body uppercase tracking-widest text-sm">Product not found.</p>
    </div>
  );

  const goNext = () => {
    if (selectedAngle < product.images.length - 1) {
      setDirection(1);
      setSelectedAngle(selectedAngle + 1);
    }
  };

  const goPrev = () => {
    if (selectedAngle > 0) {
      setDirection(-1);
      setSelectedAngle(selectedAngle - 1);
    }
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{product.name} | Near Plat</title>
        <meta name="description" content={product.description?.substring(0, 160) || "Luxury product from Near Plat"} />
        <meta property="og:title" content={product.name} />
        <meta property="og:image" content={product.images?.[0]?.url || resolveImageSrc(product.id, 0, product.images?.[0]?.url)} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary font-body text-sm tracking-widest uppercase mb-12 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-16">

          {/* Left: Image Gallery */}
          <div className="flex gap-4">

            {/* Thumbnails */}
            <div className="flex flex-col gap-3">
              {product.images?.map((angle, index) => (
                <button
                  key={index}
                  onClick={() => { setDirection(index > selectedAngle ? 1 : -1); setSelectedAngle(index); }}
                  className={`w-16 h-16 border overflow-hidden transition-all duration-300 ${
                    selectedAngle === index
                      ? "border-primary"
                      : "border-border opacity-50 hover:opacity-100"
                  }`}
                >
                  <img
                    src={resolveImageSrc(product.id, index, angle.url)}
                    alt={angle.label || 'Product image'}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>

            {/* Main Image with Arrows */}
            <div className="flex-1 relative border border-border overflow-hidden">
              <AnimatePresence custom={direction} mode="wait">
                <motion.img
                  key={selectedAngle}
                  src={resolveImageSrc(product.id, selectedAngle, product.images?.[selectedAngle]?.url)}
                  alt={product.images?.[selectedAngle]?.label || 'Product image'}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-contain aspect-square"
                />
              </AnimatePresence>

              {/* Arrow Buttons */}
              <button
                onClick={goPrev}
                disabled={selectedAngle === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 border border-border p-1 hover:border-primary hover:text-primary transition-all disabled:opacity-20"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goNext}
                disabled={selectedAngle === product.images.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 border border-border p-1 hover:border-primary hover:text-primary transition-all disabled:opacity-20"
              >
                <ChevronRight size={20} />
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {product.images?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => { setDirection(index > selectedAngle ? 1 : -1); setSelectedAngle(index); }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      selectedAngle === index ? "bg-primary w-3" : "bg-border"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <p className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-3">
              {product.type}
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              {product.name}
            </h1>
            
            {product.category === 'sunglasses' && (
              <button 
                onClick={() => setIsTryOnOpen(true)}
                className="inline-flex w-max items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 rounded-full font-body text-xs tracking-widest uppercase transition-colors mb-4"
              >
                <Camera size={14} />
                Virtual Try-On
              </button>
            )}

            <p className="font-body text-2xl text-primary mb-8">
              {formatPrice(product.price)}
            </p>

            {/* Angle Labels */}
            <div className="flex flex-wrap gap-2 mb-10">
              {product.images?.map((angle, index) => (
                <button
                  key={index}
                  onClick={() => { setDirection(index > selectedAngle ? 1 : -1); setSelectedAngle(index); }}
                  className={`font-body text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-300 ${
                    selectedAngle === index
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {angle.label || `Image ${index + 1}`}
                </button>
              ))}
            </div>

            {/* Subscribe & Save UI */}
            {product.category === 'fragrances' || product.category === 'skincare' ? (
              <div className="mb-8 space-y-4">
                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${!isSubscription ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={!isSubscription} onChange={() => setIsSubscription(false)} />
                    <span className="font-body text-sm uppercase tracking-widest">One-Time Purchase</span>
                  </div>
                  <span className="font-display">{formatPrice(product.price)}</span>
                </label>
                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${isSubscription ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={isSubscription} onChange={() => setIsSubscription(true)} />
                    <div>
                      <span className="font-body text-sm uppercase tracking-widest block">Subscribe & Save 15%</span>
                      <span className="text-xs text-muted-foreground">Delivered every 1 month</span>
                    </div>
                  </div>
                  <span className="font-display text-primary">{formatPrice(product.price * 0.85)}</span>
                </label>
              </div>
            ) : null}

            <div className="flex gap-4">
              <button
                onClick={() => {
                  const finalPrice = isSubscription ? product.price * 0.85 : product.price;
                  addToCart(product._id, 1, {}, finalPrice); // Note: addToCart signature might differ, I will adapt it. Assuming addToCart(product, quantity)
                  toast.success(isSubscription ? "Subscription added to cart" : "Added to cart");
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-gold-shimmer text-primary-foreground font-body text-sm tracking-widest uppercase px-8 py-4 hover-gold-glow transition-all duration-500"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product._id)}
                className={`flex items-center justify-center w-14 h-14 border transition-all duration-300 ${isSaved ? 'bg-primary border-primary text-primary-foreground' : 'border-border text-foreground hover:border-primary hover:text-primary'}`}
              >
                <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
              </button>
            </div>
          </motion.div>

        </div>

        {/* Reviews Section */}
        <div className="mt-32 pt-16 border-t border-border">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="flex-1">
              <h2 className="font-display text-3xl mb-8">Customer Reviews</h2>
              {reviews?.length === 0 ? (
                <p className="text-muted-foreground font-body">No reviews yet. Be the first to review {product.name}!</p>
              ) : (
                <div className="space-y-8">
                  {reviews?.map(review => (
                    <div key={review._id} className="border-b border-border pb-8">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 bg-muted rounded-full overflow-hidden flex items-center justify-center text-xs font-bold">
                          {review.user?.avatar ? (
                            <img src={review.user.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            review.user?.name?.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-display text-lg">{review.user?.name}</p>
                          <div className="flex text-primary text-sm">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground ml-auto">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="font-body text-foreground mt-4 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write Review Form */}
            <div className="md:w-[400px]">
              <div className="bg-card border border-border p-8 sticky top-32">
                <h3 className="font-display text-2xl mb-6">Write a Review</h3>
                <form onSubmit={submitReview} className="space-y-6">
                  <div>
                    <label className="block font-body text-xs uppercase tracking-widest text-muted-foreground mb-3">Rating</label>
                    <select 
                      value={rating} 
                      onChange={e => setRating(e.target.value)}
                      className="w-full bg-transparent border border-border p-3 font-body outline-none focus:border-primary transition-colors"
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Very Good</option>
                      <option value="3">3 - Good</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-body text-xs uppercase tracking-widest text-muted-foreground mb-3">Comment</label>
                    <textarea 
                      value={comment} 
                      onChange={e => setComment(e.target.value)}
                      required
                      rows="4"
                      className="w-full bg-transparent border border-border p-3 font-body outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Share your experience..."
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-gold-shimmer text-primary-foreground font-body text-sm tracking-widest uppercase px-8 py-4 hover-gold-glow transition-all duration-500"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>

        <RelatedProducts productId={id} />
      </div>

      <VirtualTryOn 
        isOpen={isTryOnOpen} 
        onClose={() => setIsTryOnOpen(false)} 
        productImage={product.images?.[0]?.url || resolveImageSrc(product.id, 0, null)} 
      />
    </div>
  );
};

export default ProductDetail;
