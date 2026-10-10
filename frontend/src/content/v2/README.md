# V2 콘텐츠 폴더

이 폴더는 Part 0과 여덟 교육 Part로 구성된 공통 엔지니어링 커리큘럼을 관리한다.
화면은 이 폴더의 JSON을 `curriculumRepository`를 통해 읽는다.

## 파일별 역할

- `parts.json`: Part 0과 여덟 교육 Part의 이름, 순서, 목표
- `system-map.json`: 시스템 맵의 그룹, 노드, 연결선
- `concepts.json`: 개념의 이름과 설명
- `chapters/*.json`: Chapter 메타데이터와 학습 단계
- `contentContract.js`: 단계와 활동 유형의 공통 이름
- `curriculumRepository.js`: JSON을 자동으로 찾아 화면에 전달하는 통로
- `source/eight-part-outline.json`: 첨부 HTML에서 보존한 9개 Part·47개 Chapter 원본
- `source/node-aliases.json`: 같은 시스템 요소를 하나의 id로 합치는 표
- `scripts/import-eight-part-curriculum.mjs`: 보존한 원본을 47개 Chapter JSON으로 옮기는 변환기

## 지켜야 할 규칙

1. `id`는 화면 순서가 바뀌어도 바꾸지 않는다.
2. 화면에 보이는 번호는 `order`로 정한다.
3. Chapter 제목과 예상 시간은 해당 Chapter JSON만 소유한다.
4. 공통 개념은 복사하지 않고 id로 참조한다.
5. `stage`는 학습 목적, `activity.type`은 화면 동작을 뜻한다.
6. 새 Chapter JSON은 `chapters/`에 넣으면 자동으로 발견된다.
7. `draft` Chapter는 개요만 있어도 되지만 `available` Chapter는 시간, 목표, 개념 참조와 학습 단계를 모두 가져야 한다.

## Chapter 단계 예시

```json
{
  "id": "find-runtime-problem",
  "stage": "locate",
  "label": "문제 원인 고르기",
  "activity": {
    "type": "single-choice",
    "question": "어떤 원인을 먼저 확인해야 할까요?",
    "choices": [
      { "id": "process", "text": "Process", "feedback": "실행 여부를 확인합니다." },
      { "id": "style", "text": "글자색", "feedback": "실행 여부와 관련이 없습니다." }
    ],
    "correctChoiceId": "process"
  }
}
```

콘텐츠를 고친 뒤에는 다음 명령으로 전체 구조와 참조 관계를 검사한다.

```bash
npm run validate:content
```

보존한 원본으로 Part와 47개 Chapter 개요를 다시 생성하려면 다음을 실행한다.

```bash
node scripts/import-eight-part-curriculum.mjs
```

새 HTML 원본을 다시 가져올 때만 `--input` 경로를 추가한다.

```bash
node scripts/import-eight-part-curriculum.mjs --input /path/to/curriculum.html
```
