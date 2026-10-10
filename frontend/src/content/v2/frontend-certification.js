export const FRONTEND_CERTIFICATION_STORAGE_KEY = 'otc:frontend-certification:v1';
export const FRONTEND_CERTIFICATION_PASSING_SCORE = 12;
export const FRONTEND_CERTIFICATION_REQUIRED_IDS = ['q09', 'q15'];

export const FRONTEND_CERTIFICATION_CATEGORIES = {
  visual: '화면 모양',
  component: 'Component와 Props',
  state: 'State',
  event: 'Event',
  api: 'API와 서버 데이터',
};

export const FRONTEND_CERTIFICATION_PROJECT_TREE = `src/
├── main.jsx
├── App.jsx
├── styles.css
├── components/
│   ├── OrderCard.jsx
│   ├── OrderList.jsx
│   └── OrderForm.jsx
└── api/
    └── orderApi.js`;

export const FRONTEND_CERTIFICATION_CHEAT_SHEET = [
  ['색상, 크기, 여백, 폰트', 'CSS'],
  ['고정 문구, 화면 구조', 'JSX / Component'],
  ['사용 중 변하는 값', 'State'],
  ['부모에게 받은 값', 'Props / 부모 Component'],
  ['클릭 동작', 'onClick / Event Handler'],
  ['입력 동작', 'onChange / Event Handler'],
  ['서버에서 받은 데이터', 'API 호출 / Response'],
  ['저장되어야 하는 데이터', 'API / Server'],
  ['새로고침하면 사라지는 값', 'State만 바꾼 건 아닌지 확인'],
];

export const FRONTEND_CERTIFICATION_QUESTIONS = [
  {
    id: 'q01',
    type: 'single-choice',
    category: 'visual',
    title: '박스 색깔을 바꾸고 싶다',
    prompt: '현재 회색인 주문 카드의 배경을 파란색으로 바꾸려면 가장 먼저 어디를 찾아봐야 할까요?',
    screenHint: '회색 주문 카드 → 파란색 주문 카드',
    choices: [
      { id: 'api', text: 'orderApi.js' },
      { id: 'css', text: 'CSS' },
      { id: 'state', text: 'useState()' },
      { id: 'click', text: 'onClick' },
    ],
    correctChoiceId: 'css',
    explanation: '색상, 크기, 여백, 폰트처럼 화면의 모양을 바꾸려면 CSS부터 확인합니다.',
  },
  {
    id: 'q02',
    type: 'single-choice',
    category: 'visual',
    title: '고정된 화면 문구를 바꾸고 싶다',
    prompt: '화면의 “주문 A”를 “주문 a”로 바꾸려면 어디를 수정해야 할까요?',
    code: '<h2>주문 A</h2>',
    choices: [
      { id: 'jsx', text: 'OrderCard.jsx의 JSX' },
      { id: 'css', text: 'styles.css의 폰트 설정' },
      { id: 'api', text: 'orderApi.js의 요청 주소' },
      { id: 'main', text: 'main.jsx의 렌더링 코드' },
    ],
    correctChoiceId: 'jsx',
    explanation: '코드에 직접 적힌 고정 문구는 해당 화면을 그리는 Component의 JSX에서 수정합니다.',
  },
  {
    id: 'q03',
    type: 'single-choice',
    category: 'component',
    title: '화면의 값이 Component 안에 없다',
    prompt: 'OrderCard.jsx에서 “A”를 검색해도 없다면 다음으로 무엇을 추적해야 할까요?',
    code: `function OrderCard({ orderName }) {
  return <h2>주문 {orderName}</h2>;
}`,
    choices: [
      { id: 'parent', text: 'orderName을 넘겨주는 부모 Component' },
      { id: 'css', text: 'h2의 CSS 선택자' },
      { id: 'main', text: 'main.jsx의 import 순서' },
      { id: 'html', text: 'index.html의 title 태그' },
    ],
    correctChoiceId: 'parent',
    explanation: 'Props로 받은 값은 현재 Component가 아니라 그 값을 넘기는 부모 Component에서 시작될 수 있습니다.',
  },
  {
    id: 'q04',
    type: 'single-choice',
    category: 'state',
    title: '화면 글자가 사용 중에 계속 바뀐다',
    prompt: '버튼을 누르면 “배송 준비중”이 “배송 완료”로 바뀝니다. 이 값과 관련해 가장 먼저 볼 것은 무엇일까요?',
    code: 'const [status, setStatus] = useState("배송 준비중");',
    choices: [
      { id: 'css', text: 'CSS' },
      { id: 'state', text: 'State' },
      { id: 'head', text: 'HTML <head>' },
      { id: 'main', text: 'main.jsx' },
    ],
    correctChoiceId: 'state',
    explanation: '화면을 사용하는 동안 변하는 값은 State로 관리되는지 먼저 확인합니다.',
  },
  {
    id: 'q05',
    type: 'single-choice',
    category: 'state',
    title: '처음 표시되는 상태만 바꾸고 싶다',
    prompt: '화면을 처음 열었을 때부터 “주문 접수”가 표시되게 하려면 무엇을 바꿔야 할까요?',
    code: 'const [status, setStatus] = useState("배송 준비중");',
    choices: [
      { id: 'initial', text: 'useState의 초기값' },
      { id: 'setter', text: 'setStatus 함수의 이름' },
      { id: 'css', text: '상태 글자의 색상' },
      { id: 'api', text: 'API의 HTTP Method' },
    ],
    correctChoiceId: 'initial',
    explanation: '첫 렌더링에 사용할 값은 useState에 전달한 초기값에서 시작됩니다.',
  },
  {
    id: 'q06',
    type: 'single-choice',
    category: 'event',
    title: '버튼을 눌러도 아무 일도 일어나지 않는다',
    prompt: '화면에 버튼은 있지만 눌러도 동작하지 않습니다. 가장 먼저 확인할 것은 무엇일까요?',
    code: `<button>
  배송 완료 처리
</button>`,
    choices: [
      { id: 'handler', text: 'onClick과 연결된 Event Handler' },
      { id: 'color', text: '버튼의 background-color' },
      { id: 'api-name', text: 'API 파일의 이름' },
      { id: 'font', text: '버튼의 font-size' },
    ],
    correctChoiceId: 'handler',
    explanation: '클릭 문제는 먼저 onClick 연결 여부를 보고, 이어서 연결된 Event Handler의 내용을 확인합니다.',
  },
  {
    id: 'q07',
    type: 'single-choice',
    category: 'event',
    title: '버튼을 누르면 엉뚱한 동작을 한다',
    prompt: '“배송 완료 처리” 버튼을 눌렀더니 주문이 삭제됩니다. 가장 의심스러운 곳은 어디일까요?',
    code: `<button onClick={handleDelete}>
  배송 완료 처리
</button>`,
    choices: [
      { id: 'handler', text: 'onClick에 연결된 handleDelete' },
      { id: 'label', text: '버튼 안의 글자 크기' },
      { id: 'state', text: 'State 변수의 배열 순서' },
      { id: 'css', text: '버튼의 CSS className' },
    ],
    correctChoiceId: 'handler',
    explanation: '화면에 적힌 버튼 이름과 실제 실행되는 함수는 별개이므로 onClick에 연결된 함수를 확인합니다.',
  },
  {
    id: 'q08',
    type: 'single-choice',
    category: 'event',
    title: '입력창에 글자를 쳐도 값이 들어가지 않는다',
    prompt: 'value는 연결되어 있지만 입력이 되지 않습니다. 무엇이 빠졌는지 확인해야 할까요?',
    code: '<input value={memo} />',
    choices: [
      { id: 'change', text: 'onChange와 State 변경 로직' },
      { id: 'click', text: 'onClick과 삭제 함수' },
      { id: 'css', text: 'input의 border 색상' },
      { id: 'fetch', text: '조회용 GET 요청' },
    ],
    correctChoiceId: 'change',
    explanation: '제어되는 입력창은 onChange에서 새 값을 받아 State를 변경해야 화면 입력이 이어집니다.',
  },
  {
    id: 'q09',
    type: 'single-choice',
    category: 'api',
    required: true,
    title: '새로고침하면 배송 상태가 원래대로 돌아온다',
    prompt: '버튼을 누르면 배송 완료로 바뀌지만 새로고침하면 배송 준비중으로 돌아옵니다. 가장 가능성 높은 이유는 무엇일까요?',
    code: `function handleComplete() {
  setStatus("배송 완료");
}`,
    choices: [
      { id: 'state-only', text: '브라우저 State만 바꾸고 서버 데이터는 변경하지 않았다' },
      { id: 'css-cache', text: 'CSS 파일이 브라우저에 캐시되었다' },
      { id: 'jsx', text: 'JSX에서 버튼 태그를 사용했다' },
      { id: 'font', text: '폰트가 늦게 로딩되었다' },
    ],
    correctChoiceId: 'state-only',
    explanation: '새로고침 뒤에도 남아야 하는 데이터라면 API를 통해 서버 데이터를 변경해야 합니다.',
  },
  {
    id: 'q10',
    type: 'single-choice',
    category: 'api',
    title: '서버에서 주문을 가져오는 코드를 발견했다',
    prompt: '다음 코드는 무엇을 하고 있을 가능성이 가장 높을까요?',
    code: 'fetch("/api/orders")',
    choices: [
      { id: 'css', text: 'CSS 변경' },
      { id: 'component', text: 'Component 생성' },
      { id: 'server', text: '서버와 통신' },
      { id: 'color', text: '버튼 색상 변경' },
    ],
    correctChoiceId: 'server',
    explanation: 'fetch와 /api 경로는 브라우저가 서버에 요청을 보내는 지점일 가능성이 높습니다.',
  },
  {
    id: 'q11',
    type: 'single-choice',
    category: 'api',
    title: '주문 조회 요청을 해석한다',
    prompt: '다음 코드는 어떤 요청일까요?',
    code: `fetch("/api/orders/1024", {
  method: "GET"
});`,
    choices: [
      { id: 'read', text: '1024번 주문 조회' },
      { id: 'create', text: '새 주문 생성' },
      { id: 'update', text: '1024번 주문 변경' },
      { id: 'delete', text: '1024번 주문 삭제' },
    ],
    correctChoiceId: 'read',
    explanation: 'GET은 일반적으로 서버의 리소스를 조회할 때 사용합니다.',
  },
  {
    id: 'q12',
    type: 'single-choice',
    category: 'api',
    title: '배송 완료를 눌렀더니 새 주문이 생긴다',
    prompt: '배송 상태를 바꾸려던 코드에서 무엇이 가장 의심스러울까요?',
    code: `fetch("/api/orders", {
  method: "POST"
});`,
    choices: [
      { id: 'post', text: '생성에 주로 쓰는 POST 요청을 보내고 있다' },
      { id: 'fetch', text: 'fetch라는 함수 이름을 사용했다' },
      { id: 'quotes', text: '주소를 큰따옴표로 감쌌다' },
      { id: 'css', text: 'CSS 파일을 함께 import하지 않았다' },
    ],
    correctChoiceId: 'post',
    explanation: '상태 변경이라면 API 설계에 따라 PATCH 같은 변경 요청을 예상할 수 있습니다.',
  },
  {
    id: 'q13',
    type: 'single-choice',
    category: 'api',
    title: '화면에 표시되는 주문명이 잘못됐다',
    prompt: '화면에는 주문 B가 보이지만 사용자는 A가 맞다고 합니다. 가장 먼저 해야 할 판단은 무엇일까요?',
    code: `<h2>{order.name}</h2>

API Response
{
  "id": 1024,
  "name": "B"
}`,
    choices: [
      { id: 'trace', text: 'JSX를 A로 덮지 말고 API Response와 서버 데이터의 출처를 추적한다' },
      { id: 'hardcode', text: 'JSX를 <h2>주문 A</h2>로 즉시 고정한다' },
      { id: 'css', text: 'B 글자를 CSS로 숨긴다' },
      { id: 'button', text: '배송 완료 버튼의 onClick을 지운다' },
    ],
    correctChoiceId: 'trace',
    explanation: 'API에서 받은 값을 보여주는 화면이라면 프론트를 덮어쓰기 전에 데이터가 잘못된 위치를 추적해야 합니다.',
  },
  {
    id: 'q14',
    type: 'single-choice',
    category: 'component',
    title: 'AI에게 수정 범위를 정확히 지시한다',
    prompt: '주문 카드 배경색만 바꾸고 싶을 때 더 좋은 요청은 무엇일까요?',
    choices: [
      { id: 'broad', text: '프로젝트 확인해서 화면 예쁘게 수정해줘.' },
      { id: 'scoped', text: 'OrderCard에서 사용하는 CSS를 찾아 배경색만 수정하고, 동작과 API 로직은 변경하지 마.' },
      { id: 'rewrite', text: '프로젝트 전체를 새 프레임워크로 다시 만들어줘.' },
      { id: 'api', text: '모든 API 응답의 색상 값을 파란색으로 바꿔줘.' },
    ],
    correctChoiceId: 'scoped',
    explanation: '수정 위치와 범위를 좁혀 지시하면 불필요한 변경과 사고 범위를 줄일 수 있습니다.',
  },
  {
    id: 'q15',
    type: 'sequence',
    category: 'api',
    required: true,
    title: '종합: “배송 준비중”의 출처를 추적한다',
    prompt: '“배송 준비중”을 “상품 준비중”으로 바꾸려 합니다. 아직 코드 구조를 모를 때 확인 순서를 올바르게 배열하세요.',
    items: [
      { id: 'api', text: 'API Response와 서버 데이터까지 추적한다' },
      { id: 'component', text: '해당 화면을 그리는 Component를 찾는다' },
      { id: 'props', text: 'Props 또는 State에서 온 값인지 확인한다' },
      { id: 'screen', text: '화면에서 바꿀 요소를 정확히 특정한다' },
      { id: 'jsx', text: '문구가 JSX에 직접 적혀 있는지 확인한다' },
    ],
    correctOrder: ['screen', 'component', 'jsx', 'props', 'api'],
    explanation: '화면 요소에서 시작해 Component, 고정 JSX, Props·State, API·서버 순서로 출처를 좁힙니다.',
  },
];

