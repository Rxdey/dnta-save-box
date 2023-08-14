import { formatTime, getDefaultLevel, mergeObjects, draw } from '../util';
import { fabric } from 'fabric';

const defaultOptions = {
    /** 渲染根节点 */
    root: '',
    /** 总时长 */
    totalTime: 10000,
    /** 绘制比例每一格时间(毫秒) */
    zoom: [20, 100, 200, 1000, 2000, 6000, 12 * 1000, 120 * 1000, 360 * 1000, 720 * 1000,],
    /** 默认缩放等级(会自动计算) */
    level: 0,
    /** hover */
    hover: false,
    /** 线段配置 */
    lineStyle: {
        offset: 50,
        height: 5,
        longerHeight: 10,
        gap: 20,
        color: '#6c707e'
    },
    /** 文本配置 */
    fontStyle: {
        color: '#6c707e',
        font: 11
    },
    onClick: (e) => { }
};



const player = {
    /**当前播放位置 */
    currentTime: 1000
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
    canvasEl = null;
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
                this.render();
                return true;
            }
        });
        this.player = objProxy;
        const { canvas, ctx } = this.createCanvas(this.el);
        this.canvasEl = canvas;
        // fabric接管canvas
        this.canvas = new fabric.Canvas(canvas, {
            width: canvas.width, // 画布宽度
            height: canvas.height, // 画布高度
        });
        this.renderHeight = canvas.height / 2;
        this.update(0);
        // window.addEventListener('resize', () => {
        //     const { width, height } = this.el.getBoundingClientRect();
        //     canvas.width = width;
        //     canvas.height = height;
        //     this.update(0);
        // });
        // const eventsList = {
        //     mousewheel: this.onMousewheel.bind(this),
        //     mousedown: this.onMouseDown.bind(this),
        //     mousemove: this.onMouseMove.bind(this),
        //     mouseout: this.onMouseOut.bind(this),
        //     mouseup: this.onMouseUp.bind(this),
        // };
        // Object.keys(eventsList).forEach(e => {
        //     canvas.addEventListener(e, eventsList[e]);
        // });
        this.canvas.on('mouse:down', options => {
            console.log(`x轴坐标: ${options.e.clientX};    y轴坐标: ${options.e.clientY}`);
        });
    }

    /** 通过时间获取X轴坐标 */
    getTimeX(time = 0) {
        const { offset } = this.canvasAttr;
        const { zoom, level, lineStyle } = this.options;
        const sigleTime = zoom[level];
        return ((time / sigleTime) * lineStyle.gap) - (0 - offset);
    }
    /** 绘制时间轴 */
    render() {
        this.canvas.clear();
        const drawTimeline = this.drawTimeline();
        // const endLine = this.drawEndLine();
        const endLine = this.drawEndLine();
        const drawPlayLine = this.drawPlayLine();
        const drawLimit = this.drawLimit();
        const obj = [
            ...drawTimeline,
            // ...playLine,
            ...endLine,
            ...drawPlayLine,
            ...drawLimit
        ];
        // this.canvas.add(baseLine, ...playLine, ...endLine, ...nodeArr);
        if (this.options.hover) {
            const hoverLine = this.drawHoverLine(this.#mouseEvent.hoverLineX);
            obj.push(...hoverLine);
        }
        this.canvas.add(...obj);
    }
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
    drawLimit() {
        const { offset } = this.options.lineStyle;
        const startX = 0;
        const endX = this.getTimeX(this.options.totalTime);
        const startLine = draw.ract(startX, offset, 2, this.canvas.height, '#fba616');
        const endLine = draw.ract(endX, offset, 2, this.canvas.height, '#fba616');
        return [startLine, endLine];
    }
    /** 绘制播放进度 */
    drawPlayLine() {
        const x = this.getTimeX(this.player.currentTime);
        const line = draw.line(x, 1, x, this.canvas.height, '#f00');
        return [line];
    }
    /** 鼠标hover位置时间线 */
    drawHoverLine(x = 0) {
        const line = draw.line(x, 1, x, this.canvas.height);
        const [timeStr] = this.getCurrentTime(x);
        const text = draw.text(timeStr, x + 5, this.canvas.height - 12);
        return [line, text];
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
        el.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        return { canvas, ctx };
    }
    /** 更新绘制 根据毫秒数 */
    update(time = 0) {
        if (time > this.options.totalTime) time = this.options.totalTime;
        this.player.currentTime = time;
    }
    /** 销毁 */
    destroy() {
        this.canvas.clear();
        this.el.removeChild(this.canvasEl);
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
        this.render();
    }
    /** 鼠标拖动时间轴 */
    onMouseMove(e) {
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
            const { left } = this.canvas._offset;
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
}

export default Timeline;