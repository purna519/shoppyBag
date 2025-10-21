package com.shoppyBag.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shoppyBag.Entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long>{
    
}
