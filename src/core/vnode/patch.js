/**
 * 更新或替换虚拟 DOM 树中的节点
 * @param {Object} oldVNode - 旧的虚拟节点
 * @param {Object} newVNode - 新的虚拟节点
 * @param {Element} parentElement - 父元素，新节点将被添加或替换到这个元素中
 */
function patch(oldVNode, newVNode, parentElement) {
    // 判断是否是同一节点
    if (oldVNode.tag !== newVNode.tag) {
        // 不是同一节点，替换旧节点
        const newElement = createElement(newVNode);
        parentElement.replaceChild(newElement, oldVNode.el);
    } else {
        // 是同一节点，复用节点并更新属性
        const el = newVNode.el = oldVNode.el;

        // 更新属性
        updateProperties(el, oldVNode.props, newVNode.props);

        // 对比子节点
        patchChildren(oldVNode.children, newVNode.children, el);
    }
}


/**
 * 批量更新父元素下的子节点，比较新旧两组子节点，并进行相应的更新、移动或删除操作
 * @param {Array} oldChildren - 旧的子节点数组
 * @param {Array} newChildren - 新的子节点数组
 * @param {Element} parentElement - 父元素，子节点将被更新或添加到这个元素中
 * @returns {void} - 该函数没有返回值
 */
function patchChildren(oldChildren, newChildren, parentElement) {
    // 初始化旧的和新的开始和结束索引，以及对应的开始和结束虚拟节点
    let oldStartIndex = 0;
    let newStartIndex = 0;
    let oldEndIndex = oldChildren.length - 1;
    let newEndIndex = newChildren.length - 1;

    let oldStartVNode = oldChildren[oldStartIndex];
    let newStartVNode = newChildren[newStartIndex];
    let oldEndVNode = oldChildren[oldEndIndex];
    let newEndVNode = newChildren[newEndIndex];

    // 进行双端比较，直到旧的或新的子节点数组被完全处理
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (sameVNode(oldStartVNode, newStartVNode)) {
            // 如果旧的开始节点和新的开始节点相同，递归地更新它们，并移动到下一个节点
            patch(oldStartVNode, newStartVNode, parentElement);
            oldStartVNode = oldChildren[++oldStartIndex];
            newStartVNode = newChildren[++newStartIndex];
        } else if (sameVNode(oldEndVNode, newEndVNode)) {
            // 如果旧的结束节点和新的结束节点相同，递归地更新它们，并移动到前一个节点
            patch(oldEndVNode, newEndVNode, parentElement);
            oldEndVNode = oldChildren[--oldEndIndex];
            newEndVNode = newChildren[--newEndIndex];
        } else if (sameVNode(oldStartVNode, newEndVNode)) {
            // 如果旧的开始节点和新的结束节点相同，更新它们，并将旧的开始节点移动到旧的结束节点的后面
            patch(oldStartVNode, newEndVNode, parentElement);
            parentElement.insertBefore(oldStartVNode.el, oldEndVNode.el.nextSibling);
            oldStartVNode = oldChildren[++oldStartIndex];
            newEndVNode = newChildren[--newEndIndex];
        } else if (sameVNode(oldEndVNode, newStartVNode)) {
            // 如果旧的结束节点和新的开始节点相同，更新它们，并将旧的结束节点移动到旧的开始节点的前面
            patch(oldEndVNode, newStartVNode, parentElement);
            parentElement.insertBefore(oldEndVNode.el, oldStartVNode.el);
            oldEndVNode = oldChildren[--oldEndIndex];
            newStartVNode = newChildren[++newStartIndex];
        } else {
            // 如果没有节点可以复用，创建新的元素并插入到旧的开始节点之前
            const newElement = createElement(newStartVNode);
            parentElement.insertBefore(newElement, oldStartVNode.el);
            newStartVNode = newChildren[++newStartIndex];
        }
    }

    // 添加剩余的新的子节点
    if (newStartIndex <= newEndIndex) {
        // 获取插入新节点的参考节点（新的结束节点的下一个兄弟节点，如果不存在则为null）
        const referenceNode = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
        // 遍历剩余的新节点，并将它们插入到参考节点之前
        while (newStartIndex <= newEndIndex) {
            const newElement = createElement(newChildren[newStartIndex]);
            parentElement.insertBefore(newElement, referenceNode);
            newStartIndex++;
        }
    }

    // 移除旧的子节点中多余的部分
    if (oldStartIndex <= oldEndIndex) {
        // 遍历剩余的旧节点，并将它们从父元素中移除
        while (oldStartIndex <= oldEndIndex) {
            parentElement.removeChild(oldChildren[oldStartIndex].el);
            oldStartIndex++;
        }
    }
}

