package com.shoppyBag.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.DTO.ProductUpdateReqDTO;
import com.shoppyBag.Entity.Product;
import com.shoppyBag.Entity.Users;
import com.shoppyBag.Repository.ProductRepository;
import com.shoppyBag.Repository.UserRepository;
import com.shoppyBag.Util.JWTUtil;

@Service
public class ProductService {

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    private Users validateAdminToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) return null;
        String actualToken = token.substring(7);
        String email = jwtUtil.extractEmail(actualToken);
        Users user = userRepository.findByEmail(email);
        if (user == null || !"ADMIN".equalsIgnoreCase(user.getRole())) return null;
        return user;
    }


    public ApiResponse<Product> addProduct(Product p, String Token) {
        Users u = validateAdminToken(Token);
        if (u == null) {
            return new ApiResponse<Product>("Error", "User not found", null);
        }

        try {
            productRepository.save(p);
            return new ApiResponse<>("Success", "Product added successfully", p);
        } catch (Exception e) {
            return new ApiResponse<>("Error", "Failed to save product: " + e.getMessage(), null);
        }

    }
    
        
    public ApiResponse<List<Product>> getAllProducts(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return new ApiResponse<>("Error", "Invalid Token", null);
        }

        String actualToken = token.substring(7);
        if (!jwtUtil.validateToken(actualToken)) {
            return new ApiResponse<>("Error", "Invalid Token", null);
        }

        List<Product> products = productRepository.findAll();
        return new ApiResponse<>("Success", "All products retrieved successfully", products);
    }
    
    public ApiResponse<List<Product>> searchProductsByName(String name, String token) {
        if (token == null || !(token.startsWith("Bearer "))) {
            return new ApiResponse<>("Error", "Invalid Token", null);
        }

        String actualToken = token.substring(7);
        String email = jwtUtil.extractEmail(actualToken);

        if (email == null) {
            return new ApiResponse<>("Error", "Invalid Token", null);
        }

        List<Product> products = productRepository.findByNameContainingIgnoreCase(name);

        if (products.isEmpty()) {
            return new ApiResponse<>("Error", "No Products Found", null);
        }

        return new ApiResponse<>("Success", "Matching Products Retrieved", products);
    }


    // Search by category
    public ApiResponse<List<Product>> searchProductsByCategory(String category, String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return new ApiResponse<>("Error", "Invalid Token", null);
        }

        String actualToken = token.substring(7);
        String email = jwtUtil.extractEmail(actualToken);

        if (email == null) {
            return new ApiResponse<>("Error", "Invalid Token", null);
        }

        List<Product> products = productRepository.findByCategoryContainingIgnoreCase(category);
        return new ApiResponse<>("Success", "Products by category retrieved successfully", products);
    }

    public ApiResponse<String> deleteProduct(Long id, String token) {

        Users u = validateAdminToken(token);
        if (u == null) {
            return new ApiResponse<>("Error","Invalid Token",null);
        }        

        if (!productRepository.existsById(id)) {
            return new ApiResponse<>("Error", "Product not found", null);
        }

        productRepository.deleteById(id);
        return new ApiResponse<>("Success", "Product deleted successfully", null);
    }


    public ApiResponse<Product> updateProduct(Long id, ProductUpdateReqDTO dto, String token) {
        Users u = validateAdminToken(token);
        if (u == null) {
            return new ApiResponse<Product>("Error","Invalid Token",null);
        }

        Product existingProduct = productRepository.findById(id).orElse(null);
        if (existingProduct == null) {
            return new ApiResponse<>("Error", "Product not found", null);
        }

        if (dto.getName() != null) existingProduct.setName(dto.getName());
        if (dto.getBrand() != null) existingProduct.setBrand(dto.getBrand());
        if (dto.getCategory() != null) existingProduct.setCategory(dto.getCategory());
        if (dto.getDescription() != null) existingProduct.setDescription(dto.getDescription());
        if (dto.getPrice() > 0) existingProduct.setPrice(dto.getPrice());
        if (dto.getStockQuantity() > 0) existingProduct.setStockQuantity(dto.getStockQuantity());

        productRepository.save(existingProduct);
        return new ApiResponse<>("Success", "Product updated successfully", existingProduct);
    }

}
