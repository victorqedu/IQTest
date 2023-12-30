package com.caido.iqtest.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name="users")
public class Users implements Serializable  {

    public Users() {
    }

    public Users(Long id, String name, String username, String password, Languages idLanguages, Countries idCountries) {
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
    private Long id;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    
    @Column(name="name", nullable=false)
    private String name;
    public String getName() {
            return name;
    }
    public void setName(String name) {
            this.name = name;
    }

    @Column(name="username", nullable=false)
    private String username;
    public String getUsername() {
            return username;
    }
    public void setUsername(String username) {
            this.username = username;
    }

    @Column(name="password", nullable=false)
    private String password;
    public String getPassword() {
            return null;
    }
    @JsonIgnore
    public String getPasswordReal() {
        return this.password;
    }
    
    public void setPassword(String password) {
            this.password = password;
    }

    @Column(name="suspended", nullable=false)
    private int suspended = 0;
    public int getSuspended() {
        return suspended;
    }
    public void setSuspended(int suspended) {
        this.suspended = suspended;
    }
    
    @Column(name="auth_email_confirmed", nullable=false)
    private int authEmailConfirmed = 0;
    public int getAuthEmailConfirmed() {
        return authEmailConfirmed;
    }
    public void setAuthEmailConfirmed(int authEmailConfirmed) {
        this.authEmailConfirmed = authEmailConfirmed;
    }    

    @Column(name="missed_password_counter", nullable=false)
    private int missedPasswordCounter = 0;
    public int getMissedPasswordCounter() {
        return missedPasswordCounter;
    }
    public void setMissedPasswordCounter(int missedPasswordCounter) {
        this.missedPasswordCounter = missedPasswordCounter;
    }

    @ManyToOne
    @JoinColumn(name="id_languages", nullable=false)
    private Languages idLanguages;
    public Languages getIdLanguages() {
        return idLanguages;
    }
    public void setIdLanguages(Languages idLanguages) {
        this.idLanguages = idLanguages;
    }

    @ManyToOne
    @JoinColumn(name="id_countries", nullable=false)
    private Countries idCountries;
    public Countries getIdCountries() {
        return idCountries;
    }
    public void setIdCountries(Countries idCountries) {
        this.idCountries = idCountries;
    }

    @Column(name="auth_email_confirmed_link")
    private String authEmailConfirmedLink;
    public String getAuthEmailConfirmedLink() {
            return authEmailConfirmedLink;
    }
    public void setAuthEmailConfirmedLink(String authEmailConfirmedLink) {
            this.authEmailConfirmedLink = authEmailConfirmedLink;
    }
    
    @Column(name="auth_password_reset_link")
    private String authPasswordResetLink;
    public String getAuthPasswordResetLink() {
            return authPasswordResetLink;
    }
    public void setAuthPasswordResetLink(String authPasswordResetLink) {
            this.authPasswordResetLink = authPasswordResetLink;
    }
    
    @Column(name="phone")
    private String phone;
    public String getPhone() {
            return phone;
    }
    public void setPhone(String phone) {
            this.phone = phone;
    }

    @Override
    public String toString() {
        return "Users{" + "id=" + id + ", name=" + name + ", username=" + username + ", password=" + password + ", suspended=" + suspended + ", missedPasswordCounter=" + missedPasswordCounter + ", idLanguages=" + idLanguages + ", idCountries=" + idCountries + ", authEmailConfirmedLink=" + authEmailConfirmedLink + ", authPasswordResetLink=" + authPasswordResetLink + ", phone=" + phone + '}';
    }

    
}

