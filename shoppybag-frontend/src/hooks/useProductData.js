import { useState, useEffect } from 'react';
import api from '../api/api';

export const useProductData = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState(null);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/product/${productId}`);
      if (res?.data?.data) {
        const p = res.data.data;
        // Normalize backend data
        p.variants = (p.productVariants || []).map(v => ({
          ...v,
          name: `${v.color} / ${v.size}`,
          displayName: v.size,
          displayColor: v.color
        }));
        p.images = (p.productImage || []).map(img => img.imageUrl);
        
        setProduct(p);
        
        // Load related products
        loadRelatedProducts(p.category);
      }
    } catch (err) {
      console.error('Failed to fetch product', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async (category) => {
    try {
      const res = await api.get('/api/product/fetchallProducts');
      let products = [];
      if (res?.data?.data && Array.isArray(res.data.data)) {
        products = res.data.data;
      } else if (Array.isArray(res?.data)) {
        products = res.data;
      }
      
      // Filter by same category, exclude current product, limit to 4
      const related = products
        .filter(p => p.category === category && p.id !== parseInt(productId))
        .slice(0, 4);
      
      setRelatedProducts(related);
    } catch (err) {
      console.error('Failed to load related products', err);
    }
  };

  const loadReviews = async () => {
    try {
      const res = await api.get(`/api/reviews/product/${productId}`);
      setReviews(res.data || []);
    } catch (err) {
      console.error('Failed to load reviews', err);
    }
  };

  const loadRatingStats = async () => {
    try {
      const res = await api.get(`/api/reviews/product/${productId}/stats`);
      setRatingStats(res.data);
    } catch (err) {
      console.error('Failed to load rating stats', err);
    }
  };

  useEffect(() => {
    if (productId) {
      loadProduct();
      loadReviews();
      loadRatingStats();
    }
  }, [productId]);

  return {
    product,
    loading,
    relatedProducts,
    reviews,
    ratingStats,
    refreshReviews: loadReviews,
    refreshRatingStats: loadRatingStats
  };
};
