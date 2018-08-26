# photoUpload
启动项目时，先配置mongodb地址。
访问地址：127.0.0.1:4000 便可以直接进入已上传图片列表。
访问地址：127.0.0.1:4000/upload 进入上传图片界面

图片列表中直接点击图片，便可以下载图片。

如需协助请发邮件：1187352588@qq.com至作者 Jay Lin

查阅资料：http://www.expressjs.com.cn/4x/api.html；
        《nodejs实战》

安装步骤：
1.下载后，在Terminal中进入项目根目录，输入npm install，安装依赖包
2.所有依赖包安装完成后，输入：npm start（因为在package.json中配置了script{"start":"node ./bin/www"}，执行npm start,npm便会读取配置中配置的start命令而执行"node ./bin/wwww"，这样便启动了项目）  启动项目；