package com.shoppyBag.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.DTO.ProductUpdateReqDTO;
import com.shoppyBag.Entity.Product;
import com.shoppyBag.Service.ProductService;

@RestController
@RequestMapping("/api/product")
public class ProductController {
    
    @Autowired
    private ProductService productService;

    @PostMapping("/addProduct")
    public ApiResponse<?> addProduct(@RequestBody Product product, @RequestHeader("Authorization") String token) {
        return productService.addProduct(product, token);
    }
    
    @GetMapping("/fetchallProducts")
    public ApiResponse<List<Product>> getAllProducts(@RequestHeader("Authorization") String Token) {
        return productService.getAllProducts(Token);
        
    }

    @GetMapping("/searchByName")
    public ApiResponse<List<Product>> searchByName(@RequestParam("name") String name,
            @RequestHeader("Authorization") String Token) {
        return productService.searchProductsByName(name, Token);
    }
    
    @GetMapping("/searchByCategory")
    public ApiResponse<List<Product>> searchProductsByCategory(@RequestParam("category") String category, @RequestHeader("Authorization") String token) {
        return productService.searchProductsByCategory(category, token);
    }
    
    @DeleteMapping("/delete/{id}")
    public ApiResponse<?> deleteProduct(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        return productService.deleteProduct(id, token);
    }

    @PostMapping("/update/{id}")
    public ApiResponse<Product> updateProduct(@PathVariable Long id, @RequestBody ProductUpdateReqDTO dto, @RequestHeader("Authorization") String token) {
        return productService.updateProduct(id, dto, token);
    }

}
