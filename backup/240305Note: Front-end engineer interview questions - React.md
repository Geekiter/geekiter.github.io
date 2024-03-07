

## React

### 一、组件基础
#### 1. React 事件机制

```js
<div
	onClick={this.handleClick.bind(this)}
>
	点我
</div>
```

react并不是将click事件绑定到div真实的dom上，而是在document处监听了所有的事件。当事件发生并且冒泡在document处时，react将事件内容封装并交给真正的处理函数处理，这样的方式不仅仅减少了内存的消耗，还能在挂件在销毁时统一订阅和移除事件。
除此之外，冒泡到document上的事件也不是原生的浏览器事件，而是由react自己实现的合成事件。因此不想事件冒泡，应该调用event.preventDefault()方法，而不是调用event.stopPropagation()方法。
So,
- react在document处监听了所有事件，当事件发生并冒泡到document，将事件内容封装成合成事件并交给真正的处理函数处理
	- 没有将click事件绑定到真是的dom上，所以要用event.preventDefault()阻止事件冒泡，而不是event.stopPropagation()方法
	- 好处：
		- 减少了内存的消耗
		- 让组件挂载销毁时统一订阅和移除事件
		- 抹平浏览器之间的兼容性
#### 4. React 高阶组件、Render props、hooks 有什么区别，为什么要不断迭代

- 高阶组件HOC是react用于复用组件逻辑的一种高级技巧。HOC自身不是React API的一部分，他是基于React的组合特性而形成的设计模式。具体而言，高阶组件是参数为组件，返回值为新组件的函数。HOC接受一个组件和额外的参数（如果需要），返回一个新的组件。
```js
function withSubscription(WrappedComponent, selectData){
	return class extend React.Component {
		constructor(props){
			super(props);
			this.state = {
				data: selectData(DataSource, props)
			};
		}
		render(){
			return <WrappedComponent data={this.state.data} {...this.props}/>;
		}
	}
}
const BlogPostWithSubscription = withSubscription(BlogPost, (DataSOurce, props) => DataSource.getBLogPost(props.id));
```


- render props是一种在React组件之间使用一个值为函数的prop共享代码的简单技术。render prop是一个用于告知组件需要渲染什么内容的函数prop

```js


```
- 通常，render props和高阶组件只渲染一个子节点。让Hook来服务这个使用场景更简单，Hook可以帮助减少桥套。

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

23
## 数据管理

#### 1. React setState 调用的原理
- 首先调用setState入口函数，根据输入参数不同，分发到不同功能函数中去
```js
ReactComponent.prototype.setState = function(partialState, callback){
	this.updater.enqueueSetState(this, partialState);
	if (callback) {
		this.updater.enqueueCallback(this, callback, "setState");
	}
}
```
- enqueueSetState将新的state放进组件的状态队列，调用enqueeUpdate来处理将要更新的实例
```js
enqueueSetState: function(publicInstance, partialState){
	var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, "setState");
	var queue = internalInstance._pendingStateQueue||(internalInstance._pendingStateQueue = []);
	queue.push(partialState);
	enqueueUpdate(internalInstance);
}
```
- 在enqueueUpdate方法引出一个关键的对象batchingStrategy，该对象所具备的isBatchingUpdates属性直接决定了当下是要走更新流程，还是应该排队等待；如果轮到执行，就调用batchUpdates方法发起更新流程。由此可以推测，batchingStrategy或许正是React内部专用于批量更新的对象
```js
function enqueueUpdate(component){
	ensureInjected();
	if(!batchingStrategy.isBatchingUpdates){
		batchingStrategy.batchedUpdates(enqueueUpdate, component);
		return
	}
	dirtyComponents.push(component);
	if(component._updateBatchNUmber == null){
		component._updateBatchNumber = updateBatchNumber + 1;
	}
}
```

- setState
- enqueueSetState：将新的状态放入组件的状态队列，调用enqueueUpdate来处理要更新的视力
- enqueueUpdate
- isBatchingUpdates，是否批量创建/更新组件
	- true: dirtyComponent，更新组件
	- false: dirtyComponents，推入组件

#### 2. React setState 调用之后发生了什么？是同步还是异步？

在代码中调用setState，React会将传入的参数对象与组件当前的状态合并，然后触发调和过程，经过调和过程。React会以相对高效的方式根据新的状态React元素树并且着手重新渲染整个UI界面。
React得到元素树之后，React会自动计算出新的树和老树的节点差异，然后根据差异对界面进行最小化重新渲染。在差异计算算法中，React能够精确地知道哪些位置发生了改变以及如何改变，这就保证了按需更新，而不是重新渲染。如果短时间频繁setState，React会将state的改变压入栈，在合适的时机，批量更新state和视图，达到提高性能的效果。

- React将输入和组件当前的状态合并，触发调和过程
- 得到新的元素树
- 计算新老树的差异
- 按需更新
- 如果短时间频繁setState，将state改变压入栈，在合适的时机批量更新state和视图
#### 7. 在React中组件的this.state和setState有什么区别？
this.state通常是用来初始化state，setState是用来修改state值的。如果直接修改state页面是不会更新的。

#### 9. React组件的state和props有什么区别？
- props是传递给函数的形参，state是组件内自己管理的变量
- props是不可以被修改的，react要不好props不能被修改
- state是在组件中创建的，一般在constructor中初始化

### 三、生命周期

#### 1. React的生命周期有哪些？

- 装载阶段Mount
	- constructor 用来创建组件
	- render，渲染返回需要渲染的内容
	- componentDidMount，挂在完成后执行
- 更新阶段Update
	- 给组件创建props、setState、forceUpdate都会重新调用render函数，
	- 更新完成后执行componentDidUpdate
- 卸载过程Unmount
	- 移除完成执行componentWillUnmount

### 四、组件通信
#### 1. 父子组件的通信方式？

- 父到子
	- props
```js
const Child = props => {
	return <p>{props.name}</p>
}
const Parent = () => {
	return <Child name="rect"></Child>
}
```
- 子到父
	- props+回调
```js
const Child = props => {
	const cb = msg => {
		return () => {
			props.callback(msg)
		}
	}
	return {
		<button onClick={cb("你好")}>你好</button>
	}
}

class Parent extends Component {
	callback(msg){
		console.log(msg)
	}
	render(){
		return <Child callback={this.callback.bind(this)}></Child>
	}
	
}
```
#### 2. 跨级组件的通信方式？

父组件向子组件的子组件通信，向更深层子组件通信：

- props
- context
```js
const BatteryContext = createContext();
// 子组件的子组件
class GrandChild extends Component {
	render(){
		return (
			<BatteryContext.Consumer>
				{
					color => <h1
	style={{"color": color}}我是红色的：{color}></h1>
				}
			</BatteryContext.Consumer>
		
		)
	}
}

// 子组件
const Child = () => {
	return (
		<GrandChild/>
	)
}

// 父组件
class Parent extends Component {
	state = {
		color: "red"
	}
	render(){
		const {color} = this.state;
		return (
			<BatteryContext.Provider value={color}>
				<Child></Child>
			</BatteryContext.Provider>
		)
	}

}
```

#### 3. 非嵌套关系组件的通信方式？

- 事件通信，订阅模式
- redux全局状态管理
- 兄弟之间可以找到共同的父节点通信

#### 5. 组件通信的方式有哪些

- props
- props+回调
- Context
- 订阅模式
- 全局状态管理

### 五、路由

#### 1. React-Router的实现原理是什么？

- hash模式
	- 监听hashchange
- history
	- 监听url变化

#### 7. React-Router的路由有几种模式？

- history的BrowserRouter模式
- HashRouter模式

### 六、Redux
#### 1. 对 Redux 的理解，主要解决什么问题

react是视图层框架，redux是一个用来管理数据状态和UI状态的js应用工具。随着js单页应用变得复杂，js需要更多状态，redux就是为了降低管理难度的。
在redux中，提供了一个叫store的统一仓储库，组件通过dispatch将state直接传入store，不用通过其他组件。并且组件通过subscribe从store获取到state的改变，使用了redux，所有的组件都可以从store获取到所需的state，他们也能从store获取到state的改变。
解决的问题：react-redux的作用是将redux的状态机和react的ui绑定在一起，当你dispatch action改变state的时候，会自动更新页面。

#### 2. Redux 原理及工作流程
工作流程
1. view通过dispatch发出action
2. store调用reducer，传入state、action，reduce返回新的state
3. state有了变化，store调用监听函数，更新view

#### 9. Redux 和 Vuex 有什么区别，它们的共同思想
- 区别
	- vuex改进了redux的action和reducer函数，以及mutations变化函数取代reducer，无需switch，只需要在对应的mutation函数里改变state值即可
	- vuex由于vue自动重新渲染的特性，无需订阅。
	- vuex数据流的顺序是view调用store.commit提交对应的请求到store中对应的mutation函数到store改变
- 共同思想
	- 单一数据源
	- 变化可以预测
### 七、Hooks

#### 1. 对 React Hook 的理解，它的实现原理是什么

hook让组件实现变得更加简洁。
闭包

#### 2. 为什么 useState 要使用数组而不是对象

- 简洁
- 对象需要起别名

#### 3. React Hooks 解决了哪些问题？

- 组件之间复用状态逻辑困难的问题
- 复杂组件难以理解
- class难以理解


### 八、虚拟DOM

#### 1. 对虚拟 DOM 的理解？虚拟 DOM 主要做了什么？虚拟 DOM 本身是什么？

虚拟DOM是一个React的优化手段，通过在内存中维护一份轻量的DOM副本，实现更高效的渲染和更新机制。
工作流程：
- 状态更新
- 虚拟DOM表示
- 差异计算
- 实际DOM操作
虚拟DOM本身是一个内存中的表示真实DOM结构的js对象树，用于提高渲染的性能和优化DOM操作。


#### 2. React diff 算法的原理是什么？

diff算法是为了找出新旧虚拟DOM之间的差异，以最小化对实际DOM的操作。
算法的核心：
- 同层比较，不跨层级比较
- 节点类型比较，如果节点类型不同，就会将节点和子节点全部替换，不会再深入比较子节点
- 唯一key标识，比较完节点类型，再比较节点属性，如果节点有唯一的key标识，react会尽量复用这个节点
- 递归比较子节点，没有唯一key标识，会递归比较子节点的差异。
- 列表节点优化，处理列表时，会通过判断位移、删除和添加来最小化操作。

### 九、其他

#### 5. 对 React 和 Vue 的理解，它们的异同

- 相似
	- 将重心都放在核心库，将其他功能比如路由和全局状态交给其他库
	- 都有自己的构建工具，得到一个最佳实践的项目模板
	- 都使用虚拟DOM重绘性能
	- 都有props概念，允许组件间的数据传递
	- 都鼓励组件化，提高复用性
- 不同
	- 数据流
		- Vue默认支持数据双向绑定，React提倡单向数据流
		- 虚拟DOM
			- Vue会根据每个组件的依赖关系，而不会重新渲染整个组件树
			- React的全部子组件都会重新渲染，当然可以通过PureComponent/ShouldComponentUpdate这个生命周期方法来控制
		- 组件化
			- Vue默认使用HTML模板
			- React推荐使用JSX

#### 12. 在React中遍历的方法有哪些？

遍历数组，map&&forEach
```js
arr.map((item, index) => {
	
})

arr.forEach((item, index) => {

})
```

遍历对象，map for in
```js
for(const key in obj){
	if(obj.hasOwnProperty(key){
		const value = obj[key]
		domArr.push(...)
	})
}

Object.entries(obj).map(([key, value], index)=>{

})
```
#### 19. 对React SSR的理解
服务端渲染是数据与模板组成的html，即html=数据+模板。将组件或页面通过服务器生成html字符串，再发送到浏览器，最后将静态标记混合为客户端上完全交互的应用程序。页面没使用服务渲染，当请求页面时，返回的body为空，之后执行js将html结构注入到body里，结合css显示出来
- 好处：
	- SEO友好
	- 资源都存储在服务器端
	- 响应亏，体验好，首屏渲染快
- 局限性
	- 服务端压力大
	- 开发条件受限
#### 20. 为什么 React 要用 JSX？

react并没有强制使用jsx，jsx类似一种语法糖，代码更为简洁和清晰。