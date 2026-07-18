package com.overthecode.backend.chapter.dto; // 이 파일이 dto 패키지 안에 있다는 뜻

import com.overthecode.backend.chapter.Chapter; // Chapter Entity 가져오기

public record ChapterResponse(
        Long id, // 응답에 내려줄 챕터 id
        String title, // 응답에 내려줄 챕터 제목
        String description, // 응답에 내려줄 챕터 설명
        Integer displayOrder // 응답에 내려줄 화면 표시 순서
) {
    public static ChapterResponse from(Chapter chapter) {
        // Chapter Entity를 ChapterResponse DTO로 변환하는 메서드

        return new ChapterResponse(
                chapter.getId(), // Entity의 id 값을 DTO로 옮김
                chapter.getTitle(), // Entity의 title 값을 DTO로 옮김
                chapter.getDescription(), // Entity의 description 값을 DTO로 옮김
                chapter.getDisplayOrder() // Entity의 displayOrder 값을 DTO로 옮김
        );
    }
}