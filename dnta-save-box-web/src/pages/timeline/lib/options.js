const defaultOptions = {
    /** 渲染根节点 */
    root: '',
    /** 总时长 */
    totalTime: 60000,
    /** 绘制比例每一格时间(毫秒) */
    zoom: [20, 100, 200, 1000, 2000, 6000, 12 * 1000, 120 * 1000, 360 * 1000, 720 * 1000,],
    /** 默认缩放等级(会自动计算) */
    level: 0,
    /** hover */
    hover: false,
    /** 线段配置 */
    lineStyle: {
        offset: 10,
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
    limitWidth: 10,
    limit: {
        start: {
            time: 3000,
            left: 0
        },
        end: {
            time: 5000,
            left: 0
        },
    },
    onClick: (e) => { },
    onLimitUpdate: (e) => {}
};

export default defaultOptions;