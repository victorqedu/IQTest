package com.caido.iqtest.repositories;

import com.caido.iqtest.entity.Users;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UsersRepository extends JpaRepository<Users, Long> {
    @Query("SELECT c FROM Users c ORDER BY c.id DESC")
    @Override
    @Transactional
    List<Users> findAll();

    @Query("SELECT p FROM Users p WHERE lower(p.username) = lower(?1)")
    public Users findByEmail(String email);
}
