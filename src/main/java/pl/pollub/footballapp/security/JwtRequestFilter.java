package pl.pollub.footballapp.security;

import io.jsonwebtoken.Claims;
import jakarta.annotation.security.PermitAll;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerExecutionChain;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import pl.pollub.footballapp.service.MatchSquadService;
import pl.pollub.footballapp.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;


@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    private JwtUtil jwtUtil;
    private UserDetailsService userDetailsService;
    private final ApplicationContext applicationContext; // Dodaj pole ApplicationContext

    @Autowired
    public JwtRequestFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService, ApplicationContext applicationContext) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.applicationContext = applicationContext;
    }

    private static final Logger log = LoggerFactory.getLogger(MatchSquadService.class);

    // Pomocnicza metoda do pobrania metody kontrolera
    private HandlerMethod getHandlerMethod(HttpServletRequest request) {
        try {
            RequestMappingHandlerMapping mapping = applicationContext.getBean(RequestMappingHandlerMapping.class);
            HandlerExecutionChain handler = mapping.getHandler(request);
            if (handler != null && handler.getHandler() instanceof HandlerMethod) {
                return (HandlerMethod) handler.getHandler();
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String requestPath = request.getRequestURI();
        System.out.println("Request URI: " + requestPath);

//        if (requestPath.endsWith("/api/leagues") || requestPath.endsWith("/api/matches") || requestPath.endsWith("/api/teams") ) {
//            chain.doFilter(request, response);
//            return;
//        }

        HandlerMethod handlerMethod = getHandlerMethod(request);


        // Jeśli metoda ma adnotację @PermitAll, przepuść żądanie bez weryfikacji JWT
        if (handlerMethod != null && handlerMethod.getMethodAnnotation(PermitAll.class) != null) {
            chain.doFilter(request, response);
            return;
        }

        String username = null;
        String jwt = null;
        Claims claims = null; // Declare `claims` here so it can be accessed in the entire method.
        logger.debug("Authorization header: " + authorizationHeader);

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            logger.debug("Extracted JWT: " + jwt);

            jwt = authorizationHeader.substring("Bearer ".length());
            claims = jwtUtil.extractAllClaims(jwt); // Extract claims here
            username = claims.getSubject(); // Assuming "sub" contains the email
            logger.debug("Extracted username: " + username);

        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt, userDetails)) {
                // Now you can use `claims` to get the roles
                List<GrantedAuthority> authorities = ((List<?>) claims.get("roles")).stream()
                        .map(role -> new SimpleGrantedAuthority((String) role))
                        .collect(Collectors.toList());

                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        chain.doFilter(request, response);
    }

}
