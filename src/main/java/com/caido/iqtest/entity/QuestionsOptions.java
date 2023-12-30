package com.caido.iqtest.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name="questions_options")
public class QuestionsOptions implements Serializable {

    public QuestionsOptions() {
    }

    public QuestionsOptions(Long id, Questions idQuestions, String image, Integer fontSize, String description) {
        this.id = id;
        this.idQuestions = idQuestions;
        this.image = image;
        this.fontSize = fontSize;
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
    
    @ManyToOne
    @JoinColumn(name="id_questions", nullable=false)
    private Questions idQuestions;
    public Questions getIdQuestions() {
        return idQuestions;
    }
    public void setIdQuestions(Questions idQuestions) {
        this.idQuestions = idQuestions;
    }
    
    @Lob
    @Column(name = "image")
    private String image;
    public String getImage() {
            return image;
    }
    public void setImage(String image) {
            this.image = image;
    }
    @Column(name="font_size")
    private Integer fontSize;
    public Integer getFontSize() {
        return fontSize;
    }
    public void setFontSize(Integer fontSize) {
        this.fontSize = fontSize;
    }     


    @Column(name="description", nullable=false)
    private String description;
    public String getDescription() {
            return description;
    }
    public void setDescription(String description) {
            this.description = description;
    }

}
