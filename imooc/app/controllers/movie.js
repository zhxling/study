var Movie=require('../models/movie');
var _ = require('underscore');

// detail page
// get中'/detail/:id'代表浏览器中的路由url地址
// render中的'detail'代表在这个url中你想要渲染的html文件的名字
exports.detail=function(req,res){
  var id = req.params.id;

  Movie.findById(id, function (err, movie) {
      res.render('detail', {title: '电影-详情', movie: movie});
  })
}

// admin page
exports.new=function(req,res){
  res.render('admin', {
    title: '电影-后台录入页', 
    movie: {}
  });
}

// list page
exports.movieList=function(req,res){
  Movie.fetch(function (err, movies) {
    if (err) {
        console.log(err);
    }
    res.render('list', {title:'电影-列表', movies: movies});
  });
}

// 逻辑控制:插入
exports.save=function (req, res) {
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
};

// 逻辑控制:更新
exports.update = function (req, res) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: '后台更新页',
                movie: movie
            })
        })
    }
};

//在列表页删除数据的路由
exports.del = function (req, res) {
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
};