package com.shoppyBag.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shoppyBag.Entity.ProductVariant;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
}
