Q1: 如何在webstorm中调试next.js，包括前后端代码

- 后端debug

1. debug模式启动dev服务器

- 前端debug

1. 配置JavaScript Debug，输入前端url地址

Q2：postgresql docker 的管理员账号

账号一般是：postgresql
密码在配置docker的POSTGRES_PASSWORD中

Q3：windows抓包软件

Reqable

Q4: next-auth本地配置github，登陆之后404

本地地址github无法回调，只能部署

Q5：next.js如何获取request ip

从request.headers['x-forwarded-for']中获取

Q6: ip获取到的是::1

是ipv6的本地地址

Q7：prisma中用enum定义字段， 创建的如何写？

举例，如果定义了一个enum类型的字段，如下：
```js
enum System{
    WINDOWS
    LINUX
    MAC
}
```

那么在创建的时候，需要写成：
```js
await prisma.system.create({
    data:{
        name: 'WINDOWS' as System
    }
})
```

Q8: nextauth有那些callback？

session、jwt、redirect、signIn

session没登陆成功前会调用，然后登陆成功之后手动调用才会触发

jwt只有在使用json web token的时候才会调用

redirect是在调整地址的时候调用，一般没什么用

signIn是在登陆成功前调用

Q9: next.js的server component如何用点击事件？

点击封装成一个组件，如何导入。

举例，点击事件封装在`<Click>`组件中，动态导入的方法：
```typescript
const Click = dynamic(() => import('../components/Click'), {
    ssr: false
})
```
Q10: user-agent解析库推荐？

ua-parser-js

Q11: client component如何进行数据库操作？

client component不能直接操作数据库，需要通过api来操作。将数据库操作封装成api，然后在client component中调用api。

Q12: 如何通过ip获取地理位置？

用geoip相关的库，如geoip-lite，fast-geoip

Q13：如果一个包只提供了require方法，没用export导出，如何在typescript中使用？

require和import的方法的区别是：require的根据规范是commonjs，import的根据规范是es6

如果一个包只提供了require方法，没用export导出，那么在typescript中使用的时候，需要用require导入，然后用as转换成类型，如下：
```typescript
import * as geoip from 'geoip-lite'

const geoip = require('geoip-lite') as typeof import('geoip-lite')
```

Q13：fork的仓库如何对原仓库提pull request？

1. fork原仓库
2. clone自己的仓库
3. 在自己的仓库中创建一个分支
4. 在分支中修改代码
5. 将remote的仓库地址改成原仓库地址
6. push到原仓库的提供pr的分支

