import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios.js';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist({ products: [] });
    }
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/wishlist');
      setWishlist(res.data);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    if (!user) {
      toast.error("Please login to save items");
      return;
    }
    try {
      const res = await axios.post(`/wishlist/${productId}`);
      setWishlist(res.data);
      toast.success("Saved to wishlist");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to wishlist");
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      const res = await axios.delete(`/wishlist/${productId}`);
      setWishlist(res.data);
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error("Please login to save items");
      return;
    }
    const isSaved = wishlist.products.some(p => p._id === productId || p === productId);
    if (isSaved) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, addToWishlist, removeFromWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
