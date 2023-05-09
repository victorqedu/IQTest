package com.caido.iqtest.repositories;

import com.caido.iqtest.entity.Tests;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TestsRepository extends JpaRepository<Tests, Long> {
    @Query("SELECT c FROM Tests c ORDER BY c.id DESC")
    @Override
    List<Tests> findAll();
}
