package com.caido.iqtest.repositories;

import com.caido.iqtest.entity.TestsSessions;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestsSessionsRepository extends JpaRepository<TestsSessions, Long> {
    @Query("SELECT c FROM TestsSessions c ORDER BY c.id DESC")
    @Override
    @Transactional
    List<TestsSessions> findAll();

    @Query("select coalesce(sum(q.points), 0) \n" +
        "from TestsSessionsAnswers tsa \n" +
        "join Questions q on (q.id = tsa.idQuestions.id and q.idQuestionsOptionsCorrect = tsa.idQuestionsOptions)\n" +
        "where tsa.idTestsSessions.id = :id")
    Integer getPointsOptions(@Param("id") Long id);

    @Query("select coalesce(sum(q.points) ,0)\n" +
        "from TestsSessionsAnswers tsa  \n" +
        "join QuestionsOptions qo on (qo.idQuestions = tsa.idQuestions and lower(qo.description) = lower(tsa.textResponse))\n" +
        "join Questions q on (q.id = qo.idQuestions.id)\n" +
        "where tsa.idTestsSessions.id = :id")
    Integer getPointsText(@Param("id") Long id);
}
