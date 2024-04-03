## 一、异步&事件循环

1.
```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);

%% 输出

1
2
4 %%

```

因为没有写resolve，所以没有输出3

2.
```js
const promise1 = new Promise((resolve, reject) => {
  console.log('promise1')
  resolve('resolve1')
})
const promise2 = promise1.then(res => {
  console.log(res)
})
console.log('1', promise1);
console.log('2', promise2);
```

```
promise1
1 Promise{<resolved>: resolve1}
2 Promise{<pending>}
resolve1
```

3.
```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    console.log("timerStart");
    resolve("success");
    console.log("timerEnd");
  }, 0);
  console.log(2);
});
promise.then((res) => {
  console.log(res);
});
console.log(4);
```

```
1
2
4
timeStart
timerEnd
success
```

4.

```js
Promise.resolve().then(() => {
  console.log('promise1');
  const timer2 = setTimeout(() => {
    console.log('timer2')
  }, 0)
});
const timer1 = setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(() => {
    console.log('promise2')
  })
}, 0)
console.log('start');
/**
start
promise1
timer1
timer2
promise2

微1
promise1

宏2
timer1

宏1
start
微1
promise1
宏3 timer2
宏1 timer1
微3 promise2

*/
```

5.
```js
const promise = new Promise((resolve, reject) => {
    resolve('success1');
    reject('error');
    resolve('success2');
});
promise.then((res) => {
    console.log('then:', res);
}).catch((err) => {
    console.log('catch:', err);
})
then: success1
```

6.
```js
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)
```

```js
1
Promise {<fulfilled>: undefined}
```

7.
```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})
const promise2 = promise1.then(() => {
  throw new Error('error!!!')
})
console.log('promise1', promise1)
console.log('promise2', promise2)
setTimeout(() => {
  console.log('promise1', promise1)
  console.log('promise2', promise2)
}, 2000)
```

```js
promise1 Promise {<pending>}
promise2 Promise {<pending>}

Uncaught (in promise) Error: error!!!
promise1 Promise {<fulfilled>: "success"}
promise2 Promise {<rejected>: Error: error!!}
```

8.
```js
Promise.resolve(1)
  .then(res => {
    console.log(res);
    return 2;
  })
  .catch(err => {
    return 3;
  })
  .then(res => {
    console.log(res);
  });

1
2
```

9.
```js
Promise.resolve().then(() => {
  return new Error('error!!!')
}).then(res => {
  console.log("then: ", res)
}).catch(err => {
  console.log("catch: ", err)
})
```

```js
"then: " "Error: error!!!"
```

10.
```js
const promise = Promise.resolve().then(() => {
  return promise;
})
promise.catch(console.err)
```

```
Uncaught (in promise) TypeError: Chaining cycle detected for promise #<Promise>
```

`.then` 或 `.catch` 返回的值不能是 promise 本身，否则会造成死循环。

### 11. 代码输出结果

```js
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)

```
看到这个题目，好多的then，实际上只需要记住一个原则：`.then` 或 `.catch` 的参数期望是函数，传入非函数则会发生**值传透**。

第一个then和第二个then中传入的都不是函数，一个是数字，一个是对象，因此发生了透传，将 `resolve(1)` 的值直接传到最后一个then里，直接打印出1。
```js
1
```

### 12. 代码输出结果

```js
Promise.reject('err!!!')
  .then((res) => {
    console.log('success', res)
  }, (err) => {
    console.log('error', err)
  }).catch(err => {
    console.log('catch', err)
  })
```

```js
error err!!!
```

### 13. 代码输出结果
```js
Promise.resolve('1')
  .then(res => {
    console.log(res)
  })
  .finally(() => {
    console.log('finally')
  })
Promise.resolve('2')
  .finally(() => {
    console.log('finally2')
    return '我是finally2返回的值'
  })
  .then(res => {
    console.log('finally2后面的then函数', res)
  })
```

```
1
finally2
finally
finally2后面的then函数 undefined

```

### 14. 代码输出结果

```js
function runAsync (x) {
    const p = new Promise(r => setTimeout(() => r(x, console.log(x)), 1000))
    return p
}

Promise.all([runAsync(1), runAsync(2), runAsync(3)]).then(res => console.log(res))
```

```js
1, 2, 3, [1, 2, 3, 4]
```

### 15. 代码输出结果

```js
function runAsync (x) {
  const p = new Promise(r => setTimeout(() => r(x, console.log(x)), 1000))
  return p
}
function runReject (x) {
  const p = new Promise((res, rej) => setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x))
  return p
}
Promise.all([runAsync(1), runReject(4), runAsync(3), runReject(2)])
       .then(res => console.log(res))
       .catch(err => console.log(err))
```

```js
1,
3,
2,
Error: 2
4
```

### 16. 代码输出结果

```js
function runAsync (x) {
  const p = new Promise(r => setTimeout(() => r(x, console.log(x)), 1000))
  return p
}
Promise.race([runAsync(1), runAsync(2), runAsync(3)])
  .then(res => console.log('result: ', res))
  .catch(err => console.log(err))
```

```js
1
result: 1
2
3
```

### 17. 代码输出结果

```js
function runAsync(x) {
  const p = new Promise(r =>
    setTimeout(() => r(x, console.log(x)), 1000)
  );
  return p;
}
function runReject(x) {
  const p = new Promise((res, rej) =>
    setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x)
  );
  return p;
}
Promise.race([runReject(0), runAsync(1), runAsync(2), runAsync(3)])
  .then(res => console.log("result: ", res),rej=>console.log("reject",rej))
  .catch(err => console.log("catch",err));
```

```js
0
Error: 0
1
2
3
```

### 18. 代码输出结果

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}
async1();
console.log('start')
```

```js
async1 start
async2
start
async1 end
```

### 19. 代码输出结果

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
  setTimeout(() => {
    console.log('timer1')
  }, 0)
}
async function async2() {
  setTimeout(() => {
    console.log('timer2')
  }, 0)
  console.log("async2");
}
async1();
setTimeout(() => {
  console.log('timer3')
}, 0)
console.log("start")
```

```js
async1 start
async2
start
async1 end
timer2
timer3
timer1
```

### 20. 代码输出结果

```js
async function async1 () {
  console.log('async1 start');
  await new Promise(resolve => {
    console.log('promise1')
  })
  console.log('async1 success');
  return 'async1 end'
}
console.log('srcipt start')
async1().then(res => console.log(res))
console.log('srcipt end')
```

```js
script start
async1 start
promise1
async1 end
```

### 21. 代码输出结果

```js
async function async1 () {
  console.log('async1 start');
  await new Promise(resolve => {
    console.log('promise1')
    resolve('promise1 resolve')
  }).then(res => console.log(res))
  console.log('async1 success');
  return 'async1 end'
}
console.log('srcipt start')
async1().then(res => console.log(res))
console.log('srcipt end')
```

```js
script start
async1 start
promise1
script end
promise1 resolve
async1 success
async1 end
```

### 22. 代码输出结果

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}

async function async2() {
  console.log("async2");
}

console.log("script start");

setTimeout(function() {
  console.log("setTimeout");
}, 0);

async1();

new Promise(resolve => {
  console.log("promise1");
  resolve();
}).then(function() {
  console.log("promise2");
});
console.log('script end')
```

```js
阻塞的任务 = [console.log("async1 end");,]
宏任务 = [console.log("setTimeout");, ]
微任务 = [console.log("promise1");]
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
```

### 23. 代码输出结果

```js
async function async1 () {
  await async2();
  console.log('async1');
  return 'async1 success'
}
async function async2 () {
  return new Promise((resolve, reject) => {
    console.log('async2')
    reject('error')
  })
}
async1().then(res => console.log(res))
```

```js
阻塞的任务 = [console.log('async1');, return 'async1 success', ().then(res => console.log(res))]
微任务 = [reject('error')]
async2
Uncaught (in promise) error 
```

### 24. 代码输出结果
```js
const first = () => (new Promise((resolve, reject) => {
    console.log(3);
    let p = new Promise((resolve, reject) => {
        console.log(7);
        setTimeout(() => {
            console.log(5);
            resolve(6);
            console.log(p)
        }, 0)
        resolve(1);
    });
    resolve(2);
    p.then((arg) => {
        console.log(arg);
    });
}));
first().then((arg) => {
    console.log(arg);
});
console.log(4);
```

```js
微任务 = [
	.then((arg) => {
	    console.log(arg);
	});,
	.then((arg) => {
        console.log(arg);
    });
	
]
宏任务 = [   console.log(5);
            resolve(6);
            console.log(p)]
3
7
4
1
2
5
Promise resolve1
```

### 25. 代码输出结果

```js
const async1 = async () => {
  console.log('async1');
  setTimeout(() => {
    console.log('timer1')
  }, 2000)
  await new Promise(resolve => {
    console.log('promise1')
  })
  console.log('async1 end')
  return 'async1 success'
}
console.log('script start');
async1().then(res => console.log(res));
console.log('script end');
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .catch(4)
  .then(res => console.log(res))
setTimeout(() => {
  console.log('timer2')
}, 1000)
```

```js
阻塞 = []
微 = [.then(res => console.log(res));, .resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .catch(4)
  .then(res => console.log(res)), ]
宏 = [setTimeout(() => {
  console.log('timer2')
}, 1000),
	
	  setTimeout(() => {
    console.log('timer1')
  }, 2000)]

script start
async1
promise1
script end
1
timer2
timer1
```

### 26. 代码输出结果

```js
const p1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('resolve3');
    console.log('timer1')
  }, 0)
  resolve('resovle1');
  resolve('resolve2');
}).then(res => {
  console.log(res)  // resolve1
  setTimeout(() => {
    console.log(p1)
  }, 1000)
}).finally(res => {
  console.log('finally', res)
})
```

```js
阻塞 = []
微 = [.finally(res => {
  console.log('finally', res)
})]
宏 = [  setTimeout(() => {
    resolve('resolve3');
    console.log('timer1')
  }, 0),
    setTimeout(() => {
    console.log(p1)
  }, 1000)
	]

resolve1
finally undefined
timer1
Primise resolverd undefined


```

### 27. 代码输出结果

```js
console.log('1');

setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})
process.nextTick(function() {
    console.log('6');
})
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})

setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
})
```

```js
block = []
micro = [
    process.nextTick(function() {
        console.log('3');
    })
    ).then(function() {
        console.log('5')
    }),
        process.nextTick(function() {
        console.log('10');
    }),
    .then(function() {
        console.log('12')
    })
]
macro = [

setTimeout(function() {


-------
]

1
7
6
8
2
4
3
5
9
11
10
12
```

### 28. 代码输出结果

```js
console.log(1)

setTimeout(() => {
  console.log(2)
})

new Promise(resolve =>  {
  console.log(3)
  resolve(4)
}).then(d => console.log(d))

setTimeout(() => {
  console.log(5)
  new Promise(resolve =>  {
    resolve(6)
  }).then(d => console.log(d))
})

setTimeout(() => {
  console.log(7)
})

console.log(8)
```

```
block = []
micro = [resolve(4)
}).then(d => console.log(d)),

]
macro = [setTimeout(() => {
  console.log(2)
}),
setTimeout(() => {
  console.log(5)
  new Promise(resolve =>  {
    resolve(6)
  }).then(d => console.log(d))
}),

setTimeout(() => {
  console.log(7)
})
]

1
3
8
4
2
5
6
7
```

### 29. 代码输出结果

```js
console.log(1);

setTimeout(() => {
  console.log(2);
  Promise.resolve().then(() => {
    console.log(3)
  });
});

new Promise((resolve, reject) => {
  console.log(4)
  resolve(5)
}).then((data) => {
  console.log(data);
})

setTimeout(() => {
  console.log(6);
})

console.log(7);
```

```js
block = []
micro = [resolve(5)
}).then((data) => {
  console.log(data);
})
,
---2
  Promise.resolve().then(() => {
    console.log(3)
  });
});,
]
macro = [setTimeout(() => {
  console.log(2);

		 ---2
		 setTimeout(() => {
  console.log(6);
})

		
		]

1
4
7
5
2
3
6
```

### 30. 代码输出结果

```js
Promise.resolve().then(() => {
    console.log('1');
    throw 'Error';
}).then(() => {
    console.log('2');
}).catch(() => {
    console.log('3');
    throw 'Error';
}).then(() => {
    console.log('4');
}).catch(() => {
    console.log('5');
}).then(() => {
    console.log('6');
});
```

```js
block = []
micro = []
macro = []

1
3
5
6
```

### 31. 代码输出结果

```js
setTimeout(function () {
  console.log(1);
}, 100);

new Promise(function (resolve) {
  console.log(2);
  resolve();
  console.log(3);
}).then(function () {
  console.log(4);
  new Promise((resove, reject) => {
    console.log(5);
    setTimeout(() =>  {
      console.log(6);
    }, 10);
  })
});
console.log(7);
console.log(8);
```

```js
block = []
micro = [.then(function () {
  console.log(4);
  new Promise((resove, reject) => {
    console.log(5);

  })]
macro = [
setTimeout(function () {
  console.log(1);
}, 100);
    setTimeout(() =>  {
      console.log(6);
    }, 10);
]
2
3
7
8
4
5
6
1
```

## 二、this

### 1. 代码输出结果

```js
function foo() {
  console.log( this.a );
}

function doFoo() {
  foo();
}

var obj = {
  a: 1,
  doFoo: doFoo
};

var a = 2;
obj.doFoo()
```

```js
2
```

### 2. 代码输出结果

```js
var a = 10
var obj = {
  a: 20,
  say: () => {
    console.log(this.a)
  }
}
obj.say()

var anotherObj = { a: 30 }
obj.say.apply(anotherObj)
```

```js
10,
10
```

### 3. 代码输出结果

```js
function a() {
  console.log(this);
}
a.call(null);
```

```js
windows对象
```

要注意的是，在严格模式中，null 就是 null，undefined 就是 undefined：

```js
'use strict';

function a() {
    console.log(this);
}
a.call(null); // null
a.call(undefined); // undefined
```

### 4. 代码输出结果

```js

var obj = {
  name: 'cuggz',
  fun: function(){
     console.log(this.name);
  }
}
obj.fun()     // cuggz
new obj.fun() // undefined



```

### 6. 代码输出结果

```js
var obj = {
   say: function() {
     var f1 = () =>  {
       console.log("1111", this);
     }
     f1();
   },
   pro: {
     getPro:() =>  {
        console.log(this);
     }
   }
}
var o = obj.say;
o();
obj.say();
obj.pro.getPro();
```

```js
1111, windows object
1111, obj object,
windows obejct
```

### 7. 代码输出结果

```js
var myObject = {
    foo: "bar",
    func: function() {
        var self = this;
        console.log(this.foo);
        console.log(self.foo);
        (function() {
            console.log(this.foo);
            console.log(self.foo);
        }());
    }
};
myObject.func();
```

```js
bar
bar
underfined
bar
```


### 8. 代码输出问题

```js
window.number = 2;
var obj = {
 number: 3,
 db1: (function(){
   console.log(this);
   this.number *= 4;
   return function(){
     console.log(this);
     this.number *= 5;
   }
 })()
}
var db1 = obj.db1;
db1();
obj.db1();
console.log(obj.number);
console.log(window.number);
```

```js
windows object
windows object


```

### 9. 代码输出结果

```js
var length = 10;
function fn() {
    console.log(this.length);
}

var obj = {
  length: 5,
  method: function(fn) {
    fn();
    arguments[0]();
  }
};

obj.method(fn, 1);
```

```
10
2
```

### 10. 代码输出结果

```js
var a = 1;
function printA(){
  console.log(this.a);
}
var obj={
  a:2,
  foo:printA,
  bar:function(){
    printA();
  }
}

obj.foo();
obj.bar();
var foo = obj.foo;
foo(); // 1
```

```
2
1
1
```

### 11. 代码输出结果

```js
var x = 3;
var y = 4;
var obj = {
    x: 1,
    y: 6,
    getX: function() {
        var x = 5;
        return function() {
            return this.x;
        }();
    },
    getY: function() {
        var y = 7;
        return this.y;
    }
}
console.log(obj.getX()) // 3
console.log(obj.getY()) // 6
```

```js
3
6
```


### 12. 代码输出结果

```js
 var a = 10;
 var obt = {
   a: 20,
   fn: function(){
     var a = 30;
     console.log(this.a)
   }
 }
 obt.fn();  // 20
 obt.fn.call(); // 10
 (obt.fn)(); // 20
```

```
20
10
20
```

### 13. 代码输出结果

```js
function a(xx){
  this.x = xx;
  return this
};
var x = a(5);
  y = null

console.log(x.x)
console.log(y.x)
```

```
undefined
6
```


### 14. 代码输出结果

```js
function foo(something){
    this.a = something
}

var obj1 = {
    foo: foo
}

var obj2 = {}

obj1.foo(2);
console.log(obj1.a);

obj1.foo.call(obj2, 3);
console.log(obj2.a);

var bar = new obj1.foo(4)
console.log(obj1.a);
console.log(bar.a);
```

```js
2
3
2
4
```

### 15. 代码输出结果

```js
function foo(something){
    this.a = something
}

var obj1 = {}

var bar = foo.bind(obj1);
bar(2);
console.log(obj1.a);

var baz = new bar(3);
console.log(obj1.a);
console.log(baz.a);

2
2
3
```

## 三、作用域&变量提升&闭包

### 1. 代码输出结果

```js
(function(){
   var x = y = 1;
})();
var z;

console.log(y); // 1
console.log(z); // undefined
console.log(x); // Uncaught ReferenceError: x is not defined

//

```

### 2

```js
var a, b
(function () {
   console.log(a);
   console.log(b);
   var a = (b = 3);
   console.log(a);
   console.log(b);
})()
console.log(a);
console.log(b);

undefined
undefined
3
3
undefined
3
```

### 3

```js
var friendName = 'World';
(function() {
  if (typeof friendName === 'undefined') {
    var friendName = 'Jack';
    console.log('Goodbye ' + friendName);
  } else {
    console.log('Hello ' + friendName);
  }
})();
Goodbye Jack
```

### 4

```js
var fn2

function fn1(){
  console.log('fn1')
}
fn2 = function() {
  console.log('fn2')
}

fn1()
fn2()


fn2()

fn1
Uncaught TypeError
fn2

```

### 5. 代码输出结果

```js
function a() {
    var temp = 10;
    function b() {
        console.log(temp); // 10
    }
    b();
}
function a() {
    var temp = 10;
    b();
}
function b() {
    console.log(temp); // 报错 Uncaught ReferenceError: temp is not defined
}
a();
a();
```

### 6. 代码输出结果

```js
 var a=3;
 function c(){
    alert(a);
 }
 (function(){
  var a=4;
  c();
 })();

3
```

### 7

```js
function fun(n, o) {
  console.log(o)
  return {
    fun: function(m){
      return fun(m, n);
    }
  };
}
var a = fun(0);  a.fun(1);  a.fun(2);  a.fun(3);
var b = fun(0).fun(1).fun(2).fun(3);
var c = fun(0).fun(1);  c.fun(2);  c.fun(3);

undefined 0 0 0
undefined 0 1 2
undefined 0 1 1
```

### 8

```js
f = function() {return true;};
g = function() {return false;};
(function() {
   if (g() && [] == ![]) {
      f = function f() {return false;};
      function g() {return true;}  //在匿名函数内部发生函数提升 因此if判断中的g()返回true
   }
})();
console.log(f());

首先这里定义了两个变量f和g，我们知道变量是可以重新赋值的。后面是一个匿名自执行函数，在if条件中调用函数g(0), 由于在匿名函数中，又重新定义了函数g，就覆盖了外部定义的变量g。所以这里调用的是内部函数g方法，返回true。第一个条件通过，进入第二条件。

第二个条件是[] != []，在js中，当用于布尔运算时，比如在这里，对象的非空引用被视为true，空引用null则被视为false。由于这里不是一个null，而是一个没有元素的数组，所以[]被视为true，而![]的结果就是false。当一个布尔值参与到条件运算的时候，true会被看作1，而false会被看作0。现在条件变成了[] == 0的问题了，当一个对象参与条件比较的时候，它会被求值，求值的结果是数组会变成一个字符串，[]的结果就是“”，会被当做0，所以，条件成立

两个条件都成立，所以会执行条件中的代码，f在定义是没有使用var，所以他是一个全局变量。因此，这里会通过闭包访问到外部的变量f，重新赋值。现在执行f函数返回值已经成为false了。而g则不会有这个问题，这里是一个函数内部定义的g，不会影响到外部的g函数，所以最后的结果就是false

```

## 四、原型&继承

### 1

```js
function Person(name) {
    this.name = name
}
var p2 = new Person('king');
console.log(p2.__proto__) //Person.prototype
console.log(p2.__proto__.__proto__) //Object.prototype
console.log(p2.__proto__.__proto__.__proto__) // null
console.log(p2.__proto__.__proto__.__proto__.__proto__)//null后面没有了，报错
console.log(p2.__proto__.__proto__.__proto__.__proto__.__proto__)//null后面没有了，报错
console.log(p2.constructor)//Person
console.log(p2.prototype)//undefined p2是实例，没有prototype属性
console.log(Person.constructor)//Function 一个空函数
console.log(Person.prototype)//打印出Person.prototype这个对象里所有的方法和属性
console.log(Person.prototype.constructor)//Person
console.log(Person.prototype.__proto__)// Object.prototype
console.log(Person.__proto__) //Function.prototype
console.log(Function.prototype.__proto__)//Object.prototype
console.log(Function.__proto__)//Function.prototype
console.log(Object.__proto__)//Function.prototype
console.log(Object.prototype.__proto__)//null
```

### 2

```js
// a
function Foo () {
 getName = function () {
   console.log(1);
 }
 return this;
}
// e
function getName () {
 console.log(5);
}
// b
Foo.getName = function () {
 console.log(2);
}
// c
Foo.prototype.getName = function () {
 console.log(3);
}
// d
var getName = function () {
 console.log(4);
}


Foo.getName();           // 2
getName();               // 4
Foo().getName();         // 1
getName();               // 1
new Foo.getName();       // 2
new Foo().getName();     // 3
new new Foo().getName(); // 3
```

### 3

```js
var F = function() {};
Object.prototype.a = function() {
  console.log('a');
};
Function.prototype.b = function() {
  console.log('b');
}
var f = new F();
f.a();
f.b();
F.a();
F.b()

a
Error
a
b
```

### 4. 代码输出结果

```js
function Foo(){
    Foo.a = function(){
        console.log(1);
    }
    this.a = function(){
        console.log(2)
    }
}

Foo.prototype.a = function(){
    console.log(3);
}

Foo.a = function(){
    console.log(4);
}

Foo.a();
let obj = new Foo();
obj.a();
Foo.a();

4
2
1
```

### 5. 代码输出结果

```js

function Dog() {
  this.name = 'puppy'
}
Dog.prototype.bark = () => {
  console.log('woof!woof!')
}
const dog = new Dog()
console.log(Dog.prototype.constructor === Dog && dog.constructor === Dog && dog instanceof Dog)

true

```

### 6. 代码输出结果
```js
var A = {n: 4399};
var B =  function(){this.n = 9999};
var C =  function(){var n = 8888};
B.prototype = A;
C.prototype = A;
var b = new B();
var c = new C();
A.n++
console.log(b.n);
console.log(c.n);

// 9999
// 4400
```

### 7. 代码输出问题
```js
function A(){
}
function B(a){
　　this.a = a;
}
function C(a){
　　if(a){
		this.a = a;
　　}
}
A.prototype.a = 1;
B.prototype.a = 1;
C.prototype.a = 1;

console.log(new A().a);
console.log(new B().a);
console.log(new C(2).a);
```

### 8 代码输出问题
```js
function Parent() {
    this.a = 1;
    this.b = [1, 2, this.a];
    this.c = { demo: 5 };
    this.show = function () {
        console.log(this.a , this.b , this.c.demo );
    }
}

function Child() {
    this.a = 2;
    this.change = function () {
        this.b.push(this.a);
        this.a = this.b.length;
        this.c.demo = this.a++;
    }
}

Child.prototype = new Parent();
var parent = new Parent();
var child1 = new Child();
var child2 = new Child();
child1.a = 11;
child2.a = 12;
parent.show();
child1.show();
child2.show();
child1.change();
child2.change();
parent.show();
child1.show();
child2.show();
```

### 9. 代码输出结果

```js
function SuperType(){
    this.property = true;
}

SuperType.prototype.getSuperValue = function(){
    return this.property;
};

function SubType(){
    this.subproperty = false;
}

SubType.prototype = new SuperType();
SubType.prototype.getSubValue = function (){
    return this.subproperty;
};

var instance = new SubType();
console.log(instance.getSuperValue());
```