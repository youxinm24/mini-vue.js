# **项目目录结构**

```
mini-vue/
├── src/
│   ├── core/
│   │   ├── observer/          # 响应式系统
│   │   │   ├── reactive.js    # 响应式数据实现
│   │   │   └── effect.js      # 依赖收集与 Watcher
│   │   ├── vnode/             # 虚拟 DOM 实现
│   │   │   ├── vnode.js       # 虚拟 DOM 的创建
│   │   │   └── patch.js       # 真实 DOM 的渲染与更新
│   │   ├── compiler/          # 模板编译模块
│   │   │   ├── parser.js      # 将模板解析为 AST
│   │   │   ├── codegen.js     # 生成 render 函数
│   │   │   └── compile.js     # 编译入口，将 template 编译为 render
│   │   ├── global-api/
│   │   │   └── nextTick.js    # 实现 $nextTick 功能
│   │   ├── instance/          # Vue 实例相关
│   │   │   ├── init.js        # Vue 实例初始化
│   │   │   ├── lifecycle.js     # 实现生命周期管理
│   │   │   ├── render.js      # render 函数的实现与调用
│   │   │   └── mount.js       # 组件挂载与渲染
│   │   └── directive/         # 指令系统，如 v-on 等
│   │       └── vOn.js         # v-on 实现
├── index.js                   # mini-vue 入口文件
└── package.json               # 项目配置文件

```


