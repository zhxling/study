var mongoose=require('mongoose');

var Schema=mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;

// 定义模式
var CategorySchema=new Schema({
    name:String,
    movies:
    movies:[{
        type:ObjectId,
        ref:'Movie'
    }],
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
CategorySchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

CategorySchema.statics = {
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

// 导出模式
module.exports = CategorySchema;