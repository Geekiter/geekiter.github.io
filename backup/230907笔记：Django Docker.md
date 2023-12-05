记录一下吧，遇到了一个很奇怪的问题。我的 Django 程序突然无法正常运行了，所以我决定修复一下。

我的情况是这样的：
Django 运行在 Docker 容器中，而 Nginx 运行在主机系统上。

Q1：访问 Django 的接口时，返回 502 错误。

Nginx 的错误日志显示如下：

```
recv() failed (104: Unknown error) while reading response header from up
```

Docker 容器中的 Django 没有运行起来，可能的原因是我在构建镜像时禁用了自动启动的选项。我担心自动启动可能会导致容器无法进入。

Q2：错误提示信息为 "none is not an allowed value"。

在代码中添加了一个选项，并标注为可选的。

```py
from typing import Optional

Optional[str]
```
