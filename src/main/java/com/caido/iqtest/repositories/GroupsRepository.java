package com.caido.iqtest.repositories;

import com.caido.iqtest.entity.Groups;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface GroupsRepository extends JpaRepository<Groups, Long> {
    @Query("SELECT c FROM Groups c ORDER BY c.id DESC")
    @Override
    List<Groups> findAll();
}
