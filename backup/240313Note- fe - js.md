## 1、JavaScript有哪些数据类型，它们的区别？

- Undefined
- Null
- Boolean
- Number
- String
- Object
- ES6
	- Symbol，创建后独一无二不可变的数据类型，为了解决可能出现的全局变量重复
	- BigInt，安全的存储和操作大整数

可以分为堆和栈
- 栈
	- undefined、null、boolean、number、string
- 堆
	- 对象，数组和函数



## 2、数据类型检测的方式有哪些

- typeof
- instanceof
```js
2 instanceof Number
true instanceof Boolean
```
- constructor
```js
(2).constructor === Number
(true).constructor === Boolean
```

- Object.prototype.toString.call()
```js
var a = Object.prototype.toString;

console.log(a.call(2));
```


## 3、 判断数组的方式有哪些

```js
Object.prototype.toString.call(obj).slice(8, -1) === "Array"

Array.isArray(obj)

obj.__proto__ === Array.prototype

obj instanceof Array

Array.prototype.isPrototypeOf(obj)
```
## 4、 null和undefined区别

- undefine代表未定义，null代表空对象。
- 声明了没定义返回undefined，null一般赋值给一些可能返回对象的变量作为初始化
- 使用typeof会返回object，undefined不是一个保留字

## 5、typeof null 的结果是什么，为什么？

object，前三个低位（其实是就是后3位）为000会被判断为obj，所以null全是0，所以就是obj

## 6. intanceof 操作符的实现原理及实现

递归、proto、prototype。
instanceof会递归L的__proto__原型链，查看是否存在右侧的prototype原型。

```js
function myInstanceOf(left, right){
	if(typeof left !== 'object' || left === null || typeof right !== "function"){
		return false;
	}

	let proto = Object.getPrototypeOf(left)
	let prototype = right.prototype
	while(true){
		if(!proto) return false;
		if(proto===prototype) return true;
		proto = Object.getPrototyoeOf(proto)
	}
}
```

## 7. 为什么0.1+0.2 ! == 0.3，如何让其相等
js的小数位是2的53次方，一共是52+符号为。一共是53位，而0.1和0.2的二进制是无限循环的小数，所以在进制转换过程中精度损失了，在计算的过程中对介运算也精度损失了，所以精度损失可能出现在进制转换和对阶运算过程中。
怎么解决
- 将数字转换为整数
```js
function add(num1, num2){
	const num1Digits = (num1.toString().split(".")[1] || "").length;
	const num2Digits = (num2.toString().split(".")[1] || "").length;
	const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
	return (num1 * baseNUm + num2 * baseNum) / baseNum;
}
```

- 第三分库
- tofixed
- 对于这个问题，一个直接的解决办法就是设置误差范围，通常称为机器精度。对于js来说，这个值通常为2-52，在ES6中，提供了Number.EPSLON\*\*\*\*属性，只要判断0.1+0.2-0.3是否小于Number.EPSILON，如果小于，就可以判断为0.1+0.2\=\=\=0.3。

```js
function numberepsilon(arg1, arg2){
	return Math.abs(arg1 - arg2) < Number.EPSILON;
}
console.log(numberepsilon(0.1 + 0.2, 0.3));
```

## 8. typeof NaN 的结果是什么？
Number

## 9. isNaN 和 Number.isNaN 函数的区别？

函数isNan接收参数后，会尝试将这个参数转换为数值，任何不能被转换为数值的都会返回true，因此非数字值传入也会返回true，会影响Nan的判断。
函数Number.isNan会首先判断传入参数是否为数字，如果是数字再继续判断是否为NaN，不会进行数据类型的转换，这种方法对于NaN的判断更为准确。

## 10. == 操作符的强制类型转换规则？

`==`在进行对比时，也会先进行类型转换。

判断流程：

- 判断类型是否相同
	- 相同，比较大小
	- 不同，类型转换
		- 是否是null和undefined
			- 是，true
		- 是否是string和number
			- 是，string转换为number
		- 是否是boolean
			- 是，boolean转换为number
		- 是否为object，另一方为string、number、symbol
			- 是，把object转换为原始类型

## 11. 其他值到字符串的转换规则？


| 类型        | 字符串转换      |
| --------- | ---------- |
| null      | null       |
| undefined | undefined  |
| true      | true       |
| false     | false      |
| number    | 极大极大会用指数形式 |
| symbol    | 显式类型转换     |

## 12. 其他值到数字值的转换规则？


| 类型        | 转换为              |
| --------- | ---------------- |
| Undefined | NaN              |
| Null      | 0                |
| Boolean   | true1,false0     |
| String    | 包含非数字值，NaN。空字符串0 |
| Symbol    | 报错               |
| 对象        | 转换为基本类型，根据以上规则转换 |

## 13. 其他值到布尔类型的值的转换规则？

- false
	- undefined
	- null
	- false
	- +0,-0,Nan
	- ""
- true
	- 除以上都是正值
## 14. Object.is() 与比较操作符 `===`,`==` 的区别？

- 双等号会进行强制类型转换
- 三等号不会进行类型转换
- Object.is一般和三等号判断逻辑相同，但是会处理特殊情况，-0和+0不相等，两个NaN是相等的

## 15. JavaScript 中如何进行隐式类型转换？

js中隐式类型转换是指在某些操作中，js会自动将一个数据类型转换为另一个数据类型，以完成表达式的计算或操作。
- 字符串拼接
- 算数运算
- 逻辑运算
- 比较操作

## 16. let、const、var的区别



| 特性       | let                         | const                       | var             |
| -------- | --------------------------- | --------------------------- | --------------- |
| 作用域      | 块级作用域                       | 块级作用域                       | 函数级作用域          |
| 重新赋值     | 可                           | 不可                          | 可               |
| 初始化      | 在使用前                        | 在使用权                        | 自动初始化为undefined |
| 提升       | 不提升                         | 不提升                         | 提升到函数或全局作用域的顶部  |
| 暂时性死区TDZ | 如果在初始化之前访问，抛出referenceError | 如果在初始化之前访问，抛出referenceError | 可以访问，是undefined |
| 重新声明     | 不可                          | 不可                          | 可               |

## 17. const对象的属性可以修改吗

不可以，但是引用类型可以，因为引用类型指向的是指针，包括对象和数组

## 18. 如果new一个箭头函数的会怎么样

不能new，因为箭头函数没有prototype，也没有this，也没有arguments，所以不能new

## 19. 箭头函数与普通函数的区别


- 箭头函数更简洁
- 剪头函数没有this、arguments、prototype
- 箭头函数不能作为构造函数使用


## 20. 箭头函数的this指向哪⾥？

捕获上下文的this

## 21. Proxy 可以实现什么功能？

proxy可以自定义对象中的操作

## 22. 对 rest 参数的理解

扩展运算符被用在函数形参上，可以把分离的参数整合成一个数组：
```js
function mutiple(...args){
	console.log(args)
}
mutiple(1, 2, 3, 4) // [1, 2, 3, 4]
```

## 23. ES6中模板语法与字符串处理

模板语法

`my name is ${name}`

字符串方法：

- 存在判定
	- includes，是否包含
	- startsWith，是否以什么开头
	- endsWith，是否以什么结尾
- 自动重复，repeat()

## 24. new操作符的实现原理

- 空对象：创建一个新的空对象
- prototype：将该对象的原型prototype链接到构造函数的原型对象
- this: 将构造函数的作用域this设置为新创建的对象
- 执行构造函数内部的代码，同时有可能修改新对象的属性和方法
- 如果构造函数返回一个对象，则返回该对象；否则返回新创建的对象

```
function Person(name, age){
	this.name = name;
	this.name = age;
}

var person1 = new Person("Alice", 30);

var person2 = Object.create(Person.prototype)l
Person.call(person2, "Bob", 25);
```

## 25. map和Object的区别



| 比较类型     | Object                                                   | Map                                                                   |
| -------- | -------------------------------------------------------- | --------------------------------------------------------------------- |
| 存储键值对的方式 | 键是字符串或符号，值可以是任意类型字符                                      | 键值对都可以任意类型                                                            |
| 键的顺序     | 无需                                                       | 有序                                                                    |
| 键 的数量    | Object.keys()，Object.entries()                           | size()                                                                |
| 迭代       | for in , Object.keys()，Object.values(), Object.entries() | Map.prototype.keys(), Map.prototype.values(), Map.prototype.entries() |
| 键的比较     | 是基于字符串的比较                                                | 使用严格相等运算符                                                             |
## 26、map和weakMap的区别


| 比较类型    | Map              | WeakMap        |
| ------- | ---------------- | -------------- |
| 类型      | 任意数据类型，包括原始类型和对象 | 只能是对象          |
| 引用计数    | 不影响键的引用计数        | 不会阻止键被垃圾回收     |
| 键的可枚举类型 | 可枚举              | 不可枚举           |
| 遍历顺序    | 有序               | 无序             |
| 回收机制    | 不会影响键的垃圾回收       | 键是弱引用，不会阻止键被回收 |
| 内存泄露    | 可能会导致内存泄露        | 不会导致           |
| 使用场景    | 键值对的存储           | 私有数据存储         |

## 27. JavaScript脚本延迟加载的方式有哪些？

- defer，同步解析，最后执行
- async，异步加载
- 动态传教DOM，
- setTimeout
- js最后加载

## 28. JavaScript 类数组对象的定义？

一个拥有length属性和若干索引属性的对象就可以被称为类数组对象，类数组对象和数组类似，但是不能调用数组的方法。厂家的类数组对象有arguments和DOM方法的返回结果，还有一个函数也可以看作是类数组对象，因为它含有length属性值，代表可以接收的参数个数。

- 通过call调用数组的slice方法来实现转换
```js
Array.prototype.slice.call(arrayLike);
```
- 通过call调用数组的splice方法来实现转换
```js
Array.prototype.splice.call(arrayLike, 0)
```
- 通过apply调用数组的concat方法来实现转换
```js
Array.prototype.concat.apply([], arrayLike)
```
- 通过Array.from方法来实现转换Array.from(arrayLike)

## 29. 为什么函数的 arguments 参数是类数组而不是数组？如何遍历类数组?

- 拥有数组的特性，length
- 数组的有些特性也没有，比如reduce，forEach


## 30. 什么是 DOM 和 BOM？

- DOM是文档对象模型，它把文档当做一个对象来对待
- BOM是浏览器对象模型，它把浏览器当做一个对象来对待。DOM也是BOM的子对象。

## 31. 对类数组对象的理解，如何转化为数组

splice.call() slice.call() concat.apply()

## 32. 对AJAX的理解，实现一个AJAX请求

ajax是asynchronous javascript and xml的缩写，指的是通过js的异步通信，从服务器获取xml文档中提取数据，再更新当前网页的对应部分，而不用刷新整个网页。

步骤：
- 创建一个xmlhttprequest对象
- 在这个对象上使用open方法创建一个http请求，open方法所需要的参数是请求方法，地址、是否异步和用户的认证信息
- 在发起请求前，可以添加一些信息和监听函数
- 调用send发起请求
```js
const server_url = "/server";
let xhr = new XMLHttpRequest();
xhr.open("GET", url, true);

xhr.onreadystatechange = function(){
	if(this.readyState !== 4) return;
	if(this.status === 200){
		handle(this.response);
	} else{
		console.error(this.statusText);
	}
}
xhr.onerror = function(){
	console.error(this.statusText);
}
xhr.responseType = "json";

xhr.setRequestHeader("Accept", "application/json")
xhr.send(null)
```

使用promise封装ajax
```js
function getJSON(url){
	let promise = new Promise(function(resolve, reject){
		let xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.onreadystatechange = function(){
			if(this.readyState !== 4) return;
			if(this.status === 200) = function(){
				resolve(this.response);
			}else{
				reject(new Error(this.statusText))
			}
		}
	})
	return promise;
}
```

## 33.JavaScript为什么要进行变量提升，它导致了什么问题？

- 提高性能
- 容错性更好
问题：
- 意外的值
- 重复声明
- 变量覆盖

## 34.ES6模块与CommonJS模块有什么异同？


| 特性        | es6模块           | commonjs模块                 |
| --------- | --------------- | -------------------------- |
| 语法        | 使用import和export | 使用require()和module.exports |
| 加载时机      | 编译时加载           | 运行时加载                      |
| 作用域       | 每个模块都有自己的作用域    | 变量添加到模块的闭包中                |
| 循环依赖处理    | 可以自然处理循环依赖      | 可能出现问题，需要特殊处理              |
| 静态导入和到处   | 必须位于最顶层         | 可以在运行时根据条件导入或导出            |
| 默认到处和命名导出 | 支持              | 不支持                        |
| 静态分析      | 是               | 否                          |
| 编译时优化     | 是               | 否                          |

## 35.常见的DOM操作有哪些

```js
//获取
getElementById
getElementByTagName
getElementByClassName
querySelectorAll //按照css
```

## 36.for...in和for...of的区别

- for of遍历获取的是对象键值value，for in 获取的是对象的key
- for in会遍历对象的整个原型链，性能差。for of只会遍历当前对象，不会遍历原型链
- 对于数组的遍历，for in 会返回数组中所有可枚举的属性，for of只会返回数组下标对应的属性值
- for in循环只要是为了遍历对象而生，不适用于遍历数组。for of循环可以用来遍历数组、类数组对象，字符串，map，generator对象


## 37.如何使用for...of遍历对象

- for of是es6新增的，允许遍历好友iterator接口的数据结构，普通对象用for of 会出错
```js
for(var k of obj){
	console.log(k)
}
obj[Symbol.iterator] = function(){
	var keys = Object.keys(this);
	var count = 0;
	return {
		
	}
}
```

## 38.ajax、axios、fetch的区别

| 特性     | ajax                 | axios             | fetch             |
| ------ | -------------------- | ----------------- | ----------------- |
| 语法     | 原生js或使用库             | promise-based api | promise-based api |
| 浏览器支持  | 手动处理兼容性              | 支持主流浏览器           | 部分浏览器支持           |
| http方法 | get、post、put、delete等 | 同                 | 同                 |
| 数据格式   | 接发json、xml、html、文本   | 同                 | 默认json            |
| 请求取消   | 手动实现                 | 内置                | 手动实现              |
| 拦截器    | 不支持                  | 支持请求响应拦截器         | 不支持               |
| csrf保护 | 手动处理                 | 内置支持              | 手动处理              |
| 并发     | 不支持                  | 支持                | 支持                |
## 39.数组的遍历方法有哪些

- for of 
- map
- forEach
- for

## 40.forEach和map方法有什么区别

- forEach方法会针对每一个元素执行提供的函数，第3个参数传该数组会改变原数组，该方法没有返回值
- map方法不会改变原数组的值，返回一个新的数组，新数组的值为原数组调用函数处理之后的值

## 41.对原型、原型链的理解

每个元素都有一个prototype属性，它指向另一个对象或null。当访问一个对象的属性和方法时，如果这个对象没有，就会顺着原型链向上查找，直到找到这个属性或者方法为止。

## 42.原型修改、重写

```js
function Person(name){
	this.name = name;
}
Person.prototype.getName = function(){}
var p = new Person("hello")
console.log(p.__proto__ === Person.prototype)
console.log(p.__proto__ === p.constructor.prototype)

Person.prototype = {
	getName: function(){}
}

var p = new Person("hello")
console.log(p.__proto__ === Person.prototype) //true
console.log(p.__proto__ === p.constructor.prototype) //false

Person.prototype = {
	getName: function(){}
}

var p = new Person("hello")
p.constructor = Person
console.log(p.__proto__ === Person.prototype)
console.log(p.__proto__ === p.constructor.prototype)
```

## 43.原型链指向

```js
p.__proto__  // Person.prototype
Person.prototype.__proto__  // Object.prototype
p.__proto__.__proto__ //Object.prototype
p.__proto__.constructor.prototype.__proto__ // Object.prototype
Person.prototype.constructor.prototype.__proto__ // Object.prototype
p1.__proto__.constructor // Person
Person.prototype.constructor  // Person
```
## 44.原型链的终点是什么？如何打印出原型链的终点？

```js
// null

console.log(Object.prototype.__proto__)
```

## 45.如何获得对象非原型链上的属性？

用hasOwnProperity()方法

## 46.对闭包的理解

闭包实现了外部访问函数内部变量的功能，让这些变量的值始终可以保存在内存当中。
```js
var a = 1;
function foo(){
	var a = 2;
	function baz(){
		console.log(a);
	}
	bar(baz)
}
function bar(fn){
	fn();
}
foo();  //输出2而不是1

```

## 47.对作用域、作用域链的理解

- 作用域是一套规则，可以存储变量、访问变量的规则
- 作用域链是当访问变量的作用域的时候，如果在当前作用域没找到，就会继续向上查找，直到找到该变量或者不存在父级作用域。
## 48.对执行上下文的理解

- 全局执行上下文
	- 任何不在函数内部的都是全局执行上下文，它首先会创建一个全局的window对象，并且设置this的值等于这个全局对象，一个程序中只有一个全局执行上下文
- 函数执行上下文
	- 当一个函数被调用，就会为该函数创建一个新的执行上下文，函数的上下文可以有任意多个
- 执行上下文
	- 当一个函数被调用，就会为该函数创建一个新的执行上下文，函数的上下文可以有任意多个。

## 49.对this对象的理解

this是执行上下文的一个属性，它指向最后一次调用这个方法的对象。在实际开发中，this的指向可以通过4种调用模式来判断。
- 函数调用模式，当一个函数不是对象的属性时，直接作为函数来调用时，this指向全局对象。
- 方法调用模式，如果一个函数作为对象的方法来调用时，this指向这个对象
- 构造器调用模式，如果一个函数用new调用，函数执行前会新创建一个对象，this指向这个新创建的对象
- apply, call, bind
	- apply输入两个参数，一个this绑定的对象，一个参数数组。
	- call接收，一个this，其余是传入函数执行参数
	- bind方法，传入一个对象，返回一个this绑定传入对象的新函数

## 50.call() 和 apply() 的区别？

作用一样，区别在于传入参数不同

- apply接收两个参数，一个是指定了函数体内this对象的指向，第二个参数为带下标的集合。这个集合可以为数组，也可以为类数组，apply方法把这个集合中的元素作为参数传递给被调用的函数
- call传入的参数数量不固定，跟apply相同，第一个参数也是代表函数体内的this指向，从第二个参数开始往后，每个参数被依次传入函数


## 51.实现call、apply 及 bind 函数

```js

//call
/**
- 判断调用的对象是不是一个函数，即使是定义在函数原型上的，也有可能出现使用call等方式调用的情况
- 截取除第一个外的剩余参数，并判断context上下文对象是否存在，不存在则设置window
- 将函数作为上下文对象的一个方法，添加在上下文对象上
- 调用该上下文对象的方法，并把参数传进去
- 删除该上下文的对象方法属性
- 返回调用结果
*/
Function.prototype.myCall = function (ctx, ...args){
	if(typeof this !== "function") return
	ctx = ctx || window
	const fn = Symbol()
	ctx[fn] = this
	const result = ctx[fn](...args)
	delete ctx[fn]
	return result
}

//apply
/**
- 判断调用对象是不是一个函数，即使定义在原型 
*/
Function.prototype.myApply = function(ctx, args){
	if(typeof this !== "function") return
	ctx = ctx || window
	const fn = Symbol()
	ctx[fn] = this
	const result = ctx[fn](...args)
	delete ctx[fn]
	return result
}

//bind
Function.prototype.myBind = function(ctx, ...args1){
	if(typeof this !== "function") return
	const fn = this
	return function(...args2){
		const allArgs = [...args1, ...args2]
		if(new.target){
			return new fn(...allArgs)
		}else{
			return fn.apply(ctx, allArgs)
		}
	}
}

```



## 52.异步编程的实现方式？

- 回调函数
- Promise
- generator
- async

## 53.setTimeout、Promise、Async/Await 的区别

- setTimeout是用于设置延迟执行的定时器，是一种简化的异步操作方法
- Promise是一种更强大的异步编程模型，可以更好的处理异步任务的成功或失败，并进行链式调用
- async/await是建立在Promise基础上的语法糖，使得异步代码看起来更像同步在吗，提高了可读性和编写效率

## 54.对Promise的理解

Promise是异步编程的一种解决方案，它是一个对象，可以获取异步操作消息，避免了回调地狱。

## 55.Promise的基本用法

操作成功返回resolve，操作失败返回reject，
## 56.Promise解决了什么问题

回调地狱

```js
// 之前
let fs = require('fs')
fs.readFile('./a.txt','utf8',function(err,data){
  fs.readFile(data,'utf8',function(err,data){
    fs.readFile(data,'utf8',function(err,data){
      console.log(data)
    })
  })
})

//之后
let fs = require('fs')
function read(url){
  return new Promise((resolve,reject)=>{
    fs.readFile(url,'utf8',function(error,data){
      error && reject(error)
      resolve(data)
    })
  })
}
read('./a.txt').then(data=>{
  return read(data)
}).then(data=>{
  return read(data)
}).then(data=>{
  console.log(data)
})
```

## 57.Promise.all和Promise.race的区别的使用场景

- Promise.all可以将多个Promise实例包装成一个新的Promise实例。成功返回结果数组，失败返回reject
- Promise.race将返回结果最快的那个

## 59.await 到底在等啥？
等待一个async的返回值

## 60.async/await的优势

- 读起来更同步，promise的链式调用会带来额外的阅读负担
- promise传递中间值麻烦
- 错误提示优化，兼容trycatch
- 调试友好
## 61.async/await对比Promise的优势

- 读起来更同步，promise的链式调用会带来额外的阅读负担
- promise传递中间值麻烦
- 错误提示优化，兼容trycatch
- 调试友好

## 62.async/await 如何捕获异常

try，catch

## 63.什么是回调函数？回调函数有什么缺点？如何解决回调地狱问题？

返回一个函数，容易写出回调地狱。

解决方法：
- Promise
- async、await
- 模块化

## 64.setTimeout、setInterval、requestAnimationFrame 各有什么特点？
- setTimeout
	- 用于在一定延迟之后执行单次任务
	- 不保证精确的延迟时间，可能会受到其他代码执行时间的影响
	- 适用于需要在一段时间后执行某个任务的情况
- setInterval
	- 用于按照固定时间间隔重复执行任务
	- 类似于setTimeout，但会以固定间隔一直执行，直至被清除
	- 适用于需要定期执行某个任务
- requestAnimationFrame
	- 用于执行动画效果，通常与浏览器的刷新频率同步，提供更流程的动画效果
	- 通常在执行动画时使用，避免了不必要的渲染，提高了性能
	- 在浏览器刷新时执行，可以避免掉帧问题，更适用于动画场景

## 65.对象创建的方式有哪些？

- 工厂模式
工厂模式的主要工作原理是用函数来封装创建对象的细节，从而通过调用函数来达到复用的目的。但是它有一个很大的问题就是创建出来的对象无法和某个类型联系在一起，它只是简单的封装了复用代码，没有建立起对象和类型间的关系。
```js
function createPerson(name){
 var o = new Object();
 o.name = name;
 o.getName = function(){
	 //...
 }
 return o;
}
```
- 构造函数模式
js中每个函数都可以作为构造函数，只要一个函数是通过new来调用的，那么就可以把它称为构造函数。执行构造函数首先会创建一个对象，然后将对象的原型指向构造函数的prototype属性，然后将执行上下文中的this指向这个对象，最后再执行整个函数，如果返回值不是对象，则返回新建的对象。因为this的值指向了新建的对象，因此可以使用this给对象赋值。构造函数模式相当于工厂模式的优点是，所创建的对象和构造函数建立起了联系，因此可以通过原型来识别对象的类型。但是构造函数存在一个缺点就是，造成了不必要的函数对象的创建，因为js中函数也是一个对象，因此如果对象属性中如果包含函数的话，那么每次都会新建一个函数对象，浪费了不必要的内存空间，因为函数是所有的实例都可以通用的。
```js
function Person(name){
	this.name = name;
	this.getName = function(){
		//...
	}
}
var person1 = new Person("kjk")
```
- 原型模型
因为每个函数都有一个prototype属性，这个属性是一个对象，它包含了通过构造函数创建的所有实例都能共享的属性和方法。因此可以使用原型对象来添加公用属性和方法，从而实现代码的复用。这种方式相对于构造函数模式来说，解决了函数对象的复用问题。但是这种模式，一是没有办法通过传入参数来初始化值，另一个是如果存在一个引用类型如Array这样的值，那么所有的实例将共享一个对象，一个实例对引用类型值的改变会影响所有的实例
```js
function Person(name){
	Person.prototype.name = 'k';
	Person.prototype.getName = function(){
		console.log(this.name);
	}
	var person1 = new Person();
}
```
- 组合使用构造函数模式和原型模式
组合使用构造函数模式和原型模式，通过构造函数来初始化对象属性，通过原型对象来实现函数过年。但是对代码的封装性不太好
```js
function Person(name){
	this.name = name;
}
Person.prototype = {
	constructor: Person,
	getName: function(){
		console.log(this.name)
	}
}

var person1 = new Person();
```
- 动态原型模式
将原型方法赋值的创建过程移动到了构造函数内部，通过对属性是否存在的判断，可以实现仅在第一次调用函数时对原型对象赋值一次的效果。解决了原型只创建一次的问题。
```js
function Person(name){
	this.name = name;
	if(typeof this.getName != "function"){
		Person.prototype.getName = function(){
			console.log("...")
		}
	}
}
var person2 = new Person();
```
- 寄生构造函数模式
基于一个已有的类型，在实例化时对实例化的对象进行扩展。这样既不用修改原来的构造函数，也达到了扩展对象的目的。它的缺点是和工厂模式一样，无法实现对对象的识别。
```js
function Person(name){
	var o = new Object();
	o.name = name;
	o.getName = function(){
		console.log(this.name)
	}
	return o;
}
var person1 = new Person("kkk");
console.log(person1 instanceof Person);
console.log(person2 instanceof Object);
```
## 66.对象继承的方式有哪些？

- 原型链实现基础，缺点是包含有引用类型的数据，会被所有的实例对象所共享，容易造成修改的混乱。在创建子类型的时候不能向父类型传递参数。
- 借用构造函数的方式
- 组合继承
- 原型链继承
- 寄生式继承
- es6的extends

## 67.浏览器的垃圾回收机制
- 标记清除
- 引用计数
- 新生代垃圾回收
- 增量垃圾回收

## 68.哪些情况会导致内存泄漏

- 意外的全局变量
- 遗忘的计时器或回调函数
- 脱离DOM的引用
- 闭包

## 69.请说一说this指向

- 箭头函数
- new
- 显式引用
- 隐式引用
- 默认绑定

