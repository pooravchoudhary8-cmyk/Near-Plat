import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios.js';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalPrice: 0, taxPrice: 0, shippingPrice: 0, grandTotal: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [], totalPrice: 0, taxPrice: 0, shippingPrice: 0, grandTotal: 0 });
    }
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/cart');
      setCart(res.data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, variant = {}) => {
    if (!user) {
      toast.error("Please login to add to cart");
      return;
    }
    try {
      const res = await axios.post('/cart', { productId, quantity, variant });
      setCart(res.data);
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      const res = await axios.delete(`/cart/${productId}`);
      setCart(res.data);
      toast.success("Removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await axios.delete('/cart');
      setCart({ items: [], totalPrice: 0, taxPrice: 0, shippingPrice: 0, grandTotal: 0 });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
