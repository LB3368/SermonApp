package com.devmountain.sermonApp.controllers;

import com.devmountain.sermonApp.dtos.SermonDto;
import com.devmountain.sermonApp.services.SermonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/sermons")
public class SermonController {
    @Autowired
    private SermonService sermonService;

    @GetMapping("/user/{userId}")
    public List<SermonDto> getSermonByUser(@PathVariable Long userId) {
        return sermonService.getAllSermonsByUserId(userId);
    }

    @PostMapping("/user/{userId}")
    public void addSermon(@RequestBody SermonDto sermonDto, @PathVariable Long userId) {
        sermonService.addSermon(sermonDto, userId);
    }

    @GetMapping("/{sermonId}")
    public Optional<SermonDto> getSermonById(@PathVariable Long sermonId) {
        return sermonService.getSermonById(sermonId);
    }


    @DeleteMapping("/{sermonId}")
    public void deleteSermonById(@PathVariable Long sermonId) {
        sermonService.deleteSermonById(sermonId);
    }

    @PutMapping("/{sermonId}")
    public void updateSermon(@RequestBody SermonDto sermonDto, @PathVariable Long sermonId) {
        sermonDto.setId(sermonId);
        sermonService.updateSermonById(sermonDto);
    }
}
