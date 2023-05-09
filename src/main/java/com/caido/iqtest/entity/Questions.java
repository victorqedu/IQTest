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
@Table(name="questions")
public class Questions implements Serializable {

    public Questions() {
    }

    public Questions(Long id, String description, QuestionsOptions idQuestionsOptionsCorrect, String image) {
        this.id = id;
        this.description = description;
        this.idQuestionsOptionsCorrect = idQuestionsOptionsCorrect;
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
        
    @Column(name="description")
    @NotNull
    private String description;
    public String getDescription() {
            return description;
    }
    public void setDescription(String description) {
            this.description = description;
    }

    @ManyToOne
    @JoinColumn(name="id_questions_options_correct")
    @NotNull
    private QuestionsOptions idQuestionsOptionsCorrect;
    public QuestionsOptions getIdQuestionsOptionsCorrect() {
        return idQuestionsOptionsCorrect;
    }
    public void setIdQuestionsOptionsCorrect(QuestionsOptions idQuestionsOptionsCorrect) {
        this.idQuestionsOptionsCorrect = idQuestionsOptionsCorrect;
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
