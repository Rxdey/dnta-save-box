class Timeline {
    constructor({ root }) {
        this.el = document.querySelector(root);
        this.init();
    }
    init() {
        const { canvas, ctx } = this.createCanvas(this.el);
    }
    createCanvas(el) {
        const canvas = document.createElement('canvas');
        canvas.width = el.clientWidth;
        canvas.height = el.clientHeight;
        window.addEventListener('resize', () => {
            canvas.width = el.clientWidth;
            canvas.height = el.clientHeight;
        });
        el.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        return { canvas, ctx };
    }
}

export default Timeline;