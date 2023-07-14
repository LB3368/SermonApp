package com.devmountain.sermonApp.repositories;

import com.devmountain.sermonApp.entities.Category;
import com.devmountain.sermonApp.entities.Sermon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findAllBySermonsEquals(Sermon sermons);
}
