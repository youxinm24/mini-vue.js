// src/core/vdom/vnode.js

// 创建 vnode 函数
export function createElement(tag, data = {}, children = []) {
    return vnode(tag, data, children, undefined, undefined);
}

// 创建文本节点
export function createTextVNode(text) {
    return vnode(undefined, undefined, undefined, text);
}

// 虚拟节点的基础结构
function vnode(tag, data, children, text, elm) {
    return {
        tag,        // 标签名
        data,       // 属性
        children,   // 子节点
        text,       // 文本内容
        elm,        // 真实 DOM
        key: data && data.key // 节点的 key（用于优化）
    };
}
