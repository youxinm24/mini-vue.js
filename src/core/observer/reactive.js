// src/core/observer/reactive.js

import { Dep } from './effect';  // 引入依赖收集器

// 定义响应式对象
/**
 * 定义一个响应式属性。
 * 这个函数接受一个对象、一个键和一个值，并将该值设置为响应式的。
 * 如果值是对象，则递归地使其变为响应式。
 * 当属性被访问或修改时，会进行依赖收集和触发更新。
 *
 * @param {Object} obj - 要定义响应式属性的目标对象。
 * @param {string} key - 要定义的属性的键。
 * @param {any} val - 要定义的属性的值。
 * @returns {void} - 该函数没有返回值。
 *
 * @example
 */
export function defineReactive(obj, key, val) {
    const dep = new Dep();  // 每个属性都会有一个 Dep 实例

    // 如果 val 是对象，则递归调用 defineReactive 使其响应式
    if (typeof val === 'object' && val !== null) {
        observe(val);
    }

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            if (Dep.target) {
                dep.depend();  // 依赖收集
            }
            return val;
        },
        set(newVal) {
            if (newVal === val) return;
            val = newVal;

            // 如果新的值是对象，则递归使其响应式
            if (typeof newVal === 'object' && newVal !== null) {
                observe(newVal);
            }

            dep.notify();  // 数据更新，通知所有订阅者
        }
    });
}


// 将对象的每个属性转为响应式
/**
 * 递归地将对象的每个属性变为响应式。
 * 
 * @param {Object} value - 要观察的对象。
 * @returns {void} - 该函数没有返回值。
 * 
 * @example
 */
export function observe(value) {
    if (typeof value !== 'object' || value === null) {
        return;
    }

    Object.keys(value).forEach(key => {
        defineReactive(value, key, value[key]);
    });
}



