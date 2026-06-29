import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../api/axios.js';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext.jsx';
import { motion } from 'framer-motion';

const RelatedProducts = ({ productId }) => {
  const { formatPrice } = useCurrency();

  const { data: products, isLoading } = useQuery({
    queryKey: ['related', productId],
    queryFn: async () => {
      const res = await axios.get(`/products/${productId}/related`);
      return res.data;
    }
  });

  if (isLoading || !products || products.length === 0) return null;

  return (
    <div className="mt-24 pt-16 border-t border-border">
      <h2 className="font-display text-3xl mb-8">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div 
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Link to={`/product/${product._id}`} className="block">
              <div className="relative aspect-square overflow-hidden bg-card border border-border mb-4">
                <img 
                  src={product.images?.[0]?.url || 'https://via.placeholder.com/400'} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <p className="font-body text-xs tracking-widest uppercase text-primary mb-1">{product.type}</p>
              <h3 className="font-display text-lg mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
              <p className="text-muted-foreground">{formatPrice(product.price)}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
