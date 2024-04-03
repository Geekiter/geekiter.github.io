## 1.如何⽤ webpack 来优化前端性能？

- 代码分割
- 压缩代码
- Tree Shaking
- 图片优化
- 使用CDN
- 缓存优化
- 懒加载和预加载
- 使用Webpack插件，使用优化类的webpack插件，如minicssextractplugin提取css，htmlwebpackplugin生成html，bundleanalyzerplugin分析打包文件等

- 代码分割，将代码拆分微多个小块，按需加载。这样可以减少初始加载时需要下载的资源量，提高页面的加载速度
- 压缩代码，使用webpack的uglifyjsplugin或terserplugin来压缩js代码，来减少文件大小，加快加载速度。uglifyjs-webpack-plugin、terser-webpack-plugin来压缩js代码，css-minimizer-webpack-plugin来压缩css代码
- tree shaking，来消除js中未使用的代码，减少最终打包文件的体积。
- 图片优化，使用image-webpack-loader或者url-loader来优化图片资源，包括压缩图片、转换为base64格式或按需加载
- 使用cdn，将静态资源部署到cdn上，加快资源的加载速度，减轻服务器压力
- 缓存优化，使用webpack的文件名哈希，chunkhash等机制，实现文件名的缓存优化，确保文件更新后能够正确地被浏览器缓存
- 懒加载和预加载，使用webpack实现懒加载和预加载，根据页面的实际需求来延迟加载某些资源和提前加载可能需要的资源，以提高用户体验和性能。

## 2.如何提⾼ webpack 的打包速度?

- 使用最新版的webpack
- 合理配置loader和plugin
- 使用happypack，将loader的执行任务分配给多个子进程。
- 使用dllplugin和dllreferenceplugin，将dllplugin将第三方库打包为单独文件，然后使用dllreferenceplugin在开发环境和生产环境中引用该文件，减少打包时间
- 使用缓存，使用cache-loader或hard-source-webpack-plugin等插件来实现缓存
- 优化文件搜索范围，在配置loader和plugin时，尽量缩小文件搜索的范围，只对必要的文件进行处理，避免不必要的性能开销。
- 使用treeshaking，通过配置webpack，确保只打包使用到的代码，而不是将整个库都打包进去。
- 使用并行构建工具，考虑使用类似于parallel-webpack，thread-loader等并行构建工具，提高构建速度
- 优化配置项
## 3.如何提⾼ webpack 的构建速度？
同上


## 4.webpack 的构建流程

- 解析配置文件
	- 解析webpack.config.js
	- 确定入口文件，输出文件路径，以及各种loader、plugin
- 识别入口文件
	- 根据入口文件，递归解析入口文件以及依赖模块
- 执行loader
	- 根据配置文件等规则，对不同类型的模块应用相应的loader，进行转换，如es6转换为es5，scss转换为css，对图片进行压缩等操作
- 应用plugin
	- 执行plugin，如代码压缩、资源提取、环境变量注入
- 生成输出文件
	- webpack将所有模块打包成一个或多个bundle文件，这些文件包括js、css、图片等资源
- 输出结果

## 5. babel 是什么，怎么做到的？

babel是一个广泛使用的js编译器，将当前或旧版本的js代码转换为向后兼容的js代码，以便在当前或旧版本的浏览器中运行。这是因为它具备以下的特点：
- 语法转换
	- 将比如箭头函数、解构赋值、Promise等语言特性转换
- API转换
	- 将Set、Map、Symbol等内置对象和方法转换
- Polyfill添加
	- 模拟新的API
- 插件化


## 6. webpack 热更新的机制原理？

- 在开发模式下，Webpack Dev Server会监控项目中所有文件等变化。当文件发生变化时，webpack会构建新的模块，并将这些模块传递给hmr runtime
- hmr runtime，webpack在构建输出的bundle中包含了hmr runtime，它负责在运行时接收来自webpackdevserver的更新，并将这些更新应用到运行中的应用程序中
- 模块热替换，hmr runtime会将新模块的更新发送给应用程序，并使用更新后的模块替换旧模块，从而实现热更新


## 7. 是否有写过 webpack 插件？

没有，但是了解过。

```js
class MyWebpackPlugin{
	constructor(options){
		this.options = options;
	}
	apply(compiler){
		compiler.hooks.emit.tap("MyWebpackPlugin", compilation => {
			console.log("Webpack is emitting files...");
		})
	}
}

// ------

const MyWebpackPlugin = require("./MyWebpackPlugin")

module.exports = {
	plugins: [
		new MyWebpackPlugin({
			
		})
	]
}
```

## 8. 谈下 webpack loader 机制？

webpack loader机制是webpack提供的一种机制，用于处理项目中各种js模块、css、图片、字体等。通过loader机制，webpack可以将不同类型的文件转换为模块，并且可以在转换过程应用各种转换操作，例如编译、压缩、转译等；
特点：
- 模块转换
	- loader可以将不同类型的文件转换为js模块，使这些文件作为模块被引入
- 链式调用
	- 多个loader可以串联使用，每个loader可以对模块进行转换，并将转换后的结果传递给下一个loader
- 配置灵活
	- 对于每个loader，可以通过配置选项进行定制化配置，从而满足各种不同的需求
- 处理多种资源
	- 除了js模块，loader可以处理css、图片、字体等各种资源文件，使得这些资源文件也可以成为模块被引入和使用
在项目中使用loader通常需要以下步骤：
1. 安装loader模块，需要通过npm、yarn安装所需的loader模块，例如babel-loader用于处理js文件、css-loader用于处理css文件
2. 配置loader，在webpack的配置文件中，通过module.rules配置项配置需要使用loader，可以指定loader的名称、处理的文件类型、loader的配置选项等
3. 链式调用，如果需要对文件进行多步转换，可以通过数组的方式指定多个loader，并且可以通过！符号指定loader的执行顺序


## 9.uglify 原理？

uglify是一个js代码压缩工具，它的主要原理是通过删除代码中的空白符，注释、简化变量名等方式，从而减小代码体积，提高加载速度。Uglify的原理可以简单概括为词法分析、语法分析和代码压缩三个步骤。
- 词法分析，uglify首先对输入 djs代码进行词法分析，将代码字符串分割成一系列的token，每个token包含了代码中的一个词法单元，如关键字、标识符、运算符等。词法分析器会忽略空格、注释等无关紧要的字符，并为每个token添加对应的类型和值。
- 语法分析，uglify使用语法分析器将token流转换成抽象语法书ast。抽象语法书是一个树状结构，它反映了代码的语法结构，每个节点代表了代码中的一个语法单元，如变量声明、函数调用、条件语句等。语法分析器会根据token流的语法规则构建对应的抽象语法树。
- 代码压缩，一旦得到了抽象语法树，uglify就可以利用各种代码压缩计数对代码进行压缩。这些压缩技术包括但不限于：
	- 删除无效的代码和不可达代码
	- 简化变量名和属性名
	- 压缩常量和表达式
	- 删除注释和空白符
	- 合并代码块和语句
	- 代码混淆
## 10. babel 原理？

babel是一个广泛使用的js编译器，它主要用于将es2015+的代码转换为向后兼容的js版本，以便在现有环境中运行。babel的主要原理包括词法分析、语法分析、转换和生成代码4个步骤
- 词法分析，babel对代码进行词法分析，分割陈token，每个token包含了代码中的一个词法单元，如关键字、标识符、运算符。词法分析器会忽略空格、注释等无关紧要的字符，并为每个token添加对应的类型和值
- 语法分析，将token转换为ast，抽象语法书
- 转换，一代得到抽象语法书，babel利用插件系统对语法树进行转换，对特定的语法结构进行识别和处理，例如箭头函数、解构赋值、类定义。
- 生成代码

## 11. webpack 插件机制？

webpack的插件机制可以监听webpack构建生命周期中的各个钩子，并且可以访问webpack的编译实例以及整个构建过程中的各种资源，从而实现对构建过程的干预和定制化处理。

- 生命周期：webpack在构建过程中定义了一系列的生命周期钩子，比如beforeRun、run、emit、afterEmit等。插件可以通过监听这些钩子来介入webpack的构建过程。
- 编译实例和资源，webpack插件可以访问webpack的编译实例和资源，对资源进行修改、分析和优化。编译实例代表了整个webpack的编译过程，而资源则代表了webpack正在处理的各种文件和模块。
- 功能扩展和优化，通过编写插件，可以实现对webpack的功能扩展和优化，例如资源压缩、代码分割、模块分析、自定义输出等
编写一个webpack插件通常需要以下步骤：
- 创建一个js函数，该类或函数包含apply方法，或者是一个符合webpack插件规范的函数
- 在apply方法中，可以访问webpack提供的编译实例和资源，以及注册对应的生命周期钩子的处理函数
- 在处理函数中，可以根据需要对资源进行修改或者添加自定义的构建逻辑

## 12. 白屏怎么优化？

白屏问题通常是指页面加载时间长，用户看到的是空白的页面，而非期望的内容。以下是一些优化白屏问题的方法：
- 代码优化：减少不必要的代码、压缩和合并js、css和html文件，以减少页面加载时间。确保代码精简和高效。
- 图片优化，优化图片大小和格式，采用适当的压缩方法，以减少图片加载时间。延迟加载不必要的图片，避免一次性加载大量图片导致页面延迟
- 异步加载：将不必要的资源加载延迟到页面初次渲染后再进行加载，通过异步加载脚本和资源文件，以加快页面加载速度。
- 代码分割，将页面所需的js代码分割成小块，并根据页面需要进行按需加载，以减少初始加载时间。
- 服务端渲染，对于需要较快的首屏加载的页面，可以考虑使用服务端渲染，以在服务端生成完整的html页面
- 浏览器缓存，合理设置静态资源的缓存策略，利用浏览器缓存，减少重复请求，提高页面加载速度。
- 使用预加载和预渲染关键资源和页面，以提前加载所需内容，加快页面呈现速度。
- 性能监控和分析，使用工具进行性能监控和分析，及时发现页面加载性能瓶颈，并进行优化。

## 13.动画性能？

- 使用css动画，尽量使用css动画来实现动画，css动画通常比js动画性能好，css可以通过gpu加速来实现，从而减少cpu负载
- 使用transform和opacity，这两个属性可以通过硬件加速来处理，从而提高动画的性能
- 避免布局抖动，在进行动画设计时，避免频繁改变元素的布局属性，如宽度，高度，位置等。这样会导致页面的布局抖动，降低动画的流畅性。
- 使用reqeustAnimationFrame，在js动画中，使用这个来执行动画循环，可以让浏览器在下一次重绘之前执行动画更新，从而提高动画的性能流畅性
- 减少重排和重绘，尽量减少对DOM结构和样式的修改，这样会导致页面的重绘和重排，影响动画的性能。可以通过批量处理样式修改、使用文档片段等方式来减少重排和重绘的次数
- 使用硬件加速，对于复杂的动画效果，可以使用css
- 脱离文本流，如果动画需要频繁操作DOM，就会导致页面的性能问题，可以将动画的positino设置为absolute或者fixed，将动画脱离文档流，这样他回流就不会影响页面。

## 14. 渲染合成层？

浏览器为了提升动画的性能，为了在动画的每一帧的过程中不必要每次都重新绘制整个页面。在特定方式下可以触发一个合成层，合成层拥有单独的graphicslayer。
需要进行动画的元素包含在这个合成层下，这样动画的每一帧只需要去重新绘制这个graphicslayer即可，从而达到提升动画性能的目的。
如果我们想尽可能的优化我们的css动画，或者在日常css开发中，尽可能的提升css的性能，这是一个非常重要的概念。通过生成独立的graphicslayer，让此层内的重绘重排不引起整个页面的重绘重排。
这也就是我们常说的，css 3d硬件加速的本质原因。
那么元素什么时候会触发一个graphics layer层？
- 硬件加速的iframe元素
- 硬件加速的插件，
- 使用加速视频解码
- 3D或者硬件加速的2D Canvas元素
- 3D 或者透视变换perspective、transform的css属性
- 对opacity做css动画或使用一个动画变换的元素
- 拥有加速css过滤器的元素。
- 元素有一个包含复合层的后代节点，一个元素拥有一个子元素，该子元素在自己层里
- 元素有个z-index较低，且包含一个符合复合层的兄弟元素
- 通常创建一个复合层的方式有：
	- transform
	- opacity
	- filter
- 通过合理使用这几个元素，有效提升页面的性能，譬如使用transform代替left，top，实现位移动画。

## 15.tree shaking 是什么，有什么作用，原理是什么？

tress shaking是一种js模块优化技术。

作用是在打包过程中去除未被引用的代码，以减少最终生成的包体积，优化资源利用

原理是基于es6模块的静态结构分析，识别未被引用的代码。

## 16. 前端微服务？

是指前端应用拆分为多个小型、独立的服务单元，每个单元负责特定的功能或页面。

优点是：
- 独立部署和维护
- 技术栈多样性
- 增量升级和扩展
- 性能优化
- 团队协作

## 17. CDN 的概念

CDN，内容分发网络，content delivery network，是一种通过互联网互相连接的电脑网络系统，利用最靠近每位用户的服务器，更快、更可靠地将音乐、图片、视频、应用程序及其他文件发送给用户，来提高性能、可扩展性以及低成本的网络内容传递用户。


## 18.CDN 的作用

- 性能方面
	- 延迟低，加载速度快，用户收到的内容来自最近的数据中心
	- 减少服务器的负责，部分资源请求分配给了CDN
- 安全方面
	- 有助于发育DDos，MITM等网络攻击

## 19. CDN 的原理

用户请求资源，经过CDN的DNS服务器将全局负载均衡设备IP地址返回给用户，用户向缓存IP发起请求，缓存服务器逐级请求上一级缓存服务器，如果最后缓存服务器没有，就会去自己的服务器去获取资源。

## 20、CDN 的使用场景

- 缓存静态资源
- 直播传送

## 21. 懒加载的概念

懒加载也叫做延迟加载、按需加载，指的是在长网页中延迟加载图片数据，是一种较好的网页性能优化的方式。在比较长的网页或应用中，如果图片很多，所有的图片都被加载出来，而用户智能看到可是窗口的那一部分，这样就浪费了性能。如果在滚动屏幕之前，可视化区域之外的图片不会进行加载，在滚动屏幕时才加载。这样网页的加载速度更快，减少了服务器的负担。

## 22.懒加载的特点

- 减少资源的加载，减少了服务器和浏览器的压力，提高了性能和用户体用

## 23. 懒加载的实现原理


- 通过onscroll事件和getBoundingClientRect API实现图片的懒加载
- 通过Intersection Observer交叉观察器实现比监听onscroll性能更佳的图片懒加载方案
```js
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lazy Load Images</title>
<style>
  .placeholder {
    height: 300px; /* 设置一个占位符的高度，以保持页面布局不变 */
  }
</style>
</head>
<body>

<div class="placeholder"></div>
<img data-src="https://via.placeholder.com/300" alt="Lazy Loaded Image" class="lazy-load">
<div class="placeholder"></div>

<script>
  // 获取所有带有 'lazy-load' 类的图片元素
  const lazyImages = document.querySelectorAll('.lazy-load');

  function lazyLoad() {
    // 循环遍历每个图片元素
    lazyImages.forEach(img => {
      // 判断图片是否在视口中可见
      if (img.getBoundingClientRect().top < window.innerHeight) {
        // 将 data-src 属性的值赋给 src 属性，实现图片加载
        img.src = img.dataset.src;
        // 移除 'lazy-load' 类，避免重复加载
        img.classList.remove('lazy-load');
      }
    });
  }

  // 页面加载完毕后立即执行一次
  lazyLoad();

  // 监听页面滚动事件，在滚动时执行 lazyLoad 函数
  window.addEventListener('scroll', lazyLoad);
</script>

</body>
</html>

```

```js
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lazy Load Images with Intersection Observer</title>
<style>
  .placeholder {
    height: 300px; /* 设置一个占位符的高度，以保持页面布局不变 */
  }
</style>
</head>
<body>

<div class="placeholder"></div>
<img data-src="https://via.placeholder.com/300" alt="Lazy Loaded Image" class="lazy-load">
<div class="placeholder"></div>

<script>
  // 获取所有带有 'lazy-load' 类的图片元素
  const lazyImages = document.querySelectorAll('.lazy-load');

  // 创建 Intersection Observer 实例
  const observer = new IntersectionObserver((entries, observer) => {
    // 遍历观察到的每个 entry
    entries.forEach(entry => {
      // 如果 entry 是可见的
      if (entry.isIntersecting) {
        const img = entry.target;
        // 将 data-src 属性的值赋给 src 属性，实现图片加载
        img.src = img.dataset.src;
        // 移除 'lazy-load' 类，避免重复加载
        img.classList.remove('lazy-load');
        // 停止观察该图片
        observer.unobserve(img);
      }
    });
  });

  // 遍历每个图片元素，开始观察
  lazyImages.forEach(img => {
    observer.observe(img);
  });
</script>

</body>
</html>

```

## 24. 懒加载与预加载的区别

一个是提前加载，一个是迟缓甚至不加载。懒加载对服务器前端有一定的缓解压力作用，预加载则会增加服务器前端压力

## 25. 回流与重绘的概念及触发条件

- 概念
	- 回流是当渲染树中部分或者全部元素的尺寸、结构或者属性发生变化时，浏览器会重新渲染部分或者全部文档的过程就叫做回流
	- 重绘是当页面某些元素的样式发生变化，但是不会影响其在文档流中的位置，浏览器就会对元素进行重新绘制，这个过程就是重绘。
- 触发条件
	- 回流
		- 页面的首次渲染
		- 浏览器的窗口发生变化
		- 元素的内容发生变化
		- 元素的尺寸或位置发生变化
		- 元素的字体大小发生变化
		- 激活css伪类
		- 查询某些属性或者调用某些方法
		- 添加或者删除可见的DOM元素
	- 重绘
		- color
		- background
		- outline
		- border-radius
		- visibility
		- box-shadow
触发回流一定会触发重绘，反之不然

## 26. 如何避免回流与重绘？

- 操作DOM，尽量在低层级DOM节点进行操作
- 少使用table布局，一个改动会使整个table进行重新布局
- 使用css表达式
- 不要频繁操作元素的样式，尽量改动类名
- 使用absolute和fixed使元素脱离文档流，不会影响其他元素
- 避免频繁操作DOM，可以创建一个文档片段documentFragment，在上面应用所有DOM操作，最后再把他们添加到文档中
- 将文档设置为display:none, 操作结束后再显示出来
- 将DOM的多个读操作或者写操作放在一起，而不是读写混合。
## 27.documentFragment 是什么？用它跟直接操作 DOM 的区别是什么？

documentFragment是一个没有父对象的最小文档对象。

和直接操作DOM对比，它的对象不会触发DOM树的重新渲染，不会导致性能问题。

## 28.对节流与防抖的理解

函数防抖：事件被触发n秒后再执行回调，如果在这n秒事件又被触发，则重新计时。这可以使用点击事件上，避免用户的多次请求。
函数节流：在规定的单位时间内，只能有一次触发时间、节流可以使用scroll函数事件监听上，通过事件节流来降低事件调用的频率。

## 29.实现节流函数和防抖函数

实现js在点击事件中的防抖
```js
function debounce(func, delay){
	let timer;
	return function(){
		const context = this;
		const args = arguments;
		clearTimeout(timer);
		timer = setTimeout(()=>{
			func.apply(context, args);
		}, delay)
	}
}
function handleClick(){
	console.log("button clicked!");
}

const button = document.getElementById("myButton");
button.addEventListener("click", debouce(handleClick, 1000));

function debounce(func, delay){
	let timer;
	return function(){
		const context = this;
		const args = arguments;
		clearTimeout(timer);
		timer = setTimeout(()=>{
			func.apply(context, args)
		}, delay)
	}
}

function handleClick(){
	console.log("button clicked");
}

const button = document.getElementById("myButton");
button.addEventListener("click", debounce(handleClick, 1000))

function debounce(func, delay){
	let timer;
	return function(){
		const context = this;
		const args = arguments;
		clearTimeout(timer);
		timer = setTimeout(()=>{
			func.apply(context, args)
		}, delay)
	}
}
function handleClick(){
	console.log("button, click!");
}

const button = document.getElementById("myButton")

button.addEventListener("click", debounce(handleClick, 1000))
```

```js
function throttle(func, delay){
	let lastExecTime = 0;
	return function(){
		const context = this;
		const args = arguments;
		const currentTime = Date.now();
		if(currentTime - lastExecTime >= delay){
			func.apply(context, args);
			lastExecTime = currentTime;
		}
	}
}

function handleScroll(){
	console.log("scrolling...")
}

window.addEventListener("scroll", throttle(handleScroll, 1000));

function throttle(func, delay){
	let lastExecTime = 0;
	return function(){
		const context = this;
		const args = arguments;
		const currentTime = Date.now();
		if(currentTime - lastExecTime >= delay){
			func.apply(context, args);
			lastExecTime = currentTime;
		}
	}
}
function handleScroll(){
	console.log("scrolling...")
}

window.addEventListener("scroll", throttle(handleScroll, 1000))

function throttle(func, delay){
	let lastExecTime = 0;
	return function(){
		const context = this;
		const args = arguments;
		const currentTime = Date.now();
		if(currentTime - lastExecTime >= delay){
			func.apply(context, args);
			lastExecTime = currentTime;
		}
	}
}
function handleScroll(){
	//...
}

window.addEventListener("scroll", throttle(handleScroll, 1000))
```

## 30.如何对项目中的图片进行优化？

1. 用css替代图片
2. 对于移动端可以根据屏幕宽度，优化对应的原图输出
3. 小图使用base64
4. 多个图标整合到一张图中
5. 选择正确的图片格式
6. 支持webp格式的浏览器尽量使用webp

## 31.常见的图片格式及使用场景

- webp支持有损和无损压缩，无损压缩比png小26%，有损压缩比jpeg小25-34%。
- svg是无损的矢量图
- png-24是无损的，使用直接色的点阵图
- png-8是无损的、使用索引色的点阵图
- gif是无损的，使用索引色的点阵图
- bmp是无损的，支持索引色和直接色的点阵图

## 32.如何提⾼ webpack 的打包速度?

- 优化loader
	- 优化loader文件搜索访问
		- node_modules没必要再编译
	- 缓存babel编译过的文件
	- HappyPack将loader同步执行转换为并行的
	- DllPlugin将特定库提前打包然后引入
- 代码压缩
	- 使用uglifyjs压缩

## 33.如何减少 Webpack 打包体积

- 按需加载
- scope hoisting分析模块之间的依赖关系，把打包的模块合并到一个函数里去
- tree sharking删除未被引用的代码

## 34.浏览器渲染优化

- js
	- async是异步加载，不保证加载顺序
	- defer异步加载，dom树准备好后按顺序执行
- css
	- link，浏览器会派发一个新的线程是加载资源文件，gui会继续向下渲染
	- @import，浏览器会暂停渲染去加载文件
	- style，gui直接渲染
	- 优先style，其次link，最后@import
- dom树，cssom树
	- 代码层级不要太深
	- 使用语义化标签
	- 减少cssd代码的层级
- 减少回流会重绘
## 35.Webpack vs Rollup 的区同点

- 目标不同
	- webpack的主要目标是解决前端开发中的一切资源的打包和构建问题，适合复杂的web程序
	- rollup的主要目标是专注于js模块的打包，特别是es6模块。tollup的特点是那个进行treeshaking，代码包更小、更高效
- 生态和插件系统
	- webpack生态系统多，支持的文件类型和开发场景多
	- rollup插件比较简单，主要关注于js模块的处理和优化，对纯js模块的打包效果更加突出
- 代码拆分和动态加载
	- webpack可以通过代码拆分和按需加载来优化应用程序的性能和加载速度
	- rollup支持代码拆分，单对于webpack来说，关注生成更小、更高效的代码包，适合库和工具的打包

## 36.如何理解前端工程化

前端工程化是通过工程化的方法和根据来提高前端开发效率，降低维护成本，提升项目质量的一种开发模式。前端工程化包括了项目构建、模块化开发、自动化测试、持续集成、部署流程等一系列技术和实践的整合，旨在优化前端开发过程和项目管理。

## 37.如何理解 Monorepo

monorepo是单个版本库repository中管理多个项目或组件的代码。通常，每个项目或组件都有自己的目录结构，但他们共享相同的版本控制和构建流程。monorepo提供了一种集中式的代码管理方式，可以用于管理大型项目或跨项目共享代码的情况。

## 38.除了 Webpack，你还了解哪些构件工具

- rollup，专注于构建es6模块
- gulp可以完成如文件压缩、文件合并、代码检测等任务
- parcel通过并行化处理和缓存来提供快速的构建速度

## 39.SPA 首屏为什么加载慢

- 大量js和css
- 数据请求过多或过慢
- 大量图片加载慢
- 过多渲染和重绘
- 网络问题

## 40.前端展示大批量图片如何优化

- CDN
- 图片懒加载
- 图片压缩
- webp格式
- 懒加载占位符

## 41.如何理解 RAIL 性能指标模型

RAIL：response/animation/idle/load
- response: 在100ms内用户输入发起的转换
- animation，目标为流程的视觉效果，一般保持60fps
- idle，最大限度的增加空闲事件以提高页面在50毫秒内响应用户输入的几率
- load，目标是5秒或更短时间实现可交互

## 42.Vue的性能优化有哪些

- 编码阶段
	- 减少data中的数据，data数据都会增加getter和setter以及watcher
	- SPA页面采用keep-alive缓存组件
	- 用v-if替代v-show
	- key保证位移
	- 懒加载，异步组件
	- 防抖节流
	- 模块按需导入
- SEO
	- 预渲染
	- 服务端渲染SSR
- 打包优化
	- 压缩代码
	- TreeShaking
	- cdn加载第三方模块
	- 多线程打包happypack
- 用户体验
	- 骨架屏
	- PWA

## 43.详解 Vue 性能优化

同上

## 44.vite为什么比webpack快

- 基于ES模块的静态分析，利用es模块的静态分析特性，在浏览器请求文件的同时，动态分析和编译模块，不需要像webpack那样预编译整个项目
- 利用原生的ES模块
	- 利用浏览器对es模块的元素支持，不需要像webpack使用webpackDevServer来实现热更新和模块替换
- 按需编译
	- 只会编译正在修改的文件，不是整个项目
- 优化的生产构建