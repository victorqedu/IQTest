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
    
    @Column(name="name")
    @NotNull
    private String name;
    public String getName() {
            return name;
    }
    public void setName(String name) {
            this.name = name;
    }

    @Column(name="code")
    @NotNull
    private String code;
    public String getCode() {
            return code;
    }
    public void setCode(String code) {
            this.code = code;
    }


}
