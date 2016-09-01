var User=require('../models/user');

exports.showSignin=function(req,res){
    console.log("登录页")
    res.render('signin',{
        title:'登录页面'
    })
}

exports.showSignup=function(req,res){
   res.render('signup',{
        title:'注册页面'
    })
}

// signup注册
exports.signup=function(req,res){
    var _user=req.body.user;

    User.findOne({name:_user.name},function(err,user){
        if(err){
            console.log(err);
        }
        if(user){
            // res.json({results:'该用户已注册'});
            return res.redirect('/signin');
        }else{
            var user=new User(_user);
            user.save(function(err,user){
                if(err){
                    console.log(err);
                }
                res.redirect('/');
            })
        }
        
    })
}

//userList
exports.userList=function(req,res){
    User.fetch(function(err,users){
        if(err) console.log(err);
        res.render('userlist',{
            title:'用户列表',
            users:users
        });
    })
}

//sigin登录
exports.signin=function(req,res){
    var _user=req.body.user;

    User.findOne({name:_user.name},function(err,user){
        if(err){
            console.log(err);
        }

        if(!user){
            console.log("用户不存在");
            return res.redirect('/signup');
        }

        user.comparePassword(_user.password,function(err,isMatch){
            if(err){
                console.log(err);
            }
            if(isMatch){
                console.log("登录成功");
                req.session.user=user;
                res.redirect('/');
            }else{
                console.log("密码错误");
                return res.redirect('/signin');
            }
        })
    })
}

//退出
exports.logout=function(req,res){
    delete req.session.user;
    // delete app.locals.user;

    res.redirect('/');
}

//midware for user
exports.signinRequired=function(req,res,next){
    var _user=req.session.user;

    if(!_user){
        return res.redirect('/signin')
    }

    next();
}

exports.adminRequired=function(req,res,next){
    var _user=req.session.user;

    if(_user.role<=10){
        return res.redirect('/signin')
    }

    next();
}