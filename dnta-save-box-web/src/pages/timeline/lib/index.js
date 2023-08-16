import defaultOptions from './options';
import MouseMoveEvent from './Mouse';
import { formatTime, getDefaultLevel, mergeObjects, draw } from './util';
import { fabric } from 'fabric';
import arrow from './narrow.png';

class TimeLine {
    canvasAttr = {
        offset: 0,
        count: 0,
    };
    mouse = {
        offset: 0,
        lastOffset: 0,
        count: 0
    };
    limit = {
        start: {
            left: 0
        },
        end: {
            left: 0
        }
    };
    constructor(root, options = defaultOptions) {
        if (!root) {
            console.warn('root dom can not be null');
            return;
        }
        this.el = typeof root === 'string' ? document.querySelector(root) : root;
        this.options = mergeObjects(options, defaultOptions);
        this.stage = null;
        this.init();
    }
    init() {
        this.options.level = getDefaultLevel(this.options.totalTime, this.options.zoom);
        const { canvas, ctx } = this.createCanvas(this.el);
        this.canvas = new fabric.Canvas(canvas, {
            width: canvas.width, // 画布宽度
            height: canvas.height, // 画布高度
            selection: false
        });
        this.renderHeight = canvas.height / 2;
        this.limit.end.left = this.getTimeX(this.options.totalTime / 2) - this.options.limitWidth;
        this.canvas.on('mouse:wheel', this.onMousewheel.bind(this));
        this.mouseEvent = new MouseMoveEvent({
            el: this.canvas,
            mouseMove: (e, mouse) => {
                this.mouse = mouse;
                this.render();
            },
            mouseOut: (e) => { },
            onClick: (e) => {
                const { left } = this.canvas._offset;
                this.options.onClick(...this.getCurrentTime(e - left));
            }
        });
        this.mouse = this.mouseEvent.mouseEvent;
        this.canvas.on('mouse:wheel', this.onMousewheel.bind(this));
        this.draw();
    }
    draw() {
        this.render();
        this.limitRact = this.drawLimit();
        this.totleRact = this.drawTotle();
        this.startBar = this.drawStart();
        this.endBar = this.drawEnd();
        this.canvas.add(this.totleRact, this.limitRact, this.startBar, this.endBar);
    }
    // 更新绘制
    render() {
        if (this.background) {
            this.canvas.remove(this.background);
        }
        this.background = this.drawBackground();
        this.canvas.add(this.background);
        if (this.totleRact) {
            this.totleRact.set({
                width: this.getTimeX(this.options.totalTime)
            });
        }
    }
    drawStart() {
        const { offset } = this.options.lineStyle;
        const ract = new fabric.Rect({
            left: this.limit.start.left,
            top: offset + this.background.height,
            width: this.options.limitWidth,
            height: this.renderHeight / 2,
            fill: 'rgba(244, 81, 16, .3)',
            // selectable: false,
            // hoverCursor: 'default'
            lockMovementY: true,
            hasBorders: false,
            hasControls: false
        });
        ract.on('moving', (options) => {
            this.mouseEvent.disabled(true);
            const { pointer } = options;
            if (pointer.x > this.getTimeX(this.options.totalTime) + this.options.limitWidth) {
                ract.set({
                    left: this.getTimeX(this.options.totalTime)
                });
            }
            if (pointer.x >= this.endBar.left - this.options.lineStyle.gap - this.options.limitWidth) {
                ract.set({
                    left: this.endBar.left - this.options.lineStyle.gap - this.options.limitWidth
                });
            }
            this.limit.start.left = this.startBar.left;
            this.limitRact.set({
                left: this.limit.start.left,
                width: this.limit.end.left - this.limit.start.left + this.options.limitWidth
            });
        });
        return ract;
    }
    drawEnd() {
        const { offset } = this.options.lineStyle;
        const ract = new fabric.Rect({
            left: this.limit.end.left,
            top: offset + this.background.height,
            width: this.options.limitWidth,
            height: this.renderHeight / 2,
            fill: 'rgba(244, 81, 16, .3)',
            lockMovementY: true,
            hasBorders: false,
            hasControls: false
        });
        ract.on('moving', (options) => {
            this.mouseEvent.disabled(true);
            const { pointer } = options;
            if (pointer.x > this.getTimeX(this.options.totalTime) + this.options.limitWidth) {
                ract.set({
                    left: this.getTimeX(this.options.totalTime) - this.options.limitWidth
                });
            }
            if (pointer.x - this.startBar.left - this.options.limitWidth <= this.options.lineStyle.gap) {
                ract.set({
                    left: this.startBar.left + this.options.lineStyle.gap + this.options.limitWidth 
                });
            }
            this.limit.end.left = this.endBar.left;
            this.limitRact.set({
                width: this.limit.end.left - this.limit.start.left + this.options.limitWidth
            });
            this.limitRact.setCoords();
            this.canvas.renderAll();
        });
        return ract;
    }
    /** 绘制背景  */
    drawBackground() {
        const nodeArr = [];
        const { zoom, level, lineStyle, fontStyle } = this.options;
        const baseLine = new fabric.Line([
            0, 0,
            this.canvas.width, 0
        ], {
            stroke: lineStyle.color, // 笔触颜色
            selectable: false,
            hoverCursor: 'default'
        });
        nodeArr.push(baseLine);
        // 渲染格数(同宽度固定)
        const count = Math.floor(this.canvas.width / lineStyle.gap);
        let offsetCount = 0 - Math.floor((this.mouse.offset + this.mouse.lastOffset) / lineStyle.gap);
        this.canvasAttr.offset = this.mouse.offset + this.mouse.lastOffset;
        this.canvasAttr.count = count;
        // 拖拽到起始点不允许操作
        if (offsetCount <= 0) {
            offsetCount = 0;
            this.mouse.offset = 0;
            this.mouse.lastOffset = 0;
        }
        for (let i = 0; i <= count; i++) {
            const flag = ((i + offsetCount) % 5) === 0;
            const h = flag ? lineStyle.longerHeight : lineStyle.height;
            const x = lineStyle.gap * i;
            const line = new fabric.Line([
                x, 0,
                x, 0 - h
            ], {
                stroke: lineStyle.color, // 笔触颜色
                selectable: false,
                hoverCursor: 'default'
            });
            nodeArr.push(line);
            if (flag) {
                const fontX = lineStyle.gap * i;
                const str = formatTime(((i + offsetCount) * zoom[level]));
                const text = new fabric.Text(str, {
                    top: 0 - (h * 2) - 5,
                    left: fontX,
                    fontSize: fontStyle.font,
                    fill: fontStyle.color,
                    selectable: false,
                    hoverCursor: 'default'
                });
                nodeArr.push(text);
            }
        }
        const group = new fabric.Group(nodeArr, {
            left: 0,
            top: lineStyle.offset,
            selectable: false,
            hoverCursor: 'default'
        });
        return group;

    }
    /** 绘制已选中区间 */
    drawLimit() {
        const { offset } = this.options.lineStyle;
        const startX = this.getTimeX(0);
        const endX = this.getTimeX(this.options.totalTime / 2);
        const ract = new fabric.Rect({
            left: startX,
            top: offset + this.background.height,
            width: endX,
            height: this.renderHeight / 2,
            fill: 'rgb(16, 210, 244)',
            selectable: false,
            hoverCursor: 'default'
        });
        ract.on('mousedown', () => {
            this.mouseEvent.disabled(true);
        });
        return ract;
    }
    /** 绘制总长度 */
    drawTotle() {
        const { offset } = this.options.lineStyle;
        const endX = this.getTimeX(this.options.totalTime);
        const ract = new fabric.Rect({
            left: 0,
            top: offset + this.background.height,
            width: endX,
            height: this.renderHeight / 2,
            fill: 'rgba(16, 191, 244, .2)',
            selectable: false,
            hoverCursor: 'default'
        });
        return ract;
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
}

export default TimeLine;