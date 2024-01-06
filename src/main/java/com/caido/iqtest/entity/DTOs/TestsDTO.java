package com.caido.iqtest.entity.DTOs;

import com.caido.iqtest.entity.Groups;
import com.caido.iqtest.entity.Subjects;
import java.io.Serializable;

public class TestsDTO implements Serializable {
    public TestsDTO() {
    }

    public TestsDTO(Long id, Integer detailedResults, String resultsText, String description, Integer options, Integer disabled, Integer randomImages, Subjects idSubjects, Groups idGroups, Integer maxTime, 
            Integer detailsPerQuestion, String text, Integer finalizedPercent) {
        this.id = id;
        this.detailedResults = detailedResults;
        this.resultsText = resultsText;
        this.description = description;
        this.options = options;
        this.disabled = disabled;
        this.randomImages = randomImages;
        this.idSubjects = idSubjects;
        this.idGroups = idGroups;
        this.maxTime = maxTime;
        this.detailsPerQuestion = detailsPerQuestion;
        this.text = text;
        this.finalizedPercent = finalizedPercent;
    }

    private Long id;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    
    private Integer detailedResults;
    public Integer getDetailedResults() {
        return detailedResults;
    }
    public void setDetailedResults(Integer detailedResults) {
        this.detailedResults = detailedResults;
    }
    
    private String resultsText;
    public String getResultsText() {
        return resultsText;
    }
    public void setResultsText(String resultsText) {
        this.resultsText = resultsText;
    }
        
    private String description;
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    private Integer options;
    public Integer getOptions() {
        return options;
    }
    public void setOptions(Integer options) {
        this.options = options;
    }
    
    private Integer disabled;
    public Integer getDisabled() {
        return disabled;
    }
    public void setDisabled(Integer disabled) {
        this.disabled = disabled;
    }
    
    private Integer randomImages;
    public Integer getRandomImages() {
        return randomImages;
    }
    public void setRandomImages(Integer randomImages) {
        this.randomImages = randomImages;
    }
    
    private Subjects idSubjects;
    public Subjects getIdSubjects() {
        return idSubjects;
    }
    public void setIdSubjects(Subjects idSubjects) {
        this.idSubjects = idSubjects;
    }
    
    private Groups idGroups;
    public Groups getIdGroups() {
        return idGroups;
    }
    public void setIdGroups(Groups idGroups) {
        this.idGroups = idGroups;
    }

    private Integer maxTime;
    public Integer getMaxTime() {
        return maxTime;
    }
    public void setMaxTime(Integer maxTime) {
        this.maxTime = maxTime;
    }     

    private Integer detailsPerQuestion;
    public Integer getDetailsPerQuestion() {
        return detailsPerQuestion;
    }
    public void setDetailsPerQuestion(Integer detailsPerQuestion) {
        this.detailsPerQuestion = detailsPerQuestion;
    }     

    private String text;
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    
    private Integer finalizedPercent;
    public Integer getFinalizedPercent() {
        return finalizedPercent;
    }
    public void setFinalizedPercent(Integer finalizedPercent) {
        this.finalizedPercent = finalizedPercent;
    }     
       
}