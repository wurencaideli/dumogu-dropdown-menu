import { BaseTools, removeElement, addElementClass, removeElementClass } from './common';
export class DumoguDropdownMenu extends BaseTools {
    dropdownMenuEl;
    dropdownMenuContainerEl;
    dropdownMenuContainerTargetEl;
    #show__ = false;
    #content__ = '';
    #transitionStart__;
    #transitionEnd__;
    #isTransitioning__ = false;
    #area__ = {};
    #areaStartPoint = [0, 0];
    #areaEndPoint = [0, 0];
    #areaWidth = 0;
    #areaHeight = 0;
    constructor(options = {}) {
        super();
        const dropdownMenuEl = document.createElement('div');
        const dropdownMenuContainerEl = document.createElement('div');
        const dropdownMenuContainerTargetEl = document.createElement('div');
        addElementClass(dropdownMenuEl, 'dumogu-dropdown-menu-body');
        addElementClass(dropdownMenuContainerEl, 'dumogu-dropdown-menu-body-container');
        addElementClass(
            dropdownMenuContainerTargetEl,
            'dumogu-dropdown-menu-body-container-target',
        );
        dropdownMenuEl.appendChild(dropdownMenuContainerEl);
        dropdownMenuContainerEl.appendChild(dropdownMenuContainerTargetEl);
        this.dropdownMenuEl = dropdownMenuEl;
        this.dropdownMenuContainerEl = dropdownMenuContainerEl;
        this.dropdownMenuContainerTargetEl = dropdownMenuContainerTargetEl;
        this.#addEventListener();
        this.content = options.content;
        this.area = options.area;
        this.show = options.show;
    }
    set show(value) {
        if (this.isDestroyed) return;
        this.#show__ = value;
        if (value && !this.isMounted) {
            this.mount();
            this.#computedPosition();
            // 刚挂载的元素不能直接设置类名来完成过渡动画
            setTimeout(() => {
                this.#setupActionClass();
            }, 16);
        } else {
            this.#computedPosition();
            this.#setupActionClass();
        }
    }
    get show() {
        return this.#show__;
    }
    set content(value) {
        this.#content__ = value;
        this.#setupContent();
    }
    get content() {
        return this.#content__;
    }
    set isTransitioning(value) {
        this.#isTransitioning__ = value;
        this.#autoUnmount();
    }
    get isTransitioning() {
        return this.#isTransitioning__;
    }
    /**
     * 设置用于计算位置的区域
     * @param {Object} [value={}] - 区域的属性对象。
     * @param {number[]} [value.start=[]] - 区域的起点坐标，格式为 `[x, y]`。
     * @param {number[]} [value.end=[]] - 区域的终点坐标，格式为 `[x, y]`。
     * @param {number} [value.width] - 区域的宽度。
     * @param {number} [value.height] - 区域的高度。
     */
    set area(value = {}) {
        this.#area__ = value;
        this.#areaStartPoint = value.start || [];
        this.#areaEndPoint = value.end || [];
        this.#areaWidth = value.width || 0;
        this.#areaHeight = value.height || 0;
    }
    get area() {
        return this.#area__;
    }
    mount() {
        if (this.isDestroyed) return;
        super.mount();
        this.#computedPosition();
        document.body.appendChild(this.dropdownMenuEl);
    }
    unmount() {
        if (this.isDestroyed) return;
        super.unmount();
        removeElement(this.dropdownMenuEl);
    }
    destroy() {
        if (this.isDestroyed) return;
        this.#removeEventListener();
        this.unmount();
        this.content = undefined;
        super.destroy();
        this.dropdownMenuEl = undefined;
        this.dropdownMenuContainerEl = undefined;
        this.dropdownMenuContainerTargetEl = undefined;
    }
    update() {
        this.#computedPosition();
    }
    /** 添加类名 */
    #setupActionClass() {
        if (this.isDestroyed) return;
        const dropdownMenuEl = this.dropdownMenuEl;
        if (this.#show__) {
            addElementClass(dropdownMenuEl, 'show');
        } else {
            removeElementClass(dropdownMenuEl, 'show');
        }
    }
    /** 添加内容 */
    #setupContent() {
        if (this.isDestroyed) return;
        const dropdownMenuContainerTargetEl = this.dropdownMenuContainerTargetEl;
        let content = this.#content__ || '';
        if (typeof content === 'string') {
            dropdownMenuContainerTargetEl.innerHTML = content;
            return;
        } else if (!content.forEach) {
            content = [content];
        }
        dropdownMenuContainerTargetEl.innerHTML = '';
        content.forEach((el) => {
            dropdownMenuContainerTargetEl.appendChild(el);
        });
    }
    /** 自动卸载 */
    #autoUnmount() {
        if (!this.#isTransitioning__ && !this.#show__) {
            this.unmount();
        }
    }
    #transitionstart(e) {
        if (!e || e.propertyName !== 'transform' || e.target !== this.dropdownMenuContainerEl)
            return;
        this.isTransitioning = true;
    }
    #transitionEnd(e) {
        if (!e || e.propertyName !== 'transform' || e.target !== this.dropdownMenuContainerEl)
            return;
        this.isTransitioning = false;
    }
    #addEventListener() {
        const dropdownMenuContainerEl = this.dropdownMenuContainerEl;
        const that = this;
        that.#transitionStart__ = function (e) {
            that.#transitionstart(e);
        };
        that.#transitionEnd__ = function (e) {
            that.#transitionEnd(e);
        };
        dropdownMenuContainerEl.addEventListener('transitionstart', that.#transitionStart__);
        dropdownMenuContainerEl.addEventListener('transitionend', that.#transitionEnd__);
    }
    #removeEventListener() {
        const dropdownMenuContainerEl = this.dropdownMenuContainerEl;
        dropdownMenuContainerEl.removeEventListener('transitionstart', this.#transitionStart__);
        dropdownMenuContainerEl.removeEventListener('transitionend', this.#transitionEnd__);
    }
    /** 计算位置 */
    #computedPosition() {
        if (this.isDestroyed) return;
        if (!this.#show__) return;
        const dropdownMenuContainerEl = this.dropdownMenuContainerEl;
        const dropdownMenuContainerTargetEl = this.dropdownMenuContainerTargetEl;
        const position = this.#computContainerStyle();
        dropdownMenuContainerEl.style.width = position.containerWidth + 'px';
        dropdownMenuContainerEl.style.height = position.containerHeight + 'px';
        dropdownMenuContainerEl.style.left = position.transformX + 'px';
        dropdownMenuContainerEl.style.top = position.transformY + 'px';
        dropdownMenuContainerTargetEl.style.position = 'absolute';
        dropdownMenuContainerTargetEl.style.top = 'initial';
        dropdownMenuContainerTargetEl.style.right = 'initial';
        dropdownMenuContainerTargetEl.style.bottom = 'initial';
        dropdownMenuContainerTargetEl.style.left = 'initial';
        switch (true) {
            case position.x == 'left' && position.y == 'top':
                dropdownMenuContainerTargetEl.style.right = '0px';
                dropdownMenuContainerTargetEl.style.bottom = '0px';
                dropdownMenuContainerEl.style.transformOrigin = 'right bottom';
                break;
            case position.x == 'right' && position.y == 'top':
                dropdownMenuContainerTargetEl.style.bottom = '0px';
                dropdownMenuContainerTargetEl.style.left = '0px';
                dropdownMenuContainerEl.style.transformOrigin = 'left bottom';
                break;
            case position.x == 'right' && position.y == 'bottom':
                dropdownMenuContainerTargetEl.style.top = '0px';
                dropdownMenuContainerTargetEl.style.left = '0px';
                dropdownMenuContainerEl.style.transformOrigin = 'left top';
                break;
            case position.x == 'left' && position.y == 'bottom':
                dropdownMenuContainerTargetEl.style.top = '0px';
                dropdownMenuContainerTargetEl.style.right = '0px';
                dropdownMenuContainerEl.style.transformOrigin = 'right top';
                break;
            default:
                break;
        }
    }
    /** 计算空余，判断元素的那个方向有空余 */
    #computSpare() {
        const areaStartPoint = this.#areaStartPoint;
        const areaEndPoint = this.#areaEndPoint;
        const innerHeight = window.innerHeight;
        const innerWidth = window.innerWidth;
        let x = 'left';
        if (innerWidth - areaEndPoint[0] > areaStartPoint[0]) {
            x = 'right';
        }
        let y = 'top';
        if (innerHeight - areaEndPoint[1] > areaStartPoint[1]) {
            y = 'bottom';
        }
        return {
            x,
            y,
        };
    }
    /** 计算精度，更靠近那个方向 */
    #computSpareTo() {
        const areaStartPoint = this.#areaStartPoint;
        const areaEndPoint = this.#areaEndPoint;
        const areaWidth = this.#areaWidth;
        const areaHeight = this.#areaHeight;
        const innerHeight = window.innerHeight;
        const innerWidth = window.innerWidth;
        const position = this.#computSpare();
        let ratio = '';
        let targetSlope = Math.abs(areaWidth / areaHeight);
        let containerSlope = 0;
        if (position.x === 'left' && position.y === 'top') {
            containerSlope = Math.abs(areaEndPoint[0] / areaStartPoint[1]);
        }
        if (position.x === 'right' && position.y === 'top') {
            containerSlope = Math.abs((innerWidth - areaStartPoint[0]) / areaStartPoint[1]);
        }
        if (position.x === 'left' && position.y === 'bottom') {
            containerSlope = Math.abs(areaEndPoint[0] / (innerHeight - areaStartPoint[1]));
        }
        if (position.x === 'right' && position.y === 'bottom') {
            containerSlope = Math.abs(
                (innerWidth - areaStartPoint[0]) / (innerHeight - areaStartPoint[1]),
            );
        }
        if (targetSlope > containerSlope) {
            ratio = 'y';
        } else {
            ratio = 'x';
        }
        return {
            ...position,
            ratio,
        };
    }
    /** 计算容器位置，宽高 */
    #computContainerStyle() {
        const areaStartPoint = this.#areaStartPoint;
        const areaEndPoint = this.#areaEndPoint;
        const innerHeight = window.innerHeight;
        const innerWidth = window.innerWidth;
        const position = this.#computSpareTo();
        let containerWidth = 0;
        let containerHeight = 0;
        let transformY = 0;
        let transformX = 0;
        if (position.x === 'left' && position.y === 'top') {
            if (position.ratio == 'x') {
                containerWidth = areaStartPoint[0];
                containerHeight = areaEndPoint[1];
            } else {
                containerWidth = areaEndPoint[0];
                containerHeight = areaStartPoint[1];
            }
        }
        if (position.x === 'right' && position.y === 'top') {
            if (position.ratio == 'x') {
                containerWidth = innerWidth - areaEndPoint[0];
                containerHeight = areaEndPoint[1];
            } else {
                containerWidth = innerWidth - areaStartPoint[0];
                containerHeight = areaStartPoint[1];
            }
            transformX = innerWidth - containerWidth;
        }
        if (position.x === 'left' && position.y === 'bottom') {
            if (position.ratio == 'x') {
                containerWidth = areaStartPoint[0];
                containerHeight = innerHeight - areaStartPoint[1];
            } else {
                containerWidth = areaEndPoint[0];
                containerHeight = innerHeight - areaEndPoint[1];
            }
            transformY = innerHeight - containerHeight;
        }
        if (position.x === 'right' && position.y === 'bottom') {
            if (position.ratio == 'x') {
                containerWidth = innerWidth - areaEndPoint[0];
                containerHeight = innerHeight - areaStartPoint[1];
            } else {
                containerWidth = innerWidth - areaStartPoint[0];
                containerHeight = innerHeight - areaEndPoint[1];
            }
            transformX = innerWidth - containerWidth;
            transformY = innerHeight - containerHeight;
        }
        return {
            ...position,
            containerWidth,
            containerHeight,
            transformX,
            transformY,
        };
    }
}
