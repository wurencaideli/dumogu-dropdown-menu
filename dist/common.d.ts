export declare function removeElement(element: HTMLElement | null): void;
export declare function addElementClass(el: HTMLElement, className: string): void;
export declare function removeElementClass(el: HTMLElement, className: string): void;
export declare class BaseTools {
    isMounted: boolean;
    isDestroyed: boolean;
    constructor();
    destroy(): void;
    mount(): void;
    unmount(): void;
}
