package com.caido.iqtest.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.sun.istack.NotNull;
import java.io.Serializable;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="questions")
public class Questions implements Serializable {

    public Questions() {
    }

    public Questions(Long id, String description, QuestionsOptions idQuestionsOptionsCorrect, String image, Tests idTests, Integer orderq, Integer points, String explication, Integer fontSize, Integer maxTime) {
        this.id = id;
        this.description = description;
        this.idQuestionsOptionsCorrect = idQuestionsOptionsCorrect;
        this.image = image;
        this.idTests = idTests;
        this.points = points;
        this.explication = explication;
        this.fontSize = fontSize;
        this.maxTime = maxTime;
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
        
    @Column(name="description")
    @NotNull
    private String description;
    public String getDescription() {
            return description;
    }
    public void setDescription(String description) {
            this.description = description;
    }

    @JsonIgnoreProperties("idQuestions")
    @ManyToOne(cascade = {CascadeType.DETACH})
    @JoinColumn(name="id_questions_options_correct")
    @NotNull
    private QuestionsOptions idQuestionsOptionsCorrect;
    public QuestionsOptions getIdQuestionsOptionsCorrect() {
        return idQuestionsOptionsCorrect;
    }
    public void setIdQuestionsOptionsCorrect(QuestionsOptions idQuestionsOptionsCorrect) {
        this.idQuestionsOptionsCorrect = idQuestionsOptionsCorrect;
    }

    @ManyToOne(cascade = {CascadeType.DETACH})
    @JoinColumn(name="id_tests")
    @NotNull
    private Tests idTests;
    public Tests getIdTests() {
        return idTests;
    }
    public void setIdTests(Tests idTests) {
        this.idTests = idTests;
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
    
    @Column(name="orderq")
    private Integer orderq;
    public Integer getOrderq() {
            return orderq;
    }
    public void setOrderq(Integer orderq) {
            this.orderq = orderq;
    }
    
    @Column(name="points")
    private Integer points;
    public Integer getPoints() {
            return points;
    }
    public void setPoints(Integer points) {
            this.points = points;
    }
    
    @Column(name="explication")
    private String explication;
    public String getExplication() {
            return explication;
    }
    public void setExplication(String explication) {
            this.explication = explication;
    }     

    @Column(name="font_size")
    private Integer fontSize;
    public Integer getFontSize() {
        return fontSize;
    }
    public void setFontSize(Integer fontSize) {
        this.fontSize = fontSize;
    }     

    @Column(name="max_time")
    private Integer maxTime;
    public Integer getMaxTime() {
        return maxTime;
    }
    public void setMaxTime(Integer maxTime) {
        this.maxTime = maxTime;
    }     

    @Column(name="image_width")
    private Integer imageWidth;
    public Integer getImageWidth() {
        return imageWidth;
    }
    public void setImageWidth(Integer imageWidth) {
        this.imageWidth = imageWidth;
    }
}
