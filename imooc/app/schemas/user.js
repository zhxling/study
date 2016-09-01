var mongoose=require('mongoose');
var bocrypt=require('bcryptjs');
var SALT_WORK_FACTOR = 10

// 定义模式
var UserSchema=new mongoose.Schema({
  name:{
    unique:true,
    type:String
  },
  password:String,
  role:{
    type:Number,
    default:0
  },
  meta: {
      createAt: {
          type: Date,
          default: Date.now()
      },
      updateAt: {
          type: Date,
          default: Date.now()
      }
  }
});

//为模式添加方法，在保存数据之前判断数据是新添加的还是更新数据来修meta里的数据
UserSchema.pre('save', function (next) {
    var user=this;

    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    
    bocrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
      if(err) return next(err);
      bocrypt.hash(user.password,salt,function(err,hash){
        if(err) return next(err)

        user.password=hash;
        next();
      })
    })
});

//为模式添加静态方法，这些方法在模型中即可调用
UserSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb);
    }
};

//为模式添加方法，这些方法需要在实例中方可调用
UserSchema.methods={
  comparePassword:function(_password,cb){
    bocrypt.compare(_password,this.password,function(err,isMatch){
      if(err){
        return cb(err);
      }

      cb(null,isMatch);
    })
  }
}

// 导出模式
module.exports = UserSchema;