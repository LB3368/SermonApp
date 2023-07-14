package com.devmountain.sermonApp.repositories;

import com.devmountain.sermonApp.entities.Sermon;
import com.devmountain.sermonApp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findAllBySermonSet(Sermon sermon);
}
