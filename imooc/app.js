var express=require('express');
var path=require('path');
var mongoose=require('mongoose');
var _ = require('underscore');
var port=process.env.PORT || 3000;
var app=express();

//引入模型
var Movie=require('./models/movie');
var User=require('./models/user');

//引入session
app.use(express.session)

// 连接数据库
mongoose.connect('mongodb://localhost:27017/imooc')

// 加入moment模块
app.locals.moment=require('moment');

//json数据格式处理
var bodyParser= require('body-parser');
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
app.use(bodyParser.text({ type: 'text/html' }));
app.use(urlencodedParser=bodyParser.urlencoded({extended:true}));     // 表单数据格式化
app.use(bodyParser.json());     //解析json数据格式      

app.set('views','./views/pages');        //设置根目录
app.set('view engine','jade');   //设置模版引擎                                           
app.use(express.static(path.join(__dirname,'public'))); // 静态资源请求路径
app.listen(port);                //设置监听端口号

console.log('imooc open in port' + port)

var emptyMovie = {
    title: "",
    doctor: "",
    country: "",
    language: "",
    year: "",
    poster: "",
    flash:"",
    summary: ""
};


// index page
app.get('/',function(req,res){
	Movie.fetch(function (err, movies) {
    if (err) {
        console.log(err);
    }
    res.render('index', {title:'电影-首页', movies: movies});
  });
});

// 注册
app.post('/user/signup',function(req,res){
    var _user=req.body.user;

    User.findOne({name:_user.name},function(err,user){
        if(err){
            console.log(err);
        }
        if(user){
            // res.json({results:'该用户已注册'});
            res.redirect('/');
        }else{
            var user=new User(_user);
            user.save(function(err,user){
                if(err){
                    console.log(err);
                }
                res.redirect('/admin/userList');
            })
        }
        
    })
})

//userList
app.get('/admin/userList',function(req,res){
    User.fetch(function(err,users){
        if(err) console.log(err);
        res.render('userlist',{title:'用户列表',users:users});
    })
})

//sigin登录
app.post('/user/signin',function(req,res){
    var _user=req.body.user;

    User.findOne({name:_user.name},function(err,user){
        if(err){
            console.log(err);
        }

        if(!user){
            console.log("用户不存在");
            return res.redirect('/');
        }

        user.comparePassword(_user.password,function(err,isMatch){
            if(err){
                console.log(err);
            }
            if(isMatch){
                console.log("登录成功");
                return res.redirect('/');
            }else{
                console.log("密码错误");
            }
        })
    })
})

// detail page
// get中'/detail/:id'代表浏览器中的路由url地址
// render中的'detail'代表在这个url中你想要渲染的html文件的名字
app.get('/detail/:id',function(req,res){
  var id = req.params.id;

  Movie.findById(id, function (err, movie) {
      res.render('detail', {title: '电影-详情', movie: movie});
  })
})

// admin page
app.get('/admin/movie',function(req,res){
  res.render('admin', {title: '电影-后台录入页', movie: emptyMovie});
})

// list page
app.get('/admin/list',function(req,res){
  Movie.fetch(function (err, movies) {
    if (err) {
        console.log(err);
    }
    res.render('list', {title:'电影-列表', movies: movies});
  });
})

// 逻辑控制:插入
app.post('/admin/movie/new',function (req, res) {
    var movieObj = req.body.movie;
    var id = movieObj._id;
    var _movie;
    if (id != "undefined") {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _.extend(movie, movieObj); //复制movieObj对象中的所有属性覆盖到movie对象上，并且返回 movie对象. 复制是按顺序的, 所以后面的对象属性会把前面的对象属性覆盖掉(如果有重复).
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }

                res.redirect('/detail/' + movie._id);
            });
        });
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }

            res.redirect('/detail/' + movie._id);
        });
    }
});

// 逻辑控制:更新
app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: '后台更新页',
                movie: movie
            })
        })
    }
});

//在列表页删除数据的路由
app.delete('/admin/list/delete', function (req, res) {
    var id = req.query.id;

    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({success: true});
            }
        });
    }
});