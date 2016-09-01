var express=require('express');
var path=require('path');
var mongoose=require('mongoose');
var port=process.env.PORT || 3000;
var app=express();
var dburl='mongodb://localhost:27017/imooc';

//引入session
var session=require('express-session');
var MongoStore=require('connect-mongo')(session);
app.use(session({
  secret: 'Alin',
  resave:true,
  saveUninitialized: true,
  store:new MongoStore({
    url:dburl,
    collection:'session'
  })
}))

// 连接数据库
mongoose.connect(dburl);

//配置开发环境
var logger=require('morgan');
if ('development' === app.get('env')) {
  app.set('showStackError', true)
  app.use(logger(':method :url :status'))
  app.locals.pretty = true
  mongoose.set('debug', true)
}

// 加入moment模块
app.locals.moment=require('moment');

//json数据格式处理
var bodyParser= require('body-parser');
app.use(urlencodedParser=bodyParser.urlencoded({extended:true}));     // 表单数据格式化
app.use(bodyParser.json());     //解析json数据格式

app.set('views','./app/views/pages');        //设置根目录
app.set('view engine','jade');   //设置模版引擎 
app.use(express.static(path.join(__dirname,'public'))); // 静态资源请求路径
app.listen(port);                //设置监听端口号

//引入routes文件
require('./config/routes')(app);

console.log('imooc open on port' + port)