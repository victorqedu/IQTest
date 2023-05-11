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

    public Questions(Long id, String description, QuestionsOptions idQuestionsOptionsCorrect, String image, Tests idTests, Integer orderq) {
        this.id = id;
        this.description = description;
        this.idQuestionsOptionsCorrect = idQuestionsOptionsCorrect;
        this.image = image;
        this.idTests = idTests;
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
}
