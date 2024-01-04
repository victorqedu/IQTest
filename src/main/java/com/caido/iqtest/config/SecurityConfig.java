package com.caido.iqtest.config;

import com.caido.iqtest.filters.CustomAccountChecksFilter;
import com.caido.iqtest.filters.JWTTokenGeneratorFilter;
import com.caido.iqtest.filters.JWTTokenValidatorFilter;
import com.caido.iqtest.repositories.UsersRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Collections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
public class SecurityConfig {
    @Autowired
    UsersRepository usersRepository;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(corsCustomizer -> corsCustomizer.configurationSource((HttpServletRequest request) -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(Arrays.asList("https://www.iqtest.caido.ro:443", "https://iqtest.caido.ro:443", "https://www.iqtest.caido.ro", "https://iqtest.caido.ro"));
                    config.setAllowedMethods(Collections.singletonList("*"));
                    config.setAllowCredentials(true);
                    config.setAllowedHeaders(Collections.singletonList("*"));
                    config.setExposedHeaders(Arrays.asList("Authorization"));
                    config.setMaxAge(3600L);
                    return config;
                    }))
                .authorizeHttpRequests((requests) -> {
                    requests
                            .requestMatchers(HttpMethod.GET, 
                                    "/api/login",
                                    "/api/getRandomImage", 
                                    "/api/images/*", 
                                    "/api/questions_findByTestId/*", 
                                    "/api/questionsoptions_findByQuestionId/*",
                                    "/api/sex",
                                    "/api/tests/*",
                                    "/api/subjects",
                                    "/api/testssessionpoints/*",
                                    "/api/testsMaxPoints/*",
                                    "/api/testsWithSubjectId/*").permitAll()
                            .requestMatchers(HttpMethod.POST, 
                                    "/api/testssessions",
                                    "/api/users").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/getUserTestsSessions").authenticated()
                            .anyRequest().hasAuthority("ADMIN")
                            ;
                })
                .addFilterBefore(new CustomAccountChecksFilter(usersRepository), BasicAuthenticationFilter.class)
                .addFilterBefore(new JWTTokenValidatorFilter(), BasicAuthenticationFilter.class)
                .addFilterAfter(new JWTTokenGeneratorFilter(usersRepository), BasicAuthenticationFilter.class)
                .httpBasic(Customizer.withDefaults())
                ;
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}


//                            .requestMatchers(HttpMethod.GET, "/api/images").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.GET, "/api/countries").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.GET, "/api/countries/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.GET, "/api/questions").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.GET, "/api/questions/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.GET, "/api/questionsoptions").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.GET, "/api/questionsoptions/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.GET, "/api/sex/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.GET, "/api/subjects/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.GET, "/api/tests").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.GET, "/api/testssessions").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.GET, "/api/testssessions/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.GET, "/api/users/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.POST, "/api/images").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.POST, "/api/countries").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.POST, "/api/questions").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.POST, "/api/questionsoptions").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.POST, "/api/sex").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.POST, "/api/subjects").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.POST, "/api/tests").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.POST, "/api/testssessions").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.POST, "/api/users").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.PUT, "/api/images/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.PUT, "/api/countries/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.PUT, "/api/questions/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.PUT, "/api/questionsoptions/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.PUT, "/api/sex/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.PUT, "/api/subjects/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.PUT, "/api/tests/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.PUT, "/api/testssessions/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.PUT, "/api/users/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.DELETE, "/api/images/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.DELETE, "/api/countries/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.DELETE, "/api/questions/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.DELETE, "/api/questionsoptions/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.DELETE, "/api/sex/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.DELETE, "/api/subjects/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.DELETE, "/api/tests/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.DELETE, "/api/testssessions/*").hasRole("ADMIN")
//                            .requestMatchers(HttpMethod.DELETE, "/api/users/*").hasRole("ADMIN")
//                            .anyRequest()
//                            .authenticated()