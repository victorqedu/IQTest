package com.caido.iqtest.repositories;

import com.caido.iqtest.entity.Sex;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SexRepository extends JpaRepository<Sex, Long> {
    @Query("SELECT c FROM Sex c ORDER BY c.id DESC")
    @Override
    List<Sex> findAll();
}
