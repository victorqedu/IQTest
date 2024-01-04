package com.caido.iqtest.repositories;

import com.caido.iqtest.entity.TestsSessions;
import com.caido.iqtest.entity.DTOs.TestsSessionsDTO;
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

    @Query("SELECT coalesce(sum(q.points), 0) \n" +
        "from TestsSessionsAnswers tsa \n" +
        "join Questions q on (q.id = tsa.idQuestions.id and q.idQuestionsOptionsCorrect = tsa.idQuestionsOptions)\n" +
        "where tsa.idTestsSessions.id = :id")
    Integer getPointsOptions(@Param("id") Long id);

    @Query("SELECT coalesce(sum(q.points) ,0)\n" +
        "from TestsSessionsAnswers tsa  \n" +
        "join QuestionsOptions qo on (qo.idQuestions = tsa.idQuestions and lower(qo.description) = lower(tsa.textResponse))\n" +
        "join Questions q on (q.id = qo.idQuestions.id)\n" +
        "where tsa.idTestsSessions.id = :id")
    Integer getPointsText(@Param("id") Long id);

    @Query("SELECT NEW com.caido.iqtest.entity.DTOs.TestsSessionsDTO(ts.id, ts.ipAddress, ts.testDate, t.description, "
            + "CONCAT(test_session_points(ts.id), '/', (SELECT sum(q.points) FROM Questions q WHERE q.idTests = ts.idTests)),"
            + "s.name"
            + ") \n" +
        "from TestsSessions ts \n" +
        "join Tests t ON (t.id = ts.idTests.id) \n" +
        "join Subjects s ON (s.id = t.idSubjects.id) \n" +
        "where ts.idUsers.id = :userId \n" +
        "ORDER BY ts.testDate DESC")
    List<TestsSessionsDTO> getUserTestsSessions(@Param("userId") Long userId);

}
