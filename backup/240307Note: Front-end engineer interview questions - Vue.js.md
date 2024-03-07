## 1、vue开发中常用的指令有哪些？
- v-if，v-else, v-else-if, v-show
- v-for
- v-on
- v-model
- v-bind
- v-html
- v-text
## 2、vuediff算法的原理
首先比较新旧节点的标签名，
- 如果不同，直接替换成新的节点。
- 如果标签名相同，则比较节点属性和事件
	- 如果不同，直接修改成新的节点
	- 如果相同，继续比较子节点。

## 3、vue mixin解决了什么问题，原理以及缺点？

- 解决的问题 
	- 代码复用
	- 逻辑解耦
- 原理
	- 将mixin中的属性和方法混入到组件的实例中，这样组件就可以访问和使用mixin中定义的内容。
- 缺点
	- 命名冲突
	- 隐式依赖
	- 复杂性增加
```js
export const counterMixin = {
	data(){
		return {
			count: 0;
		}
	},
	methods:{
		increment(){
			this.count++;
		},
		decrement(){
			this.count--;
		}
	}
}
```
然后，在需要使用计数器功能的组件中，我们可以通过mixins选项引入counterMixin
```vue
<template>
	<button @click="increment">Increment</button>
	<span>{{ count }}</span>
	<button @click="decrement">Decrement</button>
</template>
<script>
import {counterMixin} from "./counterMixin.js";

export default{
	mixins: [counterMixin]
}
</script>
```
这样组件ABC都可以共享计数器逻辑，如果需要修改计数器逻辑只需要修改counterMixin。

## 4、vue3有哪些改变？

- 响应系统改变，vue2使用object.defineProperty实现响应式系统，vue3使用了proxy代理对象实现响应式系统，提高了性能和稳定性
- 数据改变检测方式改变，vue2采用递归的方式进行数据改变检测，vue3使用proxy的观测和内部追踪之间的关系，解决了vue2瓶颈问题。
- 生命周期，vue3废除了beforeDestroy和destroy钩子函数，新增了beforeUnmount和unmounted。废除了activated和deactivated两个钩子函数，使用setup()返回onactivated和ondeactivated替代
- 更好的typescript的支持
- 编译器改变
- composition api改变

## 5、说一下generator的原理

generator是es6引入的一种新的函数类型，它可以让函数在执行时暂停，后续又可在需要时恢复执行。generator是一种特殊的迭代器，后续有可在需要时恢复执行。generator是一种特殊的迭代器，用于生成一系列的值。generator的原理可以分为以下几个步骤：
- 当调用一个generator函数时，它并不会立即执行，而是返回一个迭代器对象、
- 当不断调用迭代器的next()，generator函数内部的代码会逐行执行，直到执行到第一个yield关键字时，代码会暂停，并将yiled后面的表达式的值作为generator函数返回对象的value属性值返回，此时yield表达式本身并没有执行。
- 在下一次调用next()方法时，由于上一次暂停时保存的上下文的context信息仍然存在，所以generator函数内部的代码会从上一次暂停的地方继续执行，直到再次执行到yield关键字，代码会再次暂停，并将最新的yield后面的表达式作为generator函数返回对象的value属性值返回
- 通过对迭代器的不断调用next()方法，可以一步步地取出所有generator函数中yield关键字后的表达式的值，直到函数执行结束，generator函数返回的迭代器的done属性变为true
- 需要注意的是，generator函数可以通过yield关键字返回任意次数的值，此外，generator函数内部任意一处抛出异常都会导致迭代器的done属性变为true，并且抛出的异常会在外部代码中被捕获。除此之外，generator函数还可以通过yield关键字委托给其他generator函数，从而实现协程的功能。
```js
function* generationFn(){
	yield "Iteration 1";
	yield "Iteration 2";
}
const iterator = generatorFn();

console.log(iterator)
console.log(iterator.next());
```

## 6. 谈谈你对vue的理解

vue.js是一个渐进式js框架，用于构建用户界面。简洁易学、易于上手。

## 7. 双向数据绑定的原理

vue的数据绑定机制的通过数据劫持和发布/订阅模式实现的。单数据发生变化，会自动更新视图，并通过虚拟DOM对比算法来提高性能。这个性能可以有效简化开发过程，提高代码的可维护性和可读性。

在vue中，每个组件实例都有一个对应的响应式数据对象。当数据发生变化时，会自动更行视图，这个西洋参数据对象通过数据劫持的方式实现。
## 8. 使用 Object.defineProperty() 跟Proxy进行数据劫持分别有什么缺点？

- Object.defineProperty()在对一些属性进行操作时，使用这种方法无法拦截
- 通过使用Proxy对对象进行代理，从而使用数据拦截
- 缺点
	- Object.defineProperty()
		- 只能监听属性的读取、修改操作，无法监听数组的push、pop、shift、unshift、splice等方法
		- 无法监听对象的新增属性和删除操作
		- 对象的属性必须已经存在，才能使用Object.defineProperty()监听他们，这样会导致新增的属性无法被监听
		- 对象的每个属性都需要分别设置getter和setter，如果对象属性过多，会导致代码冗长、不易维护
	- Proxy
		- 不支持低版本的浏览器
		- 劫持整个对象的操作，无法针对耽搁属性进行监听
		- 可能会影响性能，因为每次操作都会触发代理的拦截器方法，而这些方法的执行效率较低
		- 程序员需要对代理的拦截器方法有一定的理解和掌握才能使用proxy进行数据劫持

## 9. Computed 和 Watch 的区别

computed主要偏向于对计算的值进行缓存，提升性能
watch主要是对监听数据变化，对数据变化做出一个逻辑操作

## 10. Computed 和 Methods 的区别

computed计算属性是机遇他们的依赖进行缓存的，只有在它的相关依赖发生变化时，才会重新求值
method调用总是会执行该函数

