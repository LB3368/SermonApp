package com.devmountain.sermonApp.entities;

import com.devmountain.sermonApp.dtos.SermonDto;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Sermons")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Sermon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "scripture_reference")
    private String scriptureReference;

    @Column(name = "date")
    private LocalDate date;

    @OneToMany(mappedBy = "sermon", fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JsonManagedReference
    private Set<Comment> commentSet = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(
            name = "CategorySermon",
            joinColumns = @JoinColumn(name = "sermon_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>();

    @ManyToOne
    @JsonBackReference
    private User user;

    public Sermon(SermonDto sermonDto) {
        if (sermonDto.getId() != null) {
            this.id = sermonDto.getId();
        }
        if (sermonDto.getTitle() != null) {
            this.title = sermonDto.getTitle();
        }
        if (sermonDto.getDescription() != null) {
            this.description = sermonDto.getDescription();
        }
        if (sermonDto.getScriptureReference() != null) {
            this.scriptureReference = sermonDto.getScriptureReference();
        }
        if (sermonDto.getDate() != null) {
            this.date = sermonDto.getDate();
        }
    }

    public Collection<Comment> getComments() {
        return commentSet;
    }
}
