package com.caido.iqtest.repositories;

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

    @Query("SELECT c FROM Tests c WHERE c.idSubjects = :subject and c.disabled = 0 ORDER BY c.id DESC")
    List<Tests> findAllWithSubjectId(@Param("subject") Subjects subject);
}
