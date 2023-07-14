package com.devmountain.sermonApp.dtos;

import com.devmountain.sermonApp.entities.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto implements Serializable {
    private Long id;
    private String username;
    private String password;
    private String first_name;
    private String last_name;
    private String email;
    private Set<SermonDto> sermonDtoSet = new HashSet<>();

    public UserDto(User user) {
        if (user.getId() != null) {
            this.id = user.getId();
        }
        if (user.getUsername() != null) {
            this.username = user.getUsername();
        }
        if (user.getPassword() != null) {
            this.password = user.getPassword();
        }
        if (user.getFirstName() != null) {
            this.first_name = user.getFirstName();
        }
        if (user.getLastName() != null) {
            this.last_name = user.getLastName();
        }
        if (user.getEmail() != null) {
            this.email = user.getEmail();
        }
    }
}
