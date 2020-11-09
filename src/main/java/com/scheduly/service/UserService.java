package com.scheduly.service;

import com.scheduly.model.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {

    User findByUsername(String username);

    void registerUser(User user);

    void save(User user);

    User findByUsernameOrEmail(String username, String email);
}
