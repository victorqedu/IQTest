package com.caido.iqtest.repositories;

import com.caido.iqtest.entity.Questions;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface QuestionsRepository extends JpaRepository<Questions, Long> {
    @Query("SELECT c FROM Questions c ORDER BY c.id DESC")
    @Override
    List<Questions> findAll();
}
