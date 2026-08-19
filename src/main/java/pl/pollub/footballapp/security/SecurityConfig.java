package pl.pollub.footballapp.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import pl.pollub.footballapp.security.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    private JwtRequestFilter jwtRequestFilter;

    @Autowired
    public SecurityConfig(JwtRequestFilter jwtRequestFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors().and()
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests((requests) -> requests

                                .requestMatchers("/api/**").permitAll() // Pozwól na dostęp bez autoryzacji


                                .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                .requestMatchers("/api/countries").permitAll()
                                .requestMatchers("/api/auth/reset-password").permitAll()
                                .requestMatchers("/api/auth/reset-password-confirm").permitAll()
                                .requestMatchers("/api/auth/register-admin").permitAll()
                                .requestMatchers("/api/auth/check-admin").permitAll()
                                .requestMatchers("/api/coaches/search/**").hasRole("MODERATOR")
                                .requestMatchers("/api/coach-contracts/**").hasRole("MODERATOR")
                                .requestMatchers("/api/positions/**").permitAll()
                                .requestMatchers("/assets/img/player/**").permitAll()
                                .requestMatchers("/img/player/**").permitAll()
                                .requestMatchers("/img/team/**").permitAll()
                                // Allow all authenticated users (ROLE_USER) to access teams, leagues, and matches
                                .requestMatchers("/api/teams/**", "/api/leagues/**", "/api/matches/**",
                                        "/api/favorite-teams/**", "/api/favorite-leagues/**", "/api/favorite-matches/**").hasAnyRole("USER", "MODERATOR", "ADMIN")
                                .requestMatchers("/api/favorites/**").permitAll()

                                .requestMatchers("/api/match-squad/**").permitAll()
                                .requestMatchers("/api/match-squad/players/**").permitAll()
                                .requestMatchers("/api/matches/**").permitAll() // Pozwól na dostęp bez autoryzacji
                                .requestMatchers("/api/match-squad/first-squad/**").permitAll() // Pozwól na dostęp bez autoryzacji
                                .requestMatchers("/api/match-squad/substitutes/**").permitAll() // Pozwól na dostęp bez autoryzacji
                                .requestMatchers("/api/leagues/countries").permitAll() // Pozwól na dostęp bez autoryzacji
                                .requestMatchers("/api/leagues/**").permitAll() // Pozwól na dostęp bez autoryzacji
                                .requestMatchers("/api/leagues/byCountry").permitAll() // Pozwól na dostęp bez autoryzacji
//                        .requestMatchers("/api/**").permitAll() // Pozwól na dostęp bez autoryzacji


                                .requestMatchers("/images/**").permitAll()
                                .requestMatchers("/css/**", "/js/**", "/webjars/**").permitAll()
                                .anyRequest().authenticated()
                )
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
