package com.shoppyBag.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.Entity.ProductImage;
import com.shoppyBag.Service.ProductImageService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;


@RestController
@RequestMapping("/api/productImages")
public class ProductImageController {

    @Autowired
    private ProductImageService productImageService;
    
    @PostMapping("/addProductImage/{productId}")
    public ApiResponse<ProductImage> addProductImage(@PathVariable Long productId,
            @RequestBody ProductImage productImage, @RequestHeader("Authorization") String token) {

        return productImageService.addProductImages(productId, productImage, token);

    }
    
    // ✅ Get all images by product
    @GetMapping("/getByProduct/{productId}")
    public List<ProductImage> getImagesByProduct(@PathVariable Long productId) {
        return productImageService.getImagesByProduct(productId);
    }

    // ✅ Delete image by ID (Admin only)
    @DeleteMapping("/delete/{imageId}")
    public ApiResponse<String> deleteImage(
            @PathVariable Long imageId,
            @RequestHeader("Authorization") String token) {

        return productImageService.deleteProductImage(imageId, token);
    }

}
