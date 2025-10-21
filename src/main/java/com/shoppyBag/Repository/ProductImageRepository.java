package com.shoppyBag.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shoppyBag.Entity.ProductImage;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
}
