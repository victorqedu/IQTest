package com.caido.iqtest.repositories;

import com.caido.iqtest.entity.DTOs.TestsDTO;
import com.caido.iqtest.entity.Subjects;
import com.caido.iqtest.entity.Tests;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestsRepository extends JpaRepository<Tests, Long> {
    @Query("SELECT c FROM Tests c ORDER BY c.id DESC")
    @Override
    List<Tests> findAll();
    
    @Query("select sum(q.points) from Questions q where q.idTests = :id")
    Integer getMaxPoints(@Param("id") Tests test);

    @Query("SELECT c FROM Tests c WHERE c.idSubjects = :subject and c.disabled = 0 ORDER BY c.description ASC")
    List<Tests> testsWithSubjectId(@Param("subject") Subjects subject);

    @Query("SELECT c FROM Tests c WHERE c.idSubjects.id = :idSubject and c.idGroups IS NULL and c.disabled = 0 ORDER BY c.description ASC")
    List<Tests> testsWithSubjectIdWithoutGroup(@Param("idSubject") Long idSubject);

    @Query("SELECT c "
            + "FROM Tests c "
            + "WHERE c.idSubjects.id = :idSubject and c.idGroups.id = :idGroup and c.disabled = 0 "
            + "ORDER BY c.description ASC")
    List<Tests> testsWithSubjectIdAndGroupId(@Param("idSubject") Long idSubject, @Param("idGroup") Long idGroup);

    @Query("SELECT NEW com.caido.iqtest.entity.DTOs.TestsDTO(t.id, t.detailedResults, t.resultsText, t.description, t.options, t.disabled, t.randomImages, t.idSubjects, null, t.maxTime, t.detailsPerQuestion, t.text,"
            + "CAST (finalizedPercent(cast (:idUser AS integer), t.id) AS integer)"
            + ") "
            + "FROM Tests t "
            + "WHERE t.idSubjects.id = :idSubject and t.idGroups IS NULL and t.disabled = 0 "
            + "ORDER BY t.description ASC")
    List<TestsDTO> testsDTOWithSubjectIdWithoutGroup(@Param("idSubject") Long idSubject, @Param("idUser") Long idUser);

    @Query("SELECT NEW com.caido.iqtest.entity.DTOs.TestsDTO(t.id, t.detailedResults, t.resultsText, t.description, t.options, t.disabled, t.randomImages, t.idSubjects, null, t.maxTime, t.detailsPerQuestion, t.text,"
            + "CAST (finalizedPercent(cast (:idUser AS integer), t.id) AS integer) "
            + ") "
            + "FROM Tests t "
            + "WHERE t.idSubjects.id = :idSubject and t.idGroups.id = :idGroup and t.disabled = 0 "
            + "ORDER BY t.description ASC")
    List<TestsDTO> testsDTOWithSubjectIdAndGroupId(@Param("idSubject") Long idSubject, @Param("idGroup") Long idGroup, @Param("idUser") Long idUser);

}
