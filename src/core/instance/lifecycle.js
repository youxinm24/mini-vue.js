// src/core/instance/lifecycle.js

import Watcher from '../observer/effect';  // 用于数据响应的观察者
import { noop } from '../util/index';  // 空函数，用于默认占位符

// 初始化生命周期状态
export function initLifecycle(vm) {
    const options = vm.$options;

    // 设置父组件
    let parent = options.parent;
    if (parent && !options.abstract) {
        while (parent.$options.abstract && parent.$parent) {
            parent = parent.$parent;
        }
        parent.$children.push(vm);
    }

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    // 初始化生命周期标记
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
}

// 挂载组件
export function mountComponent(vm, el) {
    vm.$el = el;

    // 触发 beforeMount 钩子
    callHook(vm, 'beforeMount');

    const updateComponent = () => {
        vm._update(vm._render(), false);  // 执行渲染并更新虚拟 DOM
    };

    // 创建一个 Watcher，观察数据变化并重新渲染
    vm._watcher = new Watcher(vm, updateComponent, noop);

    vm._isMounted = true;

    // 触发 mounted 钩子
    callHook(vm, 'mounted');
}

// 更新组件
export function updateComponent(vm) {
    callHook(vm, 'beforeUpdate');

    const prevVNode = vm._vnode;
    const nextVNode = vm._render();  // 重新渲染生成新的虚拟 DOM
    vm._vnode = nextVNode;

    // 更新真实 DOM
    vm._update(nextVNode, prevVNode);

    // 触发 updated 钩子
    callHook(vm, 'updated');
}

// 销毁组件
export function destroyComponent(vm) {
    if (vm._isBeingDestroyed) return;

    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;

    // 从父组件中移除自己
    const parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed) {
        parent.$children = parent.$children.filter(c => c !== vm);
    }

    // 移除所有的 Watcher
    if (vm._watcher) {
        vm._watcher.teardown();
    }

    // 销毁所有子组件
    let i = vm._watchers.length;
    while (i--) {
        vm._watchers[i].teardown();
    }

    // 移除 DOM 节点
    if (vm.$el) {
        vm.$el.__vue__ = null;
        vm.$el.parentNode.removeChild(vm.$el);
    }

    vm._isDestroyed = true;

    // 触发 destroyed 钩子
    callHook(vm, 'destroyed');

    // 移除引用
    vm.$off(); // 取消事件监听器
    vm.$children = [];
    vm.$refs = {};
}

// 更新虚拟 DOM 与真实 DOM 的差异

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode, oldVNode) {
        const vm = this;
        const prevEl = vm.$el;

        // 记录更新前的真实 DOM
        const prevVNode = vm._vnode;
        vm._vnode = vnode; // 保存当前的虚拟 DOM

        // 如果没有旧的虚拟 DOM，则表示初次渲染
        if (!oldVNode && !prevVNode) {
            vm.$el = vm.__patch__(vm.$el, vnode);
        } else {
            // 更新已有的虚拟 DOM
            vm.$el = vm.__patch__(prevVNode || oldVNode, vnode);
        }

        // 替换 $el 上的 Vue 实例引用
        if (prevEl) {
            prevEl.__vue__ = null;
        }
        if (vm.$el) {
            vm.$el.__vue__ = vm;
        }
    };
}


// 调用生命周期钩子
export function callHook(vm, hook) {
    const handlers = vm.$options[hook];
    if (handlers) {
        for (let i = 0, j = handlers.length; i < j; i++) {
            try {
                handlers[i].call(vm);  // 触发生命周期钩子
            } catch (e) {
                console.error(e);
            }
        }
    }
}

// 定义 $destroy 方法，用于销毁组件
Vue.prototype.$destroy = function () {
    const vm = this;
    if (vm._isBeingDestroyed) return;
    destroyComponent(vm);
};
