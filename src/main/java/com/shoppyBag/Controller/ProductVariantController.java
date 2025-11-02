package com.shoppyBag.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.Entity.ProductVariant;
import com.shoppyBag.Service.ProductVariantService;

@RestController
@RequestMapping("/api/variants")
public class ProductVariantController {

    @Autowired
    private ProductVariantService variantService;

    @PostMapping("/add/{productId}")
    public ApiResponse<ProductVariant> addVariant(@PathVariable Long productId, @RequestBody ProductVariant variant, @RequestHeader("Authorization") String token) {
        return variantService.addProductVariant(productId, variant, token);
    }

    @GetMapping("/getByProduct/{productId}")
    public List<ProductVariant> getVariantsByProduct(@PathVariable Long productId) {
        return variantService.getVariantsByProduct(productId);
    }

    @PutMapping("/update/{variantId}")
    public ProductVariant updateVariant(@PathVariable Long variantId, @RequestBody ProductVariant variant) {
        return variantService.updateVariant(variantId, variant);
    }

    @DeleteMapping("/delete/{variantId}")
    public String deleteVariant(@PathVariable Long variantId) {
        variantService.deleteVariant(variantId);
        return "Variant deleted successfully";
    }
}
