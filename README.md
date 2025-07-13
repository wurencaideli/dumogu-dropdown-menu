## Introduction

A simple drop-down menu js library. Super lightweight, no more than 5kb after packaging.

[DEMO](https://wurencaideli.github.io/dumogu-dropdown-menu/demo.html)

#### install

```javascript
npm install dumogu-dropdown-menu
```

#### How to use

```javascript
import { DumoguDropdownMenu } form 'dumogu-dropdown-menu';
const ddInstance = new DumoguDropdownMenu({
    content: '<div class="menu-item"> Test </div>',
    area: {
        start: [0, 0],
        end: [10, 10],
        width: 10,
        height: 10,
    },
    show: true,
});
ddInstance.dropdownMenuContainerTargetEl.classList.add( // Add default theme class name
    'dumogu-dropdown-menu-theme',
);

/** When the element position changes, manually update the style */
ddInstance.area = /** Position of elements */;
ddInstance.update();

/** Set whether to display */
ddInstance.show = /** true || false */
```