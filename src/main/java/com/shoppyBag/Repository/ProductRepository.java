package com.shoppyBag.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shoppyBag.Entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByCategoryContainingIgnoreCase(String category);

    List<Product> findByNameContainingIgnoreCase(String name);    
}
