package com.caido.iqtest;

import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
//@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public UserDetailsManager userDetailsManager(DataSource dataSource) {
        //default authentication requires tables/views users(username, password and enabled) and authorities(username and authority where
        //I will keept the role with ROLE_ in front) 
        return new JdbcUserDetailsManager(dataSource);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable().httpBasic().and()
                .authorizeRequests()
                .antMatchers(HttpMethod.POST, "/api/testssessions").permitAll()
                .antMatchers(HttpMethod.PUT, "/api/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.POST, "/api/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.GET, "/api/**").permitAll()
                .antMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()// allow OPTIONS for CORS preflight
                .anyRequest().denyAll()
                ;
//        http.csrf().disable()
//                .authorizeRequests()
//                .anyRequest().permitAll()
//                ;
        //http.httpBasic();
        
        return http.build();    
    }

//    @Bean 
//    public PasswordEncoder passwordEncoder() { 
//        return new BCryptPasswordEncoder(); 
//    }
//
//    @Bean
//    public InMemoryUserDetailsManager userDetailsService() {
//        UserDetails user1 = User.withUsername("user1")
//            .password(passwordEncoder().encode("user1"))
//            .roles("USER")
//            .build();
//        UserDetails user2 = User.withUsername("user2")
//            .password(passwordEncoder().encode("user2"))
//            .roles("USER", "ADMIN")
//            .build();
//        UserDetails admin = User.withUsername("admin")
//            .password(passwordEncoder().encode("admin"))
//            .roles("ADMIN")
//            .build();
//        return new InMemoryUserDetailsManager(user1, user2, admin);
//    }

//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        // http builder configurations for authorize requests and form login (see below)
//        http.csrf()
//            .disable()
//            .authorizeRequests()
//            .antMatchers("/admin/**")
//            .hasRole("ADMIN")
//            .antMatchers("/anonymous*")
//            .anonymous()
//            .antMatchers("/login*")
//            .permitAll()
//            .anyRequest()
//            .authenticated()
//            .and()
//            .formLogin()
//            .loginPage("/login.html")
//            .loginProcessingUrl("/perform_login")
//            .defaultSuccessUrl("/homepage.html", true)
//            .failureUrl("/login.html?error=true")
//            .failureHandler ((HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) -> {
//                System.out.println("Failure logging in");
//                response.sendRedirect(request.getContextPath());                
//            })
//            .and()
//            .logout()
//            .logoutUrl("/perform_logout")
//            .deleteCookies("JSESSIONID")
//            .logoutSuccessHandler((HttpServletRequest request, HttpServletResponse response, org.springframework.security.core.Authentication authentication) -> {
//                try {
//                    System.out.println("Logout succesffull.");
//                    response.sendRedirect(request.getContextPath());
//                } catch (IOException ex) {
//                    Logger.getLogger(SecSecurityConfig.class.getName()).log(Level.SEVERE, null, ex);
//                }
//        });
//        return http.build();    
//    }
}