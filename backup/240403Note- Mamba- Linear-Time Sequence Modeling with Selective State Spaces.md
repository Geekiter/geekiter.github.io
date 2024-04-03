# 标题

Mamba: Linear-Time Sequence Modeling with Selective State Spaces

具有选择状态空间的线性时间序列建模

背景

发表时间：2023年12月
单位：卡内基梅隆大学
作者：Albert Gu*, Tri Dao*
![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/2048ac96-db1b-41af-a03f-fdf653e146cf)

# Mamba架构

Mamba是由许多层Mamba堆叠而成，作者提到Mamba架构是受到H3架构（Hungry Hungry Hippo）的启发。Mamba是由H3和门控MLP操作组合而成。
- 首先将输入投影到隐藏的状态维度上
- 然后在投影维度上进行非线性操作Silu激活函数
- 计算SSM
- 跳跃链接
- 用另一个线性投影缩小张量大小
![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/01980535-0ce1-43bb-9b45-18225bd40562)

Mamba和Transformer是相似的，
- 输入token
- token进入embedding层
- 从RMS-Norm开始
- 进入上面说的Mamba块
- 重复N次
- 最后是RMS-Norm
- 投影
- Softmax
- 获取下一个token

![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/bca0514e-b983-4dce-b722-358b3b789fc5)
# 状态空间模型

Mamba是一种状态空间模型，是基于S4（序列模型的结构化状态空间）的工作。

状态空间模型帮助我们使用一组定义的输入和输出对物理系统进行建模，输入和输出通过一阶微分方程相关联。
![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/7bf5258c-255e-466b-95bc-3f030a287cf9)

这是一个一节微分方程，变量ABCD称为状态变量。负责记住系统的状态并对其进行建模，在模型训练时被保留为可学习的参数。
通过对状态空间方程模型求导，得到状态空间方程的解：

![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/4c3f74da-7191-4877-bc21-d261bebdfa74)

# 理想的语言模型

Transformer在训练的过程中具有高度并行化的架构，不会梯度爆炸或下降。但Transformer的推理是一个迭代的过程，计算复杂度为O(N^2)。而RNN的计算复杂度只有O(1)，因为下一个token仅取决于之前的隐藏状态和当前输入。并且，正常的卷积训练是可并行的。

所以，一个理想的语言模型应该是：

- 训练并行化，如Transformer和CNN
- 推理时间恒定，如RNN

# S4的两面性 - RNN和CNN

RNN 循环神经网络
在RNN中，每个RNN块都输入当前状态x_t和之前的隐藏状态h_t-1，以输出下一个隐藏状态h_t和可选的输出状态y_t。

![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/397a2267-b71a-441a-a38c-99cd2fb5f518)
CNN 卷积神经网络
通过展开递归方程，我们可以得到一个通式，这个通式可以表示为具有固定K大小内核的连续卷积。
![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/beace4ae-7e3b-40cf-bfde-29608cd50a56)

![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/b3deacc6-7d1f-4a90-a9ab-a54820079125)

因此，我们在训练的时候就可以切换到卷积模式，进行并行化训练。在推理过程中，就可以切换到循环模式，进行恒定时间推理。
因为卷积的内核是固定的，所以称这种模型为时序不变的SSM。
由于SSM和RNN非常相似，所以也会遇到梯度爆炸或者消失的问题。因此提出过HiPPO矩阵，
![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/c19ae63d-69e7-499f-a67c-425c5f78699e)



通过HiPPO表示A矩阵，每个隐藏状态中的A矩阵都会记住历史信息，只需要计算一次。
矩阵A通过跟踪勒让德多项式的系数表示最新历史信息。

红色信号视为我们想要记住或近似的目标信号，黑框表示每个状态的值，基于
该状态值，蓝线绘制勒让德级数。随着每个步骤的进行，HiPPO矩阵会更新
每个步骤。 最近的步骤越多，近似度越好，时间步长越长时，近似度越低。
![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/2369301f-9a04-4a7b-9068-870afc22b504)

# S4的问题

基于序列的建模的根本问题是：将上下文压缩成更小的可学习状态，在效率和状态表示质量之间存在权衡。
比如：transformer效率低，因为它需要存储上下文的KV缓存。但存储和表示长文方面表现良好。而RNN效率高，因为具有有限形态，但是在上下文压缩质量方面效果较差。S4和所有其他状态空间模型在一些任务上，比如说选择性复制和上下文学习归纳表现效果不佳。

- 选择性复制：从给定的输入中辨别相关信息，并将其适当地再现或合并到生成的输出中的能力。
- 归纳：根据观察，能够推断信息、理解潜在的关系，引用学到的概念来生成更细致、更适合上下文的响应

# Mamba的选择机制


举个例子，我们想过滤一条评论，不过改推文主题，但是删除单词。基于Transformer的模型可以通学习这些单词来做到。但是当前的SSM模型无法做到这一点，因为他们是时序不变的，内核是固定的，可学习参数随着每个新的令牌传入而保持固定。

![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/614b5ba7-7ac6-471b-b4d3-8d73ca5fceca)

Mamba引入选择性扫描，不依赖卷积和递归的双重属性，仅依赖于循环，由于时间变化的参数化，矩阵A（HiPPO矩阵）保持不变，但是∆，B和C现在变为输入的函数。其中B代表批次大小、L代表序列长度、D代表输入数据的维度数，N代表隐藏状态的维度数。并且和S4不同的是，B和C不是参数，而是一些投影输出
![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/8ead4310-869a-42b3-8d0b-2f3f923d4afc)
![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/5c97ac91-eb23-408c-8ca6-218810512add)

# Mamba的并行扫描操作
由于Mamba支持用RNN，不使用卷积，所以不能进行并行化。但是Mamba设计了一个并行扫描操作。
![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/2eb7b1c7-d91e-48dc-b3e0-548cabc7e961)

我们先讲一个前缀和问题，核心思想是计算一个数组中每个位置之前所有元素的综合。
![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/7122d079-09d8-4ea9-a7b9-60a22ef3cac0)

它的计算方式和RNN类似，每个新状态都是当前输入x_t和先前状态h_t-1的总和。



由于求和运算具有结合性，(a + b) + c = a + (b + c)，我们可以将数组拆分成多个部分，分别计算每个部分的前缀和，然后合并结果。这样，不同部分的计算可以并行进行。
![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/5b7093b3-7b95-4894-aefa-6d2002f0539b)

# Mamba的优化
除了并行扫描算法，mamba还使用了内核融合和激活重新计算技术。
对于Mamba来说，扫描操作识别内存绑定的操作，因此内核融合用于减少内存I/O量，即从HBM加载到SRAM。所以，首先将SSM参数 A、Δ、B 和 C 从 HBM 加载到 SRAM，融合进行离散化操作，即从 A、Δ、B 转换 A_bar 和 B_bar  , C，递归运算在SRAM中完成，最终被发送回HBM。
在任何深度学习模型中，都有前向传播和反向传播、在前向传播中，我们计算每层的中间值和输出，在后向传播中，我们计算参数的梯度并更新它。


![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/bbc77665-716f-474f-9369-25c2c34bc92e)

在后向传播过程中，我们需要跟踪所有的中间值，会消耗大量内存，所以在实际计算之前，必须将中间值从HBM加载到SRAM，但需要更多的内存和时间，因此Mamba在计算过程中，所有中间值都不会被存储，而是在输入从HBM加载到SRAM时的反向传播期间重新计算。


# 实验部分
![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/8660cdf0-5a55-44da-b78c-2744cbeb7f95)
![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/50e0900e-7fed-46e0-9ae3-923d89fc3296)
![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/ad3b9e78-8a43-433e-aac1-281ca0bca60d)



# 架构图

![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/8c49ad83-2c1e-468e-8af1-082d6753a75c)

- 这是一个混合的RNN和CNN的模型，有RNN的长距离感知能力，又有CNN并行计算的优势。
- 上面的h_t-1和h_t是典型的RNN架构，而A，B_t，∆，C_t类似y=wx+b类似CNN的网络计算
- ABC
	- A: 表示状态转移矩阵，用于描述当前状态与下一个状态之间的转移关系
	- B: 表示状态到观测的矩阵，描述当前状态如何映射到可观测的输出
	- C: 表示外部输入到状态的矩阵，描述外部输入如何影响系统的状态转移
	- 这些参数共同定义了Mamba模型中的状态空间以及状态转移和观测之间的关系
- 其他参数
	- h_t-1代表时间步t-1时刻的隐藏状态，用于表示模型在过去时刻的状态信息
	- h_t表示模型读取时刻的状态信息
	- x_t为t时刻的输入
	- y_t为t时刻的输出
	- ∆代表时间步的离散化步长，将连续的时间序列转化为离散的时间步长，以便于模型处理和计算
- Project将输入数据映射到状态空间的过程，便于模型能够处理和学习数据的状态表示
- Discretize将连续的状态空间离散化，便于模型处理的和计算
- Selection Mechanism：一种选择性机制，用于模型中选择特定的状态空间或者子空间，以适应不同的输入数据和任务要求。选择性保留或丢弃某些状态信息，优化模型的性能。
- GPU优化
	- GPU SRAM：GPU的静态随机存储器，用来处理时间无关的计算
	-  GPU HBM：GPU的高带宽内存，用来处理相关的动态计算
	- 可以更高效的利用不同的GPU层次，提高计算效率

Mamba是基于之前的工作S4（Structured state space model）,在S4的基础上做了两个改进：
- 选择性扫描算法，模型可过滤有关与无关的信息，解决了S4在语言建模和生成的某些任务表现不佳的问题
- 硬件感知扫描算法，通过并行扫描、核融合和重计算有效地存储中间结果
# 代码
```python
model = Mamba(
    d_model=dim, # Model dimension d_model
    d_state=16,  # SSM state expansion factor
    d_conv=4,    # Local convolution width
    expand=2,    # Block expansion factor
).to("cuda")
```

- d_model: 定义RMSNorm的维度大小
- d_state: h_t, h_t-1的维度
- expand: d_inner和d_model的倍数，通常是2的倍数关系
- d_conv: 一维卷积的kernel大小


