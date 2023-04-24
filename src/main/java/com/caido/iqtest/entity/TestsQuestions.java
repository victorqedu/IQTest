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
@Table(name="tests_questions")
public class TestsQuestions implements Serializable {

    public TestsQuestions() {
    }

    public TestsQuestions(Long id, Tests idTests, Questions idQuestions, Long toLeft, Long toRight) {
        this.id = id;
        this.idTests = idTests;
        this.idQuestions = idQuestions;
        this.toLeft = toLeft;
        this.toRight = toRight;
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
    @JoinColumn(name="id_tests")
    @NotNull
    private Tests idTests;
    public Tests getTests() {
        return idTests;
    }
    public void setTests(Tests idTests) {
        this.idTests = idTests;
    }
    
    @ManyToOne
    @JoinColumn(name="id_questions")
    @NotNull
    private Questions idQuestions;
    public Questions getIdQuestions() {
        return idQuestions;
    }
    public void setIdQuestions(Questions Questions) {
        this.idQuestions = Questions;
    }
    
    @Column(name="to_left")
    @NotNull
    private Long toLeft;
    public Long getToLeft() {
        return toLeft;
    }
    public void setToLeft(Long toLeft) {
        this.toLeft = toLeft;
    }
    
    @Column(name="to_right")
    @NotNull
    private Long toRight;
    public Long getToRight() {
        return toRight;
    }
    public void setToRight(Long toRight) {
        this.toRight = toRight;
    }
}
