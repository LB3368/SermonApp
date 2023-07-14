package com.devmountain.sermonApp.dtos;

import com.devmountain.sermonApp.entities.Category;
import com.devmountain.sermonApp.entities.Comment;
import com.devmountain.sermonApp.entities.Sermon;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SermonDto implements Serializable {
    private Long id;
    private String title;
    private String description;
    private String scriptureReference;
    private LocalDate date;
    private UserDto userDto;
    private Set<CommentDto> commentDtoSetSet = new HashSet<>();
    private List<Long> categoryIds;

    public SermonDto(Sermon sermon) {
        if (sermon.getId() != null) {
            this.id = sermon.getId();
        }
        if (sermon.getTitle() != null) {
            this.title = sermon.getTitle();
        }
        if (sermon.getDescription() != null) {
            this.description = sermon.getDescription();
        }
        if (sermon.getScriptureReference() != null) {
            this.scriptureReference = sermon.getScriptureReference();
        }
        if (sermon.getDate() != null) {
            this.date = sermon.getDate();
        }
        if (sermon.getCategories() != null) {
            this.categoryIds = sermon.getCategories().stream().map(Category::getId).collect(Collectors.toList());
        }
        if (sermon.getUser() != null) {
            this.userDto = new UserDto(sermon.getUser());
        }
    }

    public List<Long> getCategoryIds() {
        return categoryIds;
    }
}
