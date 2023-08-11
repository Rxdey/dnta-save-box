import Container from './Container';
import { mergeObjects } from '../util';

const defaultOptions = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rotation: 0,
    alpha: 1,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    visible: true
};

/** 
 * 基础节点
 * 包含位置、尺寸、等基础属性
 */
class Node extends Container {
    constructor(options) {
        super();
        this.#initOptions(options);
    }
    #initOptions(options) {
        const data = mergeObjects(options, defaultOptions);
        Object.keys(data).forEach(item => {
            this[item] = data[item];
        });
    }
}

export default Node;