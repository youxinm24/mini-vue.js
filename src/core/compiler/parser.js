// src/compiler/parser.js

// 定义 AST 的结构
/**
 * 创建一个抽象语法树（AST）元素。
 *
 * @param {string} tag - 元素的标签名。
 * @param {Object} attrs - 元素的属性对象。
 * @param {Object} parent - 元素的父节点。
 * @returns {Object} - 创建的 AST 元素对象。
 *
 */
function createASTElement(tag, attrs, parent) {
    return {
        tag,         // 标签名
        type: 1,     // 元素类型
        children: [],// 子节点
        attrs,       // 属性数组
        parent       // 父元素
    };
}


/**
 * 解析 HTML 模板字符串并生成抽象语法树 (AST)。
 *
 * 该函数接收一个 HTML 模板字符串，并通过解析生成一个代表 DOM 结构的 AST。
 * 它使用正则表达式来匹配开始标签、结束标签和属性，并构建相应的 AST 节点。
 *
 * @param {string} template - 要解析的 HTML 模板字符串。
 * @returns {Object} - 解析后生成的 AST 根节点。
 *
 */
export function parse(template) {
    let root = null;        // 根节点
    let currentParent = null;  // 当前父节点
    const stack = [];       // 解析过程中用来管理节点的栈

    // 解析 HTML 标签的正则
    const tagRE = /<([a-zA-Z_][\w\-]*)/; // 匹配标签
    const endTagRE = /<\/([a-zA-Z_][\w\-]*)>/; // 匹配结束标签
    const attrRE = /([a-zA-Z_][\w\-]*)="([^"]*)"/g; // 匹配属性

    // 解析过程
    while (template) {
        let tagMatch = template.match(tagRE);
        if (tagMatch) {
            const tag = tagMatch[1];
            template = template.slice(tagMatch[0].length);

            // 解析属性
            const attrs = [];
            let attrMatch;
            while ((attrMatch = attrRE.exec(template))) {
                attrs.push({
                    name: attrMatch[1],
                    value: attrMatch[2]
                });
            }

            const element = createASTElement(tag, attrs, currentParent);
            if (!root) {
                root = element;  // 将第一个解析的元素作为根元素
            }
            if (currentParent) {
                currentParent.children.push(element); // 将当前节点作为父节点的子节点
            }
            stack.push(element); // 压栈，作为当前节点
            currentParent = element; // 设置当前节点为父节点

            template = template.replace(attrRE, ''); // 去掉属性部分
            template = template.replace('>', '');    // 去掉标签闭合符号
        }

        // 处理结束标签
        let endTagMatch = template.match(endTagRE);
        if (endTagMatch) {
            stack.pop(); // 栈顶节点已经完成处理，出栈
            currentParent = stack[stack.length - 1]; // 设置父节点为栈顶元素
            template = template.slice(endTagMatch[0].length); // 去掉结束标签
        }
    }

    return root;  // 返回生成的 AST
}

