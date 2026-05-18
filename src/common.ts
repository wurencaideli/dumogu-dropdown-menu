export function removeElement(element: HTMLElement | null): void {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}
export function addElementClass(el: HTMLElement, className: string): void {
    el.classList.add(className);
}
export function removeElementClass(el: HTMLElement, className: string): void {
    el.classList.remove(className);
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
