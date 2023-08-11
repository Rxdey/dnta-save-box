import { createId } from '../util';
/** 
 * 基础容器
 * 父子节点逻辑
 */
class Container {
    constructor() {
        this.children = [];
        this.parent = null;
        this.id = createId();
    }
    _setParent(node) {
        this.parent = node;
    }
    /** 添加子节点/数组 */
    addChild(node) {
        if (!Array.isArray(node)) node = [node];
        for (let i = 0; i < node.length; i++) {
            if (!node instanceof Container) {
                throw Error('Unknown node type');
            }
        }
        this.children.push(...node);
    }
    /** 移除子节点/数组 */
    removeChild(node) {
        if (!Array.isArray(node)) node = [node];
        this.children = this.children.filter(item => !node.find(e => e.id === item.id));
    }
    /** 移除自身 */
    destroy() {
        this.parent.removeChild(this);
    }
}

export default Container;