## Documentation

- [English](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/README.md)
- [简体中文](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.zh-CN.md)
- [한국어](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.ko.md)
- [日本語](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.ja.md)

---

## Introduction

dumogu-dropdown-menu is a lightweight JavaScript dropdown menu library, under 5KB after bundling. It provides core positioning logic and show/hide behavior, **without imposing any UI styles** — you have full control over the menu's appearance.

[Live DEMO](https://wurencaideli.github.io/dumogu-dropdown-menu/demo.html)

### Features

- **Ultra-lightweight**: < 5KB bundled, zero dependencies
- **Style-free**: The library only handles positioning and transition animations; menu styling is entirely up to you
- **Auto-positioning**: Automatically determines the best expansion direction based on the target area's position in the viewport, with the primary sizing axis picked from the area's aspect ratio
- **Direction hints**: Optionally force vertical/horizontal expansion via `displayAreaLimit`, and keep a gap from the target area via `offset`
- **Built-in transitions**: Scale + opacity transition animations triggered via CSS class toggling
- **TypeScript support**: Complete type declarations included
- **Multi-format output**: ESM, CJS, and UMD builds available

---

## Installation

```bash
npm install dumogu-dropdown-menu
```

---

## Usage

### Module Imports

```javascript
// ESM
import { DumoguDropdownMenu } from 'dumogu-dropdown-menu';

// CommonJS
const { DumoguDropdownMenu } = require('dumogu-dropdown-menu');
```

### Browser Script Tag

```html
<link rel="stylesheet" href="./dist/dumogu-dropdown-menu.css" />
<script src="./dist/dumogu-dropdown-menu.umd.js"></script>
<script>
    const { DumoguDropdownMenu } = window['dumogu-dropdown-menu'];
</script>
```

---

## Quick Start

```javascript
import { DumoguDropdownMenu } from 'dumogu-dropdown-menu';
import 'dumogu-dropdown-menu/dist/dumogu-dropdown-menu.css';

// Get the trigger button's bounding rect
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

// Create an instance (shown immediately)
const ddInstance = new DumoguDropdownMenu({
    content: '<div class="my-menu-item">Menu Item 1</div>',
    area: getArea(btEl),
    show: true,
});

// Toggle visibility on button click
btEl.addEventListener('click', () => {
    ddInstance.area = getArea(btEl); // refresh the target area
    ddInstance.show = !ddInstance.show;
    ddInstance.apply(); // sync property changes to the DOM
});
```

> **Key idea**: the instance exposes plain properties (`content`, `area`, `show`, `container`, `displayAreaLimit`, `offset`). Assign them, then call `apply()` to sync everything to the DOM. There are no setter methods.

---

## API Reference

### `new DumoguDropdownMenu(options)`

Creates a new dropdown menu instance.

**`options` parameters:**

| Parameter          | Type                                    | Default | Description |
| ------------------ | --------------------------------------- | ------- | ----------- |
| `content`          | `string \| HTMLElement`                 | `''`    | Menu content — an HTML string or a single DOM element |
| `area`             | `AreaOption`                            | `{}`    | Target area used to compute where the menu expands |
| `show`             | `boolean`                               | `false` | Whether to show the menu immediately |
| `container`        | `HTMLElement`                           | —       | Element to mount the menu into; when omitted the menu mounts to `document.body`. The container should have non-static positioning (e.g. `position: relative`) |
| `displayAreaLimit` | `'vertical' \| 'horizontal' \| ''`      | `''`    | Force the primary sizing axis: `'vertical'` sizes by height, `'horizontal'` by width; empty auto-detects from the area's aspect ratio |
| `offset`           | `number`                                | `0`     | Gap (px) kept between the menu and the target area along the primary axis; negative values are treated as `0` |

**`AreaOption` type:**

| Property | Type                   | Description                                              |
| -------- | ---------------------- | -------------------------------------------------------- |
| `start`  | `[number, number]`     | Top-left corner of the target area `[x, y]` (viewport coordinates) |
| `end`    | `[number, number]`     | Bottom-right corner of the target area `[x, y]` (viewport coordinates) |
| `width`  | `number`               | Width of the target area — used for the aspect-ratio comparison in auto mode |
| `height` | `number`               | Height of the target area                                |

---

### Static Properties

#### `DumoguDropdownMenu.baseZIndex`

Base value of the z-index counter, default `999`. Every mounted menu takes the next number so recently opened menus stack on top. Change it before creating/showing instances if `999` conflicts with your page. The counter resets to the base once no menu is mounted.

---

### Instance Properties

All properties are plain fields: assign a new value, then call `apply()`.

#### `show`

Whether the menu is (about to be) visible. Type: `boolean`.

#### `content`

Current menu content. Type: `string | HTMLElement | undefined`. Setting the same element reference again re-attaches it if it was moved away externally.

#### `area`

Current target area used for positioning. Type: `AreaOption`. Coordinates are always viewport-based, even when a custom `container` is used — the library converts them for you.

#### `container`

Current mount element — `undefined` means `document.body`. Changing it while mounted relocates the menu immediately (on the next `apply()`).

#### `displayAreaLimit`

Current primary-axis override. Type: `'vertical' | 'horizontal' | ''`.

#### `offset`

Current gap (px) between the menu and the target area along the primary axis. Type: `number`.

#### `isTransitioning`

Read-only-ish flag indicating whether a show/hide transition is currently in progress. Type: `boolean`.

#### `isMounted`

Indicates whether the menu is currently mounted in the DOM. Type: `boolean`.

#### `isDestroyed`

Indicates whether the instance has been destroyed. Type: `boolean`.

---

### DOM Element References

These properties provide direct access to the menu's internal DOM structure for custom styling and event handling.

| Property                  | Type             | Description                                                      |
| ------------------------- | ---------------- | ---------------------------------------------------------------- |
| `dropdownMenuEl`          | `HTMLDivElement` | Outermost container, fixed full-viewport (or filling the custom container), `pointer-events: none` |
| `dropdownMenuContainerEl` | `HTMLDivElement` | Positioning container, handles placement, alignment and the transform animation |

**DOM structure:**

```
dropdownMenuEl (fixed full-viewport layer, pointer-events: none)
└── dropdownMenuContainerEl (positioned + transform animation, content alignment)
    └── [user-supplied content]
```

---

### Instance Methods

#### `apply()`

Syncs all property state to the DOM: content, mount container, visibility and position. Call it after changing any property.

```javascript
ddInstance.area = getArea(btEl);
ddInstance.show = true;
ddInstance.apply();
```

#### `mount()`

Manually mounts the menu into the `container` element (or `document.body` when no container is set). This is called automatically when showing, so you rarely need to invoke it directly.

#### `unmount()`

Manually removes the menu from the DOM. Called automatically after the hide transition ends — or immediately when animations are disabled.

#### `destroy()`

Destroys the instance, removing DOM elements and all event listeners. The instance should not be used after destruction.

```javascript
ddInstance.destroy();
// Do not access ddInstance after this point
```

---

## CSS Class Reference

Core class names generated by the library:

| Class                                          | Description                                                    |
| ---------------------------------------------- | -------------------------------------------------------------- |
| `.dumogu-dropdown-menu-body`                   | Outermost container (fixed full-viewport, `pointer-events: none`) |
| `.dumogu-dropdown-menu-body_show`              | Show-state class (added to the root to trigger the animation)  |
| `.dumogu-dropdown-menu-body_custom-parent`     | Added when the menu is mounted into a custom `container` instead of `document.body` (absolute, fills the container) |
| `.dumogu-dropdown-menu-body_container`         | Positioning container (absolute, hosts the transform animation) |
| `.dumogu-dropdown-menu-body_container_align-left` / `_align-right` | Horizontal content alignment — pinned to the edge nearest the target area |
| `.dumogu-dropdown-menu-body_container_align-top` / `_align-bottom` | Vertical content alignment — pinned to the edge nearest the target area |

The library ships **no theme**. Style your content however you like; the container's direct children get `max-width/max-height: 100%`, `overflow: auto` and `pointer-events: initial` automatically.

---

## Complete Example

A production-ready example demonstrating:

- Toggle menu on button click
- Close on outside click
- Per-frame position tracking
- Menu items with custom data binding
- Cleanup on destroy

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

// Create instance
const ddInstance = new DumoguDropdownMenu({
    area: getArea(btEl),
    show: false,
    offset: 12, // keep a 12px gap from the button
});

// Toggle on button click
btEl.addEventListener('click', () => {
    if (!ddInstance.show) {
        // Dynamically build items with data binding
        const menu = document.createElement('div');
        menu.className = 'my-menu';
        [
            { label: 'Option A', data: { id: 1 } },
            { label: 'Option B', data: { id: 2 } },
        ].forEach(({ label, data }) => {
            const item = document.createElement('div');
            item.className = 'my-menu_item';
            item.textContent = label;
            item.onclick = () => {
                ddInstance.show = false;
                ddInstance.apply();
                console.log('Selected:', data);
            };
            menu.appendChild(item);
        });
        ddInstance.content = menu;
    }
    ddInstance.area = getArea(btEl);
    ddInstance.show = !ddInstance.show;
    ddInstance.apply();
});

// Close on outside click
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

// Continuously track button position
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

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    ddInstance.destroy();
});
```

---

## Position Calculation

The menu's direction and size are determined in two steps:

1. **Direction detection** — compares the remaining space on each side of the target area. The menu opens toward the side with more room:
   - Horizontal: if `right space > left space` → expand right, otherwise left
   - Vertical: if `bottom space > top space` → expand down, otherwise up

2. **Primary axis** — normally picked by comparing the target area's aspect ratio with the available space's aspect ratio (a wide area favors a vertically-sized menu and vice versa). `displayAreaLimit` overrides this: `'vertical'` sizes by the vertical free space, `'horizontal'` by the horizontal free space.

Along the primary axis the menu takes the free space of the chosen side minus `offset`; along the other axis it spans from the space boundary to the far end of the target area. Values are clamped so the menu never leaves the positioning space (the viewport, or the custom container's box when `container` is set).

---

## Transition Animation

Show/hide animations are handled via CSS transitions triggered by the `.dumogu-dropdown-menu-body_show` class:

- **Hidden**: `transform: scale(0); opacity: 0;`
- **Visible**: `transform: scale(1); opacity: 1;`
- **Duration**: `0.2s`
- **Properties**: `transform`, `opacity`
- **transform-origin**: dynamically set based on expansion direction (e.g., `left top` when expanding right-downward)

The `isTransitioning` property indicates whether a transition is currently in progress. Interrupted transitions are handled too: when one is cancelled (`transitioncancel`), it is treated as finished — a hidden menu unmounts right away instead of waiting for a `transitionend` that never fires.

---

## Security Notes

`content` set as a string is assigned with `innerHTML`. **Never build that string from untrusted or user-originated input** — it would be an XSS vector. For dynamic data, build an `HTMLElement` with `textContent` / `createElement` and pass it as the element form of `content`, keeping any HTML structure static and under your control.

---

## Accessibility Notes

The library intentionally ships no keyboard or ARIA handling — it is a positioning/show-hide primitive. For real menus you should handle at least: `Escape` to close, arrow-key navigation, `role="menu"` / `role="menuitem"` attributes and focus management.

---

## TypeScript Support

Full type declarations are included out of the box:

```typescript
import type {
    DumoguDropdownMenuOptions,  // Constructor options type
    AreaOption                  // Area parameter type
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

## License

MIT
