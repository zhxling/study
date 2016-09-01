//引入模型
var Index=require('../app/controllers/index');
var Movie=require('../app/controllers/movie');
var User=require('../app/controllers/user');

module.exports=function(app){
  //pre handle user
  app.use(function(req,res,next){
    var _user=req.session.user;     
    app.locals.user=_user;
    next();
  })
  // index page
  app.get('/',Index.index);

  //user
  app.post('/user/signin',User.signin);
  app.post('/user/signup',User.signup);
  app.get('/signin',User.showSignin);
  app.get('/signup',User.showSignup);
  app.get('/admin/userList',User.signinRequired,User.adminRequired,User.userList);
  app.get('/logout',User.logout);

  // movie
  app.get('/detail/:id',Movie.detail);
  app.get('/admin/movie',User.signinRequired,User.adminRequired,Movie.new);
  app.get('/admin/list', User.signinRequired , User.adminRequired , Movie.movieList);
  app.post('/admin/movie/new', User.signinRequired ,  User.adminRequired , Movie.save);
  app.get('/admin/update/:id', User.signinRequired , User.adminRequired , Movie.update);
  app.delete('/admin/list/delete', User.signinRequired , User.adminRequired , Movie.del);
}