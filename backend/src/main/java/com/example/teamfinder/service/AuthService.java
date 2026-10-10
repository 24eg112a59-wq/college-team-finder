package com.example.teamfinder.service;

import com.example.teamfinder.dto.LoginRequest;
import com.example.teamfinder.dto.RegisterRequest;
import com.example.teamfinder.dto.UserDTO;
import com.example.teamfinder.entity.Role;
import com.example.teamfinder.entity.User;
import com.example.teamfinder.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public UserDTO register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCollegeId(request.getCollegeId());
        user.setBranch(request.getBranch());
        user.setYear(request.getYear());
        user.setPhone(request.getPhone());
        user.setBio(request.getBio());
        user.setRole(Role.STUDENT);
        return UserDTO.from(userRepository.save(user));
    }

    public UserDTO login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (AuthenticationException exception) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return userRepository.findByEmail(request.getEmail())
            .map(UserDTO::from)
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
    }

    public UserDTO getByEmail(String email) {
        return userRepository.findByEmail(email).map(UserDTO::from)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
