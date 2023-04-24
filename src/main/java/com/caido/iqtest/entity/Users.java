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
@Table(name="users")
public class Users implements Serializable  {

    public Users() {
    }

    public Users(Integer id, String name, String username, String password, Languages idLanguages, Countries idCountries) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.password = password;
        this.idLanguages = idLanguages;
        this.idCountries = idCountries;
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", nullable = false)
    private Integer id;
    public Integer getId() {
            return id;
    }
    public void setId(Integer id) {
            this.id = id;
    }

    
    @Column(name="name")
    @NotNull
    private String name;
    public String getName() {
            return name;
    }
    public void setName(String name) {
            this.name = name;
    }

    @Column(name="username")
    @NotNull
    private String username;
    public String getUsername() {
            return username;
    }
    public void setUsername(String username) {
            this.username = username;
    }

    @Column(name="password")
    @NotNull
    private String password;
    public String getPassword() {
            return password;
    }
    public void setPassword(String password) {
            this.password = password;
    }

    @Column(name="suspended")
    @NotNull
    private int suspended = 0;
    public int getSuspended() {
        return suspended;
    }
    public void setSuspended(int suspended) {
        this.suspended = suspended;
    }

    @Column(name="deactivated")
    @NotNull
    private int deactivated = 0;
    public int getDeactivated() {
        return deactivated;
    }
    public void setDeactivated(int deactivated) {
        this.deactivated = deactivated;
    }

    @Column(name="missed_password_counter")
    @NotNull
    private int missedPasswordCounter = 0;
    public int getMissedPasswordCounter() {
        return missedPasswordCounter;
    }
    public void setMissedPasswordCounter(int missedPasswordCounter) {
        this.missedPasswordCounter = missedPasswordCounter;
    }

    @ManyToOne
    @JoinColumn(name="id_languages")
    @NotNull
    private Languages idLanguages;
    public Languages getIdLanguages() {
        return idLanguages;
    }
    public void setIdLanguages(Languages idLanguages) {
        this.idLanguages = idLanguages;
    }

    @ManyToOne
    @JoinColumn(name="id_countries")
    @NotNull
    private Countries idCountries;
    public Countries getIdCountries() {
        return idCountries;
    }
    public void setIdCountries(Countries idCountries) {
        this.idCountries = idCountries;
    }
}

