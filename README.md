## 项目简介
一个WebApp版的cnode客户端，项目采用react技术栈构建。组件选用的是[Material-UI](http://www.material-ui.com/)。
- 感谢来自[cnodejs论坛](https://cnodejs.org/)官方提供的api！

## 功能
- 首页列表，下拉时自动加载下一页，在顶端上拉刷新。
- 主题详情，登陆后能够收藏，评论和点赞。
- 消息提醒，能查看消息详情和清空所有未读消息
- 个人主页，包括最近参与，回复，以及收藏的主题
- 发表主题，成功后能跳转到相应主题页面
- 页面后退，能还原数据和滚动位置

## 运用的技术主要有:
- 采用react技术栈，通过Redux来管理页面状态，通过Router来设置页面路由
- 组件选用的是Material-UI，不再自己造轮子，既美观又能方便触控操作
- 使用react-flip-move插件来实现list的加载动画
- 修改react-pullrefresh插件，实现了首页上拉刷新效果
- 应用`isomorphic-fetch`库代替`XMLHttpRequest`实现网络请求
- 使用`PostCSS`对CSS进行预处理
- 通过`CSSModules`处理模块内部的类名

## 预览
[DEMO](https://arssam.github.io/react-redux-cnode/build/production/index.html)

## 运行项目
```
  git clone https://github.com/arssam/react-redux-cnode.git
  cd cnode
  npm install webpack-dev-server webpack -g (没有安装webpack的需要安装)
  npm install
  npm start
```

## 生产项目
```
  npm run build(项目生成在./build/production)
```
## TODO
- 增加react-router过渡动画
- 优化页面性能
