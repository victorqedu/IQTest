package com.caido.iqtest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class IqtestApplication {
    public static void main(String[] args) {
//        String classpath = System.getProperty("java.class.path");
//        System.out.println("classpath "+classpath);
        SpringApplication.run(IqtestApplication.class, args);
    }
}

