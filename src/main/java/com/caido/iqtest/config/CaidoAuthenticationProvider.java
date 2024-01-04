package com.caido.iqtest.config;


import com.caido.iqtest.Services.UsersService;
import com.caido.iqtest.entity.Users;
import com.caido.iqtest.exceptions.InvalidCredentialsException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class CaidoAuthenticationProvider implements AuthenticationProvider  {
    private final UsersService usersService;
    private final PasswordEncoder passwordEncoder;
    
    public CaidoAuthenticationProvider(UsersService usersService, PasswordEncoder passwordEncoder) {
        this.usersService = usersService;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        System.out.println("Start authenticate");
        String username = authentication.getName();
        String pwd = authentication.getCredentials().toString();
        System.out.println("Start authenticate username = "+username+" pwd "+pwd);
        Users user = usersService.findByEmail(username);
        if (passwordEncoder.matches(pwd, user.getPasswordReal())) {
            System.out.println("Authenticated successfully");
            return new UsernamePasswordAuthenticationToken(username, pwd, getGrantedAuthorities(user.getRole()));
        } else {
            System.out.println("Invalid password");
            throw new InvalidCredentialsException("Parola invalida!");
        }
    }
    
    private List<GrantedAuthority> getGrantedAuthorities(String role) {
        List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
        grantedAuthorities.add(new SimpleGrantedAuthority(role));
        return grantedAuthorities;
    }
    @Override
    public boolean supports(Class<?> authentication) {
        return (UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication));
    }

}
