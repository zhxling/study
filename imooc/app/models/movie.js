var mongoose=require('mongoose');
var MovieSchema=require('../schemas/movie');

// 将模式编译为模型,生成构造函数
var Movie=mongoose.model('Movie',MovieSchema);

//将构造函数导出
module.exports=Movie;
