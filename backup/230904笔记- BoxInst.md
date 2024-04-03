# BoxInst官方代码
https://github.com/aim-uofa/AdelaiDet

# Q1：安装官方的包时报错THC/THC.h 相关头文件找不到
原因PyTorch新版本移除了相关的实现，解决办法，去其它仓库找以适配好的代码。因为官方改的是detectron2的包，所以别人也有可能用了。

# Q2：detectron2安装不上
1. 官方仓库：https://github.com/facebookresearch/detectron2
2. 特定版本：Please use Detectron2 with commit id [9eb4831](https://github.com/facebookresearch/detectron2/commit/9eb4831f742ae6a13b8edb61d07b619392fb6543) if you have any issues related to Detectron2.

# Q3: 安装detectron2报错，nms_rotated_cuda.cu报了5个错误
注释了if判断
```c++
// #ifdef WITH_CUDA
#include "../box_iou_rotated/box_iou_rotated_utils.h"
// #endif
// TODO avoid this when pytorch supports "same directory" hipification
// #ifdef WITH_HIP
#include "box_iou_rotated/box_iou_rotated_utils.h"
// #endif
``` 
