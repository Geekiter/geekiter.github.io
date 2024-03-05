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