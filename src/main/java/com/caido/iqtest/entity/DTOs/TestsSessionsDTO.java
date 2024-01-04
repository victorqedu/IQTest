package com.caido.iqtest.entity.DTOs;

import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.io.Serializable;
import java.time.LocalDateTime;

public class TestsSessionsDTO implements Serializable {
    public TestsSessionsDTO() {
    }
    
    private Long id;
    public Long getId() {
            return id;
    }
    public void setId(Long id) {
            this.id = id;
    }
    
    private String ipAddress;
    public String getIpAddress() {
            return ipAddress;
    }
    public void setIpAddress(String ipAddress) {
            this.ipAddress = ipAddress;
    }


    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime testDate;
    public LocalDateTime getTestDate() {
        return testDate;
    }
    public void setTestDate(LocalDateTime testDate) {
        this.testDate = testDate;
    }

    private String idTests;
    public String getIdTests() {
        return idTests;
    }
    public void setIdTests(String idTests) {
        this.idTests = idTests;
    }

    private String points;
    public String getPoints() {
        return points;
    }
    public void setPoints(String points) {
        this.points = points;
    }
    private String subject;
    public String getSubject() {
        return subject;
    }
    public void setSubject(String subject) {
        this.subject = subject;
    }

    public TestsSessionsDTO(Long id, String ipAddress, LocalDateTime testDate, String idTests, String points, String subject) {
        this.id = id;
        this.ipAddress = ipAddress;
        this.testDate = testDate;
        this.idTests = idTests;
        this.points = points;
        this.subject = subject;
    }
 

}


