package com.devmountain.sermonApp.services;

import com.devmountain.sermonApp.dtos.CommentDto;
import com.sun.source.tree.OpensTree;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface CommentService {
    List<CommentDto> getAllCommentsBySermonId(Long sermonId);

    void addComment(CommentDto commentDto, Long userId);

    @Transactional
    void addComment(CommentDto commentDto, Long userId, Long sermonId);

    @Transactional
    void deleteCommentById(Long commentId);

    @Transactional
    void updateCommentById(CommentDto commentDto);

    Optional<CommentDto> getCommentById(Long commentId);
}
