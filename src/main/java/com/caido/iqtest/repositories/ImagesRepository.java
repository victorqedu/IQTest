package com.caido.iqtest.repositories;

import com.caido.iqtest.entity.Images;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ImagesRepository extends JpaRepository<Images, Long> {
    @Query("SELECT c FROM Images c ORDER BY c.id DESC")
    @Override
    List<Images> findAll();

    @Query("select count(*) from Images")
    Integer countImages();

    @Transactional
    @Query(value = "SELECT i.id, i.image FROM Images i ORDER BY random() LIMIT 1", nativeQuery = true)
    Images getRandomImage(@Param("offset") int offset);
}
