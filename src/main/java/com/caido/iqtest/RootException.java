package com.caido.iqtest;

import java.time.ZonedDateTime;
import org.springframework.http.HttpStatus;

public class RootException {
    private final String message;
    private final Throwable throwable;
    private final HttpStatus httpStatus;
    private final ZonedDateTime timestamp;

    public RootException(String message, Throwable throwable, HttpStatus httpStatus, ZonedDateTime timestamp) {
        this.timestamp = timestamp;
        this.message = message;
        this.throwable = throwable;
        this.httpStatus = httpStatus;
    }

    public String getMessage() {
        return message;
    }

    public Throwable getThrowable() {
        return throwable;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public ZonedDateTime getTimestamp() {
        return timestamp;
    }

    
}
