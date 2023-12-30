package com.caido.iqtest.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

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
    
    @Column(name="ip_address", nullable=false)
    private String ipAddress;
    public String getIpAddress() {
            return ipAddress;
    }
    public void setIpAddress(String ipAddress) {
            this.ipAddress = ipAddress;
    }

    @Column(name="age", nullable=false)
    private Integer age;
    public Integer getAge() {
        return age;
    }
    public void setAge(Integer age) {
        this.age = age;
    }
    
    @Column(name="test_date", nullable=false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date testDate;
    public Date getDate() {
        return testDate;
    }
    public void setDate(Date testDate) {
        this.testDate = testDate;
    }

    @ManyToOne
    @JoinColumn(name="id_sex", nullable=false)
    private Sex idSex;
    public Sex getIdSex() {
        return idSex;
    }
    public void setIdSex(Sex idSex) {
        this.idSex = idSex;
    }
    
    @ManyToOne
    @JoinColumn(name="id_users")
    private Users idUsers;
    public Users getIdUsers() {
        return idUsers;
    }
    public void setIdUsers(Users idUsers) {
        this.idUsers = idUsers;
    }
    
    @ManyToOne
    @JoinColumn(name="id_tests", nullable=false)
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
    public void setTestsSessionsAnswers(List<TestsSessionsAnswers> testsSessionsAnswers) {
        this.testsSessionsAnswers = testsSessionsAnswers;
    }

    
}
