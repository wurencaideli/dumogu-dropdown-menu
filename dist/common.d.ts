export declare function removeElement(element: HTMLElement | null): void;
export declare class BaseTools {
    isMounted: boolean;
    isDestroyed: boolean;
    constructor();
    destroy(): void;
    mount(): void;
    unmount(): void;
}
