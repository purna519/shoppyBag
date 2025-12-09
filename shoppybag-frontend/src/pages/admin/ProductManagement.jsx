import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ToastContext } from '../../Context/ToastContext';
import ProductDetailsModal from '../../components/admin/ProductDetailsModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import '../../styles/admin/product-management.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    stockQuantity: ''
  });
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:8080/api/product/fetchallProducts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      
      // Step 1: Create the product
      const productResponse = await axios.post('http://localhost:8080/api/product/addProduct', {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const productId = productResponse.data.data?.id;
      
      if (!productId) {
        showToast('Product created but ID not returned', 'warning');
        return;
      }
      
      // Step 2: Add variants if any
      if (variants.length > 0) {
        for (const variant of variants) {
          try {
            await axios.post(`http://localhost:8080/api/variants/add/${productId}`, {
              color: variant.color,
              size: variant.size,
              sku: variant.sku,
              price: parseFloat(variant.price),
              stockQuantity: parseInt(variant.stockQuantity)
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (variantError) {
            console.error('Error adding variant:', variantError);
            showToast(`Failed to add variant: ${variant.sku}`, 'error');
          }
        }
      }
      
      // Step 3: Add images if any
      if (images.length > 0) {
        for (const image of images) {
          try {
            await axios.post(`http://localhost:8080/api/productImages/addProductImage/${productId}`, {
              imageUrl: image.imageUrl,
              altText: image.altText
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (imageError) {
            console.error('Error adding image:', imageError);
            showToast(`Failed to add image`, 'error');
          }
        }
      }
      
      showToast('Product added successfully with variants and images', 'success');
      setShowAddModal(false);
      setFormData({ name: '', brand: '', category: '', description: '', price: '', stockQuantity: '' });
      setVariants([]);
      setImages([]);
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      showToast('Failed to add product', 'error');
    }
  };
  
  const addVariant = () => {
    setVariants([...variants, { color: '', size: '', sku: '', price: '', stockQuantity: '' }]);
  };
  
  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };
  
  const updateVariant = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };
  
  const addImage = () => {
    setImages([...images, { imageUrl: '', altText: '' }]);
  };
  
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const updateImage = (index, field, value) => {
    const updatedImages = [...images];
    updatedImages[index][field] = value;
    setImages(updatedImages);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:8080/api/product/delete/${productToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Product deleted successfully', 'success');
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Failed to delete product', 'error');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading-spinner">Loading products...</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Product Management</h1>
        <div className="header-actions">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <i className="fas fa-plus"></i> Add Product
          </button>
        </div>
      </div>

      <div className="table-container product-management-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.category}</td>
                <td>₹{product.price}</td>
                <td>{product.stockQuantity}</td>
                <td className="actions-cell">
                  <button
                    className="btn-action btn-view"
                    onClick={() => setSelectedProduct(product)}
                    title="View Product"
                  >
                    <i className="fas fa-eye"></i>
                    View
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => setProductToDelete(product)}
                    title="Delete Product"
                  >
                    <i className="fas fa-trash"></i>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content add-product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Product</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleAddProduct} className="product-form">
                <div className="form-section">
                  <h3 className="section-title">Basic Information</h3>
                  
                  <div className="form-row form-row-3">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      required
                    />
                  </div>
                  
                  <textarea
                    placeholder="Product Description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                  
                  <div className="form-row">
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Stock Quantity"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-header">
                    <h3 className="section-title">Product Variants (Optional)</h3>
                    <button type="button" className="btn-add-item" onClick={addVariant}>
                      <i className="fas fa-plus"></i> Add Variant
                    </button>
                  </div>
                  
                  {variants.map((variant, index) => (
                    <div key={index} className="variant-item">
                      <div className="item-header">
                        <span className="item-label">Variant {index + 1}</span>
                        <button 
                          type="button" 
                          className="btn-remove-item" 
                          onClick={() => removeVariant(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      <div className="form-row">
                        <input
                          type="text"
                          placeholder="Color"
                          value={variant.color}
                          onChange={(e) => updateVariant(index, 'color', e.target.value)}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Size"
                          value={variant.size}
                          onChange={(e) => updateVariant(index, 'size', e.target.value)}
                          required
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="SKU"
                        value={variant.sku}
                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                        required
                      />
                      <div className="form-row">
                        <input
                          type="number"
                          placeholder="Variant Price (₹)"
                          value={variant.price}
                          onChange={(e) => updateVariant(index, 'price', e.target.value)}
                          required
                        />
                        <input
                          type="number"
                          placeholder="Stock Quantity"
                          value={variant.stockQuantity}
                          onChange={(e) => updateVariant(index, 'stockQuantity', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  ))}
                  
                  {variants.length === 0 && (
                    <p className="empty-message">No variants added yet. Click "Add Variant" to add one.</p>
                  )}
                </div>

                <div className="form-section">
                  <div className="section-header">
                    <h3 className="section-title">Product Images (Optional)</h3>
                    <button type="button" className="btn-add-item" onClick={addImage}>
                      <i className="fas fa-plus"></i> Add Image
                    </button>
                  </div>
                  
                  {images.map((image, index) => (
                    <div key={index} className="image-item">
                      <div className="item-header">
                        <span className="item-label">Image {index + 1}</span>
                        <button 
                          type="button" 
                          className="btn-remove-item" 
                          onClick={() => removeImage(index)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      <input
                        type="url"
                        placeholder="Image URL"
                        value={image.imageUrl}
                        onChange={(e) => updateImage(index, 'imageUrl', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Alt Text (description)"
                        value={image.altText}
                        onChange={(e) => updateImage(index, 'altText', e.target.value)}
                      />
                    </div>
                  ))}
                  
                  {images.length === 0 && (
                    <p className="empty-message">No images added yet. Click "Add Image" to add one.</p>
                  )}
                </div>
                
                <div className="modal-actions">
                  <button type="submit" className="btn-primary">
                    <i className="fas fa-plus"></i>
                    Add Product
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {productToDelete && (
        <DeleteConfirmModal
          item={productToDelete}
          itemType="product"
          onConfirm={handleDeleteProduct}
          onCancel={() => setProductToDelete(null)}
        />
      )}
    </div>
  );
};

export default ProductManagement;
