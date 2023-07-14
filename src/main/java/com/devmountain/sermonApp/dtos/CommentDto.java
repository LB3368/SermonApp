package com.devmountain.sermonApp.dtos;

import com.devmountain.sermonApp.entities.Comment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentDto implements Serializable {
    private Long id;
    private String body;
    private LocalDateTime time_stamp;
    private UserDto user;
    private SermonDto sermon;

    public CommentDto(Comment comment) {
        if (comment.getId() != null) {
            this.id = comment.getId();
        }
        if (comment.getBody() != null) {
            this.body = comment.getBody();
        }
        if (comment.getTimeStamp() != null) {
            this.time_stamp = comment.getTimeStamp();
        }
        if (comment.getUser() != null) {
            this.user = new UserDto(comment.getUser());
        }
        if (comment.getSermon() != null) {
            this.sermon = new SermonDto(comment.getSermon());
        }
    }
}
