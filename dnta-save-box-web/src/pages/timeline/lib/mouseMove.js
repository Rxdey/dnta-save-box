class MouseMoveEvent {
    mouseEvent = {
        isMouseDown: false,
        /** 点击状态，拖拽时不触发点击 */
        isMouseClick: false,
        isMouseOut: true,
        mouseX: 0,
        offset: 0,
        lastOffset: 0,
        hoverLineX: 0,
        disabled: false
    };
    constructor({
        el,
        mouseDown = (e) => { },
        mouseMove = (e) => { },
        mouseUp = (e) => { },
        callback = (e) => { },
        onClick = (e) => { },
        type = 'canvas'
    }) {
        this.el = el;
        this.render = callback;
        this.onClick = onClick;
        this.mouseDown = mouseDown;
        this.mouseMove = mouseMove;
        this.mouseUp = mouseUp;

        const events = [
            {
                canvas: 'mouse:down',
                node: 'mousedown',
                fnc: this.onMouseDown
            },
            {
                canvas: 'mouse:move',
                node: 'mousemove',
                fnc: this.onMouseMove
            },
            {
                canvas: 'mouse:out',
                node: 'mouseout',
                fnc: this.onMouseOut
            },
            {
                canvas: 'mouse:up',
                node: 'mouseup',
                fnc: this.onMouseUp
            },
        ];
        events.forEach(e => {
            this.el.on(e[type], e.fnc.bind(this));
        });
    }
    disabled(val = true) {
        this.mouseEvent.disabled = val;
    }
    /** 鼠标按下 */
    onMouseDown({ e }) {
        this.mouseDown(e);
        if (this.mouseEvent.disabled) return;
        this.mouseEvent.isMouseDown = true;
        this.mouseEvent.isMouseClick = true;
        this.mouseEvent.mouseX = e.clientX;
        this.mouseEvent.lastOffset = this.mouseEvent.offset + this.mouseEvent.lastOffset;
        // 初始化时重置状态
        this.mouseEvent.offset = 0;
    }
    /** 鼠标拖动时间轴 */
    onMouseMove({ e }) {
        this.mouseMove(e);
        if (this.mouseEvent.disabled) return;
        this.mouseEvent.isMouseOut = false;
        this.mouseEvent.isMouseClick = false;
        if (this.mouseEvent.isMouseDown) {
            this.mouseEvent.offset = e.clientX - this.mouseEvent.mouseX;
            this.render(this.mouseEvent, e.clientX);
        }
        // const { left } = this.canvas._offset;
        // this.mouseEvent.hoverLineX = e.clientX - left;
        this.render(this.mouseEvent, e.clientX);
    }

    /** 鼠标松开 通过isMouseClick判断点击*/
    onMouseUp({ e }) {
        this.mouseUp(e);
        this.mouseEvent.disabled = false;
        if (this.mouseEvent.isMouseClick) {
            this.onClick(e.clientX);
        }
        this.onMouseOut(e);
    }
    /** 鼠标离开canvas*/
    onMouseOut({ e }) {
        this.mouseUp(e);
        if (this.mouseEvent.disabled) return;
        this.mouseEvent.isMouseOut = true;
        if (!this.mouseEvent.isMouseDown) return;
        this.mouseEvent.isMouseDown = false;
    }
}
export default MouseMoveEvent;