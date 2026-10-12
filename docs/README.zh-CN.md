[English](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/README.md) | [简体中文](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.zh-CN.md) | [한국어](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.ko.md) | [日本語](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.ja.md)

## 介绍

dumogu-dropdown-menu 是一个轻量的 JavaScript 下拉菜单库，打包后不足 5KB。它只提供核心的定位逻辑和显示/隐藏行为，**不强加任何 UI 样式** —— 菜单的外观完全由你掌控。

[在线 DEMO](https://wurencaideli.github.io/dumogu-dropdown-menu/demo.html)

### 特性

- **超轻量**：打包后 < 5KB，零依赖
- **无样式侵入**：库只负责定位和过渡动画，菜单样式完全由你决定
- **自动定位**：根据目标区域在视口中的位置自动判断最佳展开方向，并按区域宽高比自动选择主尺寸轴
- **方向控制**：可通过 `displayAreaLimit` 强制纵向/横向显示，通过 `offset` 与触发区域保持间距
- **内置过渡**：通过 CSS 类名切换触发的缩放 + 透明度过渡动画
- **TypeScript 支持**：附带完整的类型声明
- **多格式产物**：提供 ESM、CJS 和 UMD 三种构建产物

---

## 安装

```bash
npm install dumogu-dropdown-menu
```

---

## 使用方式

### 模块导入

```javascript
// ESM
import { DumoguDropdownMenu } from 'dumogu-dropdown-menu';

// CommonJS
const { DumoguDropdownMenu } = require('dumogu-dropdown-menu');
```

### 浏览器 script 标签

```html
<link rel="stylesheet" href="./dist/dumogu-dropdown-menu.css" />
<script src="./dist/dumogu-dropdown-menu.umd.js"></script>
<script>
    const { DumoguDropdownMenu } = window['dumogu-dropdown-menu'];
</script>
```

---

## 快速开始

```javascript
import { DumoguDropdownMenu } from 'dumogu-dropdown-menu';
import 'dumogu-dropdown-menu/dist/dumogu-dropdown-menu.css';

// 获取触发按钮的区域
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

// 创建实例(立即显示)
const ddInstance = new DumoguDropdownMenu({
    content: '<div class="my-menu-item">菜单项 1</div>',
    area: getArea(btEl),
    show: true,
});

// 点击按钮切换显示/隐藏
btEl.addEventListener('click', () => {
    ddInstance.area = getArea(btEl); // 刷新触发区域
    ddInstance.show = !ddInstance.show;
    ddInstance.apply(); // 把属性变更同步到 DOM
});
```

> **核心用法**：实例暴露的都是普通属性（`content`、`area`、`show`、`container`、`displayAreaLimit`、`offset`）。先赋值，再调用 `apply()` 同步到 DOM。没有 setter 方法。

---

## API 参考

### `new DumoguDropdownMenu(options)`

创建一个下拉菜单实例。

**`options` 参数：**

| 参数               | 类型                                    | 默认值  | 说明 |
| ------------------ | --------------------------------------- | ------- | ---- |
| `content`          | `string \| HTMLElement`                 | `''`    | 菜单内容,可以是 HTML 文本或单个 DOM 元素 |
| `area`             | `AreaOption`                            | `{}`    | 用于计算菜单展开位置的目标区域 |
| `show`             | `boolean`                               | `false` | 是否立即显示 |
| `container`        | `HTMLElement`                           | —       | 挂载的容器元素,不传时挂载到 `document.body`。容器需要是非 static 定位（如 `position: relative`） |
| `displayAreaLimit` | `'vertical' \| 'horizontal' \| ''`      | `''`    | 强制主尺寸轴：`'vertical'` 以高度为准、`'horizontal'` 以宽度为准；留空时按区域宽高比自动识别 |
| `offset`           | `number`                                | `0`     | 菜单与触发区域沿主轴保持的间距(px),负值按 0 处理 |

**`AreaOption` 类型：**

| 属性     | 类型                   | 说明 |
| -------- | ---------------------- | ---- |
| `start`  | `[number, number]`     | 区域左上角坐标 `[x, y]`（视口坐标） |
| `end`    | `[number, number]`     | 区域右下角坐标 `[x, y]`（视口坐标） |
| `width`  | `number`               | 区域宽度 —— 自动模式下用于宽高比比较 |
| `height` | `number`               | 区域高度 |

---

### 静态属性

#### `DumoguDropdownMenu.baseZIndex`

z-index 计数的基础值,默认 `999`。每次挂载都领取下一个编号,后打开的菜单叠在上层。如果 `999` 与页面层级冲突,可在创建/显示实例前修改。当没有任何菜单挂载时,计数会重置回基础值。

---

### 实例属性

所有属性都是普通字段：赋新值后调用 `apply()` 生效。

#### `show`

菜单是否显示（或即将显示）。类型：`boolean`。

#### `content`

当前菜单内容。类型：`string | HTMLElement | undefined`。传入同一个元素引用时,如果它被外部移走了,再次赋值会重新挂载。

#### `area`

当前用于定位的目标区域。类型：`AreaOption`。坐标始终是视口坐标,即使设置了自定义 `container` 也不需要换算 —— 库会自动转换。

#### `container`

当前挂载元素 —— `undefined` 表示 `document.body`。挂载状态下修改会在下一次 `apply()` 时立即迁移。

#### `displayAreaLimit`

当前主轴强制方向。类型：`'vertical' | 'horizontal' | ''`。

#### `offset`

当前菜单与触发区域沿主轴的间距(px)。类型：`number`。

#### `isTransitioning`

指示显示/隐藏过渡是否正在进行。类型：`boolean`。

#### `isMounted`

指示菜单当前是否挂载在 DOM 中。类型：`boolean`。

#### `isDestroyed`

指示实例是否已销毁。类型：`boolean`。

---

### DOM 元素引用

这些属性提供对菜单内部 DOM 结构的直接访问,方便自定义样式和事件处理。

| 属性                      | 类型             | 说明 |
| ------------------------- | ---------------- | ---- |
| `dropdownMenuEl`          | `HTMLDivElement` | 最外层元素,固定铺满视口（或铺满自定义容器）,`pointer-events: none` |
| `dropdownMenuContainerEl` | `HTMLDivElement` | 定位容器,负责摆放位置、内容对齐和过渡动画 |

**DOM 结构：**

```
dropdownMenuEl (fixed 铺满视口, pointer-events: none)
└── dropdownMenuContainerEl (定位 + 过渡动画 + 内容对齐)
    └── [使用者提供的内容]
```

---

### 实例方法

#### `apply()`

把所有属性状态同步到 DOM：内容、挂载容器、显示状态和位置。修改任意属性后调用。

```javascript
ddInstance.area = getArea(btEl);
ddInstance.show = true;
ddInstance.apply();
```

#### `mount()`

手动把菜单挂载到 `container` 元素（未设置时挂到 `document.body`）。显示时会自动调用,一般无需手动调用。

#### `unmount()`

手动把菜单从 DOM 移除。隐藏过渡结束后自动调用 —— 动画被禁用时则立即调用。

#### `destroy()`

销毁实例,移除 DOM 元素和所有事件监听。销毁后不应再使用该实例。

```javascript
ddInstance.destroy();
// 此后不要再访问 ddInstance
```

---

## CSS 类名参考

库生成的核心类名：

| 类名                                           | 说明 |
| ---------------------------------------------- | ---- |
| `.dumogu-dropdown-menu-body`                   | 最外层元素（fixed 铺满视口, `pointer-events: none`） |
| `.dumogu-dropdown-menu-body_show`              | 显示状态类名（加在根元素上触发动画） |
| `.dumogu-dropdown-menu-body_custom-parent`     | 挂载到自定义 `container`（而非 `document.body`）时添加（absolute, 铺满容器） |
| `.dumogu-dropdown-menu-body_container`         | 定位容器（absolute, 承载过渡动画） |
| `.dumogu-dropdown-menu-body_container_align-left` / `_align-right` | 水平方向内容对齐 —— 钉在靠近触发区域的一侧 |
| `.dumogu-dropdown-menu-body_container_align-top` / `_align-bottom` | 垂直方向内容对齐 —— 钉在靠近触发区域的一侧 |

库**不带任何主题**。内容样式完全自定义;定位容器的直接子元素会自动获得 `max-width/max-height: 100%`、`overflow: auto` 和 `pointer-events: initial`。

---

## 完整示例

一个生产可用的示例,演示：

- 点击按钮切换菜单
- 点击外部区域关闭
- 逐帧跟踪位置
- 带数据绑定的菜单项
- 销毁清理

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

// 创建实例
const ddInstance = new DumoguDropdownMenu({
    area: getArea(btEl),
    show: false,
    offset: 12, // 与按钮保持 12px 间距
});

// 点击按钮切换
btEl.addEventListener('click', () => {
    if (!ddInstance.show) {
        // 动态生成带数据绑定的菜单项
        const menu = document.createElement('div');
        menu.className = 'my-menu';
        [
            { label: '选项 A', data: { id: 1 } },
            { label: '选项 B', data: { id: 2 } },
        ].forEach(({ label, data }) => {
            const item = document.createElement('div');
            item.className = 'my-menu_item';
            item.textContent = label;
            item.onclick = () => {
                ddInstance.show = false;
                ddInstance.apply();
                console.log('选中：', data);
            };
            menu.appendChild(item);
        });
        ddInstance.content = menu;
    }
    ddInstance.area = getArea(btEl);
    ddInstance.show = !ddInstance.show;
    ddInstance.apply();
});

// 点击其他地方关闭
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

// 逐帧跟踪按钮位置
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

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    ddInstance.destroy();
});
```

---

## 位置计算

菜单的方向和尺寸分两步确定：

1. **方向判断** —— 比较目标区域两侧的剩余空间,朝空间更大的一侧展开：
   - 水平：右侧空间 > 左侧空间 → 向右展开,否则向左
   - 垂直：下方空间 > 上方空间 → 向下展开,否则向上

2. **主尺寸轴** —— 通常通过比较目标区域宽高比与可用空间宽高比来确定（宽的区域倾向纵向定尺寸,反之亦然）。`displayAreaLimit` 可以强制覆盖：`'vertical'` 按垂直剩余空间定尺寸,`'horizontal'` 按水平剩余空间定尺寸。

沿主轴,菜单占据展开侧的剩余空间减去 `offset`;沿另一轴,从空间边界一直包到目标区域的远端。所有值都做了钳制,菜单不会越出定位空间（视口,或设置 `container` 时该容器的盒子）。

---

## 过渡动画

显示/隐藏动画通过 `.dumogu-dropdown-menu-body_show` 类名触发的 CSS 过渡实现：

- **隐藏**：`transform: scale(0); opacity: 0;`
- **显示**：`transform: scale(1); opacity: 1;`
- **时长**：`0.2s`
- **属性**：`transform`、`opacity`
- **transform-origin**：按展开方向动态设置（如向右下展开时为 `left top`）

`isTransitioning` 属性指示过渡是否正在进行。被中断的过渡也有处理:过渡被取消（`transitioncancel`）时按结束对待 —— 隐藏状态的菜单直接卸载,不会等待一个永远不会触发的 `transitionend`。

---

## 安全说明

字符串形式的 `content` 通过 `innerHTML` 赋值。**永远不要用不可信的或来自用户的输入拼接这个字符串** —— 那会成为 XSS 注入点。动态数据请用 `textContent` / `createElement` 构建 `HTMLElement`,以元素形式传入 `content`,让 HTML 结构保持静态且在你的控制之下。

---

## 可访问性说明

库有意不提供键盘和 ARIA 处理 —— 它只是一个定位/显示隐藏原语。真实的菜单场景至少应自行处理:`Escape` 关闭、方向键导航、`role="menu"` / `role="menuitem"` 属性和焦点管理。

---

## TypeScript 支持

开箱即用的完整类型声明：

```typescript
import type {
    DumoguDropdownMenuOptions,  // 构造参数类型
    AreaOption                  // 区域参数类型
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

## 许可证

MIT
