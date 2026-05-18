## Introduction

dumogu-dropdown-menu is a lightweight JavaScript dropdown menu library, under 5KB after bundling. It provides core positioning logic and show/hide behavior, **without imposing any UI styles** — you have full control over the menu's appearance.

[Live DEMO](https://wurencaideli.github.io/dumogu-dropdown-menu/demo.html)

### Features

- **Ultra-lightweight**: < 5KB bundled, zero dependencies
- **Style-free**: The library only handles positioning and transition animations; menu styling is entirely up to you
- **Auto-positioning**: Automatically determines the best expansion direction based on the target element's position in the viewport (four directions with precision optimization)
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

// Create an instance
const ddInstance = new DumoguDropdownMenu({
    content: '<div class="my-menu-item">Menu Item 1</div>',
    area: getArea(btEl),
    show: true,
});

// Add the default theme class (optional — you can use fully custom styles)
ddInstance.dropdownMenuContainerTargetEl.classList.add('dumogu-dropdown-menu-theme');

// Store a reference to the trigger element for later position updates
ddInstance.targetEl = btEl;

// Toggle visibility on button click
btEl.addEventListener('click', () => {
    ddInstance.area = getArea(btEl);
    ddInstance.show = !ddInstance.show;
});
```

---

## API Reference

### `new DumoguDropdownMenu(options)`

Creates a new dropdown menu instance.

**`options` parameters:**

| Parameter | Type                                      | Default | Description                                                |
| --------- | ----------------------------------------- | ------- | ---------------------------------------------------------- |
| `content` | `string \| HTMLElement \| HTMLElement[]`   | `''`    | Menu content — HTML string, a single DOM element, or an array of elements |
| `area`    | `AreaOption`                              | `{}`    | Target area used to compute where the menu should expand    |
| `show`    | `boolean`                                 | `false` | Whether to show the menu immediately                       |

**`AreaOption` type:**

| Property | Type       | Description                                              |
| -------- | ---------- | -------------------------------------------------------- |
| `start`  | `number[]` | Top-left corner of the target area `[x, y]` (relative to viewport) |
| `end`    | `number[]` | Bottom-right corner of the target area `[x, y]` (relative to viewport) |
| `width`  | `number`   | Width of the target area                                  |
| `height` | `number`   | Height of the target area                                 |

---

### Instance Properties

#### `show`

Gets or sets the menu visibility.

```javascript
// Show the menu
ddInstance.show = true;

// Hide the menu
ddInstance.show = false;

// Toggle
ddInstance.show = !ddInstance.show;

// Read current state
console.log(ddInstance.show); // true | false
```

#### `content`

Gets or sets the menu content. Accepts three types:

```javascript
// 1. HTML string
ddInstance.content = '<div class="item">Menu item</div>';

// 2. Single DOM element
const el = document.createElement('div');
el.textContent = 'Menu item';
ddInstance.content = el;

// 3. Array of DOM elements
const items = [el1, el2, el3];
ddInstance.content = items;
```

Setting `content` immediately updates the DOM.

#### `area`

Gets or sets the target area used for positioning. The menu calculates its expansion direction and size based on this area and the viewport dimensions.

```javascript
ddInstance.area = {
    start: [100, 200],  // top-left of the trigger element
    end: [300, 250],    // bottom-right of the trigger element
    width: 200,         // element width
    height: 50,         // element height
};
```

#### `isMounted`

Read-only. Indicates whether the menu is currently mounted in the DOM. Type: `boolean`.

#### `isDestroyed`

Read-only. Indicates whether the instance has been destroyed. Type: `boolean`.

---

### DOM Element References

These properties provide direct access to the menu's internal DOM structure for custom styling and event handling.

| Property                        | Type               | Description                                                          |
| ------------------------------- | ------------------ | -------------------------------------------------------------------- |
| `dropdownMenuEl`                | `HTMLDivElement`   | Outermost container, fixed full-screen, `pointer-events: none`       |
| `dropdownMenuContainerEl`       | `HTMLDivElement`   | Positioning container, handles transform animation and placement     |
| `dropdownMenuContainerTargetEl` | `HTMLDivElement`   | Content container, holds the user-supplied `content`, `pointer-events: auto` |

**DOM structure:**

```
dropdownMenuEl (fixed full-screen layer, pointer-events: none)
└── dropdownMenuContainerEl (positioned + transform animation)
    └── dropdownMenuContainerTargetEl (content wrapper, pointer-events: auto)
        └── [user-supplied content]
```

---

### Instance Methods

#### `update()`

Manually recalculates and updates the menu position. Call this when the target element's position has changed (e.g., page scroll, window resize, layout shift).

```javascript
// Continuously track position with requestAnimationFrame
function loop() {
    requestAnimationFrame(() => {
        ddInstance.area = getArea(btEl);
        ddInstance.update();
        loop();
    });
}
loop();
```

> **Why manual updates?** Element positions can change for many reasons (scrolling, layout changes, animations, etc.). The library cannot and should not monitor every scenario. Having the user decide when to update is the most efficient approach.

#### `mount()`

Manually mounts the menu into `document.body`. This is called automatically when setting `show = true`, so you rarely need to invoke it directly.

#### `unmount()`

Manually removes the menu from the DOM. Called automatically after the transition ends when `show === false`.

#### `destroy()`

Destroys the instance, removing DOM elements and all event listeners. The instance should not be used after destruction.

```javascript
ddInstance.destroy();
// Do not access ddInstance after this point
```

---

## CSS Class Reference

Core class names generated by the library:

| Class                                         | Description                                                    |
| --------------------------------------------- | -------------------------------------------------------------- |
| `.dumogu-dropdown-menu-body`                  | Outermost container (fixed full-screen, `pointer-events: none`) |
| `.dumogu-dropdown-menu-body_show`            | Show-state class (added to body to trigger animation)           |
| `.dumogu-dropdown-menu-body_container`       | Positioning container (absolute, hosts the transform animation) |
| `.dumogu-dropdown-menu-body_container_target` | Content container (`overflow: auto`, `pointer-events: auto`)    |

### Default Theme

The library ships with an optional theme, activated via the `.dumogu-dropdown-menu-theme` class:

```javascript
ddInstance.dropdownMenuContainerTargetEl.classList.add('dumogu-dropdown-menu-theme');
```

Theme class names:

| Class                               | Description                                |
| ----------------------------------- | ------------------------------------------ |
| `.dumogu-dropdown-menu-theme`       | Theme container (dark background, rounded corners, shadow) |
| `.dumogu-dropdown-menu-theme_item`  | Menu item (hover highlight)                |
| `.dumogu-dropdown-menu-theme_active` | Active/selected menu item state            |

You can skip the default theme entirely and apply your own styles directly on `dropdownMenuContainerTargetEl`.

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
    content: `
        <div class="dumogu-dropdown-menu-theme_item">Menu Item 1</div>
        <div class="dumogu-dropdown-menu-theme_item">Menu Item 2</div>
        <div class="dumogu-dropdown-menu-theme_item">Menu Item 3</div>
    `,
    area: getArea(btEl),
    show: false,
});

// Apply default theme
ddInstance.dropdownMenuContainerTargetEl.classList.add('dumogu-dropdown-menu-theme');

// Store trigger element reference
ddInstance.targetEl = btEl;

// Toggle on button click
btEl.addEventListener('click', () => {
    if (!ddInstance.show) {
        // Dynamically generate items with data binding
        const item1 = document.createElement('div');
        item1.textContent = 'Option A';
        item1.classList.add('dumogu-dropdown-menu-theme_item');
        item1.onclick = () => {
            ddInstance.show = false;
            console.log('Selected Option A, data:', { id: 1 });
        };

        const item2 = document.createElement('div');
        item2.textContent = 'Option B';
        item2.classList.add('dumogu-dropdown-menu-theme_item');
        item2.onclick = () => {
            ddInstance.show = false;
            console.log('Selected Option B, data:', { id: 2 });
        };

        ddInstance.content = [item1, item2];
    }
    ddInstance.area = getArea(btEl);
    ddInstance.show = !ddInstance.show;
});

// Close on outside click
document.addEventListener('click', (e) => {
    if (!ddInstance.show || ddInstance.isDestroyed) return;
    if (
        !ddInstance.dropdownMenuContainerTargetEl.contains(e.target) &&
        !ddInstance.targetEl.contains(e.target)
    ) {
        ddInstance.show = false;
    }
});

// Continuously track button position
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

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    ddInstance.destroy();
});
```

---

## Position Calculation

The menu expansion direction is determined in two steps:

1. **Direction detection** — compares the remaining space on each side of the target element. The menu opens toward the side with more room:
   - Horizontal: if `right space > left space` → expand right, otherwise left
   - Vertical: if `bottom space > top space` → expand down, otherwise up

2. **Precision optimization** — compares the aspect ratio of the target element with the available space's aspect ratio to determine which axis should be the primary sizing axis, ensuring the menu fits as fully as possible within the viewport.

The final menu width and height use the larger available space in each direction.

---

## Transition Animation

Show/hide animations are handled via CSS transitions triggered by the `.dumogu-dropdown-menu-body_show` class:

- **Hidden**: `transform: scale(0); opacity: 0;`
- **Visible**: `transform: scale(1); opacity: 1;`
- **Duration**: `0.2s`
- **Properties**: `transform`, `opacity`
- **transform-origin**: dynamically set based on expansion direction (e.g., `left top` when expanding right-downward)

The `isTransitioning` property indicates whether a transition is currently in progress. The library uses it internally to automatically call `unmount()` after the hide transition completes.

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
    show: true,
};

const instance = new DumoguDropdownMenu(options);
```

---

## License

MIT
