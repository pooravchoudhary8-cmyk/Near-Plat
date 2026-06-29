import React from 'react';
import { useWishlist } from '../context/WishlistContext.jsx';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, loading } = useWishlist();

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex justify-center items-center">
        <p className="text-muted-foreground tracking-widest uppercase">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl text-foreground mb-12">Your Wishlist</h1>
        
        {!wishlist?.products || wishlist.products.length === 0 ? (
          <div className="text-center py-24 border border-border">
            <p className="font-body text-xl text-muted-foreground mb-8">Your wishlist is currently empty.</p>
            <Link to="/#collections" className="bg-gold-shimmer text-primary-foreground font-body text-sm tracking-widest uppercase px-10 py-4 hover-gold-glow transition-all duration-500">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {wishlist.products.map((product, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                key={product._id} 
                className="relative border border-border bg-card group"
              >
                <Link to={`/product/${product._id}`} className="block aspect-[4/5] bg-muted overflow-hidden">
                  <img 
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/400'} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <div className="p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs uppercase tracking-widest text-primary">{product.type}</p>
                      <button 
                        onClick={() => removeFromWishlist(product._id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <Link to={`/product/${product._id}`} className="font-display text-xl text-foreground hover:text-primary transition-colors block mb-2">
                      {product.name}
                    </Link>
                    <p className="text-primary font-body">${product.price?.toFixed(2)}</p>
                  </div>
                  
                  <Link 
                    to={`/product/${product._id}`}
                    className="mt-6 block text-center border border-primary text-primary font-body text-xs tracking-widest uppercase py-3 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    View Product
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
