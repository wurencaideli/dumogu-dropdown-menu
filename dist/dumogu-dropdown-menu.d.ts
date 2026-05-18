import { BaseTools } from './common.js';
export interface AreaOption {
    start?: number[];
    end?: number[];
    width?: number;
    height?: number;
}
export interface DumoguDropdownMenuOptions {
    content?: string | HTMLElement | HTMLElement[];
    area?: AreaOption;
    show?: boolean;
}
export declare class DumoguDropdownMenu extends BaseTools {
    #private;
    constructor(options?: DumoguDropdownMenuOptions);
    set dropdownMenuEl(value: HTMLDivElement | undefined);
    get dropdownMenuEl(): HTMLDivElement | undefined;
    set dropdownMenuContainerEl(value: HTMLDivElement | undefined);
    get dropdownMenuContainerEl(): HTMLDivElement | undefined;
    set dropdownMenuContainerTargetEl(value: HTMLDivElement | undefined);
    get dropdownMenuContainerTargetEl(): HTMLDivElement | undefined;
    set show(value: boolean | undefined);
    get show(): boolean | undefined;
    set content(value: string | HTMLElement | HTMLElement[] | undefined);
    get content(): string | HTMLElement | HTMLElement[] | undefined;
    set isTransitioning(value: boolean);
    get isTransitioning(): boolean;
    /**
     * 设置用于计算位置的区域
     * @param {Object} [value={}] - 区域的属性对象。
     * @param {number[]} [value.start=[]] - 区域的起点坐标，格式为 `[x, y]`。
     * @param {number[]} [value.end=[]] - 区域的终点坐标，格式为 `[x, y]`。
     * @param {number} [value.width] - 区域的宽度。
     * @param {number} [value.height] - 区域的高度。
     */
    set area(value: AreaOption | undefined);
    get area(): AreaOption | undefined;
    mount(): void;
    unmount(): void;
    destroy(): void;
    update(): void;
}
