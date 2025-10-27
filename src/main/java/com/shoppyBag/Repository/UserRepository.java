package com.shoppyBag.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shoppyBag.Entity.Users;

public interface UserRepository extends JpaRepository<Users, Long> {
    Users findByEmail(String email);
}