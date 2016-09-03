var Category=require('../models/category');

//跳转到增加分类页
exports.new=function(req,res){
  res.render('category_admin',{
    title:'后台分类录入页',
    category:{}
  });
}

//跳转到分类列表页
exports.list=function(req,res){
  Category.find({},function(err,categories){
    if(err){
      console.log(err)
    }

    res.render('categoryList',{
      title:'后台分类列表页',
      categories:categories
    })
  })
}

//保存分类到后台
exports.save=function(req,res){
  var _category=req.body.category;

  if(_category){
    var category=new Category(_category);
    category.save(function(err,category){
      if(err){
        console.log(err);
      }

      res.redirect('/admin/category/list');
    })
  }
}