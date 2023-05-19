package com.caido.iqtest.repositories;

import com.caido.iqtest.entity.TestsSessions;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TestsSessionsRepository extends JpaRepository<TestsSessions, Long> {
    @Query("SELECT c FROM TestsSessions c ORDER BY c.id DESC")
    @Override
    List<TestsSessions> findAll();
}
