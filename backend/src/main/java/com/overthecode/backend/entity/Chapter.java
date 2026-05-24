package com.overthecode.backend.entity; // 이 파일이 entity 패키지 안에 있다는 뜻

import jakarta.persistence.*; // JPA 어노테이션 가져오기
import lombok.Getter; // getter 자동 생성
import lombok.NoArgsConstructor; // 기본 생성자 자동 생성

import java.time.LocalDateTime; // createdAt, updatedAt 날짜/시간 타입용

@Entity // 이 클래스가 DB 테이블과 연결되는 Entity라는 뜻
@Table(name = "chapters") // DB의 chapters 테이블과 연결
@Getter // private 필드들의 getter를 자동 생성
@NoArgsConstructor // JPA가 필요로 하는 기본 생성자 자동 생성
public class Chapter {

    @Id // 이 필드가 기본키(PK)라는 뜻
    @GeneratedValue(strategy = GenerationType.IDENTITY) // id 값은 DB가 자동 증가로 생성
    private Long id; // id 컬럼과 연결

    @Column(nullable = false, length = 100) // title 컬럼, null 불가, 최대 길이 100
    private String title; // 챕터 제목

    @Column(columnDefinition = "text") // description 컬럼을 text 타입으로 매핑
    private String description; // 챕터 설명

    @Column(name = "display_order", nullable = false) // DB의 display_order 컬럼과 연결
    private Integer displayOrder; // 화면에 보여줄 챕터 정렬 순서

    @Column(name = "is_active", nullable = false) // DB의 is_active 컬럼과 연결
    private Boolean isActive; // 사용 중인 챕터인지 여부

    @Column(name = "created_at", nullable = false) // DB의 created_at 컬럼과 연결
    private LocalDateTime createdAt; // 생성 시각

    @Column(name = "updated_at", nullable = false) // DB의 updated_at 컬럼과 연결
    private LocalDateTime updatedAt; // 수정 시각
}