package com.caido.iqtest.filters;

import com.caido.iqtest.config.RestMessage;
import com.caido.iqtest.config.SecurityConstants;
import com.caido.iqtest.entity.Users;
import com.caido.iqtest.repositories.UsersRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

public class CustomAccountChecksFilter extends OncePerRequestFilter {

    @Autowired
    private final UsersRepository usersRepository;

    public CustomAccountChecksFilter(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authRawData = request.getHeader(SecurityConstants.JWT_HEADER);
        System.out.println("CustomAccountChecks is "+authRawData);
        if (authRawData!=null && authRawData.startsWith("Basic")) {
            String base64Credentials = authRawData.substring("Basic".length()).trim();
            byte[] credDecoded = Base64.getDecoder().decode(base64Credentials);
            String credentials = new String(credDecoded, StandardCharsets.UTF_8);
            final String[] values = credentials.split(":", 2);
            String username = values[0];
            System.out.println("CustomAccountChecks account is "+username);
            Users user = usersRepository.findByEmail(username);
            if (user==null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                System.out.println("CustomAccountChecks:  "+"Contul "+username+" nu exista in baza de date");
                RestMessage re = new RestMessage(HttpStatus.UNAUTHORIZED.toString(), "Contul "+username+" nu exista in baza de date");
                //response.getWriter().write("{\"error\": \"Contul %username nu exista in baza de date\"}");
                OutputStream responseStream = response.getOutputStream();
                ObjectMapper mapper = new ObjectMapper();
                mapper.writeValue(responseStream, re);
                responseStream.flush();
                return;
            }
        }
        System.out.println("CustomAccountChecks passed succesfully ");
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return false;
    }
    
}
