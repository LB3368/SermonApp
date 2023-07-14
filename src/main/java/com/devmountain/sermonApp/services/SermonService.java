package com.devmountain.sermonApp.services;

import com.devmountain.sermonApp.dtos.SermonDto;


import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;


public interface SermonService {
    List<SermonDto> getAllSermonsByUserId(Long userId);

    @Transactional
    void addSermon(SermonDto sermonDto, Long userId);

    @Transactional
    void deleteSermonById(Long sermonId);

    @Transactional
    void updateSermonById(SermonDto sermonDto);

    Optional<SermonDto> getSermonById(Long sermonId);
}
