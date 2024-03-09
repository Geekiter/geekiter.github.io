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

## 11. slot是什么？有什么作用？原理是什么？

slot是插槽，是vue组件内部的模板引擎使用slot元素作为承载分发内容的出口。
原理：
当子组建vm实例化时，获取到父组件传入的slot标签的内容，存放在vm.\$slot中，默认插槽为vm.\$slot.default，具体插槽名为vm.\$slot.xx。当组件执行渲染函数时，遇到slot标签，使用\$slot中的内容进行替换，此时可以为插槽传递数据，若存放数据，则可以称插槽为作用域插槽。

```js
<template>
<div>
	<ChildComponent>
		<template v-slot:header>
			<h2>hello</h2>
		</template>
	</ChildComponent>
</div>
</template>

<template>
<div>
	<slot name="header">
		
	</slot>
	<slot>
	</slot>
</div>
</template>
```

## 12. 说一下mvc、mvp以及mvvm的区别和使用场景

- mvc，model-view-controller
mvc模式将应用程序分成3个主要的部分，模型、视图和控制器。模型是应用程序的核心，模型表示某些数据以及如何操作数据。视图是显示数据的地方。控制器向模型发出指令，更新模型，然后通过视图展示模型的数据。

优点：MVC模式可以将要处理的数据、数据的呈现方式和用户交互分离出来，极大的降低了应用程序各个模块间的耦合度，提高了代码的可维护性以及可拓展性。MVC模式的每个部分各司其职，代码更加清晰。

缺点：MVC模式存在的问题在于视图和控制器之间的紧密耦合，是的一个部分的该表需要牵扯到其他部分的修改。

使用场景：简单的web程序

- mvp, model-view-presenter
mvp模式是mvc模式的变体，它将控制器才分为presenter和view，然后通过presenter和view之间的接口进行通信，presenter负责从模型层读取数据，并将其提供给是突出展示，视图层向presenter发出指令并向用户传递事件，presenter对这些事件做出反应并更新模型。

优点：MVP模式的presenter起到了连接视图层和模型层的桥梁，可以非常有效的降低视图和模型层之间的耦合度，使得代码跟容易拓展和维护。
缺点：mvp的缺点在于他的实现难度表较高，需要实现观察者模式并在交互的过程中处理复杂的事件流。
使用场景：大型的GUI应用程序

- mvvm, model-view-viewmodel

mvvm将视图层和模型层分离，引入viewmodel来管理ui控件，viewmodel是一种特殊的控制器，它将视图和模型紧密的连接在一起，viewmodel负责视图层的更新和绑定，处理用户事件并更新，从而实现数据流的双向绑定。
优点：mvvm模式的最大优点就是是现实双向绑定，并且可以将界面的数据与业务逻辑分离，有效解决了mvc和mvp的缺点。提高代码的可维护性和可测试性。
缺点：mvvm模式的最大缺点就是实现比较复杂，需要依赖处理数据的框架，需要额外的学习成本。
使用场景：web程序和大型单页应用程序。

在MVC中，控制器（Controller）负责从模型获取数据并更新视图。而在MVP中，Presenter从模型获取数据，并将数据传递给视图进行显示。

## 13. 如何保存页面的当前的状态

- 组件会被卸载
	- 将数据存储在localstorage/sessionstorage
	- 路由传值
- 组件不会被卸载
	- 单页面渲染，要切换的组件作为子组件渲染


## 14. 常见的事件修饰符及其作用

- .stop相当于js的event.stopPropagation()，防止事件冒泡
- .prevent，相当于js的event.preventDefault()，防止执行预设的行为
- .capture，与事件冒泡的方向相反，事件捕捉由外到内
- .self，触发自己范围内的事件，不包含子元素
- .once，只会触发一次
## 15. v-if、v-show、v-html 的原理

- v-if调用addIfCondition方法，生成vnode的时候会忽略节点，render的时候就不渲染
- v-show会生成vnode，render的时候也会渲染成真实节点，只是在render过程中会在节点的属性中修改show属性值，也就是display
- v-html会移除节点下的所有节点，调用html方法，会通过addProp添加innerHTML

## 16. v-model 是如何实现的，语法糖实际是什么？

v-model是vue常见的指令之一，用于双向绑定表单元素的值和数据对象的值。它的语法糖实际上是将v-bind和v-on指令结合在一起使用，简化了模板中数据绑定和事件绑定的书写方式。
例如：
```js
<input v-model="message">
```

等价于
```js
<input :value="message" @input="message = $event.target.value" >
```

这里的v-model相当于将属性绑定和事件绑定结合在一起，是的输入框的值随着数据对象属性的改变而改变，同时数据对象随着输入框的值的改变而改变。

## 17. v-model 可以被用在自定义组件上吗？如果可以，如何使用？

可以，

```vue.js
<template>
<div>
	<input :value="value" @input="updateValue($event.target.value)">
</div>
</template>
<script>
<export default{
	props: {
		value: ""
	},
	methods: {
		updateValue(value){
			this.$emit("input", value);
		}
	}
}
</script>

%% 子组件 %%

<template>
<div>
	<custom-input v-model="message"/>
</div>
</template>
<script>
import CustomInput from "./custominput.vue";

export default {
	components: {
		CustomInput
	},
	data(){
		return{
			message: ""
		}
	}
}
</script>
```

## 18. data为什么是一个函数而不是对象

js中的对象是引用类型的数据，当多个实力引用用同一个对象时，只要一个实例对这个对象进行操作，其他实例的数据也会发生变化。而在vue中，更多的是想要复用组件，那就需要每个组件都有自己的数据，这样组件之间才不会互相干扰。所以组件的数据不能写成对象的形式，而是要想要携程函数的形式。数据一函数放回值的形式返回，每次复用组件的时候，就会返回一个新的data，每个组件都有自己的私有数据控件。

## 19. $nextTick 原理及作用

## 20. Vue template 到 render 的过程

- 解析模板
	- 解析成抽象语法书ast
- 静态优化
	- 对静态内容进行优化
- 编译为渲染函数
	- 将ast编译为渲染函数，返回虚拟dom用于渲染视图
- 渲染视图
	- 将虚拟dom渲染为实际的dom中

## 21. Vue data 中某一个属性的值发生改变后，视图会立即同步执行重新渲染吗？

不会立即同步执行重新渲染，vue实现响应式并不是数据发生变化后dom立即变化。而是按到策略去进行dom的更新。检测到数据变化，vue将开启一个队列，并缓冲在同一事件中循环中发的所有数据变更。

## 22. Vue 中给 data 中的对象属性添加一个新的属性时会发生什么？如何解决？

不会更新，因为在vue实例创建的时候，obj.b并没有声明，没有被vue转换为响应式属性，不会触发视图的更新，这时候需要使用xue全局的api \$set()：
```vue.js
addObjB(){
	this.$set(this.obj, "b", 'obj.b')
	console.log(this.obj)
}
```

$set()方法相当于手动的把obj.b处理成一个响应式属性，这时候视图也会跟着改变

## 23. 描述下Vue自定义指令

在vue2.0中，代码复用和抽象的主要形式是组件。然而，有的情况下，你仍然需要对普通DOM元素进行底层操作，这时候就会用到自定义指令。
一般需要对DOM元素进行底层操作使用，尽量只用操作DOM展示，不修改内部的值。当使用自定义指令直接修改value值时绑定v-model的值也不会同步更新；如必须修改可以在自定义指令中使用keydown事件，在vue组件中使用change事件，回调中修改vue数据。
- 自定义指令基本内容
	- 全局定义：vue.directive("focus", {})
	- 局部定义：directives:{focus:{}}
	- 钩子函数：指令定义对象提供狗子函数

## 24. 子组件可以直接改变父组件的数据吗？

不可以。引用\$emit派发一个自定义事件，父组件接收后由父组件修改

## 25. Vue是如何收集依赖的？

vue.js通过响应式系统收集依赖。当数据发生变化时，vue.js能够自动更新相关的dom
在vue中，当一个组件的数据被访问时，vue会将这个数据用观察者记录下来，当这个数据发生变化时，vue就知道哪些组件需要重新渲染。vue利用了js的getter和setter来实现这个依赖追踪的过程。

## 26、对 React 和 Vue 的理解，它们的异同

- 同：
	- 都将重心保持在核心库，将其他功能交给其他库
	- 都有自己的构建工具
	- 都使用了虚拟DOM提高重绘能力
	- 都鼓励组件化
- 不同
	- vue默认数据双向绑定，react提倡单向数据流
	- 实现组件化方面，vue默认是接近html模板的语法，react的jsx语法
## 27. Vue的优点

1. 简单易学
2. 轻量
3. 数据双向绑定
## 28. assets和static的区别


- assets是会在build编译的时候被优化压缩的
- static是直接同步到打包后的结果里的

## 29. delete和Vue.delete删除数组的区别

delete只是把删除的元素的值变成了empty/undefined，其他元素的键值还是不变的
vue.delete直接删除了数组，改变了键值
## 30. vue如何监听对象或者数组某个属性的变化

用$watch
```js
// 监听对象属性的变化
var vm = new Vue({
  data: {
    obj: {
      name: 'Alice',
      age: 30
    }
  },
  created: function () {
    // 监听对象的name属性
    this.$watch('obj.name', function (newValue, oldValue) {
      console.log('obj.name changed from ' + oldValue + ' to ' + newValue);
    });
  }
});

// 修改对象属性的值
vm.obj.name = 'Bob'; // 控制台输出: "obj.name changed from Alice to Bob"

// 监听数组元素的变化
var vm2 = new Vue({
  data: {
    arr: [1, 2, 3]
  },
  created: function () {
    // 监听数组的第一个元素
    this.$watch('arr[0]', function (newValue, oldValue) {
      console.log('arr[0] changed from ' + oldValue + ' to ' + newValue);
    });
  }
});

// 修改数组元素的值
vm2.arr[0] = 4; // 控制台输出: "arr[0] changed from 1 to 4"

```

## 31. Vue模版编译原理

vue的模板template无法被浏览器解析并渲染，要将template转换为js函数。

这个过程为：
- 解析parse
- 优化optimize
- 生成generate
- 生成可执行函数render

## 32. 对keep-alive的理解，它是如何实现的，具体缓存的是什么？

如果需要在组件切换时，保存一些组件的状态防止多次渲染，就可以使用keep-alive组件包裹需要保存的组件。

- keep-alive有以下3个属性
	- include字符串或正则表达式，只有名称 匹配的组件会被匹配
	- exclude字符串或正则表达式，任何名称匹配的组件都不会缓存
	- max数字，最多可以缓存多少组件实例
keep-alive包裹动态组件时，会缓存不活动的组件实例，主要流程：
- 判断组件name，不在include或者在exclude中，直接返回vnode，说明该组件不被缓存
- 获取组件实例key，如果有获取实例的key，否则重新生成
- key生成规则，cid+::+tag，仅靠cid是不够的，因为系统的构造函数可以注册为不同的本地组件
- 如果缓存对象内存在，则直接从缓存对象中获取组件实例给vnode，不存在则添加到缓存对象中
- 最大缓存数量，当缓存组件数量超过max值，清除keys数组内第一个组件。

`<keep-alive>`是vue.js提供的一个抽象组件，用于在组件之间动态地保留组件的状态或避免重新渲染。
集体来说，keep-alive组件会缓存其内部的动态组件，而不会将他们销毁。这样当这些缓存的组件再次被切换到时，vue会直接从缓存中取出组件，而不是重新创建和渲染他们。这样可以显著提高应用的性能和用户体验，尤其是频繁切换组件时。

```vue
<template>
  <div>
    <button @click="toggleComponent">Toggle Component</button>
    <keep-alive>
      <component :is="currentComponent"></component>
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentComponent: 'ComponentA'
    };
  },
  methods: {
    toggleComponent() {
      this.currentComponent = this.currentComponent === 'ComponentA' ? 'ComponentB' : 'ComponentA';
    }
  },
  components: {
    ComponentA: {
      template: '<div>Component A</div>'
    },
    ComponentB: {
      template: '<div>Component B</div>'
    }
  }
};
</script>

```

在这个例子中，keep-alive组件会缓存componentA和componentB，当点击按键切换组件时，vue会根据需要从缓存中取出相应的组件，而不会重新创建和销毁他们。

## 33.Vue中封装的数组方法有哪些，其如何实现页面更新

封装的数组的方法：
- push()
- pop()
- shift()
- unshift()
- splice()
- sort()
- reverse()

具体来说，vue.js使用了一种叫做响应式系统的机制来实现页面更新，当你修改vue实例的数据时，vue会跟踪
这些数据的依赖关系，并且在数据发生变化时，自动更新相关的视图。

## 34.说一下Vue的生命周期

- beforeCreate，创建前，还不能访问到data、computed这些方法上
- created，实例创建完成，options包括data、computed、watch、methods等都配置完成
- beforeMount，挂载前，render还没有被调用。还没有挂载到html上
- mounted，挂载后，
- beforeUpdate，更新前，
- updated，更新后
- beforeDestroy，销毁前
- destroyed，销毁后
keep-alive还有activated和deactivated，用keep-alive包裹的组件在切换的时候不会进行销毁，而是缓存到内存中执行deactivated钩子函数，命中缓存后会执行activated钩子函数。

## 35.Vue 子组件和父组件执行顺序

**加载渲染过程：**

**1.父组件 beforeCreate**

**2.父组件 created**

**3.父组件 beforeMount**

**4.子组件 beforeCreate**

**5.子组件 created**

**6.子组件 beforeMount**

**7.子组件 mounted**

**8.父组件 mounted**

**更新过程：**

**\1. 父组件 beforeUpdate**

**2.子组件 beforeUpdate**

**3.子组件 updated**

**4.父组件 updated**

**销毁过程：**

**1. 父组件 beforeDestroy**

**2.子组件 beforeDestroy**

**3.子组件 destroyed**

**4.父组件 destoryed**

## 36.created和mounted的区别

- created在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图
- mounted在模板渲染成html后调用，通常是在初始化页面完成，对DOM进行以下操作。

## 37.一般在哪个生命周期请求异步数据

一般在created钩子函数调用异步请求，因为在created钩子函数中：

- 能更快获取到服务端数据，减少页面加载时间，用户体验更好
- ssr不支持beforemount、mounted钩子函数，放在created中有助于一致性

## 38.keep-alive 中的生命周期哪些

activated和deactivated

## 39.讲一下v-if和v-for的优先级

v-for具有更快的优先级，确保在循环中动态控制每个项的渲染，而不是整个循环块。

## 40.Vue-Router 的懒加载如何实现

非懒加载：
```js
import List from "@/components/list.vue"
const router = new VueRouter({
	routes: [
		{
			path: "/list",
			component: List
		}
	]
})
```

方案一，使用箭头函数+import动态加载
```js
const List = () => import("@/components/list.vue")
const router = new VueRouter({
	routes:[
	{
		path: "/list",
		component: List
	}]
})
```

方案二，使用剪头函数加require动态加载
```js
const touter = new Router({
	routes:[
		{
			path: "/list",
			component: resolve => require(["@/components/list"], resolve)
		}
	]
})
```

方案三，使用webpack的require.ensure技术，实现按需加载
```js
const List = r=> require.ensure([], ()=>r(require("@/components/list")), 'list');
const router = new Router({
	routes: [
		{
			path: "/list",
			component: List,
			name: 'list'
		
		}
	]
})
```

## 41.路由的hash和history模式的区别

- hash模式是基于#实现，通过监听onhashchange()事件
- history是基于传统的路由分发模式
## 42.如何获取页面的hash变化

- 监听\$route的变化
```js
watch:{
	$route: {
		handler: function(val, oldval){
		}
	},
	deep: true
}
```

- window.location.hash读取#
## 43. \$route 和\$router 的区别
- route是路由信息对象的意识，包括path、params、hash等路由信息参数
- router是路由实例对象包括了路由的跳转方法，钩子函数等

## 44.如何定义动态路由？如何获取传过来的动态参数？

- params方式


```vue

// 配置路由
{
	path: "/user/:userid",
	component: User
}

// 使用
<router-link :to="'/user/'+userId" replace>用户
</router-link>

<router-link :to="{name: 'user', params: {name: wade}}"></router-link>

<script>
this.$router.push({name: "user", params: {name: wade}})
this.$router.push('/user/'+ wade)
</script>
```

- query方式
```vue
<router-link :to="path: '/profile', query:{name: 'why'}">doc</router-link>
<script>
this.$router.push({
	path: "/profile",
	query: {
		name: "why"
	}
})
</script>

//使用

// 方法1：
<router-link :to="{ name: 'users', query: { uname: james }}">按钮</router-link>

// 方法2：
this.$router.push({ name: 'users', query:{ uname:james }})

// 方法3：
<router-link :to="{ path: '/user', query: { uname:james }}">按钮</router-link>

// 方法4：
this.$router.push({ path: '/user', query:{ uname:james }})
  
// 方法5：
this.$router.push('/user?uname=' + jsmes)
```

## 45.Vue-router 路由钩子在生命周期的体现

- 全局钩子
	- beforeEach(to, from , next):
		- 在路由导航前被调用
		- 类似于vue组件的beforeCreate钩子
		- 用于全局导航守卫，可以在跳转路由前进行一些全局的前置处理，如权限验证、登录状态检查等。
	- beforeResolve(to, from, next):
		- 在导航被确认之前，同样在渲染组件之前调用
		- 类似于vue组件的beforeRouteEnter
	- afterEach(to, from)
- 路由独享钩子
	- beforeEnter(to, frmo, next)
		- 只在特定的路由生效
	- beforeRouteEnter(to, from, next)
		- 在路由进入前被调用
	- beforeRouteUpdate(to, from, next)
		- 在当前路由改变，但是该组件被复用时调用
	- beforeRouteLeave(to, from, next)
		- 在导航离开该组件的对应路由时调用

## 46.Vue-router跳转和location.href有什么区别

- 使用location.href = /url 来跳转，简单方便，但是刷新了页面
- 使用history.pushState(/url)，无需刷新页面，静态跳转
- 引进router，使用router.push(/url)来跳转，使用diff算法，实现按需加载，减少dom的消耗，vue-router是基于history.pushState()实现的

## 47.params和query的区别

- 用法上，query要用path来引入，params要用name来引入
- query刷新不会丢失query里面的数据，params刷新会丢失params里面的数据
- query在地址栏显示参数，params不显示参数

## 48.Vue-router 导航守卫有哪些

- 全局前置钩子
	- beforeEach，beforeResolve、afterEach
- 路由独享守卫
	- beforeEnter
- 组件内的守卫
	- beforeRouteEnter
	- beforeRouteUpdate
	- beforeRouteLeave

## 49.Vuex 的原理

vuex是一个专门为vue.js开发的状态管理库，它提供了一个集中式的状态管理机制，用于管理vue应用中的所有组件的共享状态。vuex的核心思想是将组件的共享状态抽离出来，以单独的状态树的形式存储，然后通过定义一系列的mutations、actions、getters来操作的这个状态输。state是应用状态，mutations用于修改state中的状态，actions则用于处理异步操作或批量的同步操作，最终通过mutations来改变state。getters则用于state中的数据进行计算或过滤。

## 50.Vuex中action和mutation的区别

- mutations用于修改state中的状态
- action则用于处理异步操作或批量的同步操作，最终通过mutations来改变state

## 51.Vuex 和 localStorage 的区别
- 存储位置
	- vuex存储在内存中，读取速度更快
	- local storage存储在本地，只能存储字符串类型的数据，存储对象需要字符串化
- 应用场景
	- vuex是一个为vue开发的状态管理模式，能做到数据的响应性
	- local storage是本地存储，是将数据存储到浏览器，一般在跨页面传输数据中使用。
## 52.Redux 和 Vuex 有什么区别，它们的共同思想

区别

- vuex改进了redux的action和reducer函数，用mutations变化函数取代了reducer，无需switch，只需要对应的mutation函数里面的state值即可
- vuex由于vue自动重新渲染的特效，无需订阅重新渲染函数，只要生成新的state即可
- vuex数据流的顺序是view调用store.commit提交对应的请求到store中对应的mutation函数->store改变
- vuex弱化了dispatch，通过commit进行store状态的一次性变更。取消了action的概念，不必传入特定的action形式进行指定变更。弱化reducer，基于commit参数直接对数据进行转变，使得框架更加简易。

共同思想
- 单一数据源
- 变化可预测
- 本质上，redux与vuex都是对mvvm思想的服务，将数据从视图中抽离的一种方案
- 形式上，vuex借鉴了redux，将store作为全局的数据中心，进行mode管理

## 53.为什么要用 Vuex 或者 Redux

- 用传参的方式对于复杂的组件嵌套、兄弟组件，会导致代码无法维护
- 把这些组件的共享状态抽取出来，以一个全局单例模式管理。在这种模式下，组件树构成一个巨大视图下，任何组件都可以获取状态或者触发行为。代码将变得结构化和易于维护。

## 54.Vuex有哪几种属性？

- state，基本数据
- getters，从基本数据派生出来的数据
- mutations，提交改变数据的方法
- actions，装饰器，包装mutations，使之可以异步
- modules，模块化vuex

## 55.Vuex和单纯的全局对象有什么区别？

- vuex是响应式的
- vuex不能直接改变store的状态，要提交一个mutaitons

