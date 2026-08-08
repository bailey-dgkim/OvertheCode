# V2 콘텐츠 폴더

이 폴더는 새 공통 엔지니어링 커리큘럼의 내용만 관리한다.
현재 화면은 아직 이 데이터를 사용하지 않는다.

## 파일별 역할

- `parts.json`: 다섯 Part의 이름, 순서, 목표
- `system-map.json`: 시스템 맵의 그룹, 노드, 연결선
- `concepts.json`: 개념의 이름과 설명
- `chapters/*.json`: Chapter 메타데이터, 맵 강조 영역, 학습 단계
- `contentContract.js`: 단계와 활동 유형의 공통 이름
- `curriculumRepository.js`: JSON을 자동으로 찾아 화면에 전달하는 통로

## 지켜야 할 규칙

1. `id`는 화면 순서가 바뀌어도 바꾸지 않는다.
2. 화면에 보이는 번호는 `order`로 정한다.
3. Chapter 제목과 예상 시간은 해당 Chapter JSON만 소유한다.
4. 시스템 맵과 개념은 복사하지 않고 id로 참조한다.
5. `stage`는 학습 목적, `activity.type`은 화면 동작을 뜻한다.
6. 새 Chapter JSON은 `chapters/`에 넣으면 자동으로 발견된다.

## Chapter 단계 예시

```json
{
  "id": "find-runtime-problem",
  "stage": "locate",
  "label": "문제 위치 찾기",
  "activity": {
    "type": "map-select",
    "question": "어느 영역을 먼저 확인해야 할까요?",
    "correctNodeIds": ["process", "port"]
  }
}
```

콘텐츠 전체 구조와 참조 관계는 다음 단계의 검증기가 자동으로 검사한다.
