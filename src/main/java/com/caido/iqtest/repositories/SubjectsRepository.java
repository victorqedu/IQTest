package com.caido.iqtest.repositories;

import com.caido.iqtest.entity.Subjects;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface SubjectsRepository extends JpaRepository<Subjects, Long> {
    @Query("SELECT c FROM Subjects c ORDER BY c.id DESC")
    @Override
    List<Subjects> findAll();
}
