## React

### 一、组件基础

1/8 3月5日11:53

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


#### 9. React 高阶组件是什么，和普通组件有什么区别，适用什么场景


#### 11. 哪些方法会触发 React 重新渲染？重新渲染 render 会做些什么？


#### 14. 对有状态组件和无状态组件的理解及使用场景

#### 23. React中什么是受控组件和非控组件？


#### 28. 类组件与函数组件有什么异同？