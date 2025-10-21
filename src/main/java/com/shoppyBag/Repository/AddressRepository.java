package com.shoppyBag.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shoppyBag.Entity.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {
    
}
