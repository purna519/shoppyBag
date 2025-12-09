package com.shoppyBag.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.DTO.ProductImageDTO;
import com.shoppyBag.Entity.ProductImage;
import com.shoppyBag.Service.FileStorageService;
import com.shoppyBag.Service.ProductImageService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
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
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/upload/{productId}")
    public ApiResponse<ProductImageDTO> uploadProductImage(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "altText", required = false) String altText,
            @RequestHeader("Authorization") String token) {
        
        try {
            String customName = "product-" + productId + "_img-" + System.currentTimeMillis();
            
            String fileName = fileStorageService.storeFile(file, "products", customName);
            
            ProductImage productImage = new ProductImage();
            productImage.setImageUrl(fileName);
            productImage.setAltText(altText != null ? altText : "Product image");
            
            return productImageService.addProductImages(productId, productImage, token);
            
        } catch (Exception e) {
            return ApiResponse.error("Failed to upload product image: " + e.getMessage());
        }
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/addProductImage/{productId}")
    public ApiResponse<ProductImageDTO> addProductImage(@PathVariable Long productId,
            @RequestBody ProductImage productImage, @RequestHeader("Authorization") String token) {

        return productImageService.addProductImages(productId, productImage, token);

    }
    
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/getByProduct/{productId}")
    public List<ProductImageDTO> getImagesByProduct(@PathVariable Long productId) {
        return productImageService.getImagesByProduct(productId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{imageId}")
    public ApiResponse<String> deleteImage(
            @PathVariable Long imageId,
            @RequestHeader("Authorization") String token) {

        return productImageService.deleteProductImage(imageId, token);
    }

}
