package com.caido.iqtest.entity;

import com.sun.istack.NotNull;
import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

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

    @ManyToOne
    @JoinColumn(name="id_tests_sessions")
    @NotNull
    private TestsSessions idTestsSessions;
    public TestsSessions getIdTestsSessions() {
        return idTestsSessions;
    }
    public void setIdTestsSessions(TestsSessions idTestsSessions) {
        this.idTestsSessions = idTestsSessions;
    }

    @ManyToOne
    @JoinColumn(name="id_tests_questions")
    @NotNull
    private Questions idQuestions;
    public Questions getIdTestsQuestions() {
        return idQuestions;
    }
    public void setQuestions(Questions idQuestions) {
        this.idQuestions = idQuestions;
    }
    
    @ManyToOne
    @JoinColumn(name="id_questions_options")
    @NotNull
    private QuestionsOptions idQuestionsOptions;
    public QuestionsOptions getIdQuestionsOptions() {
        return idQuestionsOptions;
    }
    public void setIdQuestionsOptions(QuestionsOptions idQuestionsOptions) {
        this.idQuestionsOptions = idQuestionsOptions;
    }

}
