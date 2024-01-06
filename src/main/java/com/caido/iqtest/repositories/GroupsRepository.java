package com.caido.iqtest.repositories;

import com.caido.iqtest.entity.Groups;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface GroupsRepository extends JpaRepository<Groups, Long> {
    @Query("SELECT c FROM Groups c ORDER BY c.id DESC")
    @Override
    List<Groups> findAll();

    @Query("SELECT g "
            + "FROM Groups g "
            + "JOIN Tests t ON (t.idGroups = g and t.idSubjects.id = :idSubject) "
            + "ORDER BY g.name ASC")
    List<Groups> findGroupsWithSubjectId(@Param("idSubject") Long idSubject);
}
