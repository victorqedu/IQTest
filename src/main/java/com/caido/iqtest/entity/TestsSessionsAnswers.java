package com.caido.iqtest.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name="tests_sessions_answers")
public class TestsSessionsAnswers implements Serializable {

    public TestsSessionsAnswers() {
    }

    public TestsSessionsAnswers(Long id, TestsSessions idTestsSessions, Questions idQuestions, QuestionsOptions idQuestionsOptions) {
        this.id = id;
        this.idTestsSessions = idTestsSessions;
        this.idQuestions = idQuestions;
        this.idQuestionsOptions = idQuestionsOptions;
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

    @JsonBackReference
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="id_tests_sessions", nullable=false)
    private TestsSessions idTestsSessions;
    public TestsSessions getIdTestsSessions() {
        return idTestsSessions;
    }
    public void setIdTestsSessions(TestsSessions idTestsSessions) {
        this.idTestsSessions = idTestsSessions;
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
    
    @ManyToOne
    @JoinColumn(name="id_questions_options", nullable=false)
    private QuestionsOptions idQuestionsOptions;
    public QuestionsOptions getIdQuestionsOptions() {
        return idQuestionsOptions;
    }
    public void setIdQuestionsOptions(QuestionsOptions idQuestionsOptions) {
        this.idQuestionsOptions = idQuestionsOptions;
    }

    @Column(name="text_response")
    private String textResponse;
    public String getTextResponse() {
        return textResponse;
    }
    public void setTextResponse(String textResponse) {
        this.textResponse = textResponse;
    }

}
