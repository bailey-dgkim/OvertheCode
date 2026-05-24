package com.overthecode.backend.controller; // 이 파일이 controller 패키지 안에 있다는 뜻

import com.overthecode.backend.dto.ChapterResponse; // API 응답으로 내려줄 ChapterResponse DTO 가져오기
import com.overthecode.backend.service.ChapterService; // 챕터 관련 업무 로직을 처리하는 Service 가져오기
import lombok.RequiredArgsConstructor; // final 필드를 생성자로 주입받게 해주는 Lombok 기능
import org.springframework.web.bind.annotation.GetMapping; // GET 요청을 처리하기 위한 어노테이션
import org.springframework.web.bind.annotation.RequestMapping; // 공통 URL 경로를 지정하기 위한 어노테이션
import org.springframework.web.bind.annotation.RestController; // 이 클래스가 REST API Controller라는 뜻

import java.util.List; // 여러 개의 ChapterResponse를 리스트로 반환하기 위해 필요

@RestController // 이 클래스는 API 요청을 받고 JSON 응답을 돌려주는 Controller라는 뜻
@RequestMapping("/api/chapters") // 이 Controller의 기본 주소는 /api/chapters
@RequiredArgsConstructor // final 필드인 chapterService를 생성자로 자동 주입
public class ChapterController {

    private final ChapterService chapterService; // 챕터 목록 조회 로직을 처리할 Service

    @GetMapping // GET /api/chapters 요청이 들어오면 아래 메서드 실행
    public List<ChapterResponse> getChapters() {
        // 챕터 목록을 조회해서 API 응답으로 반환하는 메서드

        return chapterService.getChapters();
        // Service에게 챕터 목록 조회를 맡기고, 그 결과를 그대로 응답으로 반환
    }
}