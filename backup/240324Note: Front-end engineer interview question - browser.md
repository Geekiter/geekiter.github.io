## 1.什么是 XSS 攻击？

xss是跨站脚本攻击，是一种代码注入工具。攻击者在网站注入恶意脚本，使其在用户的浏览器上运行，从而盗取用户信息，如cookie等。
- 存储型XSS的攻击步骤，攻击者将恶意代码提交到目标网站的数据库，用户打开目标网站，网站服务器将恶意代码从数据库中取出，拼接在HTML中返回给浏览器，浏览器解析执行恶意代码。
	- 常见于论坛发帖、商品评价、用户私信
- 反射型XSS攻击步骤，攻击者构造出特殊的URL，包含恶意代码。服务端将恶意代码从URL取出，拼接在HTML中返回给浏览器。
	- 常见于网站搜索、跳转等
- DOM型XSS攻击步骤：攻击者构造出特殊的URL，浏览器从URL取出恶意代码并执行。

## 2.如何防御 XSS 攻击？

- 不使用服务端渲染
- 对插入到HTML的代码做好充分的转义
- 使用CSP内容安全策略，告诉浏览器哪些外部资源可以加载和执行
- 对一些敏感信息，比如cookie使用http-only

## 3.什么是 CSRF 攻击？

CSRF跨站请求伪造攻击，诱导用户进入一个第三方网站，该网站向被攻击网站发送跨站请求。如果用户在被攻击网站中保存了攻击状态，那么攻击者就可以利用这个登录状态，绕过后台的用户验证，冒充用户向服务器执行一些操作。

攻击类型
- get类型，img
- post类型，提交一个隐藏表单

## 4.如何防御 CSRF 攻击？

- 同源检测，服务器根据http请求中origin和referer的信息来判断是否为允许访问的站点
- 使用CSRF token请求验证，服务器向用户返回一个随机数token，向服务器发送请求时，在请求参数里加入服务器段返回的token。
- 使用cookie进行双重验证，token注入到cookie里，服务器对比cookie。利用了攻击者智能利用cookie不能访问获取cookie的特点。但是如果存在xss漏洞就会失效，做不到子域名隔离
- 在设置的cookie属性中，这是samesite，限制cookie不能作为第三方被使用

## 5.什么是中间人攻击？如何防范中间人攻击？

中间人攻击，MITM，是指攻击者与通讯的两端分别创建独立的连接，并交换其所收到的数据，使通讯的两端认为他们正在通过私密的连接与对方直接对话。但事实上整个会话都被攻击者完全控制。在中间人攻击中，攻击者可以拦截通讯双方的通话并插入到内容。

截获服务器发送给客户端的公钥，生成一个伪造的公钥，然后获取客户端生成的加密hash值，用私钥解密获取真正的密钥，生成假的加密hash值给服务器。服务器把加密数据发送给客户端。

防范：
- 使用HTTPS
- 不要忽略警告
- 不要使用公共wifi
- 运行并更新防病毒软件

## 6. 有哪些可能引起前端安全的问题?

- 跨站脚本攻击，xss
- iframe滥用
- 跨站点请求伪造
- 恶意第三方库

## 7. 网络劫持有哪几种，如何防范？

- DNS劫持
	- 通过修改运营商的本地DNS记录，来引导用户流量到缓存服务器
	- 302跳转
- HTTP劫持
	- 运营商修改http响应内容
	- 防范：HTTPS

## 8. 进程与线程的概念

- 进程是cpu资源分配的最小单位
- 线程是cpu调度的最小单位
- 通信，线程可以直接共享同一进程的资源，进程通讯需要借助进程之间的通信
- 调度，进程切换的开销比线程大
- 系统开销，进程开销大
## 10. 浏览器渲染进程的线程有哪些

线程有：
- 浏览器进程
- CPU进程
- 第三方插件进程
- 渲染进程
	- GUI渲染
	- JS引擎
	- 事件触发线程
	- 定时器触发线程
	- 异步http请求线程

## 11. 进程之间的通信方式

- 管道通信
- 消息队列通信
- 信号量通讯
- 信号通信
- 共享内存通信
- 套接字通信

## 12. 僵尸进程和孤儿进程是什么？

- 孤儿进程，父进程退出了，子进程没有退出
- 僵尸进程，子进程退出了，但是没有释放子进程占用的资源

## 13. 死锁产生的原因？ 如果解决死锁的问题？

原因：多个进程在运行过程中争夺资源造成的僵局。

预防死锁的方法：
- 资源一次性分配：
- 只要有一个资源得不到分配，也不给这个进程分配其他资源
- 可剥夺资源，当某进程获得了部分资源，但得不到其他资源，则是否已占有的资源
- 资源有序分配法，系统给每类资源赋予一个编号，每个进程按照变化递增的顺序请求资源，释放则相反。

## 14. 如何实现浏览器内多个标签页之间的通信?

本质是通过中介者模式来实现的。

- 使用websocket协议。服务器作为中介者
- shareworker，共享线程作为中介者
- localstorage
- postMessage，获取对于标签页的引用使用postMessage

## 15. 对Service Worker的理解

service worker是运行在浏览器后的独立线程，一般用来实现缓存。

```js
//index.js
if(navigator.serviceWorker){
	navigator.serviceWorker
	.register("sw.js")
	.then(function(registration){
		console.log("service worker 注册成功")
	})
	.catch(function(err){
		console.log("service worker 注册失败")
	})
}
//sw.js
self.addEventListener("install", e=>{
	e.waitUntil(
		caches.open("my-cache").then(function(cache){
			return cache.addAll(['./index.html', "./index.js"])
		})
	)
})

self.addEventListener("fetch", e=>{
	e.respondWidth(
		caches.match(e.request).then(function(response){
			if(response){
				return response
			}
			console.log("fetch source")
		})
	)
})
```

## 16. 对浏览器的缓存机制的理解

通过HTTP header来实现
- 强缓存，header设置cache-control和expires，cache-control的优先级高于expires，
	- cache-control: max-age=300，表示5分钟内再次请求就会强制缓存
	- expires缓存时间，指定资源到期的时间
- 协商缓存
	- last-modified，如果最后修改时间有变化，就更新
	- etag，etag里是一个token，token不一致则返回新的资源
- 如果什么都不设置，取响应头中date减去last-modified的10%作为缓存时间

## 17. 浏览器资源缓存的位置有哪些？


 - Service Worker
 - Memory Cache，内存缓存
 - Disk Cache，硬盘缓存

## 18. 协商缓存和强缓存的区别

- 强缓存直接使用缓存资源，不必向服务器发起请求
- 协商缓存要和服务器对比文件最后修改时间或者token，如果资源改变则返回修改之后的资源

## 19. 为什么需要浏览器缓存？

- 减少服务器负担
- 提高网站性能
- 加快了客户端网页的加载速度
- 减少了多余网络数据传输

## 20. 对浏览器内核的理解

内核分成两个部分：
- 渲染引擎负责渲染，即浏览器窗口中显示的所请求的内容。默认情况下，渲染引擎可以显示html、xml文档，也可以借助插件显示其他类型的数据
- js引擎，解析和执行js来实现网页的动态效果

## 21. 常见的浏览器内核比较
- Trident，IE浏览器的内核
- Gecko，Firefox和Flock采用的内核
- Presto
- Webkit，Safari内核
- Blink，谷歌Chrome的内核


## 22. 常见浏览器所用内核

- IE，trident
- Chrome，Blink
- Firefox，Gecko
- Safari，Webkit
- Opera，Blink

## 23. 浏览器的主要组成部分

- 用户界面
- 浏览器引擎
- 呈现引擎
- 网络
- 用户界面后端
- js解释器
- 数据存储
## 24. 浏览器的渲染过程

- 将解析的文档解析成DOM树
- 将css解析成cssom规则树
- 根据DOM树和CSSOM树构建渲染树
- 根据渲染树进行布局


## 25. 浏览器渲染优化

- js
	- js尽量放在body的最后
	- body中间
	- 使用async和defer去控制异步引入
- css
	- 外部样式使用link
	- 少@import
	- css少，使用内嵌样式
- dom树、cssom树
	- 代码层级不要太深
	- 使用语义化标签
	- 减少cssd层级
- 减少回流和重绘
	- 在低层级操作DOM
	- 少使用table布局
	- 不要频繁操作元素的样式
	- 使用absolute或fixed
	- 避免频繁操作DOM
	- 将元素设置为display: none，操作结束后再显示出来   
	- 将DOM的多个读操作放在一起

## 26、渲染过程中遇到 JS 文件如何处理？

会阻塞文档解析，等js引擎运行结束，再从中断的地方继续解析文档。


## 27. CSS 如何阻塞文档解析？

js脚本可能会请求样式信息，浏览器会先下载和构建cssom，然后再执行js，最后再继续文档的解析

## 28.什么情况会阻塞渲染？

渲染前要生成渲染树，所以html和css会阻塞渲染。如果先渲染的快，应该一开始降低需要渲染的文件大小。
解析script标签也会暂停构建DOM。

## 29. 浏览器本地存储方式及使用场景

- cookie，可以存4kb的信息，cookie和sessionId结合使用，这样服务端就知道是谁发起的请求，从而响应相应的信息。
- localstorage，一般为5MB，不常变动的个人信息存储在本地的localstorage
- sessionstorage，具有时效性，只存在同一窗口，存储网站的游客的登录信息

## 30. Cookie、LocalStorage、SessionStorage区别


| 特性     | cookie                       | localstorage | sessionstorage |
| ------ | ---------------------------- | ------------ | -------------- |
| 存储容量   | 4kb                          | ≥5MB         | ≥5MB           |
| 数据创术   | 每个HTTP请求都会发送到服务器             | 不会发送到服务器     | 不会             |
| 生命周期   | 可以设置过期时间                     | 永久存储         | 页面会话期间有效       |
| 访问权限   | 可以通过设置secure和httponly属性来控制访问 | 同源策略         | 同源策略           |
| 存储类型   | 键值对                          | 键值对          | 键值对            |
| 与浏览器同步 | 是                            | 是            | 是              |
| 存储位置   | 本地                           | 本地           | 本地             |
| 使用     | 跟踪用户会话、持久登录                  | 本地数据持久化      | 会话数据持久化        |
## 31. 前端储存的⽅式有哪些？
- cookies
- localstorage
- sessionstorage
- websql
- indexeddb

## 32. IndexedDB有哪些特点？

- 键值对存储
- 异步
- 支持事务
- 同源限制
- 储存空间大，≥250MB
- 支持二进制存储

## 33.什么是同源策略

同源策略限制了从同一个源加载的文档或脚本如何与另一个源的资源进行交互。这是浏览器 第一个用于隔离恶意资源的重要安全机制。同源指的是：协议、端口号、域名必须一致

## 34.如何解决跨越问题

- CORS
- 代理服务器

## 35.正向代理和反向代理的区别

- 正向代理
	- 作为客户端的代理，代表客户端向其他服务器发送请求，比如在公司内部为了访问互联网
- 反向代理
	- 代表服务器接收客户端的请求并将请求转发到内部的服务器。

## 36.Nginx的概念及其工作原理

nginx是一个轻量级的web服务器，用于反向代理、负载平衡和HTTP缓存。

## 37.事件是什么？事件模型？

事件是用户操作网页发生的交互动作。
事件模型：
- DOM0级事件模型
```js
element.onclick = function(){

}
```
- IE事件模型
```js
element.addEventListener("click", function, false)
```
- DOM2级事件模型
```js
element.attachEvent("onclick", function(){

})
```

## 38. 如何阻止事件冒泡

- IE浏览器使用event.cancelBubble = true;
- 普通浏览器使用 event.stopPropagation()

## 39.对事件委托的理解

事件委托利用了浏览器事件冒泡，事件在冒泡过程中会上传到父节点，父节点可以通过事件对象捕获到目标节点，因此可以把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件，这种方式称为事件委托。
使用事件委托可以不必为每个子元素都绑定一个监听事件，这样减少了内存上的消耗。并且使用事件代理还可以实现事件的动态绑定，

## 40.事件委托的使用场景

```js
document.addEventListener("click", function(e){
	if(e.target.nodeName == "A"){
		console.log("a");
	}
})
```

```js
document.addEventListener("click", function(e){
	var node = e.target;
	while(node.parentNode.nadeName != "BODY"){
		console.log("a");
		break;
	}
	node = node.parentNode;
})
```

## 41.对事件循环的理解

在浏览器执行代码的过程中，首先执行全局的同步代码，执行过程，首先执行全局的同步代码，执行过程发现有宏任务或微任务，就会放进各自的任务队列去等待完成，随着同步的任务执行完成，先会去查看微任务队列是否存在任务，如果不存在就会开始将宏任务的第一个任务取出，去执行。如果存在那就会优先执行微任务队列的任务。当执行宏任务的时候，如果宏任务中也包含微任务，那就会继续把微任务放进微任务队列，然后一次去执行微任务队列，直到所有的宏任务和微任务都执行完成，浏览器的一次事件循环就结束了。

## 42.宏任务和微任务分别有哪些

微任务：
- promise回调
- process.nextTick
- MutationObserver
宏任务
- script
- setTimeout
- setInterval
- setImmediate
- I/O
- UI渲染

## 43.什么是执行栈

存储函数调用的栈结构，遵循先进后出的原则



## 44.Node 中的 Event Loop 和浏览器中的有什么区别？process.nextTick 执行顺序？

Node.js事件循环和浏览器中的事件循环因为运行环境和目标不同，所以有差异。

- 运行环境
	- Node.js基于V8引擎，可以在服务器运行js代码
	- 浏览器的事件循环是针对web页面和js的运行环境的
- 任务队列
	- 在node.js中，事件循环主要保护：timers、i/o callbacks、idle、prepare、poll、check、close callbacks。其中timers阶段处理setTimeout和SetInterval等计时器任务，I/O Callbacks阶段处理异步I/O操作的回调，其他阶段用于内部操作和处理。
	- 浏览器中的事件循环包含了宏任务（setTimerout、setInterval）和微任务队列（Promise.then，MutationObserver等），并且在浏览器中还有一些特定的人无缘
- API差异
	- Node提供了针对服务端的API，比如文件系统的访问、网络通信等
	- 浏览器的事件循环主要考虑用户交互、页面渲染等任务
- 性能差异
	- Node.js主要关注I/O密集型任务，浏览器则关注UI交互响应和页面渲染

process.nextTick属于微任务

## 45.事件触发的过程是怎样的

事件触发有三个阶段：
- window往事件触发传播，遇到注册的捕获事件会触发
- 传播到事件触发处的事件
- 从事件触发处往window传播，遇到注册的冒泡时间触发


## 46.V8的垃圾回收机制是怎样的

V8是chrome浏览器和node.js等js运行时的核心组件之一，它主要有以下几种回收机制：
- 分代垃圾回收
	- 分为几代，通常是新生代和老生代，大多数被分配在新生代，经过多次垃圾回收仍然存活的对象会被移到老生代
- 新生代垃圾回收
	- 新生代垃圾回收主要针对存活时间比较短的对象，使用复制算法，将存活的对象复制到另一块内存空间，然后清理掉无用的内存
- 老生代垃圾回收
	- 针对存活时间较长的对象，使用标记-清理算法，标记可达对象，清理未标记的对象
- 增量标记
	- 在老生代的标记-清除阶段减少停顿时间，它允许垃圾回收器在执行阶段的同时，运行js代码运行，减少了单次垃圾回收的停顿时间

## 47.哪些操作会造成内存泄漏？

- 使用未声明的变量，意外的创建了全局变量
- 设置了setInterval没有取消，并且循环函数对外部变量有引用
- 获取了一个DOM元素的引用，后面这个元素被删除，但是一直保留这个元素的引用
- 不合理的使用闭包

## 48.渲染合成层是什么？

渲染合成层是指web页面中用于提高性能和优化渲染的一种技术，是浏览器中的一块特殊图层，通常由浏览器自动创建和管理，用于存储特定类型的内容或执行特定操作。

渲染合成层的作用包括但不限于：

- 硬件加速，利用gpu加速渲染
- 独立绘制，独立于页面的其余部分进行绘制
- 复合和合并，将多个合成层合并成单个图层
- 硬件加速滚动

## 49.iframe如何理解？ 有什么特点？一般应用在什么场景？？

iframe是在当前页面嵌入另一个文档的html标签。

特点和场景：
- 嵌入内容
- 分割页面
- 跨域通信
- 加载外部应用
- 实现我也部件

## 50.为什么浏览器要限制并发连接数？

控制资源的使用和网络性能的平衡

## 51.理解浏览器的多线程架构及渲染流程

5大进程：
- 浏览器进程
- 渲染进程
- 网络进程
- GPU进程
- 插件进程
渲染流程：
- HTML解析
- css解析
- 合成渲染树
- 布局
- 绘制
- 合成
- 显示

## 52.如何理解 preload 指令

用于预加载资源的html指令。

## 53.如何理解 requestAnimationFrame 接口？如何优化渲染性能

是一个监听帧的接口，在浏览器进入下一帧触发回调

- 避免长时间执行js基本
- 优化事件的回调和优化任务
- 减少重排次数和范围
- 使用raf或者css绘制动画

## 54.如何理解 GPU 渲染加速？什么是合成层 CompositeLayers

GPU渲染加速是指计算机的图形计算单元来加速网页渲染过程中的图形和动画绘制，提高页面的渲染性能和用户体验。通常来说，GPU有比CPU更强大的并行计算能力和图形处理能力，能够更高效地处理复杂的图形任务。

合成层是将页面的内容分解为多个层，使用GPU进行加速合成。

## 55.什么是内容安全策略（CSP）

内容安全策略CSP是一个额外的安全层，用于检测并削弱某些特定类型的攻击。告诉客户端，哪些外部资源是可以加载和执行的。

csp可以由http头和html meta标签来指定
```js
"Content-Security-Policy": 策略集
<meta http-equiv="content-security-policy" content="策略集" >
```

## 56.浏览器的安全沙箱策略

浏览器的安全策略是一种安全机制，用于限制网页内容和计算机系统的访问权限，防止恶意网页对系统进行攻击或滥用系统资源。这种策略基于以下原则：
- 进程隔离
- 权限限制
- 沙箱环境
- 跨域限制
- 沙箱扩展