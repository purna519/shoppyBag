package com.shoppyBag.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.Entity.Product;
import com.shoppyBag.Entity.ProductVariant;
import com.shoppyBag.Entity.Users;
import com.shoppyBag.Repository.ProductRepository;
import com.shoppyBag.Repository.ProductVariantRepository;
import com.shoppyBag.Repository.UserRepository;
import com.shoppyBag.Util.JWTUtil;


@Service
public class ProductVariantService {

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    private Users validateAdminToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) return null;
        String actualToken = token.substring(7);
        String email = jwtUtil.extractEmail(actualToken);
        Users user = userRepository.findByEmail(email);
        if (user == null || !"ADMIN".equalsIgnoreCase(user.getRole())) return null;
        return user;
    }

    public ApiResponse<ProductVariant> addProductVariant(Long id, ProductVariant productVariant, String token) {
        Users admin = validateAdminToken(token);
        if (admin == null) {
            return new ApiResponse<>("Error", "Invalid or Unauthorized Token", null);
        }
    
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product Not Found"));
    
        productVariant.setProduct(product);
        productVariantRepository.save(productVariant);
    
        return new ApiResponse<>("Success", "Product Variant added successfully", productVariant);
    }
    
    
    // Get all variants for a product
    public List<ProductVariant> getVariantsByProduct(Long productId) {
        return productVariantRepository.findByProductId(productId);
    }

    // Update variant
    public ProductVariant updateVariant(Long id, ProductVariant variantDetails) {
        ProductVariant variant = productVariantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variant not found"));
        
        if (variantDetails.getColor() != null) variant.setColor(variantDetails.getColor());
        if (variantDetails.getSize() != null) variant.setSize(variantDetails.getSize());
        if (variantDetails.getSku() != null) variant.setSku(variantDetails.getSku());
        if (variantDetails.getPrice() != 0) variant.setPrice(variantDetails.getPrice());
        if (variantDetails.getStockQuantity() != 0) variant.setStockQuantity(variantDetails.getStockQuantity());
        
        return productVariantRepository.save(variant);
    }

    // Delete variant
    public void deleteVariant(Long id) {
        productVariantRepository.deleteById(id);
    }

}
