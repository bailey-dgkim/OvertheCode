package com.overthecode.backend.chapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChapterService {

    private final ChapterRepository chapterRepository;

    public List<Chapter> getActiveChapters() {
        return chapterRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc();
    }
}