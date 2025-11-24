// com.shoppyBag.service.CustomUserDetailsService
package com.shoppyBag.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import com.shoppyBag.Entity.Users;
import com.shoppyBag.Model.CustomUserDetails;
import com.shoppyBag.Repository.UserRepository;


@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users u = userRepository.findByEmail(email);
        if (u == null) throw new UsernameNotFoundException("User not found");
        return new CustomUserDetails(u);
    }
}
