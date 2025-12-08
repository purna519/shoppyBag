import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StarRating from '../components/StarRating';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import CollapsibleSection from '../components/CollapsibleSection';
import ShippingInfo from '../components/ShippingInfo';
import ProductImages from '../components/product/ProductImages';
import ProductInfo from '../components/product/ProductInfo';
import { useProductData } from '../hooks/useProductData';
import CartContext from '../Context/CartContext';
import { ToastContext } from '../Context/ToastContext';
import '../styles/product-detail.css';
import '../styles/product-detail-enhancements.css';
import '../styles/product-detail-dark-mode.css';
import '../styles/out-of-stock-variants.css';
import '../styles/mini-cart.css';
import '../styles/reviews.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainIndex, setMainIndex] = useState(0);
  const [userToken, setUserToken] = useState(null);
  
  const { cart, addToCart } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  
  const { product, loading, relatedProducts, reviews, ratingStats, refreshReviews, refreshRatingStats } = useProductData(id);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants?.[0] || null);
      setMainIndex(0);
    }
  }, [product]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setUserToken(token);
  }, []);

  const handleAdd = async () => {
    try {
     const price = selectedVariant ? selectedVariant.price : (product.price || 0);
      await addToCart({
        productId: product.id,
        variantId: selectedVariant?.id || null,
        quantity,
        price
      });
      showToast('Added to cart!', 'success');
    } catch (e) {
      showToast('Failed to add to cart', 'error');
    }
  };

  const formatPrice = (price) => `₹${price?.toLocaleString('en-IN')}`;

  if (loading) return (
    <div><Navbar /><div className="container py-5 text-center"><div className="spinner-border text-primary" role="status"></div></div><Footer /></div>
  );

  if (!product) return (
    <div><Navbar /><div className="container py-5 text-center"><h3>Product not found</h3></div><Footer /></div>
  );

  const stock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="product-detail-container">
        <div className="product-detail-grid">
          {/* Product Images */}
          <ProductImages 
            images={product.images}
            mainIndex={mainIndex}
            setMainIndex={setMainIndex}
            productName={product.name}
          />

          {/* Product Info */}
          <ProductInfo 
            product={product}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
            quantity={quantity}
            setQuantity={setQuantity}
            ratingStats={ratingStats}
            handleAdd={handleAdd}
            stock={stock}
          />

          {/* Mini Cart Sidebar */}
          <div className="mini-cart-sidebar">
            <div className="mini-cart-header">
              <i className="bi bi-bag"></i>
              <h3>Your Cart</h3>
              <span className="cart-count">{cart?.items?.length || 0}</span>
            </div>

            {!cart || !cart.items || cart.items.length === 0 ? (
              <div className="mini-cart-empty">
                <i className="bi bi-cart-x"></i>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="mini-cart-items">
                  {cart.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="mini-cart-item">
                      <img src={item.variant?.imageUrl || item.product?.imageUrl} alt={item.product?.name} />
                      <div className="mini-item-details">
                        <div className="mini-item-name">{item.product?.name}</div>
                        <div className="mini-item-meta">
                          {item.variant?.size} × {item.quantity}
                        </div>
                        <div className="mini-item-price">{formatPrice(item.price * item.quantity)}</div>
                      </div>
                    </div>
                  ))}
                  {cart.items.length > 3 && (
                    <div className="mini-cart-more">
                      +{cart.items.length - 3} more item(s)
                    </div>
                  )}
                </div>

                <div className="mini-cart-total">
                  <span>Subtotal:</span>
                  <span>{formatPrice(cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}</span>
                </div>

                <div className="mini-cart-actions">
                  <Link to="/cart" className="mini-btn-cart">
                    <i className="bi bi-cart3"></i>
                    View Cart
                  </Link>
                  <Link to="/checkout" className="mini-btn-checkout">
                    <i className="bi bi-lightning"></i>
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="product-detail-grid">
          <div></div>
          <div>
            <CollapsibleSection title="Description & Fit">
              <p>{product.description || 'Experience unmatched comfort with this premium product. Made from high-quality materials with attention to detail. Perfect for everyday wear with a modern fit that complements any style.'}</p>
            </CollapsibleSection>

            <CollapsibleSection title="Shipping">
              <ShippingInfo />
            </CollapsibleSection>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <div className="container">
            <div className="reviews-header">
              <h2 className="section-title">Customer Reviews</h2>
              {ratingStats && ratingStats.averageRating > 0 && (
                <div className="rating-summary">
                  <div className="rating-average">{ratingStats.averageRating.toFixed(1)}</div>
                  <div>
                    <StarRating rating={ratingStats.averageRating} size="1.2rem" />
                    <div className="text-muted small mt-1">
                      Based on {ratingStats.reviewCount} review{ratingStats.reviewCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="row">
              <div className="col-md-8">
                <ReviewList reviews={reviews} />
              </div>
              <div className="col-md-4">
                {userToken ? (
                  <div className="review-form-wrapper">
                    <ReviewForm
                      productId={id}
                      onReviewSubmitted={() => {
                        refreshReviews();
                        refreshRatingStats();
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center p-4 bg-light rounded">
                    <i className="bi bi-person-circle" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                    <p className="mt-3">Please <Link to="/login">login</Link> to write a review</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2 className="section-title">You May Also Like</h2>
            <div className="related-products-grid">
              {relatedProducts.map(relProduct => (
                <Link
                  key={relProduct.id}
                  to={`/product/${relProduct.id}`}
                  className="related-product-card"
                >
                  <div className="related-product-image">
                    <img src={relProduct.productImage?.[0]?.imageUrl || relProduct.imageUrl || '/placeholder.png'} alt={relProduct.name} />
                  </div>
                  <div className="related-product-info">
                    <h3 className="related-product-name">{relProduct.name}</h3>
                    <p className="related-product-category">{relProduct.category}</p>
                    <div className="related-product-price">{formatPrice(relProduct.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
