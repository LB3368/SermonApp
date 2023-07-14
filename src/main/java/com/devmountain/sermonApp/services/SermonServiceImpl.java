package com.devmountain.sermonApp.services;

import com.devmountain.sermonApp.dtos.CommentDto;
import com.devmountain.sermonApp.dtos.SermonDto;
import com.devmountain.sermonApp.dtos.UserDto;
import com.devmountain.sermonApp.entities.Category;
import com.devmountain.sermonApp.entities.Sermon;
import com.devmountain.sermonApp.entities.User;
import com.devmountain.sermonApp.repositories.CategoryRepository;
import com.devmountain.sermonApp.repositories.SermonRepository;
import com.devmountain.sermonApp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SermonServiceImpl implements SermonService{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SermonRepository sermonRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Override
    public List<SermonDto> getAllSermonsByUserId(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            List<Sermon> sermonList = sermonRepository.findAllByUserEquals(userOptional.get());
            return sermonList.stream().map(sermon -> new SermonDto(sermon)).collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    @Override
    @Transactional
    public void addSermon(SermonDto sermonDto, Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Sermon sermon = new Sermon(sermonDto);
            sermon.setUser(user);

            // Set commentDtoSetSet
            sermonDto.setCommentDtoSetSet(sermon.getCommentSet().stream()
                    .map(CommentDto::new)
                    .collect(Collectors.toSet()));

            // Set categoryIds
            sermonDto.setCategoryIds(sermon.getCategories().stream()
                    .map(Category::getId)
                    .collect(Collectors.toList()));

            // Save the sermon
            sermonRepository.save(sermon);
        }
    }

    @Override
    @Transactional
    public void deleteSermonById(Long sermonId) {
        sermonRepository.deleteById(sermonId);
    }

    @Override
    @Transactional
    public void updateSermonById(SermonDto sermonDto) {
        Optional<Sermon> sermonOptional = sermonRepository.findById(sermonDto.getId());
        sermonOptional.ifPresent(sermon -> {
            sermon.setTitle(sermonDto.getTitle());
            sermon.setDescription(sermonDto.getDescription());
            sermon.setScriptureReference(sermonDto.getScriptureReference());
            sermon.setDate(sermonDto.getDate());
            updateCategories(sermon, sermonDto.getCategoryIds());
            sermonRepository.save(sermon);
        });
    }

    private void updateCategories(Sermon sermon, List<Long> categoryIds) {
        sermon.getCategories().clear();
        if (categoryIds != null) {
            List<Category> categories = categoryRepository.findAllById(categoryIds);
            sermon.getCategories().addAll(categories);
        }
    }

    @Override
    public Optional<SermonDto> getSermonById(Long sermonId) {
        Optional<Sermon> sermonOptional = sermonRepository.findById(sermonId);
        return sermonOptional.map(SermonDto::new);
    }
}