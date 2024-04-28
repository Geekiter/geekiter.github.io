# 强制拔下挂载到VMBox上的U盘，导致下次无法挂载上，提示busy

具体的报错信息如下：
```
USB device Ralink 802.11 n Wlan with UUID {xxxx} is busy with a previous request. Please try again later.
Result Code:
E_INVALIDARG (0x80070057)
Component:
HostUSBDevice
Interface:
IHostUSBDevice {xxxx}
Callee:
IConsole {xxxx}
```

解决办法：

一定要按照步骤做，驱动一定要重新安装。切记

- first of all, edit your registry

- Open the Windows registry, by clicking on Start > Run and typing regedit
- Navigate to the following location HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Class\{36FC9E60-C465-11CF-8056-444553540000}
- In the right hand panel, if the the UpperFilters entry exists, then delete it
![image](https://github.com/Geekiter/geekiter.github.io/assets/20443506/313a1e53-8657-4f3a-a25b-008d1de9a8a4)

2. Install virtualbox USB driver manually.

- Goto folder C:\Program Files\Oracle\VirtualBox\drivers\USB\filter
- Click right mouse button on file named VboxUSBMon.inf
- Check Install(I) (maybe.. My window is korean so it dose not exact. )

3. Rebooting

4. Unplug your USB memory (or joystick..)

5. Open VirtualBox and Close it rightly.
( it will remove your USB device from VM's seized list. )

6. Plug your USB memory.

7. Open VirtualBox and Run Virtual Machine.

8. Click right mouse button on USB icon placed in status bar which is below VM window.

9. Check USB device what you want to plug in.

# Ubuntu安装完成，terminal无法启动，日期乱码

编码问题。

首先执行CTRL+ALT+F3进入[命令行界面]

/etc/default/locale 原来内容为:

代码如下:
```
LANG=”zh_CN.UTF-8″
LANGUAGE=”zh_CN:zh”
LC_NUMERIC=”zh_CN”
LC_TIME=”zh_CN”
LC_MONETARY=”zh_CN”
LC_PAPER=”zh_CN”
LC_NAME=”zh_CN”
LC_ADDRESS=”zh_CN”
LC_TELEPHONE=”zh_CN”
LC_MEASUREMENT=”zh_CN”
LC_IDENTIFICATION=”zh_CN”
```
改为:
```
代码如下:
LANG=”zh_CN.UTF-8″
LANGUAGE=”zh_CN:zh”
```
重新登录后生效,执行ll和date可见,不再出现乱码,执行locale可见当前的语言环境.

如果你要使用英文环境,在~/.bashrc末尾加入以下内容,重新登录即可切换语言:

代码如下:
```
LANG=”en_US.UTF-8″
LANGUAGE=”en_US:en”
```
