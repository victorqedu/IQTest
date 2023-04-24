package com.caido.iqtest.repositories;

import com.caido.iqtest.entity.Countries;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CountriesRepository extends JpaRepository<Countries, Long> {
    
}
