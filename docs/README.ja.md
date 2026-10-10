[English](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/README.md) | [简体中文](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.zh-CN.md) | [한국어](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.ko.md) | [日本語](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.ja.md)

## はじめに

dumogu-dropdown-menu は、バンドル後 5KB 未満の軽量な JavaScript ドロップダウンメニューライブラリです。コアとなる位置計算ロジックと表示/非表示の動作のみを提供し、**UI スタイルを一切強制しません** — メニューの見た目は完全にあなたがコントロールできます。

[ライブデモ](https://wurencaideli.github.io/dumogu-dropdown-menu/demo.html)

### 特徴

- **超軽量**: バンドル後 < 5KB、依存関係なし
- **スタイル不干渉**: ライブラリは位置計算とトランジションアニメーションのみを担当し、メニューのスタイルは完全にあなた次第です
- **自動位置決定**: 対象要素のビューポート内位置に基づき、最適な展開方向を自動判定します（4 方向 + 精度最適化）
- **内蔵トランジション**: CSS クラスの切り替えでトリガーされるスケール + 透明度のトランジションアニメーション
- **TypeScript 対応**: 完全な型定義を同梱
- **マルチフォーマット出力**: ESM、CJS、UMD ビルドを提供

---

## インストール

```bash
npm install dumogu-dropdown-menu
```

---

## 使用方法

### モジュールの読み込み

```javascript
// ESM
import { DumoguDropdownMenu } from 'dumogu-dropdown-menu';

// CommonJS
const { DumoguDropdownMenu } = require('dumogu-dropdown-menu');
```

### ブラウザの script タグ

```html
<link rel="stylesheet" href="./dist/dumogu-dropdown-menu.css" />
<script src="./dist/dumogu-dropdown-menu.umd.js"></script>
<script>
    const { DumoguDropdownMenu } = window['dumogu-dropdown-menu'];
</script>
```

---

## クイックスタート

```javascript
import { DumoguDropdownMenu } from 'dumogu-dropdown-menu';
import 'dumogu-dropdown-menu/dist/dumogu-dropdown-menu.css';

// トリガーボタンの境界矩形を取得
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

// インスタンスを作成
const ddInstance = new DumoguDropdownMenu({
    content: '<div class="my-menu-item">メニュー項目 1</div>',
    area: getArea(btEl),
    show: true,
});

// デフォルトテーマのクラスを追加（任意 — 完全にカスタムスタイルを使うこともできます）
ddInstance.dropdownMenuContainerTargetEl.classList.add('dumogu-dropdown-menu-theme');

// 後の位置更新用にトリガー要素の参照を保存
ddInstance.targetEl = btEl;

// ボタンクリックで表示/非表示を切り替え
btEl.addEventListener('click', () => {
    ddInstance.area = getArea(btEl);
    ddInstance.show = !ddInstance.show;
});
```

---

## API リファレンス

### `new DumoguDropdownMenu(options)`

新しいドロップダウンメニューのインスタンスを作成します。

**`options` パラメータ:**

| パラメータ | 型                                        | デフォルト | 説明                                                |
| ---------   | ----------------------------------------- | ------- | ---------------------------------------------------------- |
| `content`   | `string \| HTMLElement \| HTMLElement[]`   | `''`    | メニューの内容 — HTML 文字列、単一の DOM 要素、または要素の配列 |
| `area`      | `AreaOption`                              | `{}`    | メニューの展開位置を計算するための対象領域    |
| `show`      | `boolean`                                 | `false` | メニューを即座に表示するかどうか                       |
| `container` | `HTMLElement`                             | —       | メニューをマウントする要素。省略した場合は `document.body` にマウントされます。コンテナは static 以外の position（例: `position: relative`）である必要があります |

**`AreaOption` 型:**

| プロパティ | 型        | 説明                                              |
| -------- | ---------- | -------------------------------------------------------- |
| `start`  | `number[]` | 対象領域の左上座標 `[x, y]`（ビューポート基準） |
| `end`    | `number[]` | 対象領域の右下座標 `[x, y]`（ビューポート基準） |
| `width`  | `number`   | 対象領域の幅                                  |
| `height` | `number`   | 対象領域の高さ                                 |

---

### インスタンスプロパティ

#### `show`

メニューの表示状態を取得または設定します。

```javascript
// メニューを表示
ddInstance.show = true;

// メニューを非表示
ddInstance.show = false;

// 切り替え
ddInstance.show = !ddInstance.show;

// 現在の状態を読み取り
console.log(ddInstance.show); // true | false
```

#### `content`

メニューの内容を取得または設定します。3 つの型をサポートします:

```javascript
// 1. HTML 文字列
ddInstance.content = '<div class="item">メニュー項目</div>';

// 2. 単一の DOM 要素
const el = document.createElement('div');
el.textContent = 'メニュー項目';
ddInstance.content = el;

// 3. DOM 要素の配列
const items = [el1, el2, el3];
ddInstance.content = items;
```

`content` を設定すると DOM が即座に更新されます。

#### `area`

位置計算に使用する対象領域を取得または設定します。メニューはこの領域とビューポートの寸法に基づいて展開方向とサイズを計算します。

```javascript
ddInstance.area = {
    start: [100, 200],  // トリガー要素の左上
    end: [300, 250],    // トリガー要素の右下
    width: 200,         // 要素の幅
    height: 50,         // 要素の高さ
};
```

#### `container`

メニューをマウントする要素を取得または設定します。未設定（または `undefined` に設定）の場合は `document.body` にマウントされ、設定した場合はその要素にマウントされ、ルート要素に `.dumogu-dropdown-menu-body_custom-parent` クラスが付与されます。マウント中にコンテナを変更すると、メニューは即座に移動します。

```javascript
const ddInstance = new DumoguDropdownMenu({
    container: document.getElementById('my-panel'), // #my-panel にマウント
    // ...
});

// 後で: body に戻す
ddInstance.container = undefined;
```

> **注意:** カスタムコンテナは static 以外の position（例: `position: relative`）である必要があります。メニューが absolute 位置でコンテナを `100%` × `100%` 埋めるように配置されるためです。この場合、ビューポートではなくコンテナの領域を基準に位置が計算されます — `area` 座標は引き続きビューポート基準なので、利用者側で変更は不要です。

#### `isMounted`

読み取り専用。メニューが現在 DOM にマウントされているかどうかを示します。型: `boolean`。

#### `isDestroyed`

読み取り専用。インスタンスが破棄されたかどうかを示します。型: `boolean`。

---

### DOM 要素の参照

これらのプロパティは、カスタムスタイリングやイベント処理のためにメニューの内部 DOM 構造へ直接アクセスできます。

| プロパティ                        | 型               | 説明                                                          |
| ------------------------------- | ------------------ | -------------------------------------------------------------------- |
| `dropdownMenuEl`                | `HTMLDivElement`   | 最外層コンテナ、fixed で全画面、`pointer-events: none`       |
| `dropdownMenuContainerEl`       | `HTMLDivElement`   | 位置決めコンテナ、transform アニメーションと配置を担当     |
| `dropdownMenuContainerTargetEl` | `HTMLDivElement`   | コンテンツコンテナ、ユーザーが渡した `content` を保持、`pointer-events: auto` |

**DOM 構造:**

```
dropdownMenuEl (fixed 全画面レイヤー、pointer-events: none)
└── dropdownMenuContainerEl (位置決め + transform アニメーション)
    └── dropdownMenuContainerTargetEl (コンテンツラッパー、pointer-events: auto)
        └── [ユーザーが渡したコンテンツ]
```

---

### インスタンスメソッド

#### `update()`

メニューの位置を手動で再計算して更新します。対象要素の位置が変化したとき（ページスクロール、ウィンドウリサイズ、レイアウト変更など）に呼び出してください。

```javascript
// requestAnimationFrame で位置を継続的に追跡
function loop() {
    requestAnimationFrame(() => {
        ddInstance.area = getArea(btEl);
        ddInstance.update();
        loop();
    });
}
loop();
```

> **なぜ手動更新なのか?** 要素の位置はさまざまな理由で変化します（スクロール、レイアウト変更、アニメーションなど）。ライブラリですべてのシナリオを監視することは不可能ですし、すべきでもありません。更新のタイミングをユーザーが決めるのが最も効率的な方法です。

#### `mount()`

メニューを `container` 要素に手動でマウントします（コンテナが未設定の場合は `document.body`）。`show = true` を設定すると自動的に呼ばれるため、直接呼び出す必要はほぼありません。

#### `unmount()`

メニューを DOM から手動で削除します。`show === false` のときトランジション終了後に自動的に呼ばれます。

#### `destroy()`

インスタンスを破棄し、DOM 要素とすべてのイベントリスナーを削除します。破棄後はインスタンスを使用しないでください。

```javascript
ddInstance.destroy();
// この後 ddInstance にはアクセスしないでください
```

---

## CSS クラスリファレンス

ライブラリが生成するコアクラス名:

| クラス                                         | 説明                                                    |
| --------------------------------------------- | -------------------------------------------------------------- |
| `.dumogu-dropdown-menu-body`                  | 最外層コンテナ（fixed 全画面、`pointer-events: none`） |
| `.dumogu-dropdown-menu-body_show`            | 表示状態クラス（body に追加されてアニメーションをトリガー）           |
| `.dumogu-dropdown-menu-body_custom-parent`   | `document.body` ではなくカスタム `container` にマウントされているときに付与（absolute、コンテナを埋める） |
| `.dumogu-dropdown-menu-body_container`       | 位置決めコンテナ（absolute、transform アニメーションを担当） |
| `.dumogu-dropdown-menu-body_container_target` | コンテンツコンテナ（`overflow: auto`、`pointer-events: auto`）    |

### デフォルトテーマ

ライブラリには `.dumogu-dropdown-menu-theme` クラスで有効化するオプションのテーマが同梱されています:

```javascript
ddInstance.dropdownMenuContainerTargetEl.classList.add('dumogu-dropdown-menu-theme');
```

テーマのクラス名:

| クラス                                   | 説明                                |
| ----------------------------------- | ------------------------------------------ |
| `.dumogu-dropdown-menu-theme`       | テーマコンテナ（暗い背景、角丸、影） |
| `.dumogu-dropdown-menu-theme_item`  | メニュー項目（ホバーでハイライト）                |
| `.dumogu-dropdown-menu-theme_active` | アクティブ/選択中のメニュー項目の状態            |

デフォルトテーマを完全に使わず、`dropdownMenuContainerTargetEl` に直接独自のスタイルを適用することもできます。

---

## 完全な例

本番環境で使える完全なサンプルです:

- ボタンクリックでメニューを切り替え
- 外部クリックで閉じる
- フレーム単位の位置追跡
- カスタムデータバインディングを持つメニュー項目
- 破棄時のクリーンアップ

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

// インスタンスを作成
const ddInstance = new DumoguDropdownMenu({
    content: `
        <div class="dumogu-dropdown-menu-theme_item">メニュー項目 1</div>
        <div class="dumogu-dropdown-menu-theme_item">メニュー項目 2</div>
        <div class="dumogu-dropdown-menu-theme_item">メニュー項目 3</div>
    `,
    area: getArea(btEl),
    show: false,
});

// デフォルトテーマを適用
ddInstance.dropdownMenuContainerTargetEl.classList.add('dumogu-dropdown-menu-theme');

// トリガー要素の参照を保存
ddInstance.targetEl = btEl;

// ボタンクリックで切り替え
btEl.addEventListener('click', () => {
    if (!ddInstance.show) {
        // データバインディング付きのメニュー項目を動的に生成
        const item1 = document.createElement('div');
        item1.textContent = 'オプション A';
        item1.classList.add('dumogu-dropdown-menu-theme_item');
        item1.onclick = () => {
            ddInstance.show = false;
            console.log('オプション A が選択されました。データ:', { id: 1 });
        };

        const item2 = document.createElement('div');
        item2.textContent = 'オプション B';
        item2.classList.add('dumogu-dropdown-menu-theme_item');
        item2.onclick = () => {
            ddInstance.show = false;
            console.log('オプション B が選択されました。データ:', { id: 2 });
        };

        ddInstance.content = [item1, item2];
    }
    ddInstance.area = getArea(btEl);
    ddInstance.show = !ddInstance.show;
});

// 外部クリックで閉じる
document.addEventListener('click', (e) => {
    if (!ddInstance.show || ddInstance.isDestroyed) return;
    if (
        !ddInstance.dropdownMenuContainerTargetEl.contains(e.target) &&
        !ddInstance.targetEl.contains(e.target)
    ) {
        ddInstance.show = false;
    }
});

// ボタンの位置を継続的に追跡
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

// ページアンロード時にクリーンアップ
window.addEventListener('beforeunload', () => {
    ddInstance.destroy();
});
```

---

## 位置計算

メニューの展開方向は 2 ステップで決定されます:

1. **方向判定** — 対象要素の両側の残りスペースを比較します。メニューはスペースに余裕のある側に開きます:
   - 水平: `右側のスペース > 左側のスペース` の場合 → 右に展開、そうでなければ左
   - 垂直: `下側のスペース > 上側のスペース` の場合 → 下に展開、そうでなければ上

2. **精度最適化** — 対象要素のアスペクト比と利用可能スペースのアスペクト比を比較し、どちらの軸を主サイズ軸にするかを決めて、メニューができるだけビューポート内に収まるようにします。

最終的なメニューの幅と高さには、各方向でより大きい利用可能スペースが使用されます。

---

## トランジションアニメーション

表示/非表示アニメーションは `.dumogu-dropdown-menu-body_show` クラスによってトリガーされる CSS トランジションで処理されます:

- **非表示**: `transform: scale(0); opacity: 0;`
- **表示**: `transform: scale(1); opacity: 1;`
- **継続時間**: `0.2s`
- **プロパティ**: `transform`、`opacity`
- **transform-origin**: 展開方向に応じて動的に設定（例: 右下に展開する場合は `left top`）

`isTransitioning` プロパティはトランジションが進行中かどうかを示します。ライブラリは内部でこれを利用し、非表示トランジションの完了後に自動的に `unmount()` を呼び出します。

---

## TypeScript サポート

完全な型定義が最初から含まれています:

```typescript
import type {
    DumoguDropdownMenuOptions,  // コンストラクタオプションの型
    AreaOption                  // 領域パラメータの型
} from 'dumogu-dropdown-menu';

import { DumoguDropdownMenu } from 'dumogu-dropdown-menu';

const options: DumoguDropdownMenuOptions = {
    content: '<div>メニュー</div>',
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

## ライセンス

MIT
