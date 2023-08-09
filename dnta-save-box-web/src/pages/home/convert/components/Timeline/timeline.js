import { formatTime, getDefaultLevel, mergeObjects } from './util';

const defaultOptions = {
    /** 渲染根节点 */
    root: '',
    /** 总时长 */
    totalTime: 10000,
    /** 绘制比例每一格时间(毫秒) */
    zoom: [20, 100, 200, 1000, 6000, 12 * 1000, 120 * 1000, 360 * 1000, 720 * 1000,],
    /** 默认缩放等级(会自动计算) */
    level: 0,
    /** 线段配置 */
    lineStyle: {
        height: 8,
        gap: 20,
        color: '#6c707e'
    },
    /** 文本配置 */
    fontStyle: {
        color: '#e5e5e5',
        font: '12px'
    }
};

/**
 * canvas时间轴
 * 支持鼠标滚轮缩放显示比例
 * 支持鼠标拖动查看
 * (开发中...)
 */
class Timeline {
    canvasProp = {
        isMouseDown: false,
        mouseX: 0,
        offset: 0,
        lastOffset: 0
    };
    constructor(root, options = defaultOptions) {
        if (!root) {
            console.warn('root dom can not be null');
            return;
        }
        this.el = typeof root === 'string' ? document.querySelector(root) : root;
        this.options = mergeObjects(options, defaultOptions);

        this.canvas = null;
        this.ctx = null;
        this.options.level = getDefaultLevel(this.options.totalTime, this.options.zoom);
        this.init();
    }
    init() {
        const { canvas, ctx } = this.createCanvas(this.el);
        this.canvas = canvas;
        this.ctx = ctx;
        this.drawTimeline();
        canvas.addEventListener('mousewheel', this.onMousewheel.bind(this));
        canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        canvas.addEventListener('mouseout', this.onMouseOut.bind(this));
        canvas.addEventListener('mouseup', this.onMouseOut.bind(this));
    }
    /** 鼠标滚轮缩放level */
    onMousewheel(e) {
        if (e.wheelDelta > 0) {
            if (this.options.level < this.options.zoom.length - 1) {
                this.options.level += 1;
            }
        } else {
            if (this.options.level > 0) {
                this.options.level -= 1;
            }
        }
        this.drawTimeline();
    }
    /** 鼠标拖动时间轴 */
    onMouseMove(e) {
        if (this.canvasProp.isMouseDown) {
            this.canvasProp.offset = e.clientX - this.canvasProp.mouseX;
            this.drawTimeline();
        }
        const { left } = this.canvas.getBoundingClientRect();
        const hoverLineX = e.clientX - left;
        this.drawTimeline();
        this.drawHoverLine(hoverLineX, 0);
    }
    onMouseDown(e) {
        this.canvasProp.isMouseDown = true;
        this.canvasProp.mouseX = e.clientX;
        this.canvasProp.lastOffset = this.canvasProp.offset + this.canvasProp.lastOffset;
        console.log(this.canvasProp.lastOffset);
    }
    onMouseOut(e) {
        if (!this.canvasProp.isMouseDown) return;
        this.canvasProp.isMouseDown = false;
    }
    /** 绘制时间轴 */
    drawTimeline() {
        const { zoom, level, lineStyle, fontStyle } = this.options;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#ffdc23';
        this.ctx.fillRect(0, 0, this.canvas.width, 1);
        // 渲染格数(同宽度固定)
        const count = Math.floor(this.canvas.width / lineStyle.gap);
        // 偏移量(用于滚动)
        let offsetCount = 0 - Math.floor((this.canvasProp.offset + this.canvasProp.lastOffset) / lineStyle.gap);
        // 拖拽到起始点不允许操作
        if (offsetCount <= 0) {
            offsetCount = 0;
            this.canvasProp.offset = 0;
            this.canvasProp.lastOffset = 0;
        }
        for (let i = 0; i <= count; i++) {
            const flag = ((i + offsetCount) % 5) === 0;
            const h = flag ? lineStyle.height + 7 : lineStyle.height;
            this.ctx.fillStyle = lineStyle.color;
            this.ctx.fillRect(lineStyle.gap * i, 1, 1, h);
            if (flag) {
                this.ctx.fillStyle = fontStyle.color;
                this.ctx.font = fontStyle.font;
                const fontX = lineStyle.gap * i;
                this.ctx.fillText(formatTime(((i + offsetCount) * zoom[level])), fontX, h + 12);
            }
        }
    }
    /** 鼠标hover时间线 */
    drawHoverLine(x = 0, y = 0) {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(x, y, 1, this.canvas.height);
    }
    createCanvas(el) {
        const { width, height } = el.getBoundingClientRect();
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        // el.style.backgroundColor = '#121316';
        el.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        return { canvas, ctx };
    }
}

export default Timeline;