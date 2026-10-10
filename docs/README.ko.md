[English](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/README.md) | [简体中文](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.zh-CN.md) | [한국어](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.ko.md) | [日本語](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.ja.md)

## 소개

dumogu-dropdown-menu는 번들 후 5KB 미만의 경량 JavaScript 드롭다운 메뉴 라이브러리입니다. 핵심 위치 계산 로직과 표시/숨김 동작만 제공하며, **어떠한 UI 스타일도 강제하지 않습니다** — 메뉴의 외관은 전적으로 사용자가 제어합니다.

[라이브 데모](https://wurencaideli.github.io/dumogu-dropdown-menu/demo.html)

### 특징

- **초경량**: 번들 후 < 5KB, 의존성 없음
- **스타일 무침범**: 라이브러리는 위치 계산과 전환 애니메이션만 처리하며, 메뉴 스타일은 전적으로 사용자가 결정합니다
- **자동 위치 결정**: 대상 요소의 뷰포트 내 위치를 기준으로 최적의 확장 방향을 자동으로 판단합니다 (4방향 + 정밀도 최적화)
- **내장 전환 애니메이션**: CSS 클래스 토글로 트리거되는 스케일 + 투명도 전환 애니메이션
- **TypeScript 지원**: 완전한 타입 선언 포함
- **다중 포맷 출력**: ESM, CJS, UMD 빌드 제공

---

## 설치

```bash
npm install dumogu-dropdown-menu
```

---

## 사용 방법

### 모듈 가져오기

```javascript
// ESM
import { DumoguDropdownMenu } from 'dumogu-dropdown-menu';

// CommonJS
const { DumoguDropdownMenu } = require('dumogu-dropdown-menu');
```

### 브라우저 script 태그

```html
<link rel="stylesheet" href="./dist/dumogu-dropdown-menu.css" />
<script src="./dist/dumogu-dropdown-menu.umd.js"></script>
<script>
    const { DumoguDropdownMenu } = window['dumogu-dropdown-menu'];
</script>
```

---

## 빠른 시작

```javascript
import { DumoguDropdownMenu } from 'dumogu-dropdown-menu';
import 'dumogu-dropdown-menu/dist/dumogu-dropdown-menu.css';

// 트리거 버튼의 경계 사각형 가져오기
const btEl = document.getElementById('my-button');

function getArea(el) {
    const rect = el.getBoundingClientRect();
    return {
        start: [rect.x, rect.y],
        end: [rect.x + rect.width, rect.y + rect.height],
        width: rect.width,
        height: rect.height,
    };
}

// 인스턴스 생성
const ddInstance = new DumoguDropdownMenu({
    content: '<div class="my-menu-item">메뉴 항목 1</div>',
    area: getArea(btEl),
    show: true,
});

// 기본 테마 클래스 추가 (선택 사항 — 완전히 커스텀 스타일을 사용할 수도 있습니다)
ddInstance.dropdownMenuContainerTargetEl.classList.add('dumogu-dropdown-menu-theme');

// 이후 위치 업데이트를 위해 트리거 요소 참조 저장
ddInstance.targetEl = btEl;

// 버튼 클릭 시 표시/숨김 토글
btEl.addEventListener('click', () => {
    ddInstance.area = getArea(btEl);
    ddInstance.show = !ddInstance.show;
});
```

---

## API 참조

### `new DumoguDropdownMenu(options)`

새로운 드롭다운 메뉴 인스턴스를 생성합니다.

**`options` 매개변수:**

| 매개변수   | 타입                                      | 기본값  | 설명                                                |
| ---------   | ----------------------------------------- | ------- | ---------------------------------------------------------- |
| `content`   | `string \| HTMLElement \| HTMLElement[]`   | `''`    | 메뉴 콘텐츠 — HTML 문자열, 단일 DOM 요소 또는 요소 배열 |
| `area`      | `AreaOption`                              | `{}`    | 메뉴가 확장될 위치를 계산하는 데 사용되는 대상 영역    |
| `show`      | `boolean`                                 | `false` | 메뉴를 즉시 표시할지 여부                       |
| `container` | `HTMLElement`                             | —       | 메뉴를 마운트할 요소; 생략하면 `document.body`에 마운트됩니다. 컨테이너는 static이 아닌 position(예: `position: relative`)이어야 합니다 |

**`AreaOption` 타입:**

| 속성    | 타입       | 설명                                              |
| -------- | ---------- | -------------------------------------------------------- |
| `start`  | `number[]` | 대상 영역의 왼쪽 위 좌표 `[x, y]` (뷰포트 기준) |
| `end`    | `number[]` | 대상 영역의 오른쪽 아래 좌표 `[x, y]` (뷰포트 기준) |
| `width`  | `number`   | 대상 영역의 너비                                  |
| `height` | `number`   | 대상 영역의 높이                                 |

---

### 인스턴스 속성

#### `show`

메뉴 표시 여부를 가져오거나 설정합니다.

```javascript
// 메뉴 표시
ddInstance.show = true;

// 메뉴 숨김
ddInstance.show = false;

// 토글
ddInstance.show = !ddInstance.show;

// 현재 상태 읽기
console.log(ddInstance.show); // true | false
```

#### `content`

메뉴 콘텐츠를 가져오거나 설정합니다. 세 가지 타입을 지원합니다:

```javascript
// 1. HTML 문자열
ddInstance.content = '<div class="item">메뉴 항목</div>';

// 2. 단일 DOM 요소
const el = document.createElement('div');
el.textContent = '메뉴 항목';
ddInstance.content = el;

// 3. DOM 요소 배열
const items = [el1, el2, el3];
ddInstance.content = items;
```

`content`를 설정하면 DOM이 즉시 업데이트됩니다.

#### `area`

위치 계산에 사용되는 대상 영역을 가져오거나 설정합니다. 메뉴는 이 영역과 뷰포트 크기를 기준으로 확장 방향과 크기를 계산합니다.

```javascript
ddInstance.area = {
    start: [100, 200],  // 트리거 요소의 왼쪽 위
    end: [300, 250],    // 트리거 요소의 오른쪽 아래
    width: 200,         // 요소 너비
    height: 50,         // 요소 높이
};
```

#### `container`

메뉴가 마운트될 요소를 가져오거나 설정합니다. 설정하지 않으면(또는 `undefined`로 설정하면) `document.body`에 마운트되고, 설정하면 해당 요소에 마운트되며 루트 요소에 `.dumogu-dropdown-menu-body_custom-parent` 클래스가 추가됩니다. 마운트된 상태에서 컨테이너를 변경하면 메뉴가 즉시 이동합니다.

```javascript
const ddInstance = new DumoguDropdownMenu({
    container: document.getElementById('my-panel'), // #my-panel에 마운트
    // ...
});

// 나중에: body로 다시 이동
ddInstance.container = undefined;
```

> **참고:** 커스텀 컨테이너는 static이 아닌 position(예: `position: relative`)이어야 합니다. 메뉴가 absolute 위치로 컨테이너를 `100%` × `100%` 채우기 때문입니다. 이 경우 뷰포트가 아닌 컨테이너 영역을 기준으로 위치가 계산됩니다 — `area` 좌표는 여전히 뷰포트 기준이므로 사용자 쪽에서 변경할 필요가 없습니다.

#### `isMounted`

읽기 전용. 메뉴가 현재 DOM에 마운트되어 있는지 나타냅니다. 타입: `boolean`.

#### `isDestroyed`

읽기 전용. 인스턴스가 파괴되었는지 나타냅니다. 타입: `boolean`.

---

### DOM 요소 참조

이 속성들은 커스텀 스타일링과 이벤트 처리를 위해 메뉴의 내부 DOM 구조에 직접 접근할 수 있게 합니다.

| 속성                            | 타입               | 설명                                                          |
| ------------------------------- | ------------------ | -------------------------------------------------------------------- |
| `dropdownMenuEl`                | `HTMLDivElement`   | 최외층 컨테이너, fixed 전체 화면, `pointer-events: none`       |
| `dropdownMenuContainerEl`       | `HTMLDivElement`   | 위치 컨테이너, transform 애니메이션과 배치 처리     |
| `dropdownMenuContainerTargetEl` | `HTMLDivElement`   | 콘텐츠 컨테이너, 사용자가 제공한 `content`를 담음, `pointer-events: auto` |

**DOM 구조:**

```
dropdownMenuEl (fixed 전체 화면 레이어, pointer-events: none)
└── dropdownMenuContainerEl (위치 지정 + transform 애니메이션)
    └── dropdownMenuContainerTargetEl (콘텐츠 래퍼, pointer-events: auto)
        └── [사용자가 제공한 콘텐츠]
```

---

### 인스턴스 메서드

#### `update()`

메뉴 위치를 수동으로 다시 계산하고 업데이트합니다. 대상 요소의 위치가 변경되었을 때 호출하세요 (예: 페이지 스크롤, 창 크기 조절, 레이아웃 변경).

```javascript
// requestAnimationFrame으로 위치 지속 추적
function loop() {
    requestAnimationFrame(() => {
        ddInstance.area = getArea(btEl);
        ddInstance.update();
        loop();
    });
}
loop();
```

> **왜 수동 업데이트인가?** 요소 위치는 다양한 이유로 변경될 수 있습니다 (스크롤, 레이아웃 변경, 애니메이션 등). 라이브러리가 모든 시나리오를 감시하는 것은 불가능하고 바람직하지도 않습니다. 사용자가 업데이트 시점을 결정하는 것이 가장 효율적인 방법입니다.

#### `mount()`

메뉴를 `container` 요소에 수동으로 마운트합니다 (컨테이너가 설정되지 않은 경우 `document.body`). `show = true` 설정 시 자동으로 호출되므로 직접 호출할 일은 거의 없습니다.

#### `unmount()`

메뉴를 DOM에서 수동으로 제거합니다. `show === false`일 때 전환 애니메이션이 끝나면 자동으로 호출됩니다.

#### `destroy()`

인스턴스를 파괴하고 DOM 요소와 모든 이벤트 리스너를 제거합니다. 파괴 후에는 인스턴스를 사용해서는 안 됩니다.

```javascript
ddInstance.destroy();
// 이 후에는 ddInstance에 접근하지 마세요
```

---

## CSS 클래스 참조

라이브러리가 생성하는 핵심 클래스 이름:

| 클래스                                         | 설명                                                    |
| --------------------------------------------- | -------------------------------------------------------------- |
| `.dumogu-dropdown-menu-body`                  | 최외층 컨테이너 (fixed 전체 화면, `pointer-events: none`) |
| `.dumogu-dropdown-menu-body_show`            | 표시 상태 클래스 (body에 추가되어 애니메이션 트리거)           |
| `.dumogu-dropdown-menu-body_custom-parent`   | 메뉴가 `document.body` 대신 커스텀 `container`에 마운트될 때 추가 (absolute, 컨테이너를 채움) |
| `.dumogu-dropdown-menu-body_container`       | 위치 컨테이너 (absolute, transform 애니메이션 담당) |
| `.dumogu-dropdown-menu-body_container_target` | 콘텐츠 컨테이너 (`overflow: auto`, `pointer-events: auto`)    |

### 기본 테마

라이브러리는 `.dumogu-dropdown-menu-theme` 클래스로 활성화하는 선택적 테마를 제공합니다:

```javascript
ddInstance.dropdownMenuContainerTargetEl.classList.add('dumogu-dropdown-menu-theme');
```

테마 클래스 이름:

| 클래스                                   | 설명                                |
| ----------------------------------- | ------------------------------------------ |
| `.dumogu-dropdown-menu-theme`       | 테마 컨테이너 (어두운 배경, 둥근 모서리, 그림자) |
| `.dumogu-dropdown-menu-theme_item`  | 메뉴 항목 (호버 하이라이트)                |
| `.dumogu-dropdown-menu-theme_active` | 활성/선택된 메뉴 항목 상태            |

기본 테마를 완전히 건너뛰고 `dropdownMenuContainerTargetEl`에 직접 자신만의 스타일을 적용할 수도 있습니다.

---

## 완전한 예제

프로덕션에 사용할 수 있는 완전한 예제입니다:

- 버튼 클릭으로 메뉴 토글
- 외부 클릭 시 닫기
- 프레임 단위 위치 추적
- 커스텀 데이터 바인딩이 있는 메뉴 항목
- 파괴 시 정리

```javascript
import { DumoguDropdownMenu } from 'dumogu-dropdown-menu';
import 'dumogu-dropdown-menu/dist/dumogu-dropdown-menu.css';

const btEl = document.getElementById('my-button');

function getArea(el) {
    const rect = el.getBoundingClientRect();
    return {
        start: [rect.x, rect.y],
        end: [rect.x + rect.width, rect.y + rect.height],
        width: rect.width,
        height: rect.height,
    };
}

// 인스턴스 생성
const ddInstance = new DumoguDropdownMenu({
    content: `
        <div class="dumogu-dropdown-menu-theme_item">메뉴 항목 1</div>
        <div class="dumogu-dropdown-menu-theme_item">메뉴 항목 2</div>
        <div class="dumogu-dropdown-menu-theme_item">메뉴 항목 3</div>
    `,
    area: getArea(btEl),
    show: false,
});

// 기본 테마 적용
ddInstance.dropdownMenuContainerTargetEl.classList.add('dumogu-dropdown-menu-theme');

// 트리거 요소 참조 저장
ddInstance.targetEl = btEl;

// 버튼 클릭 시 토글
btEl.addEventListener('click', () => {
    if (!ddInstance.show) {
        // 데이터 바인딩이 있는 메뉴 항목 동적 생성
        const item1 = document.createElement('div');
        item1.textContent = '옵션 A';
        item1.classList.add('dumogu-dropdown-menu-theme_item');
        item1.onclick = () => {
            ddInstance.show = false;
            console.log('옵션 A 선택됨, 데이터:', { id: 1 });
        };

        const item2 = document.createElement('div');
        item2.textContent = '옵션 B';
        item2.classList.add('dumogu-dropdown-menu-theme_item');
        item2.onclick = () => {
            ddInstance.show = false;
            console.log('옵션 B 선택됨, 데이터:', { id: 2 });
        };

        ddInstance.content = [item1, item2];
    }
    ddInstance.area = getArea(btEl);
    ddInstance.show = !ddInstance.show;
});

// 외부 클릭 시 닫기
document.addEventListener('click', (e) => {
    if (!ddInstance.show || ddInstance.isDestroyed) return;
    if (
        !ddInstance.dropdownMenuContainerTargetEl.contains(e.target) &&
        !ddInstance.targetEl.contains(e.target)
    ) {
        ddInstance.show = false;
    }
});

// 버튼 위치 지속 추적
function updateLoop() {
    requestAnimationFrame(() => {
        if (!ddInstance.isDestroyed) {
            ddInstance.area = getArea(ddInstance.targetEl);
            ddInstance.update();
            updateLoop();
        }
    });
}
updateLoop();

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    ddInstance.destroy();
});
```

---

## 위치 계산

메뉴의 확장 방향은 두 단계로 결정됩니다:

1. **방향 감지** — 대상 요소의 양쪽 남은 공간을 비교합니다. 메뉴는 공간이 더 많은 쪽으로 열립니다:
   - 수평: `오른쪽 공간 > 왼쪽 공간`이면 오른쪽으로 확장, 그렇지 않으면 왼쪽
   - 수직: `아래 공간 > 위 공간`이면 아래로 확장, 그렇지 않으면 위로

2. **정밀도 최적화** — 대상 요소의 가로세로 비율과 사용 가능한 공간의 가로세로 비율을 비교하여 어느 축을 주 크기 결정 축으로 할지 정하고, 메뉴가 뷰포트 안에 최대한 들어가도록 합니다.

최종 메뉴의 너비와 높이는 각 방향에서 더 큰 사용 가능한 공간을 사용합니다.

---

## 전환 애니메이션

표시/숨김 애니메이션은 `.dumogu-dropdown-menu-body_show` 클래스가 트리거하는 CSS 전환으로 처리됩니다:

- **숨김**: `transform: scale(0); opacity: 0;`
- **표시**: `transform: scale(1); opacity: 1;`
- **지속 시간**: `0.2s`
- **속성**: `transform`, `opacity`
- **transform-origin**: 확장 방향에 따라 동적으로 설정 (예: 오른쪽-아래로 확장 시 `left top`)

`isTransitioning` 속성은 전환이 진행 중인지 나타냅니다. 라이브러리는 내부적으로 이를 사용하여 숨김 전환이 끝난 후 자동으로 `unmount()`를 호출합니다.

---

## TypeScript 지원

완전한 타입 선언이 기본 포함되어 있습니다:

```typescript
import type {
    DumoguDropdownMenuOptions,  // 생성자 옵션 타입
    AreaOption                  // 영역 매개변수 타입
} from 'dumogu-dropdown-menu';

import { DumoguDropdownMenu } from 'dumogu-dropdown-menu';

const options: DumoguDropdownMenuOptions = {
    content: '<div>메뉴</div>',
    area: {
        start: [0, 0],
        end: [100, 50],
        width: 100,
        height: 50,
    },
    show: true,
};

const instance = new DumoguDropdownMenu(options);
```

---

## 라이선스

MIT
