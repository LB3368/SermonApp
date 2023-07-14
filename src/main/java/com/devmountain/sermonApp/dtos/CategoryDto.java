package com.devmountain.sermonApp.dtos;

import com.devmountain.sermonApp.entities.Category;
import com.devmountain.sermonApp.entities.Sermon;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDto implements Serializable {
    private Long id;
    private String name;
    private Set<SermonDto> sermonDtoSet = new HashSet<>();

    public CategoryDto(Category category) {
        if (category.getId() != null) {
            this.id = category.getId();
        }
        if (category.getName() != null) {
            this.name = category.getName();
        }
    }
}
