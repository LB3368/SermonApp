package com.devmountain.sermonApp.repositories;

import com.devmountain.sermonApp.entities.Comment;
import com.devmountain.sermonApp.entities.Sermon;
import com.devmountain.sermonApp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findAllByUserEquals(User user);
    List<Comment> findAllBySermonEquals(Sermon sermon);
}
