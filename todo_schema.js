const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

let todo_lists = new Schema({
    description: {
        type: String
    },
    date: {
        type: Date
    },
    done: {
        type: Boolean
    }
});
let TodoModel = mongoose.model('Todo_list', todo_lists);
exports.insert = async (params) => {
    console.log(params.date);
    var entry = new TodoModel({
        description: params.description,
        date: new Date(params.date),
        done: params.done
    });
    return await entry.save().then((e) => {
        console.log(e);
        return true;
    }).catch((e) => {
        console.error(e);
        return false;
    });
}
exports.retrieve = async (is_done) => {
    return await TodoModel.find(
        {done: is_done}, 'description date done _id'
    ).lean().exec().then((res) => {
        return {
            ...res,
            success: true
        };
    }).catch((e) => {
        console.error(e);
        return null;
    });
}
exports.delete = async (params) => {
    return await TodoModel.deleteOne({
        _id: params.id
    }).catch((e) => {
        console.error(e);
        return null;
    });
};
exports.done = async (params) => {
    return await TodoModel.updateOne({
        _id: params.id
    }, {
        done: true
    }).then(() => {
        return true;
    }).catch((e) =>{
        console.error(e);
        return false;
    });
}
