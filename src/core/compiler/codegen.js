// src/compiler/codegen.js

// 生成代码的核心函数
export function generate(ast) {
    // 如果不存在 ast 则返回空
    if (!ast) return '';

    const code = genElement(ast); // 调用生成节点的函数
    return `with(this){return ${code}}`;  // 生成带有 `with` 语法的渲染函数代码
}

// 生成元素节点的代码
function genElement(el) {
    const children = genChildren(el);  // 生成子节点的代码
    const code = `_c('${el.tag}'${el.attrs.length ? `,${genProps(el.attrs)}` : ''}${children ? `,${children}` : ''})`;
    return code;
}

// 生成子节点
function genChildren(el) {
    const children = el.children;
    if (children) {
        return children.map(c => genNode(c)).join(',');
    }
}

// 生成节点
function genNode(node) {
    if (node.type === 1) {  // 如果是元素节点
        return genElement(node);
    } else if (node.type === 3) {  // 如果是文本节点
        return genText(node);
    }
}

// 生成文本节点
function genText(text) {
    return `_v(${JSON.stringify(text.text)})`;
}

// 生成属性
function genProps(attrs) {
    let props = '';
    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        props += `"${attr.name}":${JSON.stringify(attr.value)},`;
    }
    return `{${props.slice(0, -1)}}`;  // 去掉最后一个多余的逗号
}
