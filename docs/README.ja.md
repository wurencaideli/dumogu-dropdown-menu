[English](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/README.md) | [简体中文](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.zh-CN.md) | [한국어](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.ko.md) | [日本語](https://github.com/wurencaideli/dumogu-dropdown-menu/blob/master/docs/README.ja.md)

## はじめに

dumogu-dropdown-menu は、バンドル後 5KB 未満の軽量な JavaScript ドロップダウンメニューライブラリです。コアとなる位置計算ロジックと表示/非表示の動作のみを提供し、**UI スタイルを一切強制しません** — メニューの見た目は完全にあなたがコントロールできます。

[ライブデモ](https://wurencaideli.github.io/dumogu-dropdown-menu/demo.html)

### 特徴

- **超軽量**: バンドル後 < 5KB、依存関係なし
- **スタイル不干渉**: ライブラリは位置計算とトランジションアニメーションのみを担当し、メニューのスタイルは完全にあなた次第です
- **自動位置決定**: 対象エリアのビューポート内位置に基づき最適な展開方向を自動判定し、エリアの縦横比から主軸を自動選択します
- **方向制御**: `displayAreaLimit` で縦/横展開を強制でき、`offset` で対象エリアとの間隔を保てます
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

// トリガーボタンの領域を取得
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

// インスタンス生成(即時表示)
const ddInstance = new DumoguDropdownMenu({
    content: '<div class="my-menu-item">メニュー項目 1</div>',
    area: getArea(btEl),
    show: true,
});

// ボタンクリックで表示/非表示を切り替え
btEl.addEventListener('click', () => {
    ddInstance.area = getArea(btEl); // 対象エリアを更新
    ddInstance.show = !ddInstance.show;
    ddInstance.apply(); // プロパティの変更を DOM に反映
});
```

> **基本的な使い方**: インスタンスは通常のプロパティ(`content`、`area`、`show`、`container`、`displayAreaLimit`、`offset`)を公開します。値を代入してから `apply()` を呼ぶと、すべて DOM に反映されます。setter メソッドはありません。

---

## API リファレンス

### `new DumoguDropdownMenu(options)`

新しいドロップダウンメニューのインスタンスを生成します。

**`options` パラメータ:**

| パラメータ         | 型                                     | デフォルト | 説明 |
| ------------------ | -------------------------------------- | ---------- | ---- |
| `content`          | `string \| HTMLElement`                | `''`       | メニューの内容 — HTML 文字列または単一の DOM 要素 |
| `area`             | `AreaOption`                           | `{}`       | メニューがどこに展開するかを計算する対象エリア |
| `show`             | `boolean`                              | `false`    | 即時表示するかどうか |
| `container`        | `HTMLElement`                          | —          | メニューをマウントする要素;省略時は `document.body` にマウントされます。コンテナは non-static なポジショニングが必要です(例: `position: relative`) |
| `displayAreaLimit` | `'vertical' \| 'horizontal' \| ''`     | `''`       | 主サイジング軸の強制: `'vertical'` は高さ基準、`'horizontal'` は幅基準;空の場合はエリアの縦横比で自動判定します |
| `offset`           | `number`                               | `0`        | 主軸に沿ってメニューと対象エリアの間に保つ間隔(px);負の値は 0 として扱われます |

**`AreaOption` 型:**

| プロパティ | 型                   | 説明 |
| ---------- | -------------------- | ---- |
| `start`    | `[number, number]`   | 対象エリアの左上座標 `[x, y]`(ビューポート座標) |
| `end`      | `[number, number]`   | 対象エリアの右下座標 `[x, y]`(ビューポート座標) |
| `width`    | `number`             | 対象エリアの幅 — 自動モードでの縦横比比較に使用 |
| `height`   | `number`             | 対象エリアの高さ |

---

### 静的プロパティ

#### `DumoguDropdownMenu.baseZIndex`

z-index カウンターの基準値、デフォルトは `999`。マウントのたびに次の番号を取得するため、後から開いたメニューが上に重なります。`999` がページのレイヤーと競合する場合は、インスタンスの生成/表示前に変更してください。マウント中のメニューがひとつもなくなると、カウンターは基準値にリセットされます。

---

### インスタンスプロパティ

すべてのプロパティは通常のフィールドです:新しい値を代入した後、`apply()` を呼んでください。

#### `show`

メニューが表示中(または表示予定)かどうか。型: `boolean`。

#### `content`

現在のメニューの内容。型: `string | HTMLElement | undefined`。要素が外部で移動された場合、同じ参照を再代入すると再マウントされます。

#### `area`

位置計算に使用される現在の対象エリア。型: `AreaOption`。座標はカスタム `container` を使用する場合でも常にビューポート基準です — ライブラリが自動的に変換します。

#### `container`

現在のマウント要素 — `undefined` は `document.body` を意味します。マウント中に変更すると、次の `apply()` で即座に移動します。

#### `displayAreaLimit`

現在の主軸強制方向。型: `'vertical' | 'horizontal' | ''`。

#### `offset`

主軸に沿ったメニューと対象エリアの現在の間隔(px)。型: `number`。

#### `isTransitioning`

表示/非表示トランジションが進行中かどうかを示すフラグ。型: `boolean`。

#### `isMounted`

メニューが現在 DOM にマウントされているかどうか。型: `boolean`。

#### `isDestroyed`

インスタンスが破棄されたかどうか。型: `boolean`。

---

### DOM 要素の参照

これらのプロパティは、カスタムスタイリングとイベント処理のためにメニューの内部 DOM 構造への直接アクセスを提供します。

| プロパティ                 | 型               | 説明 |
| -------------------------- | ---------------- | ---- |
| `dropdownMenuEl`           | `HTMLDivElement` | 最外側の要素。ビューポート全体(またはカスタムコンテナ全体)を覆う、`pointer-events: none` |
| `dropdownMenuContainerEl`  | `HTMLDivElement` | 位置決めコンテナ。配置・コンテンツ整列・トランジションアニメーションを担当 |

**DOM 構造:**

```
dropdownMenuEl (fixed ビューポート全体レイヤー, pointer-events: none)
└── dropdownMenuContainerEl (位置決め + トランジション + コンテンツ整列)
    └── [ユーザーが提供したコンテンツ]
```

---

### インスタンスメソッド

#### `apply()`

すべてのプロパティ状態を DOM に同期します:コンテンツ、マウントコンテナ、表示状態、位置。プロパティを変更した後に呼んでください。

```javascript
ddInstance.area = getArea(btEl);
ddInstance.show = true;
ddInstance.apply();
```

#### `mount()`

メニューを `container` 要素(未設定の場合は `document.body`)に手動でマウントします。表示時に自動的に呼ばれるため、直接呼ぶ必要はほとんどありません。

#### `unmount()`

メニューを DOM から手動で削除します。非表示トランジション終了後に自動的に呼ばれます — アニメーションが無効な場合は即座に呼ばれます。

#### `destroy()`

インスタンスを破棄し、DOM 要素とすべてのイベントリスナーを削除します。破棄後はインスタンスを使用しないでください。

```javascript
ddInstance.destroy();
// この後 ddInstance にアクセスしないでください
```

---

## CSS クラスリファレンス

ライブラリが生成する主要なクラス名:

| クラス                                         | 説明 |
| ---------------------------------------------- | ---- |
| `.dumogu-dropdown-menu-body`                   | 最外側のコンテナ(fixed ビューポート全体、`pointer-events: none`) |
| `.dumogu-dropdown-menu-body_show`              | 表示状態クラス(ルートに追加されてアニメーションをトリガー) |
| `.dumogu-dropdown-menu-body_custom-parent`     | `document.body` ではなくカスタム `container` にマウントするときに追加(absolute、コンテナ全体を埋める) |
| `.dumogu-dropdown-menu-body_container`         | 位置決めコンテナ(absolute、トランジションアニメーションをホスト) |
| `.dumogu-dropdown-menu-body_container_align-left` / `_align-right` | 水平方向のコンテンツ整列 — 対象エリアに近い側に固定 |
| `.dumogu-dropdown-menu-body_container_align-top` / `_align-bottom` | 垂直方向のコンテンツ整列 — 対象エリアに近い側に固定 |

ライブラリは**テーマを一切同梱しません**。コンテンツのスタイルは完全に自由です;位置決めコンテナの直接の子要素は自動的に `max-width/max-height: 100%`、`overflow: auto`、`pointer-events: initial` を受け取ります。

---

## 完全な例

本番で使用できる例です:

- ボタンクリックでメニューをトグル
- 外部クリックで閉じる
- フレームごとの位置追跡
- データバインディングされたメニュー項目
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

// インスタンス生成
const ddInstance = new DumoguDropdownMenu({
    area: getArea(btEl),
    show: false,
    offset: 12, // ボタンとの間隔 12px
});

// ボタンクリックでトグル
btEl.addEventListener('click', () => {
    if (!ddInstance.show) {
        // データバインディングされた項目を動的生成
        const menu = document.createElement('div');
        menu.className = 'my-menu';
        [
            { label: 'オプション A', data: { id: 1 } },
            { label: 'オプション B', data: { id: 2 } },
        ].forEach(({ label, data }) => {
            const item = document.createElement('div');
            item.className = 'my-menu_item';
            item.textContent = label;
            item.onclick = () => {
                ddInstance.show = false;
                ddInstance.apply();
                console.log('選択されました:', data);
            };
            menu.appendChild(item);
        });
        ddInstance.content = menu;
    }
    ddInstance.area = getArea(btEl);
    ddInstance.show = !ddInstance.show;
    ddInstance.apply();
});

// 外部クリックで閉じる
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

// ボタン位置をフレームごとに追跡
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

// ページアンロード時にクリーンアップ
window.addEventListener('beforeunload', () => {
    ddInstance.destroy();
});
```

---

## 位置計算

メニューの方向とサイズは 2 ステップで決定されます:

1. **方向判定** — 対象エリアの両側の残り空間を比較します。メニューは空間が多い側に開きます:
   - 水平: `右の空間 > 左の空間` → 右へ展開、そうでなければ左
   - 垂直: `下の空間 > 上の空間` → 下へ展開、そうでなければ上

2. **主軸** — 通常は対象エリアの縦横比と利用可能な空間の縦横比を比較して決定されます(広いエリアは縦基準のサイジングを好み、その逆も同様)。`displayAreaLimit` で上書きできます: `'vertical'` は垂直の空き空間基準、`'horizontal'` は水平の空き空間基準。

主軸に沿ってメニューは選択した側の空き空間から `offset` を引いた分を占めます;もう一方の軸では、空間の境界から対象エリアの反対側の端までをカバーします。すべての値はクランプされ、メニューが位置空間(ビューポート、または `container` 設定時はそのコンテナのボックス)からはみ出すことはありません。

---

## トランジションアニメーション

表示/非表示アニメーションは `.dumogu-dropdown-menu-body_show` クラスによってトリガーされる CSS トランジションで処理されます:

- **非表示**: `transform: scale(0); opacity: 0;`
- **表示**: `transform: scale(1); opacity: 1;`
- **継続時間**: `0.2s`
- **プロパティ**: `transform`、`opacity`
- **transform-origin**: 展開方向に応じて動的に設定されます(例: 右下へ展開する場合は `left top`)

`isTransitioning` プロパティはトランジションが進行中かどうかを示します。中断されたトランジションも処理されます:トランジションがキャンセルされると(`transitioncancel`)終了扱いとなり、非表示のメニューは決して発生しない `transitionend` を待つことなく即座にアンマウントされます。

---

## セキュリティに関する注意

文字列として設定された `content` は `innerHTML` で代入されます。**信頼できない、またはユーザー由来の入力からこの文字列を構築しないでください** — XSS の侵入経路になります。動的データは `textContent` / `createElement` で `HTMLElement` を構築し、要素形式の `content` として渡してください。HTML 構造を静的で管理下に保ちます。

---

## アクセシビリティに関する注意

このライブラリは意図的にキーボード操作や ARIA 処理を提供しません — 位置決め/表示・非表示のプリミティブです。実際のメニューでは、少なくとも以下を自身で処理する必要があります: `Escape` で閉じる、矢印キーナビゲーション、`role="menu"` / `role="menuitem"` 属性、フォーカス管理。

---

## TypeScript 対応

完全な型定義が初期状態で含まれています:

```typescript
import type {
    DumoguDropdownMenuOptions,  // コンストラクタオプション型
    AreaOption                  // エリアパラメータ型
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

## ライセンス

MIT
