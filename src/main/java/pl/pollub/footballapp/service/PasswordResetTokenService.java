package pl.pollub.footballapp.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import pl.pollub.footballapp.model.PasswordResetToken;
import pl.pollub.footballapp.model.User;
import pl.pollub.footballapp.repository.PasswordResetTokenRepository;
import pl.pollub.footballapp.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

//@Service
//public class PasswordResetTokenService {
//    private PasswordResetTokenRepository tokenRepository;
//    private UserRepository userRepository;
//    @Autowired
//    public PasswordResetTokenService(PasswordResetTokenRepository tokenRepository, UserRepository userRepository) {
//        this.tokenRepository = tokenRepository;
//        this.userRepository = userRepository;
//    }
//
//
//
//
//
//    public String createToken(User user) {
//        String token = UUID.randomUUID().toString();
//        PasswordResetToken passwordResetToken = new PasswordResetToken(token, user, LocalDateTime.now().plusHours(1));
//        user.setResettingPassword(true);
//        userRepository.save(user);
//        tokenRepository.save(passwordResetToken);
//        return token;
//    }
//
//    public boolean validateToken(String token) {
//        Optional<PasswordResetToken> passwordResetToken = tokenRepository.findByToken(token);
//
//        return passwordResetToken.isPresent() &&
//                passwordResetToken.get().getExpiryDate().isAfter(LocalDateTime.now());
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


@Service
public class PasswordResetTokenService {
    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    @Autowired
    public PasswordResetTokenService(PasswordResetTokenRepository tokenRepository, UserRepository userRepository, JavaMailSender mailSender) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.mailSender = mailSender;
    }


    public String createToken(User user) {
        String token = UUID.randomUUID().toString();
        PasswordResetToken passwordResetToken = new PasswordResetToken(token, user, LocalDateTime.now().plusHours(1));
        user.setResettingPassword(true);
        userRepository.save(user);
        tokenRepository.save(passwordResetToken);
        return token;
    }

    public void handlePasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Email not found"));

        String token = createToken(user);
        sendResetEmail(user, token);
    }

    public void resetPasswordConfirm(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token has expired");
        }

        User user = resetToken.getUser();

        // Hashowanie hasła przed zapisaniem
        String hashedPassword = new BCryptPasswordEncoder().encode(newPassword);
        user.setPassword(hashedPassword);

        user.setResettingPassword(false);
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }

    private void sendResetEmail(User user, String token) {
        String resetUrl = "http://localhost:3000/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("from@example.com");
        message.setTo(user.getEmail());
        message.setSubject("Reset Password");
        message.setText("Click the link to reset your password: " + resetUrl);

        mailSender.send(message);
    }
}

