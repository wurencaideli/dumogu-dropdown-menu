[English](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/README.md) | [简体中文](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.zh-CN.md) | [한국어](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.ko.md) | [日本語](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.ja.md)

## 介绍

dumogu-dropdown-menu 是一个轻量的 JavaScript 下拉菜单库，打包后不足 5KB。它只提供核心的定位逻辑和显示/隐藏行为，**不强加任何 UI 样式** —— 菜单的外观完全由你掌控。

[在线 DEMO](https://wurencaideli.github.io/dumogu-dropdown-menu/demo.html)

### 特性

- **超轻量**：打包后 < 5KB，零依赖
- **无样式侵入**：库只负责定位和过渡动画，菜单样式完全由你决定
- **自动定位**：根据目标元素在视口中的位置自动判断最佳展开方向（四个方向，并做精度优化）
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

## 快速上手

```javascript
import { DumoguDropdownMenu } from 'dumogu-dropdown-menu';
import 'dumogu-dropdown-menu/dist/dumogu-dropdown-menu.css';

// 获取触发按钮的边界矩形
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
    content: '<div class="my-menu-item">菜单项 1</div>',
    area: getArea(btEl),
    show: true,
});

// 添加默认主题类名（可选 —— 你也可以使用完全自定义的样式）
ddInstance.dropdownMenuContainerTargetEl.classList.add('dumogu-dropdown-menu-theme');

// 保存触发元素的引用，便于后续更新位置
ddInstance.targetEl = btEl;

// 点击按钮时切换显示/隐藏
btEl.addEventListener('click', () => {
    ddInstance.area = getArea(btEl);
    ddInstance.show = !ddInstance.show;
});
```

---

## API 参考

### `new DumoguDropdownMenu(options)`

创建一个新的下拉菜单实例。

**`options` 参数：**

| 参数       | 类型                                      | 默认值  | 说明                                                |
| ---------   | ----------------------------------------- | ------- | ---------------------------------------------------------- |
| `content`   | `string \| HTMLElement \| HTMLElement[]`   | `''`    | 菜单内容 —— HTML 字符串、单个 DOM 元素或元素数组 |
| `area`      | `AreaOption`                              | `{}`    | 用于计算菜单展开位置的目标区域    |
| `show`      | `boolean`                                 | `false` | 是否立即显示菜单                       |
| `container` | `HTMLElement`                             | —       | 菜单的挂载元素；不传时挂载到 `document.body`。该容器应为非 static 定位（如 `position: relative`） |

**`AreaOption` 类型：**

| 属性    | 类型       | 说明                                              |
| -------- | ---------- | -------------------------------------------------------- |
| `start`  | `number[]` | 目标区域左上角坐标 `[x, y]`（相对于视口） |
| `end`    | `number[]` | 目标区域右下角坐标 `[x, y]`（相对于视口） |
| `width`  | `number`   | 目标区域的宽度                                  |
| `height` | `number`   | 目标区域的高度                                 |

---

### 实例属性

#### `show`

获取或设置菜单的可见性。

```javascript
// 显示菜单
ddInstance.show = true;

// 隐藏菜单
ddInstance.show = false;

// 切换
ddInstance.show = !ddInstance.show;

// 读取当前状态
console.log(ddInstance.show); // true | false
```

#### `content`

获取或设置菜单内容。支持三种类型：

```javascript
// 1. HTML 字符串
ddInstance.content = '<div class="item">菜单项</div>';

// 2. 单个 DOM 元素
const el = document.createElement('div');
el.textContent = '菜单项';
ddInstance.content = el;

// 3. DOM 元素数组
const items = [el1, el2, el3];
ddInstance.content = items;
```

设置 `content` 会立即更新 DOM。

#### `area`

获取或设置用于定位的目标区域。菜单会根据该区域和视口尺寸计算展开方向和大小。

```javascript
ddInstance.area = {
    start: [100, 200],  // 触发元素左上角
    end: [300, 250],    // 触发元素右下角
    width: 200,         // 元素宽度
    height: 50,         // 元素高度
};
```

#### `container`

获取或设置菜单的挂载元素。未设置（或设置为 `undefined`）时挂载到 `document.body`；设置后挂载到该元素，并且根元素会添加 `.dumogu-dropdown-menu-body_custom-parent` 类名。挂载状态下更换容器会立即迁移菜单位置。

```javascript
const ddInstance = new DumoguDropdownMenu({
    container: document.getElementById('my-panel'), // 挂载到 #my-panel
    // ...
});

// 之后：移回 body
ddInstance.container = undefined;
```

> **注意：** 自定义容器应为非 static 定位（如 `position: relative`），因为菜单使用绝对定位并以 `100%` × `100%` 填充容器。此时定位基于容器区域而非视口计算 —— `area` 坐标仍然是视口坐标，无需做任何改动。

#### `isMounted`

只读。表示菜单当前是否已挂载到 DOM 中。类型：`boolean`。

#### `isDestroyed`

只读。表示实例是否已被销毁。类型：`boolean`。

---

### DOM 元素引用

这些属性提供了菜单内部 DOM 结构的直接访问，可用于自定义样式和事件处理。

| 属性                            | 类型               | 说明                                                          |
| ------------------------------- | ------------------ | -------------------------------------------------------------------- |
| `dropdownMenuEl`                | `HTMLDivElement`   | 最外层容器，fixed 全屏覆盖，`pointer-events: none`       |
| `dropdownMenuContainerEl`       | `HTMLDivElement`   | 定位容器，负责 transform 动画和摆放     |
| `dropdownMenuContainerTargetEl` | `HTMLDivElement`   | 内容容器，承载用户传入的 `content`，`pointer-events: auto` |

**DOM 结构：**

```
dropdownMenuEl (fixed 全屏层，pointer-events: none)
└── dropdownMenuContainerEl (定位 + transform 动画)
    └── dropdownMenuContainerTargetEl (内容包装层，pointer-events: auto)
        └── [用户传入的内容]
```

---

### 实例方法

#### `update()`

手动重新计算并更新菜单位置。当目标元素位置发生变化时调用（如页面滚动、窗口缩放、布局变化）。

```javascript
// 使用 requestAnimationFrame 持续跟踪位置
function loop() {
    requestAnimationFrame(() => {
        ddInstance.area = getArea(btEl);
        ddInstance.update();
        loop();
    });
}
loop();
```

> **为什么要手动更新？** 元素位置变化的原因很多（滚动、布局变化、动画等）。库无法也不应该监控每一种场景。由用户决定何时更新是最高效的方式。

#### `mount()`

手动将菜单挂载到 `container` 元素（未设置容器时挂载到 `document.body`）。设置 `show = true` 时会自动调用，一般无需直接调用。

#### `unmount()`

手动将菜单从 DOM 中移除。当 `show === false` 且过渡动画结束后会自动调用。

#### `destroy()`

销毁实例，移除 DOM 元素和所有事件监听。销毁后不应再使用该实例。

```javascript
ddInstance.destroy();
// 此后不要再访问 ddInstance
```

---

## CSS 类名参考

库生成的核心类名：

| 类名                                           | 说明                                                    |
| --------------------------------------------- | -------------------------------------------------------------- |
| `.dumogu-dropdown-menu-body`                  | 最外层容器（fixed 全屏，`pointer-events: none`） |
| `.dumogu-dropdown-menu-body_show`            | 显示状态类名（添加到 body 上触发动画）           |
| `.dumogu-dropdown-menu-body_custom-parent`   | 菜单挂载到自定义 `container` 而非 `document.body` 时添加（absolute，填充容器） |
| `.dumogu-dropdown-menu-body_container`       | 定位容器（absolute，承载 transform 动画） |
| `.dumogu-dropdown-menu-body_container_target` | 内容容器（`overflow: auto`，`pointer-events: auto`）    |

### 默认主题

库附带一个可选主题，通过 `.dumogu-dropdown-menu-theme` 类名启用：

```javascript
ddInstance.dropdownMenuContainerTargetEl.classList.add('dumogu-dropdown-menu-theme');
```

主题类名：

| 类名                                   | 说明                                |
| ----------------------------------- | ------------------------------------------ |
| `.dumogu-dropdown-menu-theme`       | 主题容器（深色背景、圆角、阴影） |
| `.dumogu-dropdown-menu-theme_item`  | 菜单项（悬停高亮）                |
| `.dumogu-dropdown-menu-theme_active` | 激活/选中的菜单项状态            |

你也可以完全跳过默认主题，直接在 `dropdownMenuContainerTargetEl` 上应用自己的样式。

---

## 完整示例

一个可用于生产的完整示例，演示了：

- 点击按钮切换菜单
- 点击外部区域关闭菜单
- 逐帧位置跟踪
- 菜单项的自定义数据绑定
- 销毁时的清理

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
    content: `
        <div class="dumogu-dropdown-menu-theme_item">菜单项 1</div>
        <div class="dumogu-dropdown-menu-theme_item">菜单项 2</div>
        <div class="dumogu-dropdown-menu-theme_item">菜单项 3</div>
    `,
    area: getArea(btEl),
    show: false,
});

// 应用默认主题
ddInstance.dropdownMenuContainerTargetEl.classList.add('dumogu-dropdown-menu-theme');

// 保存触发元素引用
ddInstance.targetEl = btEl;

// 点击按钮时切换
btEl.addEventListener('click', () => {
    if (!ddInstance.show) {
        // 动态生成带数据绑定的菜单项
        const item1 = document.createElement('div');
        item1.textContent = '选项 A';
        item1.classList.add('dumogu-dropdown-menu-theme_item');
        item1.onclick = () => {
            ddInstance.show = false;
            console.log('选择了选项 A，数据：', { id: 1 });
        };

        const item2 = document.createElement('div');
        item2.textContent = '选项 B';
        item2.classList.add('dumogu-dropdown-menu-theme_item');
        item2.onclick = () => {
            ddInstance.show = false;
            console.log('选择了选项 B，数据：', { id: 2 });
        };

        ddInstance.content = [item1, item2];
    }
    ddInstance.area = getArea(btEl);
    ddInstance.show = !ddInstance.show;
});

// 点击外部区域关闭
document.addEventListener('click', (e) => {
    if (!ddInstance.show || ddInstance.isDestroyed) return;
    if (
        !ddInstance.dropdownMenuContainerTargetEl.contains(e.target) &&
        !ddInstance.targetEl.contains(e.target)
    ) {
        ddInstance.show = false;
    }
});

// 持续跟踪按钮位置
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

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    ddInstance.destroy();
});
```

---

## 位置计算

菜单的展开方向通过两步确定：

1. **方向检测** —— 比较目标元素两侧的剩余空间，菜单朝空间更大的一侧展开：
   - 水平方向：如果 `右侧空间 > 左侧空间` → 向右展开，否则向左
   - 垂直方向：如果 `下方空间 > 上方空间` → 向下展开，否则向上

2. **精度优化** —— 比较目标元素的宽高比与可用空间的宽高比，确定以哪个轴作为主尺寸轴，使菜单尽可能完整地容纳在视口内。

最终的菜单宽高取各方向上较大的可用空间。

---

## 过渡动画

显示/隐藏动画通过 `.dumogu-dropdown-menu-body_show` 类名触发的 CSS 过渡实现：

- **隐藏**：`transform: scale(0); opacity: 0;`
- **显示**：`transform: scale(1); opacity: 1;`
- **时长**：`0.2s`
- **属性**：`transform`、`opacity`
- **transform-origin**：根据展开方向动态设置（如向右下展开时为 `left top`）

`isTransitioning` 属性表示过渡是否正在进行。库内部利用它在隐藏过渡结束后自动调用 `unmount()`。

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
    content: '<div>菜单</div>',
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

## 许可证

MIT
