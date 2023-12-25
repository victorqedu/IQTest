package com.caido.iqtest.entity;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.Id;

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
