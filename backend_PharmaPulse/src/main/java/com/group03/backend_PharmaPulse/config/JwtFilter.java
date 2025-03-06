package com.group03.backend_PharmaPulse.config;

import com.group03.backend_PharmaPulse.user.internal.serviceImpl.AppUserDetailsService;
import com.group03.backend_PharmaPulse.user.internal.serviceImpl.JWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final HandlerExceptionResolver exceptionResolver;
    ApplicationContext context;

    public JwtFilter(JWTService jwtService, @Qualifier("handlerExceptionResolver")
                     HandlerExceptionResolver exceptionResolver,
                     ApplicationContext context) {
        this.jwtService = jwtService;
        this.exceptionResolver = exceptionResolver;
        this.context = context;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;
        try{
            if(authHeader != null && authHeader.startsWith("Bearer ")){
                token = authHeader.substring(7);
                username = jwtService.extractUserName(token);
            }
            if (username!=null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails=context.getBean(AppUserDetailsService.class).loadUserByUsername(username);
                if(jwtService.validateToken(token, userDetails)){
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails,null,
                                    userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
            filterChain.doFilter(request,response);
        }catch(Exception ex){
            exceptionResolver.resolveException(request,response,null,ex);
        }
    }
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getServletPath().startsWith("api/users/login");
    }
}
