import { BaseTools, removeElement } from './common.js';

export interface AreaOption {
    /** 区域的起点坐标(左上角),格式为 `[x, y]`,视口坐标 */
    start?: [number, number];
    /** 区域的终点坐标(右下角),格式为 `[x, y]`,视口坐标 */
    end?: [number, number];
    /** 区域的宽度 */
    width?: number;
    /** 区域的高度 */
    height?: number;
}

export interface DumoguDropdownMenuOptions {
    /** 菜单内容,可以是 html 文本或者 element 对象 */
    content?: string | HTMLElement;
    /** 用于计算位置的触发区域 */
    area?: AreaOption;
    /** 是否立即显示 */
    show?: boolean;
    /** 挂载的容器元素,不传时挂载到 body 上 */
    container?: HTMLElement;
    /** 显示区域限制:'vertical' 垂直显示、'horizontal' 水平显示,不填则自动识别 */
    displayAreaLimit?: 'vertical' | 'horizontal' | '';
    /** 与触发区域边缘保持的距离(px),默认 0 */
    offset?: number;
}

interface Layout {
    /** 横向展开方向 */
    x: 'left' | 'right';
    /** 纵向展开方向 */
    y: 'top' | 'bottom';
    width: number;
    height: number;
    left: number;
    top: number;
}

export class DumoguDropdownMenu extends BaseTools {
    /** z-index 计数的基础值,外部可在创建实例前修改,默认 999 */
    static baseZIndex: number = 999;
    /** 已分配的最大 z-index,保证后创建的实例叠在上层 */
    private static zIndexCount: number = 0;
    /** 当前处于挂载状态的实例,全部收起后用来重置 z-index 计数 */
    private static mountedInstances = new Set<DumoguDropdownMenu>();
    /** 最外层元素,覆盖整个定位空间 */
    dropdownMenuEl: HTMLDivElement;
    /** 定位容器元素,负责摆放位置、承载内容和过渡动画 */
    dropdownMenuContainerEl: HTMLDivElement;
    content: string | HTMLElement | undefined = '';
    area: AreaOption = {};
    container: HTMLElement | undefined;
    displayAreaLimit: 'vertical' | 'horizontal' | '' = '';
    offset: number = 0;
    show: boolean = false;
    isTransitioning: boolean = false;
    private appliedContent?: string | HTMLElement;
    private appliedContainer?: HTMLElement;
    private handleTransitionStart = (e: TransitionEvent): void => {
        if (!this.isOwnTransition(e)) return;
        this.isTransitioning = true;
    };
    /** transitionend 与 transitioncancel 的统一处理:被打断时不会有 end 事件,同样复位并卸载 */
    private handleTransitionFinish = (e: TransitionEvent): void => {
        if (!this.isOwnTransition(e)) return;
        this.isTransitioning = false;
        if (!this.show) this.unmount();
    };
    constructor(options: DumoguDropdownMenuOptions = {}) {
        super();
        this.dropdownMenuEl = document.createElement('div');
        this.dropdownMenuContainerEl = document.createElement('div');
        this.dropdownMenuEl.className = 'dumogu-dropdown-menu-body';
        this.dropdownMenuContainerEl.className = 'dumogu-dropdown-menu-body_container';
        this.dropdownMenuEl.appendChild(this.dropdownMenuContainerEl);
        this.bindTransitionEvents();
        this.content = options.content ?? '';
        this.area = options.area || {};
        this.container = options.container;
        this.displayAreaLimit = options.displayAreaLimit || '';
        this.offset = options.offset || 0;
        this.show = !!options.show;
        this.apply();
    }
    /** 把属性状态同步到 DOM,修改属性后调用 */
    apply(): void {
        if (this.isDestroyed) return;
        const containerEl = this.dropdownMenuContainerEl;
        if (this.content !== this.appliedContent) {
            if (typeof this.content === 'string') {
                containerEl.innerHTML = this.content;
            } else {
                containerEl.innerHTML = '';
                if (this.content) containerEl.appendChild(this.content);
            }
            this.appliedContent = this.content;
        }
        if (this.container !== this.appliedContainer) {
            this.appliedContainer = this.container;
            if (this.isMounted) this.mount();
        }
        if (this.show && !this.isMounted) {
            this.mount();
            // 同步强制布局，防止css动画不触发
            containerEl.getBoundingClientRect();
        }
        this.applyPosition();
    }
    mount(): void {
        if (this.isDestroyed) return;
        super.mount();
        DumoguDropdownMenu.mountedInstances.add(this);
        // 每次挂载都重新领取 z-index,最近挂载的菜单叠在最上层
        DumoguDropdownMenu.zIndexCount = Math.max(
            DumoguDropdownMenu.baseZIndex,
            DumoguDropdownMenu.zIndexCount + 1,
        );
        this.dropdownMenuEl.style.zIndex = `${DumoguDropdownMenu.zIndexCount}`;
        (this.container || document.body).appendChild(this.dropdownMenuEl);
    }
    unmount(): void {
        if (this.isDestroyed) return;
        super.unmount();
        DumoguDropdownMenu.mountedInstances.delete(this);
        // 全部菜单收起后把计数归零,下次从 baseZIndex 重新开始,避免长期只增不减
        if (DumoguDropdownMenu.mountedInstances.size === 0) {
            DumoguDropdownMenu.zIndexCount = 0;
        }
        removeElement(this.dropdownMenuEl);
    }
    destroy(): void {
        if (this.isDestroyed) return;
        this.unbindTransitionEvents();
        this.unmount();
        this.dropdownMenuContainerEl.innerHTML = '';
        super.destroy();
    }
    private applyPosition(): void {
        if (this.isDestroyed) return;
        // 隐藏且未挂载时无需计算位置,也避免对游离元素触发强制 reflow
        if (!this.show && !this.isMounted) return;
        const dropdownMenuEl = this.dropdownMenuEl;
        dropdownMenuEl.classList.toggle('dumogu-dropdown-menu-body_show', this.show);
        dropdownMenuEl.classList.toggle(
            'dumogu-dropdown-menu-body_custom-parent',
            !!this.container,
        );
        const layout = this.computeLayout();
        const containerEl = this.dropdownMenuContainerEl;
        containerEl.style.width = layout.width + 'px';
        containerEl.style.maxWidth = layout.width + 'px';
        containerEl.style.height = layout.height + 'px';
        containerEl.style.maxHeight = layout.height + 'px';
        containerEl.style.left = layout.left + 'px';
        containerEl.style.top = layout.top + 'px';
        const anchorX = layout.x === 'left' ? 'right' : 'left';
        const anchorY = layout.y === 'top' ? 'bottom' : 'top';
        containerEl.classList.toggle(
            'dumogu-dropdown-menu-body_container_align-left',
            anchorX === 'left',
        );
        containerEl.classList.toggle(
            'dumogu-dropdown-menu-body_container_align-right',
            anchorX === 'right',
        );
        containerEl.classList.toggle(
            'dumogu-dropdown-menu-body_container_align-top',
            anchorY === 'top',
        );
        containerEl.classList.toggle(
            'dumogu-dropdown-menu-body_container_align-bottom',
            anchorY === 'bottom',
        );
        containerEl.style.transformOrigin = `${anchorX} ${anchorY}`;
    }
    private computeLayout(): Layout {
        const area = this.area;
        const areaStart = area.start || [0, 0];
        const areaEnd = area.end || [0, 0];
        let offsetX = 0;
        let offsetY = 0;
        let spaceWidth = window.innerWidth;
        let spaceHeight = window.innerHeight;
        if (this.container) {
            const rect = this.dropdownMenuEl.getBoundingClientRect();
            offsetX = rect.left;
            offsetY = rect.top;
            spaceWidth = rect.width;
            spaceHeight = rect.height;
        }
        const start = [areaStart[0] - offsetX, areaStart[1] - offsetY];
        const end = [areaEnd[0] - offsetX, areaEnd[1] - offsetY];
        const spareLeft = start[0];
        const spareRight = spaceWidth - end[0];
        const spareTop = start[1];
        const spareBottom = spaceHeight - end[1];
        const x = spareRight > spareLeft ? 'right' : 'left';
        const y = spareBottom > spareTop ? 'bottom' : 'top';
        // 区域宽高比大于空间宽高比时以纵向为主,否则以横向为主
        const targetSlope = Math.abs((area.width || 0) / (area.height || 0));
        const horizontal = x === 'left' ? end[0] : spaceWidth - start[0];
        const vertical = y === 'top' ? start[1] : spaceHeight - start[1];
        let ratio: 'x' | 'y';
        if (this.displayAreaLimit === 'vertical') ratio = 'y';
        else if (this.displayAreaLimit === 'horizontal') ratio = 'x';
        else ratio = targetSlope > Math.abs(horizontal / vertical) ? 'y' : 'x';
        // 横向为主时宽取展开侧的剩余空间,纵向为主时高取展开侧的剩余空间,另一边从空间边界包到区域远端
        const widthX = x === 'left' ? spareLeft : spareRight;
        const widthY = horizontal;
        const heightX = y === 'top' ? end[1] : spaceHeight - start[1];
        const heightY = y === 'top' ? spareTop : spareBottom;
        // 与触发区域保持 offset 距离:只作用于贴近触发区域的主轴方向,与区域对齐的方向保持贴合
        // 剩余空间不足 offset 时收缩到 0,位移随之钳制,保证不越出定位空间;负值按 0 处理
        const offset = Math.max(this.offset, 0);
        const offsetWidth = ratio === 'x' ? offset : 0;
        const offsetHeight = ratio === 'y' ? offset : 0;
        const baseWidth = ratio === 'x' ? widthX : widthY;
        const baseHeight = ratio === 'x' ? heightX : heightY;
        const width = Math.max(baseWidth - offsetWidth, 0);
        const height = Math.max(baseHeight - offsetHeight, 0);
        const left =
            x === 'right' ? Math.min(spaceWidth - baseWidth + offsetWidth, spaceWidth - width) : 0;
        const top =
            y === 'bottom'
                ? Math.min(spaceHeight - baseHeight + offsetHeight, spaceHeight - height)
                : 0;
        return { x, y, width, height, left, top };
    }
    private isOwnTransition(e: TransitionEvent): boolean {
        return !!e && e.propertyName === 'transform' && e.target === this.dropdownMenuContainerEl;
    }
    private bindTransitionEvents(): void {
        const containerEl = this.dropdownMenuContainerEl;
        containerEl.addEventListener('transitionstart', this.handleTransitionStart);
        containerEl.addEventListener('transitionend', this.handleTransitionFinish);
        containerEl.addEventListener('transitioncancel', this.handleTransitionFinish);
    }
    private unbindTransitionEvents(): void {
        const containerEl = this.dropdownMenuContainerEl;
        containerEl.removeEventListener('transitionstart', this.handleTransitionStart);
        containerEl.removeEventListener('transitionend', this.handleTransitionFinish);
        containerEl.removeEventListener('transitioncancel', this.handleTransitionFinish);
    }
}
