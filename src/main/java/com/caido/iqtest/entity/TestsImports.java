package com.caido.iqtest.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.io.Serializable;

@Entity
public class TestsImports implements Serializable {
    public TestsImports() {}

    @Id
    private Long id;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    
    private String testData;
    public String getTestData() {
        return testData;
    }
    public void setTestData(String testData) {
        this.testData = testData;
    }

    private String resultsData;
    public String getResultsData() {
        return resultsData;
    }
    public void setResultsData(String resultsData) {
        this.resultsData = resultsData;
    }

}
