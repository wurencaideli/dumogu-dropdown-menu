export function removeElement(element: HTMLElement | null): void {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}
export class BaseTools {
    isMounted: boolean = false;
    isDestroyed: boolean = false;
    constructor() {}
    destroy(): void {
        this.isDestroyed = true;
    }
    mount(): void {
        this.isMounted = true;
    }
    unmount(): void {
        this.isMounted = false;
    }
}
