package com.caido.iqtest;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class CORSConfig implements WebMvcConfigurer  {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**");
        registry.addMapping("/**")
                .allowedOrigins("http://caido.ro:3000")
                .allowedMethods("HEAD", "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowCredentials(true)
                .allowedHeaders("Content-Type",
                        "Authorization", 
                        "Origin", 
                        "Accept", 
                        "Host", 
                        "Connection", 
                        "Access-Control-Request-Method", 
                        "Access-Control-Request-Headers", 
                        "User-Agent", 
                        "Sec-Fetch-Mode", 
                        "Referer",
                        "Accept", 
                        "Accept-Encoding", 
                        "Accept-Language")
                .maxAge(32400);
        ;
//        registry.addMapping("/**")
//            .allowedOrigins("http://caido.ro:3000")
//            .allowedMethods("*")
//            .allowedHeaders("Content-Type", "Authorization")
//            .maxAge(32400);  // 9 hours max age
    }
}