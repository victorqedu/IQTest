package com.caido.iqtest.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.sun.istack.NotNull;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name="tests_sessions")
public class TestsSessions implements Serializable {

    public TestsSessions() {
    }

    public TestsSessions(Long id, String name, String ipAddress, Integer age, Date testDate, Sex idSex, Tests idTests) {
        this.id = id;
        this.name = name;
        this.ipAddress = ipAddress;
        this.age = age;
        this.testDate = testDate;
        this.idSex = idSex;
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
    
    @Column(name="name")
    private String name;
    public String getName() {
            return name;
    }
    public void setName(String name) {
            this.name = name;
    }
    
    @Column(name="ip_address")
    @NotNull
    private String ipAddress;
    public String getIpAddress() {
            return ipAddress;
    }
    public void setIpAddress(String ipAddress) {
            this.ipAddress = ipAddress;
    }

    @Column(name="age")
    @NotNull
    private Integer age;
    public Integer getAge() {
        return age;
    }
    public void setAge(Integer age) {
        this.age = age;
    }
    
    @NotNull
    @Column(name="test_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date testDate;
    public Date getDate() {
        return testDate;
    }
    public void setDate(Date testDate) {
        this.testDate = testDate;
    }

    @ManyToOne
    @JoinColumn(name="id_sex")
    @NotNull
    private Sex idSex;
    public Sex getIdSex() {
        return idSex;
    }
    public void setIdSex(Sex idSex) {
        this.idSex = idSex;
    }
    
    @ManyToOne
    @JoinColumn(name="id_tests")
    @NotNull
    private Tests idTests;
    public Tests getIdTests() {
        return idTests;
    }
    public void setIdTests(Tests idTests) {
        this.idTests = idTests;
    }

    @JsonManagedReference
    @OneToMany(mappedBy="idTestsSessions", fetch=FetchType.LAZY, cascade = CascadeType.ALL)
    private List<TestsSessionsAnswers> testsSessionsAnswers;
    public List<TestsSessionsAnswers> getTestsSessionsAnswers() {
        return testsSessionsAnswers;
    }
    public void setPersonIdrh(List<TestsSessionsAnswers> testsSessionsAnswers) {
        this.testsSessionsAnswers = testsSessionsAnswers;
    }

    
}
