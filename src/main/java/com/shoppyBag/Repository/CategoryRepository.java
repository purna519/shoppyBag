package com.shoppyBag.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shoppyBag.Entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    
}
