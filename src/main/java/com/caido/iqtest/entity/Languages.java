package com.caido.iqtest.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name="languages")
public class Languages implements Serializable {

    public Languages() {
    }

    public Languages(Integer id, String name, String code) {
        this.id = id;
        this.name = name;
        this.code = code;
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
    
    @Column(name="name", nullable=false)
    private String name;
    public String getName() {
            return name;
    }
    public void setName(String name) {
            this.name = name;
    }

    @Column(name="code", nullable=false)
    private String code;
    public String getCode() {
            return code;
    }
    public void setCode(String code) {
            this.code = code;
    }


}
