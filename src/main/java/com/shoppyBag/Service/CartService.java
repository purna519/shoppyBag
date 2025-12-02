package com.shoppyBag.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.DTO.CartDTO;
import com.shoppyBag.DTO.CartItemDTO;
import com.shoppyBag.DTO.ProductVariantDTO;
import com.shoppyBag.Entity.Cart;
import com.shoppyBag.Entity.CartItem;
import com.shoppyBag.Entity.Product;
import com.shoppyBag.Entity.ProductVariant;
import com.shoppyBag.Entity.Users;
import com.shoppyBag.Repository.CartItemRepository;
import com.shoppyBag.Repository.CartRepository;
import com.shoppyBag.Repository.ProductRepository;
import com.shoppyBag.Repository.ProductVariantRepository;

@Service
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

    private CartItemDTO convertToItemDTO(CartItem item) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(item.getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProduct(item.getProduct());

        if (item.getVariant() != null) {
            ProductVariant variant = item.getVariant();
            ProductVariantDTO variantDTO = new ProductVariantDTO();
            
            variantDTO.setId(variant.getId());
            variantDTO.setColor(variant.getColor());
            variantDTO.setSize(variant.getSize());
            variantDTO.setSku(variant.getSku());
            variantDTO.setPrice(variant.getPrice());
            
            dto.setVariant(variantDTO);
        } else {
            dto.setVariant(null);
        }
        
        dto.setQuantity(item.getQuantity());
        dto.setPrice(item.getPrice());

        return dto;
    }

    private CartDTO convertToCartDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());
        dto.setCreatedAt(cart.getCreatedAt());
        dto.setTotalAmount(cart.getTotalAmount());
        dto.setItems(cart.getItems().stream().map(this::convertToItemDTO).toList());
        return dto;
    }

    private void updateCartTotal(Cart cart) {
        double total = 0.0;
        for (CartItem item : cart.getItems()) {
            total += item.getPrice() * item.getQuantity();
        }
        cart.setTotalAmount(total);
    }



    public ApiResponse<String> createCartIfNotExists(String token, Long id, Long VariantId, int quantity,
            double price) {
        Users user = regularFunctions.validateToken(token);
        if (user == null) {
            return new ApiResponse<>("Error", "You are not a valid user. Please register or log in.", null);
        }

        Cart cart = cartRepository.findByUser(user);
        if (cart == null) {
            cart = new Cart(user);
            cartRepository.save(cart);
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
            double finalPrice = (variant != null) ? variant.getPrice() : product.getPrice();
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            existingItem.setPrice(finalPrice);
            cartItemRepository.save(existingItem);
            updateCartTotal(cart);
            cartRepository.save(cart);
            return new ApiResponse<>("Success", "Product quantity updated in cart!", null);
        } else {
            double finalPrice = (variant != null) ? variant.getPrice() : product.getPrice();

            CartItem newItem = new CartItem(cart, product, variant, quantity, finalPrice, user);
            
            cart.getItems().add(newItem);

            cartItemRepository.save(newItem);
            updateCartTotal(cart);
            cartRepository.save(cart);
            return new ApiResponse<>("Success", "Product added to cart successfully!", null);
        }
    }
    
    public ApiResponse<CartDTO> getCartItems(String token) {
        Users user = regularFunctions.validateToken(token);
        if (user == null) {
            return new ApiResponse<>("Error", "You are not a valid user. Please register or log in.", null);
        }

        Cart cart = cartRepository.findByUser(user);

        if (cart == null || cart.getItems() == null || cart.getItems().isEmpty()) {
            return new ApiResponse<>("Error", "No items found in your cart.", null);
        }

        updateCartTotal(cart);
        cartRepository.save(cart);

        return new ApiResponse<>("Success", "Items in your cart", convertToCartDTO(cart));

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

        ProductVariant variant = null;
        if (variantId != null) {
            variant = productVariantRepository.findById(variantId)
                    .orElseThrow(() -> new RuntimeException("Product variant not found"));
        }

        CartItem cartItem = cartItemRepository.findByCartAndProductAndVariant(cart, product, variant);

        if (cartItem == null) {
            return new ApiResponse<>("Error", "Product not found in cart", null);
        }

        cartItemRepository.delete(cartItem);

        updateCartTotal(cart);
        cartRepository.save(cart);

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

        ProductVariant variant = null;
        if (variantId != null) {
            variant = productVariantRepository.findById(variantId)
                    .orElseThrow(() -> new RuntimeException("Product variant not found"));
        }

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

        double finalPrice = (variant != null) ? variant.getPrice() : product.getPrice();
        cartItem.setPrice(finalPrice);

        cartItemRepository.save(cartItem);

        updateCartTotal(cart);
        cartRepository.save(cart);

        return new ApiResponse<>("Success", "Cart item quantity updated successfully", null);
    }


}
