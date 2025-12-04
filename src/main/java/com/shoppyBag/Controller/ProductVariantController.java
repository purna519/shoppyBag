package com.shoppyBag.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.DTO.ProductVariantDTO;
import com.shoppyBag.Entity.ProductVariant;
import com.shoppyBag.Service.ProductVariantService;

@RestController
@RequestMapping("/api/variants")
public class ProductVariantController {

    @Autowired
    private ProductVariantService variantService;

    // Add Variant (Admin Only)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add/{productId}")
    public ApiResponse<ProductVariantDTO> addVariant(
            @PathVariable Long productId,
            @RequestBody ProductVariant variant,
            @RequestHeader("Authorization") String token) {
        return variantService.addProductVariant(productId, variant, token);
    }

    //Get all variants for a product (Public)
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/getByProduct/{productId}")
    public ApiResponse<List<ProductVariantDTO>> getVariantsByProduct(@PathVariable Long productId, @RequestHeader("Authorization") String token) {
        return variantService.getVariantsByProduct(productId, token);
    }

    // Update Variant (Admin Only)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{variantId}")
    public ApiResponse<ProductVariantDTO> updateVariant(
            @PathVariable Long variantId,
            @RequestBody ProductVariant variant,
            @RequestHeader("Authorization") String token) {
        return variantService.updateVariant(variantId, variant, token);
    }

    // Delete Variant (Admin Only)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{variantId}")
    public ApiResponse<String> deleteVariant(
            @PathVariable Long variantId,
            @RequestHeader("Authorization") String token) {
        return variantService.deleteVariant(variantId, token);
    }
}
