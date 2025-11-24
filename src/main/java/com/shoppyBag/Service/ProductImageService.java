package com.shoppyBag.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.DTO.ProductImageDTO;
import com.shoppyBag.Entity.Product;
import com.shoppyBag.Entity.ProductImage;
import com.shoppyBag.Entity.Users;
import com.shoppyBag.Repository.ProductImageRepository;
import com.shoppyBag.Repository.ProductRepository;
import com.shoppyBag.Repository.UserRepository;
import com.shoppyBag.Util.JWTUtil;

@Service
public class ProductImageService {
    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    private ProductImageDTO convertToDTO(ProductImage image) {
        ProductImageDTO dto = new ProductImageDTO();
        dto.setId(image.getId());
        dto.setImageUrl(image.getImageUrl());
        dto.setAltText(image.getAltText());
        return dto;
    }

    private Users validateAdminToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) return null;
        String actualToken = token.substring(7);
        String email = jwtUtil.extractEmail(actualToken);
        Users user = userRepository.findByEmail(email);
        if (user == null || !"ADMIN".equalsIgnoreCase(user.getRole())) return null;
        return user;
    }

    public ApiResponse<ProductImageDTO> addProductImages(Long id, ProductImage productImage, String token) {
        Users admin = validateAdminToken(token);

        if (admin == null) {
            return new ApiResponse<ProductImageDTO>("Error", "Invalid Token", null);
        }

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product Not Found"));

        productImage.setProduct(product);
        productImageRepository.save(productImage);

        return new ApiResponse<>("Success", "Product image succesfully added", convertToDTO(productImage));
    }

     //  Get all images by product
    public List<ProductImageDTO> getImagesByProduct(Long productId) {
        return productImageRepository.findByProductId(productId).stream()
                .map(this::convertToDTO)
                .toList();
    }

    //  Delete product image (Admin only)
    public ApiResponse<String> deleteProductImage(Long imageId, String token) {
        Users admin = validateAdminToken(token);
        if (admin == null) {
            return new ApiResponse<>("Error", "Unauthorized Access", null);
        }

        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Product Image Not Found"));
        productImageRepository.delete(image);

        return new ApiResponse<>("Success", "Product Image deleted successfully", null);
    }

}
