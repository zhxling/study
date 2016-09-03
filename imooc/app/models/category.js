var  mongoose=require('mongoose');
var CategorySchema=require('../models/category');

var Category=mongoose.model('Category',CategorySchema);

module.exports=Category;