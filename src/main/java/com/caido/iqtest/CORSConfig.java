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
//        registry.addMapping("/**").allowedMethods("*");
        registry.addMapping("/**")
            .allowedOrigins("http://caido.ro:3000")
            .allowedMethods("*")
            .allowedHeaders("Content-Type", "Authorization")
            .allowCredentials(true)
            .maxAge(32400);  // 9 hours max age
    }
}