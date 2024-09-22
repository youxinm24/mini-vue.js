// index.js
import { initInstance } from './src/core/instance/init';
import { mount } from './src/core/instance/mount';
import { parse, generate } from './src/compiler/parser';

/**
 * 创建 Vue 实例
 * @param {Object} options - 包含 Vue 实例配置的对象
 * @param {string} options.template - Vue 模板字符串
 * @returns {Object} - 包含 mount 方法的对象
 */
function createApp(options) {
    const vm = {};
    initInstance(vm, options);
    return {
        /**
         * 将 Vue 实例挂载到指定的 DOM 元素上
         * @param {string} el - 要挂载的 DOM 元素的选择器
         */
        mount(el) {
            const template = options.template;
            const ast = parse(template);
            vm.$options.render = generate(ast);
            mount(vm, document.querySelector(el));
        }
    };
}


export { createApp };
