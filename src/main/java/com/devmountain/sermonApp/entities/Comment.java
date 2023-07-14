package com.devmountain.sermonApp.entities;

import com.devmountain.sermonApp.dtos.CommentDto;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Comments")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "body", columnDefinition = "text")
    private String body;

    @Column(name = "time_stamp")
    private LocalDateTime timeStamp;

    @ManyToOne
    @JsonBackReference
    private User user;

    @ManyToOne
    @JsonBackReference
    private Sermon sermon;

    public Comment(CommentDto commentDto) {
        if (commentDto.getBody() != null) {
            this.body = commentDto.getBody();
        }
        if (commentDto.getTime_stamp() != null) {
            this.timeStamp = commentDto.getTime_stamp();
        }
    }
}
