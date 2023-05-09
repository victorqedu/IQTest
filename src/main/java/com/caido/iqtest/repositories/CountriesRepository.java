package com.caido.iqtest.repositories;

import com.caido.iqtest.entity.Countries;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CountriesRepository extends JpaRepository<Countries, Long> {
    @Query("SELECT c FROM Countries c ORDER BY c.id DESC")
    @Override
    List<Countries> findAll();
}
