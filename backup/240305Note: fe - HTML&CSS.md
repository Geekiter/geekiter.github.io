
## HTML+CSS

10/37

## 1.说一下 web worker

在HTML页面中，如果在执行脚本时，页面的状态是不可响应的，知道脚本执行完成后，页面才变得可以响应。web worker是运行在后台的js，独立于其他的脚本，不会影响页面性能。并且通过postMessage将结果回传到主线程。这样在进行复杂操作的时候就不会阻塞主线程了。

如何创建web worker：
1. 检测浏览器对于web worker的支持
2. 创建web worker的文件
3. 创建web worker对象

## 2.行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？
- 行内：span, a, b, img, input, select strong
- 块级别：h、p、div, ul, ol, li
## 3. CSS选择器及其优先级
- 标签内的,1000
- id,100
- class, 10
- 伪类选择器，10
- 标签选择器， 1
- 伪元素选择器，1
- 子元素选择器，0
- 后代选择器，0
- 通配符选择器，0
## 4.display的属性值及其作用

- none，元素不显示，从文档中移除
- block，块元素，继承父元素宽度
- inline，行内元素，默认宽度为内容宽度，不可以设置宽高
- inline-block，宽度为内容宽度，可以设置宽高
- list-item，添加样式列表标记
- table，块级表格
- inherit，集成父元素的display属性
- flex，flex布局
## 5.display的block、inline和inline-block的区别

1. block：会占用一行，可以设置width、height、margin、padding属性
2. inline，不会占用一行，width、height无效，垂直方向的padding、margin无效，可以设置水平方向的margin和padding
3. inline-block，将对象设置为inline对象，但是对象内容作为block对象程序，内联对象会排列在同一行。不会单独占据一行，又拥有块级元素的特性，宽高上下边距。

## 6. 隐藏元素的方法

- display: none
- visibility: hidden
- opacity: 0
- position: absolute
- z-index: -xx
- transform: scale(0, 0)

## 7. link和@import的区别

- link除了能加载css，还能加载rss。@import只能加载css
- link和页面同时加载，@import是载入完成后再加载
- link兼容性好，@import是css2.1提出的

## 8. display:none与visibility:hidden的区别

- 渲染树
	- display会脱离文本流
	- visibility不会脱离文本流
- 继承
	- display非继承性
	- visibility是继承属性，子孙节点可以显示
## 9. 伪元素和伪类的区别和作用？

- 伪元素是在元素前后插入元素或样式，但并不在文档源代码中，只在外部显示可见
- 伪类将特殊效果添加到特定选择器上，是已有的元素上添加类别，不会产生新的元素。.

## 10. 对盒模型的理解

标准盒模型、IE盒模型。

标准盒模型width和height包含content，IE盒模型包含了border、padding、content
box-sizeing: content-box 标准盒模型
box-sizeing: border-boxIE盒模型

## 11. 对 CSSSprites 的理解

将一个页面涉及到的所有图片都包含到一张大图里，利用css的background-image、background-repeat、background-position属性对背景定位
- 优点：
	- 减少http请求，提高页面性能
	- 减少图片的字节
- 缺点
	- 图片合并麻烦
	- 维护麻烦

## 12. CSS预处理器/后处理器是什么？为什么要使用它们？

预处理器：less，sass，stylus，用来预编译sass，less，增加css的复用性，还有编程特性，兼容性
后处理器：postCss，根据css规范，处理css。比如解决一些兼容性问题

## 13. display:inline-block 什么时候会显示间隙？
1. 空格
2. margin
3. font-size

## 14. 单行、多行文本溢出隐藏

- 单行文本溢出
```css
{

overflow: hidden; //溢出隐藏
text-overflow: ellipsis; //溢出用省略号显示
white-space: nowrap; // 规定段落中的文本不换行
}
```
- 多行文本溢出
```css
{

overflow: hidden
text-overflow: ellipsis;
display: -webkit-box; //作为弹性伸缩盒子显示
-webkit-box-orient: vertical; //从上到下锤子排列
-webkit-line-clamp: 3; //显示的行数

}


```

## 15. 如何判断元素是否到达可视区域

以图片为例，
window.innerHeight 是浏览器可视区的高度
document.body.scrollTop || document.documentElement.scrollTop是浏览器滚动的过距离
imgs.offsetTop是元素顶部距离文档顶部的高度
内容达到显示区域的：document.body.scrollTop  < img.offsetTop < window.innerHeight + document.body.scrollTop;
![[Pasted image 20240305201347.png]]

## 16. z-index属性在什么情况下会失效

1. 父元素为relative，子元素z-index失效
2. 元素设置了float浮动
3. 严肃没有设置postion为非static

## 17. 两栏布局的实现

- 第一种：左边浮动，右边margin-left
- 第二种：flex布局
- 第三种，绝对定位，margin-left/left
```css
.left{
float: left;
width: 300px;
}
.right{
margin-left: 300px;
}
```

```css
.container{
	display: flex;
}
.left{
	flex: 1
}
.right}
	flex: 1
```
绝对定位
```css
.outer{
	position: relative;
	height: 100px;
}

.left{
	postion: absolute;
	width: 200px;
}

.right{
	margin-left: 200px;
}
```

```css
.outer{
	postion: relative;
	height: 100px;
}

.left{
	width: 200px;
}

.right{
	position: absolute;
	top:0;
	right: 0;
	botton: 0;
	left: 200px;

}
```

## 18. 三栏布局的实现

浮动，中间一栏放在中间

### 绝对定位，左右两栏absolute，中间对应方向margin值
```css
.outer {
	position: relative;
	height: 100px;
}

.left {
	position: absolute;
	width: 100px;
	height: 100px;
	background: tomato;
}

.right {
	position: abosulte;
	top: 0;
	right: 0;
	width: 200px;
	height: 100px;
	background: gold;
}

.center {
	margin-left: 100px;
	margin-right: 200px;
	height: 100px;
	background: lightgreen;
}
```

### flex布局，中间flex:1, 左右设置大小
```css
.outer{
	display: flex;
	height: 100px;
}

.left{
	width: 100px;
	background: tomato;
}

.right{
	width: 100px;
	background: gold;
}

.center{
	flex: 1;
	background: lightgreen;
}
```
### 浮动，左右固定大小，对应方向浮动。中间设置左右margin值，中间一栏必须放在最后
```css
.outer{
	height: 100px;
}

.left{
	float: left;
	width: 100px;
	height: 100px;
	background: tomato;
}

.right{
	float: right;
	width: 200px;
	height: 100px;
	background: gold;
}

.center{
	height: 100px;
	margin-left: 100px;
	margin-right: 200px;
	background: lightgreen;
}
```

### 圣杯布局
利用浮动和负边距来实现。父级元素设置左右padding，三列三列做浮动，中间一列放在最前面。宽度设置为父级元素的宽度。把后面两列
```html
<head>

    <style>

        .outer{

            background-color: blanchedalmond;

            padding: 0 200px 0 100px;

            height: 200px;

        }

  

        .center{

            width: 100%;

            height: 100px;

            float: left

  

        }

        .left{

            position: relative;

            left: -100px;

            margin-left: -100%;

            width: 100px;

            height: 200px;

            float: left;

            background-color: aquamarine;

        }

        .right{

            position: relative;

            left: 200px;  /*让他上去*/

            margin-left: -200px;  /*位移回来*/

            width: 200px;

            height: 200px;

            float: right;

            background-color: whitesmoke;

        }

    </style>

</head>

  

<body>

  

    <div class="outer">

        <div class="center">Inline Block Element 2</div>

        <div class="left">Inline Block Element 1</div>

        <div class="right">Inline Block Element 3</div>

    </div>

  

</body>
```

### 双飞翼布局

利用center外面包裹的wrap覆盖全部宽度，center在内部使用margin留出宽度，left、right用margin-left顶上
```html
<html>
<head>

    <style>

        .wrap,

        .left,

        .right {

            float: left;

            height: 200px;

        }

  

        .wrap{

            width: 100%;

            background-color: aqua;

        }

  

        .center{

            margin: 0 200px 0 100px;

        }

  

        .left{

            margin-left: -100%;

            width: 100px;

            background-color: red;

        }

  

        .right{

            margin-left: -200px;

            width: 200px;

            background-color: yellow;

        }

    </style>

</head>

<body>

  

    <div class="outer">

        <div class="wrap">

            <div class="center">Inline Block Element 2</div>

        </div>

        <div class="left">Inline Block Element 1</div>

        <div class="right">Inline Block Element 3</div>

    </div>

  

</body>
</html>
```



## 19.水平垂直居中的实现

### flex布局

```css
.parant{
	display: flex;
	justify-content: center;
	align-items: center;
}
```

### grid 布局

```css
.wp{
	display: grid;
}

.box{
	align-self: center;
	justify-self: center;
}
```

### absolute

```css
%% 这是相对浏览器来说的垂直居中，如果相对元素， 将父元素的position设为relative %%
        .center{

            position: absolute;

            top: 50%;

            left: 50%;

            background-color: aqua;

            transform: translate(-50%, -50%) // 将元素的中心移到元素原先的左上角

        }
```

## 20. 对Flex布局的理解及其使用场景

Flex布局是一种在容器内部进行灵活、可响应的布局方式。
Flex的概念
- 主轴和交叉轴，默认水平方向是主轴
- 容器属性
	- display: flex，设为flex布局
	- flex-direction: 定义主轴
	- justify-content: 主轴的对齐方式
	- align-items: 交叉轴的对齐方式
	- flex-wrap: 是否换行
- 项目属性
	- flex-grow: 项目放大比例
	- flex-shrink: 缩小比例
	- flex-basis: 主轴的初始大小
使用场景：
- 自适应布局
- 水平和垂直居中
- 等高布局
- 响应式布局
- 动态排序

## 21. 为什么需要清除浮动？清除浮动的方式

浮动：在非IE浏览器下，容器不设高度且子元素浮动，容器高度不会被撑开，内容就会溢出到容器外面从而影响布局。

清除方式：

- 给父级div定义height属性
- 最后一个浮动元素之后添加一个空的div，并添加clear:both样式
- 包含浮动元素的父级元素添加overflow:hidden或者overflow:auto
- 使用:after伪元素
```css
.clear::after{
	content: "";
	clear: both;
	display: block;
}
```

## 对BFC的理解，如何创建BFC
BFC是块级上下文格式化，是页面的一块渲染区域，有着一套渲染规则。
常用来：
- 消除margin重叠
- 消除浮动容器重叠
- 消除浮动元素父元素高度坍塌的问题
如何创建BFC？常用的方式是给父元素设置overflow:hidden

## 23. 什么是margin重叠问题？如何解决？

普通流中，两个会计元素的上下外边距可能会合并为一个外边距，取最大的那个。浮动元素和绝对定位不会折叠。

- 兄弟重叠
	- 底部元素变为行内盒子：display: inline-block
- 父子重叠
	- 父元素加入overflow: hidden
	- 子元素变为行内盒子: display: inline-block
## 24. position的属性有哪些，区别是什么

- absolute: 绝对定位，相对于static以外的一个父元素进行定位。
- relative：相对定位，相对于原来的位置进行定位
- fixed: 绝对定位，相对于屏幕进行定位
- static，没有定位
- inherit: 继承定位

## 25. display、float、position的关系

- position为absolute和fixed，float失效，并且display要设置为table或者block
- float、postion会脱离文本流，flex不会脱离文本流

## 26、css怎么实现三角形？

**border属性是右三角形组成的**

```css
div {
    width: 0;
    height: 0;
    border-top: 50px solid red;
    border-right: 50px solid transparent;
    border-left: 50px solid transparent;
}
```

## 27. 实现一个扇形

**用CSS实现扇形的思路和三角形基本一致，就是多了一个圆角的样式，实现一个90°的扇形：**

```css
	.center {
		border: 100px solid transparent;
		width: 0;
		height: 0;
		border-radius: 100px;
		border-top-color: aqua;
	}
```

## 28. 实现一个宽高自适应的正方形
```css
.square {
  width: 10%;
  height: 10vw;
  background: tomato;
}
```

## 29. 画一条0.5px的线

- **采用transform: scale()的方式，该方法用来定义元素的2D 缩放转换：**
```css
transform: scale(0.5,0.5);
```
- meta viewport方式
```html
<meta name="viewport" content="width=device-width, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5"/>
```

## 30. 设置小于12px的字体
- 使用css的transform.scale
- 使用图片
## 31. 如何解决 1px 问题？

在移动端web开发中，UI设计稿中设置边框为1像素，前端在开发过程中如果出现border:1px，测试会发现在retina屏机型中，1px会比较粗，即经典的移动端1px像素问题。

- 直接写0.5px，老设备不兼容
- 伪元素放大再缩小，宽高设为父元素的两倍，然后再缩小
```css
.parant{
	position: relative;
	&::after{
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		height: 1px;
		width: 100%;
		transform: scale(0.5);
		transform-origin: left top;
		box-sizing: border-box;
		border: 1px solid #333;
	}
}
```
- 设置viewport
设置initial-scale=0.5, maxinum-scale=0.5, mininum=0.5

## 32.CSS 中可继承与不可继承属性有哪些？
可继承：
- 字体
- 文本
- 可见性
- 间距
不可继承：
- 盒模型属性
- 定位属性
- 背景
- 清除浮动

## 33.line-height: 100% 和 line-height: 1 有什么不一样？

- 100%是行高与当前字体实际大小相等， 行高与字体大小相同
- 1是行高与字体大小的倍数，具体的倍数取决于字体特性和浏览器的默认样式
## 34.如果在伪元素中不写 content 会发生什么

如果在伪元素中不写 content，那么该伪元素将不会被渲染或显示在页面上。content 属性是伪元素的必需属性，它定义了伪元素的内容。
## 35.flex: shrink 和 flex-grow 的默认值是多少？它们的作用是什么？flex: 1 表示什么？

shrink默认值是1，flex-grow默认值是0
- shrink定义了如果父容器空间不足，会根据flex-shrink比例收缩
- flex-grow定义了剩余空间的扩展能力，如果父容器有多余空间，会根据flex-grow的比例进行扩展，默认不扩展
## 36.如何快速选取同一批兄弟元素的偶数序号元素。
```css
.nth-child(even){
	...
}
```

## 37.CSS 中是否存在父选择器？其背后的原因是什么？

- focus-within
- has
之前没有，因为如果支持父选择器，整个文档不能阻塞，不然渲染速度会减慢。

