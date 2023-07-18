package com.devmountain.sermonApp.entities;

import com.devmountain.sermonApp.dtos.CategoryDto;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Category")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name",unique = true)
    private String name;

    @ManyToMany(mappedBy = "categories", fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
//    @JoinTable(name = "CategorySermon",
//    joinColumns = @JoinColumn(name = "sermon_id"),
//    inverseJoinColumns = @JoinColumn(name = "category_id"))
    @JsonBackReference
    private Set<Sermon> sermons = new HashSet<>();

    public Category(CategoryDto categoryDto) {
        if (categoryDto.getId() != null) {
            this.id = categoryDto.getId();
        }
        if (categoryDto.getName() != null) {
            this.name = categoryDto.getName();
        }
    }
}
