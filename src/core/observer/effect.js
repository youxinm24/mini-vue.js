// src/core/observer/effect.js

/**
 * 依赖收集器，维护一个订阅者列表，负责通知他们数据的变化
 */
export class Dep {
    constructor() {
        this.subs = [];  // 初始化订阅者列表
    }

    /**
     * 添加一个订阅者到列表中
     * @param {Object} sub - 订阅者对象
     */
    addSub(sub) {
        this.subs.push(sub);
    }

    /**
     * 收集依赖，当前正在执行的 Watcher 会被添加到依赖列表中
     * 如果没有正在执行的 Watcher，则不会收集依赖
     */
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    }

    /**
     * 通知所有订阅者数据已经更新
     * 当数据发生变化时，调用此方法通知所有订阅者
     */
    notify() {
        this.subs.forEach(sub => sub.update());
    }
}


// 全局唯一的 Dep.target，用于依赖收集
Dep.target = null;

export class Watcher {
    /**
   * 构造函数
   *
   * @param {Object} vm - Vue 实例
   * @param {Function|string} expOrFn - 表达式或函数，将被用于Watcher
   * @param {Function} cb - 回调函数，将在Watcher 触发时执行
   *
   */
    constructor(vm, expOrFn, cb) {
        this.vm = vm;
        this.cb = cb;
        this.getter = expOrFn;

        this.value = this.get();
    }

    /**
     * 获取当前值，并进行依赖收集
     */
    get() {
        Dep.target = this;
        const value = this.getter.call(this.vm);
        Dep.target = null;
        return value;
    }

    /**
     * 更新时执行
     */
    update() {
        const newValue = this.get();
        const oldValue = this.value;
        this.value = newValue;
        this.cb.call(this.vm, newValue, oldValue);
    }

    /**
     * 在 Watcher 中添加依赖
     */
    addDep(dep) {
        dep.addSub(this);
    }

}

