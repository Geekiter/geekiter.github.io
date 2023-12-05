最近需要部署一个wordpress到服务器上，因为我觉得php安装不像python那样熟悉和方便，另外我感觉好像会自动占用80端口，就不是很想在原生系统上安装php，准备用一个docker跑wordpress。

Q1：wordpress数据库丢失，需要重新安装

删除wp-config.php文件

Q2：Docker 部署wordpress

1. 拉取镜像： `docker pull wordpress`
2. 创建容器：`docker run -d -it -p 8083:80 wordpress`
3. 创建mysql数据库
4. 安装

Q3：wordpress使用postgresql数据库

放弃，需要用到一个psql的插件，但是这个插件又比较旧了，和新版本的wp适配总是有问题。用docker跑了一个mysql，数据文件映射到原生系统上了。

Q4：wordpress连接不到docker的mysql

不能用127.0.0.1，要用docker给mysql分配的ip地址
```shell
 docker inspect mysql | grep -i ipaddr
``` 
可能会显示如下的信息：
```shell
            "SecondaryIPAddresses": null,
            "IPAddress": "172.17.0.4",
                    "IPAddress": "172.17.0.4",
```
Q5：上传的文件大小超过php.ini文件中定义的upload_max_filesize值

docker中没找到相关的配置文件，理论上改php.ini，或者反向代理的配置。遂放弃。用cp命令，从原生系统复制到docker里了。

将主机/www/bb目录拷贝到容器 abcd123的/www目录下。
`docker cp /www/bb abcd123:/www/`

Q6：wordpress主页跳转到127.0.0.1，其他页面都是正常访问

应该在设置里面填入当前的主页网址。配置好记得清理缓存，不然总是跳到localhost，配置不生效。

Q7：静态文件网络请求出错，显示no data found，报错block:mixed-content

nginx配置有问题，http请求没有自动升级为https请求。
我当时加了这一行：
```conf
add_header Content-Security-Policy "upgrade-insecure-requests";
```
完整的nginx配置
```conf
server {
   server_name 你的域名.com;
   location / {
       proxy_pass http://反向代理的ip;
       proxy_set_header Host $host;   
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       add_header Content-Security-Policy "upgrade-insecure-requests";
}
```

Q8：Uncaught TypeError: strlen(): Argument #1 ($str) must be of type string, array given in

估计是早期的php版本中数组和字符串都可以自动转换可能。
我这里的变量类型的是array，所以我把strlen换成count。
注意我这里是用的option framework，应该用了这个框架的都有可能碰到这种问题。

总结：docker跑php虽然有些坑，但是不污染原生系统，对于这种不再流行的语言来说，我觉得还是觉得挺方便省心的。