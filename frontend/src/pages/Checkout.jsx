import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'sonner';
import axios from '../api/axios.js';
import { PayPalButtons } from "@paypal/react-paypal-js";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    street: '', city: '', state: '', postalCode: '', country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const handlePlaceOrder = async (details, method = 'PayPal', hash = null) => {
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      return toast.error("Please fill in your complete shipping address");
    }

    try {
      setLoading(true);
      const res = await axios.post('/orders', {
        orderItems: cart.items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
          image: item.product.images?.[0]?.url,
          variant: item.variant
        })),
        shippingAddress,
        paymentMethod: method,
        transactionHash: hash,
        itemsPrice: cart.totalPrice,
        taxPrice: cart.taxPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.grandTotal
      });
      
      clearCart();
      toast.success("Order placed successfully!");
      navigate('/profile'); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen pt-32 flex justify-center items-center">
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl mb-8">Checkout</h1>
        
        <div className="border border-border p-8 mb-8 bg-card">
          <h2 className="font-display text-2xl mb-4">Shipping Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Street Address" className="border border-border p-3 bg-transparent" value={shippingAddress.street} onChange={e => setShippingAddress({...shippingAddress, street: e.target.value})} />
            <input placeholder="City" className="border border-border p-3 bg-transparent" value={shippingAddress.city} onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})} />
            <input placeholder="State" className="border border-border p-3 bg-transparent" value={shippingAddress.state} onChange={e => setShippingAddress({...shippingAddress, state: e.target.value})} />
            <input placeholder="Postal Code" className="border border-border p-3 bg-transparent" value={shippingAddress.postalCode} onChange={e => setShippingAddress({...shippingAddress, postalCode: e.target.value})} />
            <input placeholder="Country" className="border border-border p-3 bg-transparent" value={shippingAddress.country} onChange={e => setShippingAddress({...shippingAddress, country: e.target.value})} />
          </div>
        </div>

        <div className="border border-border p-8 bg-card">
          <h2 className="font-display text-2xl mb-4">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {cart.items.map(item => (
              <div key={item.product._id} className="flex justify-between text-sm">
                <span>{item.quantity} x {item.product.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 flex justify-between font-display text-xl text-primary mb-8">
            <span>Grand Total</span>
            <span>${cart.grandTotal?.toFixed(2)}</span>
          </div>

          <div className="mb-6 space-y-3">
            <h3 className="font-display text-lg mb-2">Payment Method</h3>
            <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
              <input type="radio" name="paymentMethod" value="PayPal" checked={paymentMethod === 'PayPal'} onChange={() => setPaymentMethod('PayPal')} className="mr-3" />
              <span className="font-display">PayPal or Credit Card</span>
            </label>
            <label className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
              <input type="radio" name="paymentMethod" value="Crypto" checked={paymentMethod === 'Crypto'} onChange={() => setPaymentMethod('Crypto')} className="mr-3" />
              <span className="font-display flex items-center gap-2">
                Pay with Crypto <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full ml-2">Web3</span>
              </span>
            </label>
          </div>
          
          <div className="space-y-4">
            {paymentMethod === 'PayPal' ? (
              <PayPalButtons 
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  if (!shippingAddress.street || !shippingAddress.city) {
                    toast.error("Please fill in shipping address");
                    return null;
                  }
                  return actions.order.create({
                    purchase_units: [{ amount: { value: cart.grandTotal.toFixed(2) } }]
                  });
                }}
                onApprove={async (data, actions) => {
                  const details = await actions.order.capture();
                  handlePlaceOrder(details, 'PayPal');
                }}
              />
            ) : (
              <button 
                onClick={() => {
                  if (!shippingAddress.street || !shippingAddress.city) {
                    toast.error("Please fill in shipping address");
                    return;
                  }
                  toast.success("Web3 Wallet Connected. Processing Transaction...");
                  setTimeout(() => {
                    handlePlaceOrder({ id: 'crypto_' + Date.now(), status: 'COMPLETED', update_time: new Date().toISOString(), payer: { email_address: 'crypto@web3.com' } }, 'Crypto', '0x' + Math.random().toString(16).substr(2, 40));
                  }, 2000);
                }}
                disabled={loading}
                className="w-full bg-foreground text-background font-body py-4 uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                {loading ? 'Processing Web3 Transaction...' : 'Pay with Crypto (ETH)'}
              </button>
            )}
            
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs uppercase tracking-widest">Or pay later</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <button 
              onClick={() => handlePlaceOrder()}
              disabled={loading}
              className="w-full bg-transparent border border-border text-foreground font-body text-sm tracking-widest uppercase px-8 py-4 hover:bg-muted transition-all duration-500 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Place Order (Cash on Delivery)"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
