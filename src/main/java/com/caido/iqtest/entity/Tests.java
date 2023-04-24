package com.caido.iqtest.entity;

import com.sun.istack.NotNull;
import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="tests")
public class Tests implements Serializable {

    public Tests() {
    }

    public Tests(Long id, String description) {
        this.id = id;
        this.description = description;
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

}
