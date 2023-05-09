package com.caido.iqtest.entity;

import com.sun.istack.NotNull;
import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import org.hibernate.annotations.Type;

@Entity
@Table(name="questions_options")
public class QuestionsOptions implements Serializable {

    public QuestionsOptions() {
    }

    public QuestionsOptions(Long id, Questions idQuestions, String image) {
        this.id = id;
        this.idQuestions = idQuestions;
        this.image = image;
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
    @JoinColumn(name="id_questions")
    @NotNull
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
}
