
package com.caido.iqtest.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="groups")
public class Groups {
    public Groups() {};

    public Groups(Long id, String name) {
        this.id = id;
        this.name = name;
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
}
