package com.caido.iqtest.repositories;

import com.caido.iqtest.entity.Tests;
import com.caido.iqtest.entity.TestsQuestions;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TestsQuestionsRepository extends JpaRepository<TestsQuestions, Long> {
    @Query("SELECT c FROM TestsQuestions c ORDER BY c.id DESC")
    @Override
    List<TestsQuestions> findAll();
    
    @Query("SELECT c FROM TestsQuestions c WHERE c.idTests = ?1 ORDER BY c.toLeft DESC")
    List<TestsQuestions> findByTestId(Tests idTests);

}
