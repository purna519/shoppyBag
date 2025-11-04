package com.shoppyBag.Service;

import org.springframework.beans.factory.annotation.Autowired;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.Entity.Cart;
import com.shoppyBag.Entity.CartItem;
import com.shoppyBag.Entity.Product;
import com.shoppyBag.Entity.ProductVariant;
import com.shoppyBag.Entity.Users;
import com.shoppyBag.Repository.CartItemRepository;
import com.shoppyBag.Repository.CartRepository;
import com.shoppyBag.Repository.ProductRepository;
import com.shoppyBag.Repository.ProductVariantRepository;


public class CartService {

    @Autowired
    private RegularFunctions regularFunctions;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private CartItemRepository cartItemRepository;


    public ApiResponse<String> createCartIfNotExists(String token, Long id, Long VariantId, int quantity,
            double price) {
        Users user = regularFunctions.validateToken(token);
        if (user == null) {
            return new ApiResponse<>("Error", "You are not a valid user. Please register or log in.", null);
        }

        Cart cart = cartRepository.findByUser(user);
        if (cart == null) {
            Cart newCart = new Cart(user);
            cartRepository.save(newCart);
        }

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductVariant variant = productVariantRepository.findById(VariantId)
                .orElseThrow(() -> new RuntimeException("Product Variant Not selected"));

        int available = (variant != null) ? variant.getStockQuantity() : product.getStockQuantity();

        if (available < quantity)
            return new ApiResponse<>("Error", "Sorry, not enough stock available.", null);

        CartItem existingItem = cartItemRepository.findByCartAndProductAndVariant(cart, product, variant);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            existingItem.setPrice(price);
            cartItemRepository.save(existingItem);
            return new ApiResponse<>("Success", "Product quantity updated in cart!", null);
        } else {
            CartItem newItem = new CartItem(cart, product, variant, quantity, price);
            cartItemRepository.save(newItem);
            return new ApiResponse<>("Success", "Product added to cart successfully!", null);
        }
    }
    
    public ApiResponse<Cart> getCartItems(String token) {
        Users user = regularFunctions.validateToken(token);
        if (user == null) {
            return new ApiResponse<>("Error", "You are not a valid user. Please register or log in.", null);
        }

        Cart cart = cartRepository.findByUser(user);

        if (cart == null || cart.getItems() == null || cart.getItems().isEmpty()) {
            return new ApiResponse<>("Error", "No items found in your cart.", null);
        }

        return new ApiResponse<Cart>("Success", "Items in your cart", cart);
    }

    public ApiResponse<String> clearCart(String token, Long productId, Long variantId) {
        Users user = regularFunctions.validateToken(token);
        if (user == null) {
            return new ApiResponse<>("Error", "User not valid", null);
        }

        Cart cart = cartRepository.findByUser(user);
        if (cart == null) {
            return new ApiResponse<>("Error", "No cart found for this user", null);
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        CartItem cartItem = cartItemRepository.findByCartAndProductAndVariant(cart, product, variant);

        if (cartItem == null) {
            return new ApiResponse<>("Error", "Product not found in cart", null);
        }

        cartItemRepository.delete(cartItem);

        return new ApiResponse<>("Success", "Product removed from cart successfully", null);
    }

    public ApiResponse<String> updateCartItem(String token, Long productId, Long variantId, int newQuantity) {
        Users user = regularFunctions.validateToken(token);
        if (user == null) {
            return new ApiResponse<>("Error", "User not valid", null);
        }

        Cart cart = cartRepository.findByUser(user);
        if (cart == null) {
            return new ApiResponse<>("Error", "No cart found for this user", null);
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        CartItem cartItem = cartItemRepository.findByCartAndProductAndVariant(cart, product, variant);
        if (cartItem == null) {
            return new ApiResponse<>("Error", "Product not found in cart", null);
        }

        // check stock
        int available = (variant != null) ? variant.getStockQuantity() : product.getStockQuantity();
        if (newQuantity > available) {
            return new ApiResponse<>("Error", "Not enough stock available", null);
        }

        cartItem.setQuantity(newQuantity);
        cartItemRepository.save(cartItem);

        return new ApiResponse<>("Success", "Cart item quantity updated successfully", null);
    }


}
