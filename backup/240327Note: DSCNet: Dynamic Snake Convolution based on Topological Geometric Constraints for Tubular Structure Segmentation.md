# Background

- 会议：ICCV 2023
- 单位：东南大学
- 作者：Yaolei Qi

# Contribute
- 动态蛇形卷积，自适应关注细长曲折的局部特征，在2D和3D数据集上对管状结构的精确分割
- 多视角特征融合策略，以补充对关键特征的多方面关注
- 基于点集相似性的持久同调的拓扑连续性约束损失函数，更好的约束了分割的连续性

# Method

## DSCNet

![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/75625a9b-6698-4a4e-81f7-6a9e0b25dbfa)

## 动态蛇形卷积

![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/bb506f29-9b53-40a0-aaa1-5845a4f29251)
动态蛇形卷积DSConv用于提取管状结构的局部特征，卷积核的灵活性通过引入变形偏移来增强，采用迭代策略来确保感知范围的连续性。
DSConv将标准卷积核在x和y轴方向都进行直线化，采用累积过程来确定每个网格
偏移量通过累加确保卷积核符合线性形态结构，使用双学校差值将小数位置转换为整数形式
动态蛇形卷积覆盖了9x9的感受野可选择范围，旨在更好地适应细长的管状结构。

标准3x3卷积

```python
def convolution_9x9(input_feature_map):
    # 假设输入图像为I，输出图像为O
    kernel_size = 9
    
    # 遍历输入图像的每个像素
    for i in range(4, len(I) - 4):
        for j in range(4, len(I[0]) - 4):
            # 计算卷积结果
            conv_sum = 0
            for m in range(-4, 5):
                for n in range(-4, 5):
                    # 获取卷积核权重
                    weight = get_kernel_weight(m, n)
                    # 获取输入图像对应位置的像素值
                    pixel_value = I[i + m][j + n]
                    # 累加卷积结果
                    conv_sum += weight * pixel_value
            # 将累加结果赋给输出图像
            O[i][j] = conv_sum
    return O

# 假设 get_kernel_weight(m, n) 返回卷积核在位置 (m, n) 处的权重


```

动态蛇形卷积

```python
# 假设输入图像为I，输出图像为O
# 假设变形偏移为delta
# 假设卷积核大小为9x9
# 假设卷积核中心为Ki = (xi, yi)

# 遍历输入图像的每个像素
for i in range(4, len(I) - 4):
    for j in range(4, len(I[0]) - 4):
        # 计算动态蛇形卷积结果
        conv_sum = 0
        for c in range(-4, 5):
            # 计算偏移量
            delta = compute_delta(i, j, c)  # 根据目标位置计算偏移量，偏移量设置为一个卷积，去学习
            # 计算卷积核位置
            Ki_plus_c = (i + c, j + delta)
            # 获取输入图像对应位置的像素值
            pixel_value = I[Ki_plus_c[0]][Ki_plus_c[1]]
            # 累加卷积结果
            conv_sum += pixel_value
        # 将累加结果赋给输出图像
        O[i][j] = conv_sum

```

## 多视角融合策略

![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/a63734f2-b013-4cf8-b5e7-c1418274c217)

多视角策略的核心是通过多个视角观察目标的结构特征，并通过这些特征进行融合，以提高模型的性能和稳健。多视角融合策略包括：
- 特征提取：从不同角度提取特征图。对于每个角度K，从x轴和y轴提取特征图，采用累积方法计算特征
- 特征融合，将提取的特征进行融合。使用多个目标TI，其中每个模板包含不同形态的DSConv，这样可以考虑不同形态的特征。
- 随机丢弃策略，为了防止过拟合并提高性能，引入随机丢弃策略rl。在训练阶段，通过伯努利分布随机丢弃一部分特征，以减少冗余噪声。
- 测试阶段的特征融合，在测试阶段，根据训练阶段保留的最佳丢弃策略，引导模型融合关键特征，以实现更好的性能

## 拓扑连续性约束损失

拓扑连续性约束损失TCLoss，
1. TCLoss由交叉熵瞬时LCE和Hausdorff距离的综合构成，可以实现对拓扑和准确性的约束，从而有利于实现连续的管状结构分割
2. Hausdorff距离是为了衡量结果和groundtruth之间的相似性，使用hausdorff距离。Hausdorff距离对离群值敏感，可以有效的表示两组点之间的相似性

```python
class cross_loss(nn.Module):

    def __init__(self):
        super().__init__()

    def forward(self, y_true, y_pred):
        smooth = 1e-6
        return -torch.mean(y_true * torch.log(y_pred + smooth) +
                           (1 - y_true) * torch.log(1 - y_pred + smooth))
```

