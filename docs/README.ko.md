[English](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/README.md) | [简体中文](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.zh-CN.md) | [한국어](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.ko.md) | [日本語](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.ja.md)

## 소개

dumogu-dropdown-menu는 번들 후 5KB 미만의 경량 JavaScript 드롭다운 메뉴 라이브러리입니다. 핵심 위치 계산 로직과 표시/숨김 동작만 제공하며, **어떠한 UI 스타일도 강제하지 않습니다** — 메뉴의 외관은 전적으로 사용자가 제어합니다.

[라이브 데모](https://wurencaideli.github.io/dumogu-dropdown-menu/demo.html)

### 특징

- **초경량**: 번들 후 < 5KB, 의존성 없음
- **스타일 무침범**: 라이브러리는 위치 계산과 전환 애니메이션만 처리하며, 메뉴 스타일은 전적으로 사용자가 결정합니다
- **자동 위치 결정**: 대상 영역의 뷰포트 내 위치를 기준으로 최적의 확장 방향을 자동으로 판단하고, 영역의 가로세로 비율에 따라 주 축을 자동 선택합니다
- **방향 제어**: `displayAreaLimit`로 세로/가로 확장을 강제하고, `offset`으로 대상 영역과의 간격을 유지할 수 있습니다
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

// 트리거 버튼의 영역 가져오기
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

// 인스턴스 생성 (즉시 표시)
const ddInstance = new DumoguDropdownMenu({
    content: '<div class="my-menu-item">메뉴 항목 1</div>',
    area: getArea(btEl),
    show: true,
});

// 버튼 클릭으로 표시/숨김 토글
btEl.addEventListener('click', () => {
    ddInstance.area = getArea(btEl); // 대상 영역 갱신
    ddInstance.show = !ddInstance.show;
    ddInstance.apply(); // 속성 변경을 DOM에 반영
});
```

> **핵심 사용법**: 인스턴스는 일반 속성(`content`, `area`, `show`, `container`, `displayAreaLimit`, `offset`)을 노출합니다. 값을 할당한 뒤 `apply()`를 호출하면 모두 DOM에 반영됩니다. setter 메서드는 없습니다.

---

## API 참조

### `new DumoguDropdownMenu(options)`

새 드롭다운 메뉴 인스턴스를 생성합니다.

**`options` 매개변수:**

| 매개변수           | 타입                                    | 기본값  | 설명 |
| ------------------ | --------------------------------------- | ------- | ---- |
| `content`          | `string \| HTMLElement`                 | `''`    | 메뉴 콘텐츠 — HTML 문자열 또는 단일 DOM 요소 |
| `area`             | `AreaOption`                            | `{}`    | 메뉴가 확장될 위치를 계산하는 대상 영역 |
| `show`             | `boolean`                               | `false` | 즉시 표시할지 여부 |
| `container`        | `HTMLElement`                           | —       | 메뉴를 마운트할 요소; 생략 시 `document.body`에 마운트됩니다. 컨테이너는 non-static 포지셔닝이어야 합니다 (예: `position: relative`) |
| `displayAreaLimit` | `'vertical' \| 'horizontal' \| ''`      | `''`    | 주 크기 축 강제: `'vertical'`은 높이 기준, `'horizontal'`은 너비 기준; 비워 두면 영역의 가로세로 비율로 자동 판단합니다 |
| `offset`           | `number`                                | `0`     | 주축을 따라 메뉴와 대상 영역 사이에 유지할 간격(px); 음수는 0으로 취급됩니다 |

**`AreaOption` 타입:**

| 속성     | 타입                   | 설명 |
| -------- | ---------------------- | ---- |
| `start`  | `[number, number]`     | 대상 영역의 왼쪽 위 좌표 `[x, y]` (뷰포트 좌표) |
| `end`    | `[number, number]`     | 대상 영역의 오른쪽 아래 좌표 `[x, y]` (뷰포트 좌표) |
| `width`  | `number`               | 대상 영역의 너비 — 자동 모드에서 가로세로 비율 비교에 사용 |
| `height` | `number`               | 대상 영역의 높이 |

---

### 정적 속성

#### `DumoguDropdownMenu.baseZIndex`

z-index 카운터의 기본값, 기본 `999`. 마운트될 때마다 다음 번호를 받아 나중에 열린 메뉴가 위에 쌓입니다. `999`가 페이지 레이어와 충돌하면 인스턴스 생성/표시 전에 변경하세요. 마운트된 메뉴가 하나도 없으면 카운터는 기본값으로 초기화됩니다.

---

### 인스턴스 속성

모든 속성은 일반 필드입니다: 새 값을 할당한 뒤 `apply()`를 호출하세요.

#### `show`

메뉴가 표시 중(또는 표시 예정)인지 여부. 타입: `boolean`.

#### `content`

현재 메뉴 콘텐츠. 타입: `string | HTMLElement | undefined`. 외부에서 요소가 이동된 경우 동일한 참조를 다시 할당하면 다시 마운트됩니다.

#### `area`

위치 계산에 사용되는 현재 대상 영역. 타입: `AreaOption`. 좌표는 커스텀 `container`를 사용하더라도 항상 뷰포트 기준입니다 — 라이브러리가 자동으로 변환합니다.

#### `container`

현재 마운트 요소 — `undefined`는 `document.body`를 의미합니다. 마운트된 상태에서 변경하면 다음 `apply()` 때 즉시 이동합니다.

#### `displayAreaLimit`

현재 주축 강제 방향. 타입: `'vertical' | 'horizontal' | ''`.

#### `offset`

주축을 따라 메뉴와 대상 영역 사이의 현재 간격(px). 타입: `number`.

#### `isTransitioning`

표시/숨김 전환이 진행 중인지 나타내는 플래그. 타입: `boolean`.

#### `isMounted`

메뉴가 현재 DOM에 마운트되어 있는지 여부. 타입: `boolean`.

#### `isDestroyed`

인스턴스가 파괴되었는지 여부. 타입: `boolean`.

---

### DOM 요소 참조

이 속성들은 커스텀 스타일링과 이벤트 처리를 위해 메뉴의 내부 DOM 구조에 직접 접근할 수 있게 합니다.

| 속성                      | 타입             | 설명 |
| ------------------------- | ---------------- | ---- |
| `dropdownMenuEl`          | `HTMLDivElement` | 최외곽 요소, 뷰포트 전체(또는 커스텀 컨테이너 전체)를 덮음, `pointer-events: none` |
| `dropdownMenuContainerEl` | `HTMLDivElement` | 위치 컨테이너, 배치·콘텐츠 정렬·전환 애니메이션 담당 |

**DOM 구조:**

```
dropdownMenuEl (fixed 뷰포트 전체 레이어, pointer-events: none)
└── dropdownMenuContainerEl (위치 + 전환 애니메이션 + 콘텐츠 정렬)
    └── [사용자가 제공한 콘텐츠]
```

---

### 인스턴스 메서드

#### `apply()`

모든 속성 상태를 DOM에 동기화합니다: 콘텐츠, 마운트 컨테이너, 표시 여부, 위치. 속성을 변경한 후 호출하세요.

```javascript
ddInstance.area = getArea(btEl);
ddInstance.show = true;
ddInstance.apply();
```

#### `mount()`

메뉴를 `container` 요소(설정하지 않으면 `document.body`)에 수동으로 마운트합니다. 표시 시 자동으로 호출되므로 직접 호출할 일은 거의 없습니다.

#### `unmount()`

메뉴를 DOM에서 수동으로 제거합니다. 숨김 전환이 끝나면 자동으로 호출됩니다 — 애니메이션이 비활성화된 경우에는 즉시 호출됩니다.

#### `destroy()`

인스턴스를 파괴하고 DOM 요소와 모든 이벤트 리스너를 제거합니다. 파괴 후에는 인스턴스를 사용하면 안 됩니다.

```javascript
ddInstance.destroy();
// 이후 ddInstance에 접근하지 마세요
```

---

## CSS 클래스 참조

라이브러리가 생성하는 핵심 클래스 이름:

| 클래스                                         | 설명 |
| ---------------------------------------------- | ---- |
| `.dumogu-dropdown-menu-body`                   | 최외곽 컨테이너 (fixed 뷰포트 전체, `pointer-events: none`) |
| `.dumogu-dropdown-menu-body_show`              | 표시 상태 클래스 (루트에 추가되어 애니메이션 트리거) |
| `.dumogu-dropdown-menu-body_custom-parent`     | `document.body` 대신 커스텀 `container`에 마운트될 때 추가됨 (absolute, 컨테이너 전체 채움) |
| `.dumogu-dropdown-menu-body_container`         | 위치 컨테이너 (absolute, 전환 애니메이션 호스팅) |
| `.dumogu-dropdown-menu-body_container_align-left` / `_align-right` | 수평 콘텐츠 정렬 — 대상 영역에 가까운 쪽에 고정 |
| `.dumogu-dropdown-menu-body_container_align-top` / `_align-bottom` | 수직 콘텐츠 정렬 — 대상 영역에 가까운 쪽에 고정 |

라이브러리는 **테마를 제공하지 않습니다**. 콘텐츠 스타일은 완전히 자유롭게; 위치 컨테이너의 직계 자식은 자동으로 `max-width/max-height: 100%`, `overflow: auto`, `pointer-events: initial`을 받습니다.

---

## 완전한 예제

프로덕션에서 사용할 수 있는 예제입니다:

- 버튼 클릭으로 메뉴 토글
- 외부 클릭 시 닫기
- 프레임 단위 위치 추적
- 데이터 바인딩된 메뉴 항목
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
    area: getArea(btEl),
    show: false,
    offset: 12, // 버튼과 12px 간격 유지
});

// 버튼 클릭으로 토글
btEl.addEventListener('click', () => {
    if (!ddInstance.show) {
        // 데이터 바인딩된 항목 동적 생성
        const menu = document.createElement('div');
        menu.className = 'my-menu';
        [
            { label: '옵션 A', data: { id: 1 } },
            { label: '옵션 B', data: { id: 2 } },
        ].forEach(({ label, data }) => {
            const item = document.createElement('div');
            item.className = 'my-menu_item';
            item.textContent = label;
            item.onclick = () => {
                ddInstance.show = false;
                ddInstance.apply();
                console.log('선택됨:', data);
            };
            menu.appendChild(item);
        });
        ddInstance.content = menu;
    }
    ddInstance.area = getArea(btEl);
    ddInstance.show = !ddInstance.show;
    ddInstance.apply();
});

// 외부 클릭 시 닫기
document.addEventListener('click', (e) => {
    if (!ddInstance.show || ddInstance.isDestroyed) return;
    if (
        !ddInstance.dropdownMenuContainerEl.contains(e.target) &&
        !btEl.contains(e.target)
    ) {
        ddInstance.show = false;
        ddInstance.apply();
    }
});

// 버튼 위치를 프레임마다 추적
function updateLoop() {
    requestAnimationFrame(() => {
        if (!ddInstance.isDestroyed) {
            ddInstance.area = getArea(btEl);
            ddInstance.apply();
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

메뉴의 방향과 크기는 두 단계로 결정됩니다:

1. **방향 감지** — 대상 영역의 양쪽 남은 공간을 비교합니다. 메뉴는 공간이 더 많은 쪽으로 열립니다:
   - 수평: `오른쪽 공간 > 왼쪽 공간` → 오른쪽으로 확장, 그렇지 않으면 왼쪽
   - 수직: `아래 공간 > 위 공간` → 아래로 확장, 그렇지 않으면 위

2. **주 축** — 일반적으로 대상 영역의 가로세로 비율과 사용 가능한 공간의 가로세로 비율을 비교하여 결정됩니다(넓은 영역은 세로 기준 크기 선호, 그 반대도 마찬가지). `displayAreaLimit`로 강제할 수 있습니다: `'vertical'`은 수직 여유 공간 기준, `'horizontal'`은 수평 여유 공간 기준.

주축을 따라 메뉴는 선택한 쪽의 여유 공간에서 `offset`을 뺀 만큼 차지합니다; 다른 축에서는 공간 경계부터 대상 영역의 반대쪽 끝까지 걸칩니다. 모든 값은 클램프되어 메뉴가 위치 공간(뷰포트, 또는 `container` 설정 시 해당 컨테이너 박스)을 벗어나지 않습니다.

---

## 전환 애니메이션

표시/숨김 애니메이션은 `.dumogu-dropdown-menu-body_show` 클래스로 트리거되는 CSS 전환으로 처리됩니다:

- **숨김**: `transform: scale(0); opacity: 0;`
- **표시**: `transform: scale(1); opacity: 1;`
- **지속 시간**: `0.2s`
- **속성**: `transform`, `opacity`
- **transform-origin**: 확장 방향에 따라 동적으로 설정됩니다 (예: 오른쪽-아래로 확장 시 `left top`)

`isTransitioning` 속성은 전환이 진행 중인지 나타냅니다. 중단된 전환도 처리됩니다: 전환이 취소되면(`transitioncancel`) 종료된 것으로 취급하여, 숨겨진 메뉴는 절대 발생하지 않는 `transitionend`를 기다리지 않고 즉시 언마운트됩니다.

---

## 보안 참고

문자열로 설정된 `content`는 `innerHTML`로 할당됩니다. **신뢰할 수 없거나 사용자 출처의 입력으로 이 문자열을 절대 구성하지 마세요** — XSS 벡터가 됩니다. 동적 데이터는 `textContent` / `createElement`로 `HTMLElement`를 구성하고 요소 형태의 `content`로 전달하여, HTML 구조가 정적이고 통제 가능한 상태로 유지하세요.

---

## 접근성 참고

이 라이브러리는 의도적으로 키보드 및 ARIA 처리를 제공하지 않습니다 — 위치 지정/표시-숨김 프리미티브입니다. 실제 메뉴에서는 최소한 다음을 직접 처리해야 합니다: `Escape`로 닫기, 방향키 탐색, `role="menu"` / `role="menuitem"` 속성, 포커스 관리.

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
    content: '<div>Menu</div>',
    area: {
        start: [0, 0],
        end: [100, 50],
        width: 100,
        height: 50,
    },
    offset: 8,
    displayAreaLimit: 'vertical',
    show: true,
};

const instance = new DumoguDropdownMenu(options);
```

---

## 라이선스

MIT
