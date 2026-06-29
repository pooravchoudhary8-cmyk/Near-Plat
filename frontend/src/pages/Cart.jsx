import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useCurrency } from '../context/CurrencyContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, loading } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const handleQuantity = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    updateQuantity(item.product._id, newQty, item.variant);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex justify-center items-center">
        <p className="text-muted-foreground tracking-widest uppercase">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl text-foreground mb-12">Your Cart</h1>
        
        {!cart?.items || cart.items.length === 0 ? (
          <div className="text-center py-24 border border-border">
            <p className="font-body text-xl text-muted-foreground mb-8">Your cart is currently empty.</p>
            <Link to="/#collections" className="bg-gold-shimmer text-primary-foreground font-body text-sm tracking-widest uppercase px-10 py-4 hover-gold-glow transition-all duration-500">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.items.map((item) => (
                <motion.div 
                  key={item._id || item.product._id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-6 p-6 border border-border bg-card"
                >
                  <div className="w-24 h-32 md:w-32 md:h-40 bg-muted flex-shrink-0">
                    <img 
                      src={item.product.images?.[0]?.url || 'https://via.placeholder.com/150'} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link to={`/product/${item.product._id}`} className="font-display text-xl text-foreground hover:text-primary transition-colors">
                          {item.product.name}
                        </Link>
                        <p className="font-display text-lg">{formatPrice(item.price)}</p>
                      </div>
                      {item.variant && Object.keys(item.variant).length > 0 && (
                        <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">
                          Variant details here
                        </p>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center border border-border">
                        <button onClick={() => handleQuantity(item, -1)} className="px-3 py-2 text-muted-foreground hover:text-primary transition-colors"><Minus size={14} /></button>
                        <span className="px-4 font-body text-sm">{item.quantity}</span>
                        <button onClick={() => handleQuantity(item, 1)} className="px-3 py-2 text-muted-foreground hover:text-primary transition-colors"><Plus size={14} /></button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-muted-foreground hover:text-destructive transition-colors text-sm font-body uppercase tracking-widest flex items-center gap-2"
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-border bg-card p-8 sticky top-32">
                <h2 className="font-display text-2xl text-foreground mb-6">Order Summary</h2>
                
                <div className="space-y-4 font-body text-sm mb-6 border-b border-border pb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimated Tax (15%)</span>
                    <span>{formatPrice(cart.taxPrice)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>{cart.shippingPrice === 0 ? 'Free' : formatPrice(cart.shippingPrice)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between font-display text-2xl text-foreground mb-8">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(cart.grandTotal)}</span>
                </div>
                
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full flex items-center justify-center gap-2 bg-gold-shimmer text-primary-foreground font-body text-sm tracking-widest uppercase px-8 py-4 hover-gold-glow transition-all duration-500"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
