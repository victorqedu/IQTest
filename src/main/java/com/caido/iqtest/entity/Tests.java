
package com.caido.iqtest.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name="tests")
public class Tests implements Serializable {
    public Tests() {
    }

    public Tests(Long id, String description) {
        this.id = id;
        this.description = description;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", nullable = false)
    private Long id;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    
    @Column(name="detailed_results")
    private Integer detailedResults;
    public Integer getDetailedResults() {
        return detailedResults;
    }
    public void setDetailedResults(Integer detailedResults) {
        this.detailedResults = detailedResults;
    }
    
    @Column(name="results_text")
    private String resultsText;
    public String getResultsText() {
        return resultsText;
    }
    public void setResultsText(String resultsText) {
        this.resultsText = resultsText;
    }
        
    @Column(name="description", nullable=false)
    private String description;
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    @Column(name="options")
    private Integer options;
    public Integer getOptions() {
        return options;
    }
    public void setOptions(Integer options) {
        this.options = options;
    }
    
    @Column(name="disabled")
    private Integer disabled;
    public Integer getDisabled() {
        return disabled;
    }
    public void setDisabled(Integer disabled) {
        this.disabled = disabled;
    }
    
    @Column(name="random_images")
    private Integer randomImages;
    public Integer getRandomImages() {
        return randomImages;
    }
    public void setRandomImages(Integer randomImages) {
        this.randomImages = randomImages;
    }
    
    @ManyToOne(cascade = {CascadeType.DETACH})
    @JoinColumn(name="id_subjects", nullable=false)
    private Subjects idSubjects;
    public Subjects getIdSubjects() {
        return idSubjects;
    }
    public void setIdSubjects(Subjects idSubjects) {
        this.idSubjects = idSubjects;
    }
    
    @ManyToOne(cascade = {CascadeType.DETACH})
    @JoinColumn(name="id_groups", nullable=false)
    private Groups idGroups;
    public Groups getIdGroups() {
        return idGroups;
    }
    public void setIdGroups(Groups idGroups) {
        this.idGroups = idGroups;
    }

    @Column(name="max_time")
    private Integer maxTime;
    public Integer getMaxTime() {
        return maxTime;
    }
    public void setMaxTime(Integer maxTime) {
        this.maxTime = maxTime;
    }     

    @Column(name="details_per_question")
    private Integer detailsPerQuestion;
    public Integer getDetailsPerQuestion() {
        return detailsPerQuestion;
    }
    public void setDetailsPerQuestion(Integer detailsPerQuestion) {
        this.detailsPerQuestion = detailsPerQuestion;
    }     

    @Column(name="text")
    private String text;
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    
}
