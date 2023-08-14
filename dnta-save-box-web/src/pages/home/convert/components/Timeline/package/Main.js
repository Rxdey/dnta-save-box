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
    }
    /** 绘制时间轴 */
    render() {

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
    createCanvas(el) {
        const { width, height } = el.getBoundingClientRect();
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        el.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        return { canvas, ctx };
    }
}

export default Timeline;