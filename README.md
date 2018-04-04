# distributedPV
分布式光伏

本项目模块结构进行了优化，分离了业务组件和纯组件，提高组件复用性，模块结构更加清晰。
### 一、目录结构：

- /src
	- /common --------------- 公用类库
	- /components ------------ Dumb 组件
    - /Home ------------ 首页
		- /Power ------------ 电站管理
	- /constants ------------- 公用常量
		- /actionTypes
		- /url
	- /containers ------------ Smart 组件
		- /Main --------- 总框架页面（包括各种路由）
    - /Home --------- 首页
		- /Power --------- 电站管理
      - PostList.jsx ------ 采用 Saga 获取数据
      - UserList.jsx ------ 采用 Thunk 获取数据
	- /redux
		- /reducer
		- /saga
  - /theme
    - /iconfont ------ 字体
    - /img ------ 图片
    - style.scss ------ 总样式
  - /utils
  - app.js
  - router.js ------ 以后的路由提取出来集中管理，to do
- .babelrc
- index.html
- package.json
- README.md
- webpack.config.js

### 二、模块间调用关系

`app.js` 为启动入口，配置好 **Thunk/Saga**，将 `store` 传入 `<Main />`；

 `<Main />` 为 **container** 中的业务组件，主要框架，专门用来获取异步数据，这样就可以跟 **component** 中的纯组件解耦；

**component** 中的组件不用关心外部的情况，只需要关注传入的 `props` 进行渲染即可。

> 每个 Smart 组件跟 Dumb 组件都通过 `connect` 传递 `props`：通过 `mapStateToProps` 传递 state，通过 `mapDispatchToProps` 传递 dispatch。

#### （1）Thunk 处理流程

**/container/UserList.js**

**Thunk** 直接在业务组件中 `dispatch` 一个函数来异步获取数据。


#### （2）Saga 处理流程

**Saga** 在业务组件中 `dispatch` 一个获取数据的 `action` 命令，然后 `saga` 监听到该 `action` 之后再去获取数据。

---
最后，**Thunk** 和 **Saga** 在异步获取数据之后都会再 `dispatch` 一个 `action`，然后，`reducer` 根据原有的 state 和 该 `action` 返回新的 `state`。
