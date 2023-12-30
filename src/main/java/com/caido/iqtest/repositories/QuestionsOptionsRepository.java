package com.caido.iqtest.repositories;

import com.caido.iqtest.entity.Questions;
import com.caido.iqtest.entity.QuestionsOptions;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface QuestionsOptionsRepository extends JpaRepository<QuestionsOptions, Long> {
    @Query("SELECT c FROM QuestionsOptions c ORDER BY c.id DESC")
    @Override
    List<QuestionsOptions> findAll();

    /**
     * I have no idea why this @Transactional is necessary but if I don't have it I will receive the error "Unable to access lob stream", 
     * this solutions is from here: https://stackoverflow.com/questions/9023819/org-hibernate-hibernateexception-unable-to-access-lob-stream
     * This is weird because in the Question section I have another identical field that I can retrieve it without @Transactional
     * @param idQuestions
     * @return 
     */
    @Transactional 
    @Query("SELECT c FROM QuestionsOptions c WHERE c.idQuestions = ?1 ORDER BY c.id DESC")
    List<QuestionsOptions> findByQuestionId(Questions idQuestions);
}
