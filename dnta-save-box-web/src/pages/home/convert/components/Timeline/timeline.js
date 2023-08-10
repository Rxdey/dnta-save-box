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
        height: 5,
        longerHeight: 10,
        gap: 20,
        color: '#6c707e'
    },
    /** 文本配置 */
    fontStyle: {
        color: '#e5e5e5',
        font: '12px'
    },
    onClick: (e) => { }
};

const player = {
    /**当前播放位置 */
    currentTime: 0
};
/**
 * canvas时间轴
 * ✅ 鼠标滚轮缩放显示比例 
 * ✅ 鼠标拖动
 * ✅ 播放进度展示/跳转
 * 🚧 多区块层级点击事件
 * 🚧 时间区间选择
 * (开发中...)
 */
class Timeline {
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
    renderHeight = 0;
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
        this.canvas = null;
        this.ctx = null;
        this.init();
    }
    init() {

        this.options.level = getDefaultLevel(this.options.totalTime, this.options.zoom);
        // 动态监听播放位置
        const objProxy = new Proxy(player, {
            get: (target, key) => {
                return target[key];
            },
            set: (target, key, newValue) => {
                target[key] = newValue;
                this.drawTimeline();
                return true;
            }
        });
        this.player = objProxy;
        const { canvas, ctx } = this.createCanvas(this.el);
        this.canvas = canvas;
        this.ctx = ctx;
        this.renderHeight = canvas.height / 2;
        this.update(0);
        window.addEventListener('resize', () => {
            const { width, height } = this.el.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;
            this.update(0);
        });
        const eventsList = {
            mousewheel: this.onMousewheel.bind(this),
            mousedown: this.onMouseDown.bind(this),
            mousemove: this.onMouseMove.bind(this),
            mouseout: this.onMouseOut.bind(this),
            mouseup: this.onMouseUp.bind(this),
        };
        Object.keys(eventsList).forEach(e => {
            canvas.addEventListener(e, eventsList[e]);
        });
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
        this.#mouseEvent.isMouseOut = false;
        this.#mouseEvent.isMouseClick = false;
        if (this.#mouseEvent.isMouseDown) {
            this.#mouseEvent.offset = e.clientX - this.#mouseEvent.mouseX;
            this.drawTimeline();
        }
        const { left } = this.canvas.getBoundingClientRect();
        this.#mouseEvent.hoverLineX = e.clientX - left;
        this.drawTimeline();
    }
    /** 鼠标按下 */
    onMouseDown(e) {
        this.#mouseEvent.isMouseDown = true;
        this.#mouseEvent.isMouseClick = true;
        this.#mouseEvent.mouseX = e.clientX;
        this.#mouseEvent.lastOffset = this.#mouseEvent.offset + this.#mouseEvent.lastOffset;
        // 初始化时重置状态
        this.#mouseEvent.offset = 0;
    }
    /** 鼠标松开 通过isMouseClick判断点击*/
    onMouseUp(e) {
        if (this.#mouseEvent.isMouseClick) {
            const { left } = this.canvas.getBoundingClientRect();
            this.options.onClick(...this.getCurrentTime(e.clientX - left));
        }
        this.onMouseOut(e);
    }
    /** 鼠标离开canvas*/
    onMouseOut(e) {
        this.#mouseEvent.isMouseOut = true;
        if (!this.#mouseEvent.isMouseDown) return;
        this.#mouseEvent.isMouseDown = false;
    }
    /** 通过时间获取X轴坐标 */
    getTimeX(time = 0) {
        const { offset } = this.canvasAttr;
        const { zoom, level, lineStyle } = this.options;
        const sigleTime = zoom[level];
        return ((time / sigleTime) * lineStyle.gap) - (0 - offset);
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
        let offsetCount = 0 - Math.floor((this.#mouseEvent.offset + this.#mouseEvent.lastOffset) / lineStyle.gap);
        this.canvasAttr.offset = this.#mouseEvent.offset + this.#mouseEvent.lastOffset;
        this.canvasAttr.count = count;
        // 拖拽到起始点不允许操作
        if (offsetCount <= 0) {
            offsetCount = 0;
            this.#mouseEvent.offset = 0;
            this.#mouseEvent.lastOffset = 0;
        }
        this.drawEndLine();
        this.drawPlayline();
        this.drawHoverLine(this.#mouseEvent.hoverLineX);
        for (let i = 0; i <= count; i++) {
            const flag = ((i + offsetCount) % 5) === 0;
            const h = flag ? lineStyle.longerHeight : lineStyle.height;
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
    /** 鼠标hover位置时间线 */
    drawHoverLine(x = 0, y = 0) {
        // this.drawTimeline();
        if (this.#mouseEvent.isMouseOut) return;
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(x, y, 1, this.canvas.height);
        const [timeStr] = this.getCurrentTime(x);
        this.ctx.fillText(timeStr, x + 5, this.canvas.height - 12);
    }
    /** 绘制播放进度色块 */
    drawPlayline() {
        const width = this.getTimeX(this.player.currentTime);
        const [timeStr] = this.getCurrentTime(width);
        this.ctx.fillStyle = 'rgba(117, 252, 162, .3)';
        this.ctx.fillRect(0, 0, width, this.renderHeight);
        this.ctx.fillStyle = 'rgba(117, 252, 162, .5)';
        this.ctx.fillText(timeStr, width + 5, this.renderHeight - 14);
    }
    /** 绘制总长度色块 */
    drawEndLine() {
        const x = this.getTimeX(this.options.totalTime);
        const [timeStr] = this.getCurrentTime(x);
        this.ctx.fillStyle = 'rgba(232, 0, 0, .1)';
        this.ctx.fillRect(0, 0, x, this.renderHeight);
        this.ctx.fillStyle = 'rgba(232, 0, 0, 1)';
        this.ctx.fillText(timeStr, x + 5, this.renderHeight - 2);
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
    /** 更新绘制 根据毫秒数 */
    update(time = 0) {
        if (time > this.options.totalTime) time = this.options.totalTime;
        this.player.currentTime = time;
    }
    /** 重新加载 */
    // reload(options) {
    //     this.options = mergeObjects(options, defaultOptions);
    //     this.init();
    // }
    /** 销毁 */
    destroy() {
        this.el.removeChild(this.canvas);
    }
}

export default Timeline;