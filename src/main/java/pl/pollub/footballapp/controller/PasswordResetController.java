package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import pl.pollub.footballapp.model.PasswordResetToken;
import pl.pollub.footballapp.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.service.UserService;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import pl.pollub.footballapp.service.PasswordResetTokenService;
import pl.pollub.footballapp.repository.PasswordResetTokenRepository;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

//@RestController
//@RequestMapping("/api/auth")
//public class PasswordResetController {
//    private final UserService userService;
//    private final PasswordResetTokenService tokenService;
//    private final PasswordResetTokenRepository tokenRepository;
//    private final JavaMailSender mailSender;
//    @Autowired
//    public PasswordResetController(UserService userService, PasswordResetTokenService tokenService, PasswordResetTokenRepository tokenRepository, JavaMailSender mailSender) {
//        this.userService = userService;
//        this.tokenService = tokenService;
//        this.tokenRepository = tokenRepository;
//        this.mailSender = mailSender;
//    }
//
//
//    @Async
//    @PostMapping("/reset-password")
//    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> emailMap) {
//        String email = emailMap.get("email");
//        User user = userService.findByEmail(email);
//        if (user == null) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email not found");
//        }
//
//        String token = tokenService.createToken(user);
//
//        String resetUrl = "http://localhost:3000/reset-password?token=" + token;
//
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setFrom("from@example.com");
//        message.setTo(user.getEmail());
//        message.setSubject("Reset Password");
//        message.setText("Click the link to reset your password: " + resetUrl);
//        mailSender.send(message);
//
//        return ResponseEntity.ok("Reset link sent");
//    }
//
//    @PostMapping("/reset-password-confirm")
//    public ResponseEntity<?> resetPasswordConfirm(@RequestBody Map<String, String> request) {
//        String token = request.get("token");
//        String newPassword = request.get("password");
//
//        boolean isValidToken = tokenService.validateToken(token);
//        if (!isValidToken) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token");
//        }
//
//        User user = tokenService.getUserByToken(token);
//        userService.updatePassword(user, newPassword);
//
//        return ResponseEntity.ok("Password has been reset successfully");
//    }
//
//    public User getUserByToken(String token) {
//        Optional<PasswordResetToken> passwordResetToken = tokenRepository.findByToken(token);
//
//        if (passwordResetToken.isPresent() && passwordResetToken.get().getExpiryDate().isAfter(LocalDateTime.now())) {
//            return passwordResetToken.get().getUser();
//        }
//
//        return null;
//    }
//}
@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {
    private final PasswordResetTokenService tokenService;

    @Autowired
    public PasswordResetController(PasswordResetTokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Async
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> emailMap) {
        tokenService.handlePasswordReset(emailMap.get("email"));
        return ResponseEntity.ok("Reset link sent");
    }

    @PostMapping("/reset-password-confirm")
    public ResponseEntity<String> resetPasswordConfirm(@RequestBody Map<String, String> request) {
        tokenService.resetPasswordConfirm(request.get("token"), request.get("password"));
        return ResponseEntity.ok("Password has been reset successfully");
    }
}


