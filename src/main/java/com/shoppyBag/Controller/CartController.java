package com.shoppyBag.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.DTO.CartDTO;
import com.shoppyBag.Entity.Cart;
import com.shoppyBag.Service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/add")
    public ApiResponse<String> addToCart(
            @RequestHeader("Authorization") String token,
            @RequestParam Long productId,
            @RequestParam Long variantId,
            @RequestParam int quantity,
            @RequestParam double price) {
        return cartService.createCartIfNotExists(token, productId, variantId, quantity, price);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/get")
    public ApiResponse<CartDTO> getCart(@RequestHeader("Authorization") String token) {
        return cartService.getCartItems(token);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/update")
    public ApiResponse<String> updateCartItem(
            @RequestHeader("Authorization") String token,
            @RequestParam Long productId,
            @RequestParam(required = false) Long variantId,
            @RequestParam int quantity) {
        return cartService.updateCartItem(token, productId, variantId, quantity);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @DeleteMapping("/remove")
    public ApiResponse<String> removeFromCart(
            @RequestHeader("Authorization") String token,
            @RequestParam Long productId,
            @RequestParam(required = false) Long variantId) {
        return cartService.clearCart(token, productId, variantId);
    }
}
