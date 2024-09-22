// src/compiler/compile.js

import { parse } from './parser';
import { generate } from './codegen';

/**
 * 将模板字符串编译成渲染函数。
 *
 * @param {string} template - 要编译的 HTML 模板字符串。
 * @returns {Object} - 一个包含渲染函数和 AST 的对象。渲染函数可以直接调用以生成 DOM 元素。AST 可以用于调试或其他用途。
 *
 */
export function compile(template) {
    // 1. 将模板解析为 AST
    const ast = parse(template);

    // 2. （可选）对 AST 进行优化，这里可以跳过静态节点优化
    // optimize(ast);  // 暂时省略，Vue 中实际会进行静态节点的优化

    // 3. 生成渲染函数代码
    const code = generate(ast);

    // 返回最终的渲染函数
    return {
        render: new Function(code),  // 将生成的代码转成可执行函数
        ast      // 可以选择返回 AST 以供调试或其他用途
    };
}

