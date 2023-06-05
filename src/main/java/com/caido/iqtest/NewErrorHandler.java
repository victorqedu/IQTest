package com.caido.iqtest;

import java.io.PrintWriter;
import java.io.StringWriter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
public class NewErrorHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handle(Exception ex, HttpServletRequest request, HttpServletResponse response) {
        System.out.println("Some error "+ex);
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        ex.printStackTrace(pw);
        System.out.println("Some error "+sw.toString());
//        if (ex instanceof NullPointerException) {
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ex.getMessage());
        //return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}