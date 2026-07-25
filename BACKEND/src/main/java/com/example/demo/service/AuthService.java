package com.example.demo.service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //comprueba que el username no exista ya, encripta la contraseña con BCrypt, y guarda
    public User register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso");
        }

        String encryptedPassword = passwordEncoder.encode(request.getPassword());
        User newUser = new User(request.getUsername(), encryptedPassword);

        return userRepository.save(newUser);
    }

    //busca al usuario y usa passwordEncoder.matches, esto coge la contraseña en texto plano que llega, 
    // la encripta con el mismo algoritmo, y compara contra el hash guardado
    public User validateLogin(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Usuario o contraseña incorrectos"));

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());

        //si el usuario no existe como si la contraseña falla, buena práctica de seguridad, 
        // para no revelar a un atacante si un username concreto existe o no en tu sistema.
        if (!passwordMatches) {
            throw new IllegalArgumentException("Usuario o contraseña incorrectos");
        }

        return user;
    }
}