package com.caido.iqtest.entity;

import com.sun.istack.NotNull;
import java.io.Serializable;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

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
        
    @Column(name="description")
    @NotNull
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
    
    @ManyToOne(cascade = {CascadeType.DETACH})
    @JoinColumn(name="id_subjects")
    @NotNull
    private Subjects idSubjects;
    public Subjects getIdSubjects() {
        return idSubjects;
    }
    public void setIdSubjects(Subjects idSubjects) {
        this.idSubjects = idSubjects;
    }

    
    
}
