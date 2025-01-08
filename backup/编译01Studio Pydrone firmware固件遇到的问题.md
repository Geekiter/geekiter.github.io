
# 正确流程

## 克隆 esp-idf
拉取代码：

```bash
git clone -b v4.4 --recursive https://github.com/espressif/esp-idf.git
```

> 注意：pydrone 使用的是 esp32s3 芯片，因此需要切换到 4.4 版本。

### 初始化环境

```bash
cd esp-idf
./install.sh       # (Windows 用户请使用 install.bat)
source export.sh   # (Windows 用户请使用 export.bat)
```

## 克隆 MicroPython
在 esp-idf 目录下进行克隆：

```bash
git clone https://github.com/01studio-lab/micropython
```

## 编译固件

### 预编译

```bash
cd micropython
make -C mpy-cross
```

### 去除子模块

```bash
cd ports/esp32
```

删除第 65-66 行：

```bash
submodules:
	git submodule update --init $(addprefix ../../,$(GIT_SUBMODULES))
```

### 手动拉取子模块

将子模块拉取到 esp-idf/lib：

```bash
git clone https://github.com/pfalcon/berkeley-db-1.xx -b embedded
```

### 添加 esp-dl 依赖

在 esp-idf/components 下进行克隆：

```bash
git clone https://github.com/espressif/esp-dl.git -b idfv4.4
```

### 正式编译

```bash
cd ports/esp32
make submodules
make
```

# 遇到的问题

## esp-dl 缺失

报错信息：

```bash
cmake Failed to resolve component 'esp-dl'
```

解决方法：手动下载 esp-dl 到 esp-idf/components 目录，确保使用的是 idfv4.4 版本，并且包含 CMakeLists.txt 文件，以便正确识别模块。

## cmake 未安装

报错信息：

```bash
ESP-IDF v4.4 'cmake' must be available on the PATH to use idf.py
```

解决方法：安装 cmake。

```bash
sudo apt update && sudo apt install cmake
```

## 子模块下载失败

报错信息：

```bash
fatal: remote error: upload-pack: not our ref xxxxxx
```

解决方法：手动下载子模块。此错误需进一步研究。

## pip 未安装

报错信息：

```bash
Installing virtualenv /usr/bin/python3: No module named pip
```

解决方法：安装 pip。

```bash
sudo apt-get remove python3-pip
sudo apt-get install python3-pip
```

注意：建议分开安装 python-pip 和 python3-pip，以避免错误。

## 默认 python 命令为 python3

可以通过 alias 重命名：

```bash
alias python=python3
```

## 安装 Python 3.8

```bash
sudo apt update
sudo apt install software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt install python3.8
python3.8 --version
```

## WSL 使用 Clash

在 Windows 的 `C:\Users\<你的用户名>` 目录下创建 `.wslconfig` 文件，配置网络模式为 `mirrored`：

```ini
[experimental]
autoMemoryReclaim=gradual  
networkingMode=mirrored
dnsTunneling=true
firewall=true
autoProxy=true
```

### 配置说明

- **autoMemoryReclaim=gradual**：WSL2 将逐渐回收不再使用的内存，以提高内存使用效率。
- **networkingMode=mirrored**：WSL2 将镜像主机的网络配置，确保网络应用能够正常访问网络资源。
- **dnsTunneling=true**：启用 DNS 隧道技术以提高网络兼容性。
- **firewall=true**：启用防火墙以保护虚拟机免受未授权访问。
- **autoProxy=true**：根据 Windows 的代理设置自动配置 WSL2 中的代理。

确保 Clash 允许 LAN 访问，并在设置中允许应用通过防火墙。

## VMware 使用 Clash

确保 Clash 允许 LAN 访问，并在 VMware 网络设置中配置代理。

在虚拟机中添加以下脚本：

```bash
vim ~/.bashrc
```

脚本内容：

```bash
export https_proxy=http://10.0.0.103:7890
export http_proxy=http://10.0.0.103:7890
export all_proxy=socks5://10.0.0.103:7890
```

使其生效：

```bash
source ~/.bashrc
```

参考文献：[Clash 让虚拟机系统 (Linux) 共享主机的代理](https://www.skfwe.cn/p/clash%E8%AE%A9%E8%99%9A%E6%8B%9F%E6%9C%BA%E7%B3%BB%E7%BB%9Flinux-%E5%85%B1%E4%BA%AB%E4%B8%BB%E6%9C%BA%E7%9A%84%E4%BB%A3%E7%90%86/)

## SSH 连接 VMware 的 Ubuntu

1. 在虚拟机中安装 SSH。
2. 在 VMware 中编辑 NAT 转发端口，将虚拟机的端口映射到宿主机。
3. 从宿主机连接虚拟机的 SSH。

> 一般使用普通用户，root 用户可以尝试密钥登录。

参考文献：[宿主机 SSH 登录到 Linux 虚拟机 - Jeffxue - 博客园](https://www.cnblogs.com/Jeffxu/p/18110799)

## 在 Windows 上使用 Linux 命令

大多数命令在 PowerShell 中是支持的，请确保不是使用原始的 cmd。

一些软件资源：

- [cat-for-windows](https://github.com/TwiN/cat-for-windows)
- [sed-windows](https://github.com/mbuilov/sed-windows)
