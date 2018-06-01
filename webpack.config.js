const path = require('path')
// 引入ugligyjs-webpack-glugin插件，自动集成，不用安装，用于压缩js
const uglify = require('uglifyjs-webpack-plugin')
// 打包html文件到生产路径，引入插件 安装 $ sudo npm install --save-dev html-webpack-plugin
const htmlPlugin = require('html-webpack-plugin')
// css分离 引入插件 安装 sudo npm install --save-dev extract-text-webpack-plugin
const extractTextPlugin = require("extract-text-webpack-plugin")
var website = {
    publicPath: "http: //localhost:1717"
}
module.exports = {
    // 入口
    entry: {
        entry: './src/entry.js',
        entry2: './src/enrty2.js'
    }, 
     // 出口
    output: {
        path: path.resolve(__dirname, 'dist'), // 出口文件绝对路径
        // filename: 'bundle.js' // 出口文件打包
        // 多入口打包
        filename: '[name].js'
    },
    // 所有模块配置
    module: {
        // 配置cssloader
        rules: [
            {
                test: /\.css$/, // 用于匹配处理文件的拓展名的表达式，必须
                // use: ['style-loader', 'css-loader'], // loader名称，必须
                // inclue/exclude ：手动添加必须处理的文件(可选)
                // query: 为loaders提供额外的设置选项(可以选)
                // 分离css 需要修改loader为：
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            // 安装配置图片打包的loader
            // npm install --save-dev file-loader url-loader
            {
                test: /\.(png|jpg|gif)/,  // 匹配图片后缀
                use: [{
                    loader: 'url-loader', // 使用指定的loader
                    options: {
                        limit: 500, // limit参数：把小于500B的文件打包成base64的格式，写入js
                        outputPath: '/images' // 打包图片到images路径
                    }
                }]
            },
            // 解决html 文件中引入img标签的
            {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']
            },
            // 配置less-loader
            {
                test: /\.less$/,
                use: extractTextPlugin.extract({
                    use: [
                        // {
                        //     loader: "style-loader" // 分离less不这样写
                        // }, 
                        {
                            loader: "css-loader"
                        }, {
                            loader: "less-loader"
                        }],
                        fallback: "style-loader"
                })
                
            },
            // scss 配置
            {
                test: /\.scss$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader",
                    },{
                        loader: "sass-loader"
                    }],
                    fallback: "style-loader"
                })
            }
        ]
    }, 
    // 插件
    plugins: [
        new uglify(),
        // 配置html打包
        new htmlPlugin({
            minify: { // 对html文件压缩
                removeAttributeQuotes: true //去掉属性的双引号
            },
            hash: true, // 为了避免缓存js
            template: './src/index.html' // 要打包的html模板路径和文件名称
        }),
        // 配置插件熟悉
        new extractTextPlugin('css/index.css') // 这里的/css是分离后的路径 需要修改css-loader 和 style-loader
    ],
    // 开发服务 
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'), // 设置基本目录结构
        host: 'localhost', // 服务器发访问地址
        compress: true, // 服务器端压缩是否开启
        port: 1717 // 端口号
    } 
}