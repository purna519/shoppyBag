package com.shoppyBag.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.DTO.ProductImageDTO;
import com.shoppyBag.Entity.Product;
import com.shoppyBag.Entity.ProductImage;
import com.shoppyBag.Repository.ProductImageRepository;
import com.shoppyBag.Repository.ProductRepository;

@Service
public class ProductImageService {
    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private ProductRepository productRepository;

    private ProductImageDTO convertToDTO(ProductImage image) {
        ProductImageDTO dto = new ProductImageDTO();
        dto.setId(image.getId());
        dto.setImageUrl(image.getImageUrl());
        dto.setAltText(image.getAltText());
        return dto;
    }

    public ApiResponse<ProductImageDTO> addProductImages(Long id, ProductImage productImage, String token) {
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
        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Product Image Not Found"));
        productImageRepository.delete(image);

        return new ApiResponse<>("Success", "Product Image deleted successfully", null);
    }

}
