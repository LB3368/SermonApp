package com.devmountain.sermonApp.services;

import com.devmountain.sermonApp.dtos.CommentDto;
import com.devmountain.sermonApp.entities.Comment;
import com.devmountain.sermonApp.entities.Sermon;
import com.devmountain.sermonApp.entities.User;
import com.devmountain.sermonApp.repositories.CommentRepository;
import com.devmountain.sermonApp.repositories.SermonRepository;
import com.devmountain.sermonApp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private SermonRepository sermonRepository;

    @Override
    public List<CommentDto> getAllCommentsBySermonId(Long sermonId) {
        Optional<Sermon> sermonOptional = sermonRepository.findById(sermonId);
        if (sermonOptional.isPresent()) {
            List<Comment> commentList = commentRepository.findAllBySermonEquals(sermonOptional.get());
            return commentList.stream().map(CommentDto::new).collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    @Override
    public void addComment(CommentDto commentDto, Long userId) {

    }

    @Override
    @Transactional
    public void addComment(CommentDto commentDto, Long userId, Long sermonId) {
       Optional<User> userOptional = userRepository.findById(userId);
       Optional<Sermon> sermonOptional = sermonRepository.findById(sermonId);
       if (userOptional.isPresent() && sermonOptional.isPresent()) {
           User user = userOptional.get();
           Comment comment = new Comment(commentDto);
           Sermon sermon = sermonOptional.get();

           comment.setUser(user);
           comment.setSermon(sermon);
           commentRepository.saveAndFlush(comment);
       }
    }

    @Override
    @Transactional
    public void deleteCommentById(Long commentId) {
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        commentOptional.ifPresent(comment -> commentRepository.delete(comment));
    }

    @Override
    @Transactional
    public void updateCommentById(CommentDto commentDto) {
        Optional<Comment> commentOptional = commentRepository.findById(commentDto.getId());
        commentOptional.ifPresent(comment -> {
            comment.setBody(commentDto.getBody());
            comment.setTimeStamp(commentDto.getTime_stamp());
            commentRepository.saveAndFlush(comment);
        });
    }

    @Override
    public Optional<CommentDto> getCommentById(Long commentId) {
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (commentOptional.isPresent()) {
            return Optional.of(new CommentDto(commentOptional.get()));
        }
        return Optional.empty();
    }
}
