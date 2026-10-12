import { BaseTools } from './common.js';
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
export declare class DumoguDropdownMenu extends BaseTools {
    /** z-index 计数的基础值,外部可在创建实例前修改,默认 999 */
    static baseZIndex: number;
    /** 已分配的最大 z-index,保证后创建的实例叠在上层 */
    private static zIndexCount;
    /** 当前处于挂载状态的实例,全部收起后用来重置 z-index 计数 */
    private static mountedInstances;
    /** 最外层元素,覆盖整个定位空间 */
    dropdownMenuEl: HTMLDivElement;
    /** 定位容器元素,负责摆放位置、承载内容和过渡动画 */
    dropdownMenuContainerEl: HTMLDivElement;
    content: string | HTMLElement | undefined;
    area: AreaOption;
    container: HTMLElement | undefined;
    displayAreaLimit: 'vertical' | 'horizontal' | '';
    offset: number;
    show: boolean;
    isTransitioning: boolean;
    private appliedContent?;
    private appliedContainer?;
    private handleTransitionStart;
    /** transitionend 与 transitioncancel 的统一处理:被打断时不会有 end 事件,同样复位并卸载 */
    private handleTransitionFinish;
    constructor(options?: DumoguDropdownMenuOptions);
    /** 把属性状态同步到 DOM,修改属性后调用 */
    apply(): void;
    mount(): void;
    unmount(): void;
    destroy(): void;
    private applyPosition;
    private computeLayout;
    private isOwnTransition;
    private bindTransitionEvents;
    private unbindTransitionEvents;
}
