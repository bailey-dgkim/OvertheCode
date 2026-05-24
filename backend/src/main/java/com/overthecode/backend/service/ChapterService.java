package com.overthecode.backend.service; // 이 파일이 service 패키지 안에 있다는 뜻

import com.overthecode.backend.dto.ChapterResponse; // API 응답용 DTO 가져오기
import com.overthecode.backend.repository.ChapterRepository; // DB 조회 창구인 Repository 가져오기
import lombok.RequiredArgsConstructor; // final 필드를 받는 생성자를 자동 생성
import org.springframework.stereotype.Service; // 이 클래스를 Service로 등록하기 위한 어노테이션

import java.util.List; // 여러 개의 ChapterResponse를 리스트로 반환하기 위해 필요

@Service // 이 클래스가 서비스 로직을 담당하는 Spring Bean이라는 뜻
@RequiredArgsConstructor // final 필드를 생성자로 주입받게 해줌
public class ChapterService {

    private final ChapterRepository chapterRepository; // Chapter DB 조회를 담당하는 Repository

    public List<ChapterResponse> getChapters() {
        // 활성화된 챕터 목록을 조회해서 API 응답 DTO 리스트로 변환하는 메서드

        return chapterRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc()
                // DB에서 is_active=true인 챕터들을 display_order 오름차순으로 조회

                .stream()
                // 조회된 Chapter 리스트를 하나씩 처리할 수 있는 흐름으로 바꿈

                .map(ChapterResponse::from)
                // Chapter Entity 하나를 ChapterResponse DTO 하나로 변환

                .toList();
        // 변환된 결과들을 다시 List로 모아서 반환
    }
}