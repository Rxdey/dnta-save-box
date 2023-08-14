import defaultOptions from './options';
import { formatTime, getDefaultLevel, mergeObjects, draw } from './util';
import { fabric } from 'fabric';

class TimeLine {
    #mouseEvent = {
        isMouseDown: false,
        /** 点击状态，拖拽时不触发点击 */
        isMouseClick: false,
        isMouseOut: true,
        mouseX: 0,
        offset: 0,
        lastOffset: 0,
        hoverLineX: 0,
    };
    canvasAttr = {
        offset: 0,
        count: 0,
    };
    constructor(root, options = defaultOptions) {
        if (!root) {
            console.warn('root dom can not be null');
            return;
        }
        this.el = typeof root === 'string' ? document.querySelector(root) : root;
        this.options = mergeObjects(options, defaultOptions);
        this.init();
    }
    init() {
        this.options.level = getDefaultLevel(this.options.totalTime, this.options.zoom);
        const { canvas, ctx } = this.createCanvas(this.el);
        this.canvas = new fabric.Canvas(canvas, {
            width: canvas.width, // 画布宽度
            height: canvas.height, // 画布高度
        });
        this.renderHeight = canvas.height / 2;
        this.render();
        // const eventsList = {
        //     'mouse:wheel': this.onMousewheel.bind(this),
        //     'mouse:down': this.onMouseDown.bind(this),
        //     'mouse:move': this.onMouseMove.bind(this),
        //     'mouse:out': this.onMouseOut.bind(this),
        //     'mouse:up': this.onMouseUp.bind(this),
        // };
        // Object.keys(eventsList).forEach(e => {
        //     this.canvas.on(e, eventsList[e]);
        // });
        // const background = new fabric.Rect({
        //     top: 0,
        //     left: 0,
        //     width: this.canvas.width,
        //     height: this.canvas.height,
        //     fill: '#000',
        //     lockMovementX: true,
        //     lockMovementY: true
        // });


    }
    // 渲染
    render() {
        this.canvas.clear();
        const timeLine = this.drawTimeline();
        const drawEndLine = this.drawEndLine();
        const drawLimit = this.drawLimit();
        const background = new fabric.Group([...drawEndLine, ...timeLine], {
            top: 0,
            left: 0,
            width: this.canvas.width,
            height: this.canvas.height,
            selectable: false
        });
        const eventsList = {
            'mousewheel': this.onMousewheel.bind(this),
            'mousedown': this.onMouseDown.bind(this),
            'mousemove': this.onMouseMove.bind(this),
            'mouseout': this.onMouseOut.bind(this),
            'mouseup': this.onMouseUp.bind(this),
        };
        Object.keys(eventsList).forEach(e => {
            background.on(e, eventsList[e]);
        });
        this.canvas.add(background);
        this.canvas.add(...drawLimit);
    }
    /** 绘制区间选择 */
    drawLimit() {
        const { offset } = this.options.lineStyle;
        const startX = 0;
        const endX = this.getTimeX(this.options.totalTime);
        // const startLine = draw.ract(startX, offset, 2, this.canvas.height / 2, '#fba616');
        // const endLine = draw.ract(endX, offset, 2, this.canvas.height / 2, '#fba616');
        const startLine = new fabric.Rect({
            top: offset,
            left: startX,
            width: 5,
            height: this.renderHeight / 2,
            fill: '#fba616',
        });
        const endLine = new fabric.Rect({
            top: offset,
            left: endX - 5,
            width: 5,
            height: this.renderHeight / 2,
            fill: '#fba616',
        });
        return [startLine, endLine];
    }
    /** 绘制总长度色块 */
    drawEndLine() {
        const { offset } = this.options.lineStyle;
        const height = this.renderHeight / 2;
        const baseLine = draw.line(0, offset + height, this.canvas.width, offset + height, 'rgba(0,0,0,.5)');
        const x = this.getTimeX(this.options.totalTime);
        const [timeStr] = this.getCurrentTime(x);
        const line = draw.ract(0, offset, x, this.renderHeight / 2, '#11d7f4');
        const text = draw.text(timeStr, x + 5, this.renderHeight / 2, '#11d7f4');
        return [line, text, baseLine];
    }
    /** 时间轴背景 */
    drawTimeline() {
        const nodeArr = [];
        const { zoom, level, lineStyle, fontStyle } = this.options;
        const baseLine = draw.line(0, lineStyle.offset, this.canvas.width, lineStyle.offset, lineStyle.color);
        nodeArr.push(baseLine);
        // 渲染格数(同宽度固定)
        const count = Math.floor(this.canvas.width / lineStyle.gap);
        let offsetCount = 0 - Math.floor((this.#mouseEvent.offset + this.#mouseEvent.lastOffset) / lineStyle.gap);
        this.canvasAttr.offset = this.#mouseEvent.offset + this.#mouseEvent.lastOffset;
        this.canvasAttr.count = count;
        // 拖拽到起始点不允许操作
        if (offsetCount <= 0) {
            offsetCount = 0;
            this.#mouseEvent.offset = 0;
            this.#mouseEvent.lastOffset = 0;
        }
        for (let i = 0; i <= count; i++) {
            const flag = ((i + offsetCount) % 5) === 0;
            const h = flag ? lineStyle.longerHeight : lineStyle.height;
            const x = lineStyle.gap * i;
            const line = draw.line(x, lineStyle.offset, x, lineStyle.offset - h, lineStyle.color);
            nodeArr.push(line);
            if (flag) {
                const fontX = lineStyle.gap * i;
                const text = draw.text(formatTime(((i + offsetCount) * zoom[level])), fontX, lineStyle.offset - (h * 2) - 5, fontStyle.color, fontStyle.font);
                nodeArr.push(text);
            }
        }
        return nodeArr;
    }
    createCanvas(el) {
        const { width, height } = el.getBoundingClientRect();
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        el.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        return { canvas, ctx };
    }
    /** 通过时间获取X轴坐标 */
    getTimeX(time = 0) {
        const { offset } = this.canvasAttr;
        const { zoom, level, lineStyle } = this.options;
        const sigleTime = zoom[level];
        return ((time / sigleTime) * lineStyle.gap) - (0 - offset);
    }
    /** 根据偏移量获取时间 */
    getCurrentTime(x = 0) {
        const { offset } = this.canvasAttr;
        const { zoom, level, lineStyle } = this.options;
        // 每一格代表的毫秒数
        const sigleTime = zoom[level];
        // 当前位置的毫秒数
        const current = Math.floor(((x + (0 - offset)) / lineStyle.gap) * sigleTime);
        return [formatTime(current), current];
    }
    /** 鼠标滚轮缩放level */
    onMousewheel({ e }) {
        if (e.wheelDelta > 0) {
            if (this.options.level < this.options.zoom.length - 1) {
                this.options.level += 1;
            }
        } else {
            if (this.options.level > 0) {
                this.options.level -= 1;
            }
        }
        this.render();
    }
    /** 鼠标拖动时间轴 */
    onMouseMove({ e }) {
        this.#mouseEvent.isMouseOut = false;
        this.#mouseEvent.isMouseClick = false;
        if (this.#mouseEvent.isMouseDown) {
            this.#mouseEvent.offset = e.clientX - this.#mouseEvent.mouseX;
            this.render();
        }
        const { left } = this.canvas._offset;
        this.#mouseEvent.hoverLineX = e.clientX - left;
        this.render();
    }
    /** 鼠标按下 */
    onMouseDown({ e }) {
        this.#mouseEvent.isMouseDown = true;
        this.#mouseEvent.isMouseClick = true;
        this.#mouseEvent.mouseX = e.clientX;
        this.#mouseEvent.lastOffset = this.#mouseEvent.offset + this.#mouseEvent.lastOffset;
        // 初始化时重置状态
        this.#mouseEvent.offset = 0;
    }
    /** 鼠标松开 通过isMouseClick判断点击*/
    onMouseUp({ e }) {
        if (this.#mouseEvent.isMouseClick) {
            const { left } = this.canvas._offset;
            this.options.onClick(...this.getCurrentTime(e.clientX - left));
        }
        this.onMouseOut(e);
    }
    /** 鼠标离开canvas*/
    onMouseOut({ e }) {
        this.#mouseEvent.isMouseOut = true;
        if (!this.#mouseEvent.isMouseDown) return;
        this.#mouseEvent.isMouseDown = false;
    }
}

export default TimeLine;