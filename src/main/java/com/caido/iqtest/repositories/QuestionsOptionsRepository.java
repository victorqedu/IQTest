package com.caido.iqtest.repositories;

import com.caido.iqtest.entity.Questions;
import com.caido.iqtest.entity.QuestionsOptions;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface QuestionsOptionsRepository extends JpaRepository<QuestionsOptions, Long> {
    @Query("SELECT c FROM QuestionsOptions c ORDER BY c.id DESC")
    @Override
    List<QuestionsOptions> findAll();

    @Query("SELECT c FROM QuestionsOptions c WHERE c.idQuestions = ?1 ORDER BY c.id DESC")
    List<QuestionsOptions> findByQuestionId(Questions idQuestions);
}
