package com.devmountain.sermonApp.controllers;

import com.devmountain.sermonApp.dtos.CommentDto;
import com.devmountain.sermonApp.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @GetMapping("/sermon/{sermonId}")
    public List<CommentDto> getCommentsBySermonId(@PathVariable Long sermonId) {
        return commentService.getAllCommentsBySermonId(sermonId);
    }

    @PostMapping("/{userId}/{sermonId}")
    public void addComment(@RequestBody CommentDto commentDto, @PathVariable Long userId, @PathVariable Long sermonId) {
        commentService.addComment(commentDto, userId, sermonId);
    }

    @DeleteMapping("/{commentId}")
    public void deleteCommentById(@PathVariable Long commentId) {
        commentService.deleteCommentById(commentId);
    }

    @PutMapping("/{commentId}")
    private void updateCommentById(@RequestBody CommentDto commentDto, @PathVariable String commentId) {
        commentService.updateCommentById(commentDto);
    }
}
