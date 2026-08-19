package pl.pollub.footballapp.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.User;
import pl.pollub.footballapp.repository.PasswordResetTokenRepository;
import pl.pollub.footballapp.repository.UserRepository;
import pl.pollub.footballapp.util.JwtUtil;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

//@Service
//public class UserService  implements UserDetailsService {
//    private UserRepository userRepository;
//    private final BCryptPasswordEncoder passwordEncoder;
//    @Autowired
//    public UserService(UserRepository userRepository) {
//        this.userRepository = userRepository;
//        this.passwordEncoder = new BCryptPasswordEncoder();
//    }
//
//
//
//
//
//    public User findByEmail(String email) {
//        Optional<User> optionalUser = userRepository.findByEmail(email);
//
//        if (optionalUser.isPresent()) {
//            return optionalUser.get();
//        } else {
//            throw new UsernameNotFoundException("User not found with email: " + email);
//        }
//    }
//
//    public void registerUser(User user) {
//        String hashedPassword = passwordEncoder.encode(user.getPassword());
//        user.setPassword(hashedPassword);
//
//        userRepository.save(user);
//    }
//
//
//
//    public User findByUsername(String username) {
//        Optional<User> optionalUser = userRepository.findByUsername(username);
//
//        if (optionalUser.isPresent()) {
//            return optionalUser.get();
//        } else {
//            throw new UsernameNotFoundException("User not found with email: " + username);
//        }
//    }
//
//
//    public void updatePassword(User user, String newPassword) {
//        user.setPassword(passwordEncoder.encode(newPassword));
//        user.setResettingPassword(false);
//        userRepository.save(user);
//    }
//
//
//    public boolean checkPassword(String rawPassword, String encodedPassword) {
//        return passwordEncoder.matches(rawPassword, encodedPassword);
//    }
//
//    public String encodePassword(String password) {
//        return passwordEncoder.encode(password);
//    }
//
//    @Override
//    public User loadUserByUsername(String username) throws UsernameNotFoundException {
//        Optional<User> user = userRepository.findByUsername(username);
//        if (user.isEmpty()) {
//            throw new UsernameNotFoundException("User not found with username: " + username);
//        }
//        return user.get();
//    }
//}


@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserService(UserRepository userRepository, PasswordResetTokenRepository passwordResetTokenRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.jwtUtil = jwtUtil;
    }

    public void addModerator(User moderatorRequest) {
        if (userRepository.existsByEmail(moderatorRequest.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        User moderator = new User();
        moderator.setEmail(moderatorRequest.getEmail());
        moderator.setPassword(encodePassword(moderatorRequest.getPassword()));
        moderator.setUsername(moderatorRequest.getUsername());
        moderator.setRole(User.Role.ROLE_MODERATOR);

        userRepository.save(moderator);
    }

    public void addAdmin(User adminRequest) {
        if (userRepository.existsByEmail(adminRequest.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        User admin = new User();
        admin.setEmail(adminRequest.getEmail());
        admin.setPassword(encodePassword(adminRequest.getPassword()));
        admin.setUsername(adminRequest.getUsername());
        admin.setRole(User.Role.ROLE_ADMIN);

        userRepository.save(admin);
    }

    public void deleteUserByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }
        User user = userOptional.get();
        passwordResetTokenRepository.deleteByUserId(user.getId());
        userRepository.deleteByEmail(email);
    }

    public void changePassword(String email, String newPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }
        User user = userOptional.get();
        user.setPassword(encodePassword(newPassword));
        userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }


    public void registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already in use");
        }

        user.setRole(User.Role.ROLE_USER);
        user.setPassword(encodePassword(user.getPassword()));
        userRepository.save(user);
    }

    public Map<String, String> loginUser(User loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isEmpty() || !checkPassword(loginRequest.getPassword(), userOptional.get().getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        User user = userOptional.get();
        if (user.isResettingPassword()) {
            throw new IllegalArgumentException("Please complete the password reset process before logging in.");
        }

        UserDetails userDetails = loadUserByUsername(user.getUsername());
        String jwtToken = jwtUtil.generateToken(userDetails);

        Map<String, String> response = new HashMap<>();
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());
        response.put("token", jwtToken);
        return response;
    }

    public void deleteCurrentUser() {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findByUsername(currentUsername);

        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        userRepository.delete(userOptional.get());
        SecurityContextHolder.clearContext();
    }

    public boolean checkIfAdminExists() {
        return userRepository.existsByRole(User.Role.ROLE_ADMIN);
    }

    public void registerAdmin(User user) {
        if (userRepository.existsByRole(User.Role.ROLE_ADMIN)) {
            throw new IllegalArgumentException("Admin account already exists.");
        }

        user.setRole(User.Role.ROLE_ADMIN);
        user.setPassword(encodePassword(user.getPassword()));
        userRepository.save(user);
    }

    //    public Optional<Map<String, Object>> getUserIdByEmail(String email) {
//        Optional<User> user = userRepository.findByUsername(email);
//        return user.map(u -> {
//            Map<String, Object> response = new HashMap<>();
//            response.put("id", u.getId());
//            return response;
//        });
//    }
    public ResponseEntity<?> getUserIdResponseByEmail(String email) {
        Optional<User> user = userRepository.findByUsername(email);

        if (user.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.get().getId());
            return ResponseEntity.ok(response); // Zwróć odpowiedź z kodem 200
        } else {
            return ResponseEntity.status(404).body("User not found"); // Zwróć odpowiedź z kodem 404
        }
    }


    public String getEmailFromToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring("Bearer ".length());
            return jwtUtil.extractUsername(jwt);
        } else {
            throw new IllegalArgumentException("Invalid token");
        }
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public User findByEmail(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {
            return optionalUser.get();
        } else {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
    }

    public void updatePassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResettingPassword(false);
        userRepository.save(user);
    }


}
