### 1. 手写 Object.create
```js
function create(obj){
	function F(){}
	F.prototype = obj;
	return new F()
}

function create(obj){
	function F(){}
	F.prototype = obj;
	return new F()
}

function create(obj){
	function F(){}
	F.prototype = obj;
	return new F()
}

function create(obj){
	function F(){}
	F.prototype = obj;
	return new F()
}
```

### 2. 手写 instanceof 方法

```js
function myInstanceof(left, right){
	let proto = Object.getPrototypeOf(left);
	prototype = right.prototype;
	while(true){
		if(!proto) return false;
		if(proto === prototype) return true;
		proto = Object.getPrototypeOf(proto);
	}
}
function myInstanceof(left, right){
	let proto = Object.getPrototypeOf(left);
	prototype = right.prototype;
	while(true){
		if(!proto) return false;
		if(proto === prototype) return true;
		proto = Object.getPrototypeOf(proto);
	}
}

function myInstanceOf(left, right){
	let proto = Object.getPrototypeOf(left);
	prototype = right.prototype;
	while(true){
		if(!proto) return false;
		if(proto === prototype) return true;
		proto = Object.getProtortpeof(proto)
	}
}

function myInstanceOf(left, right){
	let proto = Object.getPrototypeOf(left)
	prototype = right.prototype;
	while(true){
		if(!proto) return false;
		if(proto == prototype) return true;
		proto = Object.getPrototypeOf(proto)
	}
}
```

### 3. 手写 new 操作符

```js
function myNew(constructor, ...args){
	if(typeof constructor !== "function") return;
	let obj = {}
	obj.prototype = Object.create(constructor.prototype)
	const res = constructor.apply(obj, args)
	if(res && (typeof res !== "object" || typeof res === "function")) return res;
	return obj;
}
function Fn(obj){
	this.obj = obj;
}
let obj = myNew(Fn, "222")
console.log(obj);

function myNew(constructor, ...args){
	if(typeof constructor !== "function") return;
	let obj = {}
	obj.prototype = Object.create(constructor.prototype)
	const res = constructor.apply(obj, args)
	if(res && (typeof res !== "object" || typeof res === "function")) return res;
	return obj;	
}
function Fn(obj){
	this.obj = obj
}
let obj = myNew(Fn, "222")
console.log(obj)

function myNew(constructor, ...args){
	if(typeof constructor !== "function") return;
	let obj = {}
	obj.prototype = Object.create(constructor.prototype)
	const res = constructor.apply(obj, args)
	if(res && (typeof res !== "object" || typeof res === "function")) return res;
	return obj;
}
```

### 4. 手写 Promise

```js
class MyPromise{
	constructor(executor){
		this.state = "pending"
		this.value = null
		this.error = null
		this.resolve = this.resolve.bind(this);
		this.reject = this.reject.bind(this);
		executor(this.resolve, this.reject)
	}
	resolve(value){
		if(this.state === "pending"){
			this.state = "resolved"
			this.value = value;
		}
	}
	reject(error){
		if(this.state === "pending"){
			this.state = "rejected"
			this.error = error
		}
	}

	then(onFulFilled, onRejected){
		onFulFilled = typeof onFulFilled === "function" ? onFulFilled : v => v;
		onRejected = typeof onRejected === "function" ? onRejected : r => {
			throw r
		}
		if(this.state === "resolved"){
			onFulFilled(this.value)
		}
		if(this.state === "rejected"){
			onRejcted(this.error)
		}
	}
}

class MyPromise{
	constructor(executor){
		this.state = "pending"
		this.value = null
		this.error = null
		this.resolve = this.resolve.bind(this)
		this.reject = this.reject.bind(this)
		executor(this.resolve, this.reject)
	}
	resolve(value){
		if(this.state === "pending"){
			this.state = "resolved"
			this.value = value
		}
	}
	reject(error){
		if(this.state === "pending"){
			this.state = "reject"
			this.error = error
		}
	}

	then(onFulFilled, onRejected){
		onFulFilled = typeof onFulFilled === "function" ? onFulFilled : v => v;
		onRejected = typeof onRejected === "function" ? onRejected : r => {
			throw r;
		}
		if(this.state === "resolved"){
			onFulFilled(this.value)
		}
		if(this.state === "rejected"){
			onRejected(this.error)
		}
	}
}

class MyPromise{
	constructor(executor){
		this.state = "pending"
		this.value = null
		this.error = null
		this.resolve = this.resolve.bind(this)
		this.reject = this.reject.bind(this)
		executor(this.resolve, this.reject)
	}
	resolve(value){
		if(this.state === "pending"){
			this.state = "resolved"
			this.value = value
		}
	}
	reject(error){
		if(this.state === "pending"){
			this.state = "reject"
			this.error = error
		}
	}
	then(onFulFilled, onRejected){
		onFulFilled = typeof onFulFilled === "function" ? onFulFilled : v => v;
		onRejected = typeof OnRejected === "function" ? onRejected : r => {
			throw r;
		}
		if(this.state === "resolved"){
			onFulFilled(this.value)
		}
		if(this.state === "rejected"){
			onRejected(this.error)
		}
	}
}
```

### 5. 手写防抖函数

```js
function debounce(func, delay){
	let timer;
	return function(){
		const context = this;
		const args = arguments;
		clearTimer(timer);
		timer = setTimeout(()=>{
			func.apply(context, args)
		}, delay)
	}
}
function handleClick(){
	//...
}
const button = document.getElementById("mybutton")
button.addListener("click", debounce(handleClick, 1000))
```

### 6. 手写节流函数

```js
function throttle(func, delay){
	let lastExecTime = 0;
	return function(){
		const context = this
		const args = arguments;
		let curTime = date.now()
		if(curTime - lastExecTime > delay){
			func.apply(func, args)
			lastExecTime = curTime
		}
	}
}
function handleScroll(){
	console.log("scrolling...")
}

window.addEventListener("scroll", throttle(handleScroll, 1000))
```

### 7. 手写类型判断函数

```js
function getType(value){
	if(value === null){
		return value + "";
	}
	if (typeof value === "object"){
		let valueClass = Object.prototype.toString.call(value);
		type = valueClass.split(" ")[1].split("");
		type.pop()
		return type.join("").toLowerCase();
	}else{
		return typeof value;
	}
}
```

### 8. 手写 call 函数

```js
Function.prototype.myCall = function(ctx, ...args){
	if(typeof this !== "function") return;
	ctx = ctx || window;
	const fn = Symbol()
	ctx[fn] = this
	const result = ctx[fn](...args)
	delete ctx[fn]
	return result
}
Function.prototype = function(ctx, ...args){
	if(typeof this !== "function") return;
	ctx = ctx || window;
	const fn = Symbol()
	ctx[fn] = this
	const result = ctx[fn](...args)
	delete ctx[fn]
	return result
}

Function.prototype = function(ctx, ...args){
	if(typeof this !== "function") return;
	ctx = ctx ||  window
	const fn = Symbol()
	ctx[fn] = this
	const result = ctx[fn](...args)
	delete ctx[fn]
	return result
}

Function.prototype = function(ctx, ...args){
	if(typeof this !== "function") return;
	ctx = ctx || window
	const fn = Symbol()
	ctx[fn] = this
	const result = ctx[fn](...args)
	delete ctx[fn]
	return result
}
```

### 9. 手写 apply 函数

```js

Function.prototype.myCall = function(ctx, args){
	if(typeof this !== "function") return
	ctx = ctx || window
	const fn = Symbol
	ctx[fn] = this
	const result = ctx[fn](...args)
	delete ctx[fn]
	return result
}
```

### 10. 手写 bind 函数

```js
Function.prototype.myBind = function(ctx, ...args1){
	if(typeof this !== "function") return;
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

Function.protortpe.myBind = function(ctx, ...args1){
	if(typeof this !== "function") return;
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

Function.prototype.myBind = function(ctx, ...args1){
	if(typeof this !== "function") return;
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

Function.prototype.myBind = function(ctx, ...args1){
	if(typeof this !== "function") return;
	const fn = this;
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

