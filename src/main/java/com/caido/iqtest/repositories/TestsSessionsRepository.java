package com.caido.iqtest.repositories;

import com.caido.iqtest.entity.TestsSessions;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestsSessionsRepository extends JpaRepository<TestsSessions, Long> {
    @Query("SELECT c FROM TestsSessions c ORDER BY c.id DESC")
    @Override
    List<TestsSessions> findAll();

    @Query("select sum(q.points)\n" +
        "from TestsSessionsAnswers tsa \n" +
        "join Questions q on (q.id = tsa.idQuestions and q.idQuestionsOptionsCorrect = tsa.idQuestionsOptions)\n" +
        "where tsa.idTestsSessions.id = :id")
    Integer getPoints(@Param("id") Long id);

}
