var Comment=require('../models/Comment');


exports.save=function(req,res){
  var _comment=req.body.comment;
  var movieId=_comment.movie;

  var _cid=_comment.cid;

  if(_cid){
    Comment.findById(_cid,function(err,comment){
      console.log(comment);
      var reply={
        from:_comment.from,
        to:_comment.tid,
        content:_comment.content
      };

      comment.reply.push(reply);

      comment.save(function(err,comment){
        if(err){
          console.log(err);
        }
        console.log(comment);
        res.redirect('/detail/' + movieId);
      })
    })
  }
  else{
    var _comment=new Comment(_comment);

    _comment.save(function(err,comment){
      if(err){
        console.log(err);
      }
      res.redirect('/detail/' + movieId);
    })
  }
}