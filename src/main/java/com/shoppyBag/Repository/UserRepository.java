package com.shoppyBag.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shoppyBag.Entity.Users;

public interface UserRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByEmail(String email);
}