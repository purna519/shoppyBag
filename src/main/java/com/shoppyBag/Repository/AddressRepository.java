package com.shoppyBag.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shoppyBag.Entity.Address;
import com.shoppyBag.Entity.Users;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUsers(Users user);
}
