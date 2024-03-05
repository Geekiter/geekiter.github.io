## HTML+CSS

14/37 3月5日 17:57

## 1.说一下 web worker

在HTML页面中，如果在执行脚本时，页面的状态是不可响应的，知道脚本执行完成后，页面才变得可以响应。web worker是运行在后台的js，独立于其他的脚本，不会影响页面性能。并且通过postMessage将结果回传到主线程。这样在进行复杂操作的时候就不会阻塞主线程了。

如何创建web worker：
1. 检测浏览器对于web worker的支持
2. 创建web worker的文件
3. 创建web worker对象

## 2.行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？
- 行内：span, a, b, img, input, select strong
- 块级别：h、p、div, ul, ol, li
## 3. CSS选择器及其优先级
- 标签内的,1000
- id,100
- class, 10
- 伪类选择器，10
- 标签选择器， 1
- 伪元素选择器，1
- 子元素选择器，0
- 后代选择器，0
- 通配符选择器，0
## 4.display的属性值及其作用

- none，元素不显示，从文档中移除
- block，块元素，继承父元素宽度
- inline，行内元素，默认宽度为内容宽度，不可以设置宽高
- inline-block，宽度为内容宽度，可以设置宽高
- list-item，添加样式列表标记
- table，块级表格
- inherit，集成父元素的display属性
- flex，flex布局
## 5.display的block、inline和inline-block的区别

1. block：会占用一行，可以设置width、height、margin、padding属性
2. inline，不会占用一行，width、height无效，垂直方向的padding、margin无效，可以设置水平方向的margin和padding
3. inline-block，将对象设置为inline对象，但是对象内容作为block对象程序，内联对象会排列在同一行。不会单独占据一行，又拥有块级元素的特性，宽高上下边距。

## 6. 隐藏元素的方法

- display: none
- visibility: hidden
- opacity: 0
- position: absolute
- z-index: -xx
- transform: scale(0, 0)

## 7. link和@import的区别

- link除了能加载css，还能加载rss。@import只能加载css
- link和页面同时加载，@import是载入完成后再加载
- link兼容性好，@import是css2.1提出的

## 8. display:none与visibility:hidden的区别

- 渲染树
	- display会脱离文本流
	- visibility不会脱离文本流
- 继承
	- display非继承性
	- visibility是继承属性，子孙节点可以显示
## 9. 伪元素和伪类的区别和作用？

- 伪元素是在元素前后插入元素或样式，但并不在文档源代码中，只在外部显示可见
- 伪类将特殊效果添加到特定选择器上，是已有的元素上添加类别，不会产生新的元素。.

## 10. 对盒模型的理解

标准盒模型、IE盒模型。

标准盒模型width和height包含content，IE盒模型包含了border、padding、content
box-sizeing: content-box 标准盒模型
box-sizeing: border-boxIE盒模型

## 11. 对 CSSSprites 的理解

将一个页面涉及到的所有图片都包含到一张大图里，利用css的background-image、background-repeat、background-position属性对背景定位
- 优点：
	- 减少http请求，提高页面性能
	- 减少图片的字节
- 缺点
	- 图片合并麻烦
	- 维护麻烦

## 12. CSS预处理器/后处理器是什么？为什么要使用它们？

预处理器：less，sass，stylus，用来预编译sass，less，增加css的复用性，还有编程特性，兼容性
后处理器：postCss，根据css规范，处理css。比如解决一些兼容性问题

## 13. display:inline-block 什么时候会显示间隙？
1. 空格
2. margin
3. font-size

## 14. 单行、多行文本溢出隐藏

- 单行文本溢出
```css
{

overflow: hidden; //溢出隐藏
text-overflow: ellipsis; //溢出用省略号显示
white-space: nowrap; // 规定段落中的文本不换行
}
```
- 多行文本溢出
```css
{

overflow: hidden
text-overflow: ellipsis;
display: -webkit-box; //作为弹性伸缩盒子显示
-webkit-box-orient: vertical; //从上到下锤子排列
-webkit-line-clamp: 3; //显示的行数

}


```



## React

### 一、组件基础

1/8 3月5日 11:53
2/8 3月5日 14:24
1/2 3月5日 15:17
8/8 3月5日 15:54
#### 1. React 事件机制



- react在document处监听了所有事件，当事件发生并冒泡到document，将事件内容封装成合成事件并交给真正的处理函数处理
	- 没有将click事件绑定到真是的dom上，所以要用event.preventDefault()阻止事件冒泡，而不是event.stopPropagation()方法
	- 好处：
		- 减少了内存的消耗
		- 让组件挂载销毁时统一订阅和移除事件
		- 抹平浏览器之间的兼容性

#### 4. React 高阶组件、Render props、hooks 有什么区别，为什么要不断迭代

- hoc、render props、hook都是为了解决代码复用的问题。
- hoc接收一个组件和一个可选的参数，返回一个组件。通过包装现有的组件来添加新的行为和功能
- render props接收一个返回react函数，将render的渲染注入到组件内部。父组件通过一个函数prop将渲染逻辑传给子组件，子组件通过函数获取渲染要渲染的内容。
- hook是react16.8的新特性，可以使用状态useState、生命周期useEffect、上下文useContext

#### 5. 对React-Fiber的理解，它解决了什么问题？


- React 15在渲染是会递归对比虚拟Dom树，再出需要变动的节点，然后同步更新他们，一气呵成。这个过程React会占据浏览器资源，会导致用户触发的事件得不到响应，导致用户感觉卡顿。
- React通过fiber架构让渲染过程可中断，让浏览器及时响应用户交互。
- 此外fiber还可以分批延时对DOM进行操作，避免一次性操作大量的DOM节点

#### 9. React 高阶组件是什么，和普通组件有什么区别，适用什么场景

- 高阶组件，输入为一个组件和一个可选参数，输出一个组件
	- 场景
		- 代码、状态逻辑复用
		- 渲染劫持，权限控制
- 普通组件
	- 场景
		- 描述UI、功能单一、易于理解
	- 类组件
		- 继承Component，输出组件
	- 函数组件
		- 输入props，输出组件
```js
function hoc(wrappedComponent, optionalData){
	return class extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				data: optionalData(DataSource, props)
			}
		}
	}

	render(){
		return <WrappedComponent data={this.state.data} {...this.props}/>;
	}
}

const BlogPostWithSubscription = hoc(BlogPost, (DataSource, props)=>DataSource.getBlogPost(props.id));

//普通组件
import React, {Component} from "react";

class MyCompoent extends Component{
	render(){
		return <div>...</div>
	}

}

function MyCompoent(props) {
	return <div>...</div>

}

```



#### 11. 哪些方法会触发 React 重新渲染？重新渲染 render 会做些什么？
- 哪些方法
	- State
	- Props
	- force update
	- 生命周期方法
	- Context变化
- 会做些什么
	- 调用render生成虚拟dom
	- 用Diff算法对新旧虚拟DOM节点进行对比
		- 对新旧两棵树进行深度优先遍历，进行标记对比。更具差异类型和对应的规则更新变化部分的虚拟DOM节点
	- 生命周期调用

#### 14. 对有状态组件和无状态组件的理解及使用场景

无状态一般是纯展示性的组件，简单UI。
有状态适用于复杂UI和处理用户交互的组件。

#### 23. React中什么是受控组件和非控组件？

- 受控组件
	- 受到state控制
	- 用户与组件交互时，通常会触发事件来处理函数，更新组件state
- 非受控组件
	- 不受state控制
	- 由DOM元素本身管理
	- 在非受控组件中，可以使用ref来获取输入框的值
#### 28. 类组件与函数组件有什么异同？
- 不同
	- 生命周期
		- 在react16.8之前，函数组件没有生命周期
	- 代码量，函数更轻量
	- 性能，函数更快，但是微不足道
	- 初始化状态，类组件在构造函数中进行，函数组件在useState hook来初始化状态
- 共同
	- 用途，都是为了构建用户界面和定义组件行为
	- 组件特性，都可以接受输入props
	- 组件嵌套，都可以嵌套成组件树