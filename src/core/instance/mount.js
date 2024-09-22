// src/core/instance/mount.js
import { patch } from '../vdom/patch';

/**
 * 将 Vue 实例挂载到指定的 DOM 元素上
 * @param {Object} vm - Vue 实例对象
 * @param {string} el - 要挂载的 DOM 元素的选择器
 * @returns {void} - 该函数没有返回值
 */
export function mount(vm, el) {
    // 生成虚拟 DOM
    const vnode = vm.$options.render.call(vm);

    // 将虚拟 DOM 挂载到真实 DOM 中
    patch(null, vnode, el); // 这里调用 patch 进行首次渲染，null 表示旧 VNode 不存在
}

