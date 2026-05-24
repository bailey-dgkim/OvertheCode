package com.overthecode.backend.repository; // 이 파일이 repository 패키지 안에 있다는 뜻

import com.overthecode.backend.entity.Chapter; // Chapter Entity 가져오기
import org.springframework.data.jpa.repository.JpaRepository; // JPA 기본 Repository 기능 가져오기

import java.util.List; // 여러 Chapter를 List로 반환하기 위해 필요

public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    // Chapter 테이블을 다루는 Repository
    // Chapter = 대상 Entity
    // Long = Chapter의 PK인 id 타입

    List<Chapter> findAllByIsActiveTrueOrderByDisplayOrderAsc();
    // is_active가 true인 챕터만 displayOrder 기준 오름차순으로 조회
    // SQL 느낌으로는:
    // SELECT * FROM chapters WHERE is_active = true ORDER BY display_order ASC;
}