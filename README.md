# webpack
webpack 学习笔记

> 安装
```
// 全局
npm install -g webpack
// 初始化 
npm init
// 项目目录安装
npm install --save-dev webpack

```
> webpack.config.js
```
module.exports={
    //入口文件的配置项
    entry:{}, // 可配置多个文件路径
    //出口文件的配置项
    output:{
        path: path.resolve(__dirname, 'dist') //path: 文件路径 ，需要引入const path = require('path');
        filename: '' // 出口文件名 ，若多个文件 使用filename: '[name].js'
    },
    //模块：例如解读CSS,图片如何转换，压缩
    module:{},
    //插件，用于生产模版和各项功能
    plugins:[],
    //配置webpack开发服务功能
    devServer:{
        //设置基本目录结构
        contentBase:path.resolve(__dirname,'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host:'localhost',
        //服务端压缩是否开启
        compress:true,
        //配置服务端口号
        port:8080
    }
}
```
> webpack-dev-server 支持热更新
```
npm install webpack-dev-server --save-dev

需要在packge.json中的script配置选项
"server": "webpack-dev-server"
```

> css 文件打包 (less, sass加载不同的loader就可以了) 都需要在js中引入
```
// loader安装
npm install style-loader --save-dev
npm install --save-dev css-loader

// less
npm install --save-dev less
npm install --save-dev less-loader

// sass
npm install --save-dev node-sass
npm install --save-dev sass-loader

// 在module:rules中添加一行配置
 module:{
        rules: [
            {
              test: /\.css$/,
              use: [ 'style-loader', 'css-loader' ]
            }
          ]
    }

// 需要分离开的，使用插件：
npm install --save-dev extract-text-webpack-plugin

// 引入：
const extractTextPlugin = require("extract-text-webpack-plugin")

在plugin中：
 new extractTextPlugin("/css/index.css") // 打包的路径名

 // 修改style-loader:
  use: extractTextPlugin.extract({
     fallback: "style-loader",
     use: [{
         // loader 名称
     }]
   })


```

> js 打包
webpack.config.js中直接引入插件
```
const uglify = require('uglifyjs-webpack-plugin')

在plugins中new uglify()
```

> 打包html文件

```
// 引入：

const htmlPlugin= require('html-webpack-plugin')

// 安装
npm install --save-dev html-webpack-plugin

// 配置：
new htmlPlugin({
    minify:{
        removeAttributeQuotes:true // 去掉属性的双引号
    },
    hash:true,  //避免缓存JS
    template:'./src/index.html' //要打包的html模版路径和文件名称
   
})
```


> 图片打包
```
npm install --save-dev file-loader url-loader

// 配置
{
   test:/\.(png|jpg|gif)/ ,
   use:[{
       loader:'url-loader',
       options:{
           limit:500000, // 将小于这么多的打包为base64格式写入
           outputPath: 'images/' // 打包图片路径
       }
   }]
}

// 处理图片路径问题
webpack.config.js中声明website对象

var website ={
    publicPath:"http://IP:端口/"
}

// 在output中使用
publicPath: website.publicPath


// 使用插件更好在html引入img标签
npm install html-withimg-loader --save

// 配置：
{
    test: /\.(htm|html)$/i,
     use:[ 'html-withimg-loader'] 
}

```

> 处理css前缀问题
```
// 安装模块
npm install --save-dev postcss-loader autoprefixer
```
在根目录，与webpack.config.js同级创建postcss.config.js文件

```
module.exports = {
    plugins: [
        require('autoprefixer') // 引入次插件可以添加前缀的能力
    ]
}
```
需要在webpack.config.js的css中配置：
```
loader: {
    'postcss-loader'
}
```
结果： 已经需要前缀的css已经自动添加了 
``` 
 -webkit-transform: rotate(45deg);
 transform: rotate(45deg);
```

> 消除未使用的css  PurifyCss
安装插件
```
npm i -D purifycss-webpack purify-css // -D = --save-dev
```
在config中引入glob, purifycss-webpack
```
const glob = require('glob')
const PurifyCSSPlugin = require("purifycss-webpack");

```
配置插件 - plugins
```
// 注意：使用这个插件必须配合extract-text-webpack-plugin这个插件


new PurifyCSSPlugin({
  // Give paths to parse for rules  These should be absolute!
  paths: glob.sync(path.join(__dirname  'src/*.html')),
  
})
```
>babel & ENV
安装
```
cnpm install --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react

```

ENV:
```
npm install --save-dev babel-preset-env
```

配置：
```
{
    test:/\.(jsx|js)$/,
    use:{
        loader:'babel-loader',
        // 外部新建.babelrc后 将preset配置写入，就可以不使用这串代码
        // options:{
        //      presets:[
        //          "es2015","react" // env将es换为env
        //      ]
        // }
    },
    exclude:/node_modules/
}
```
可以修改entry.js中的代码
使用es6的语法，创建变量等操作



