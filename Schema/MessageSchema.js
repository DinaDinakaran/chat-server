const mongooes = require("mongoose");

const MessageModel = new mongooes.Schema({
    message:{
        text:{
            type:String,
            required:true,

        }
    },
    users:Array,
    sender:{
        type:mongooes.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

},{
    timestamps:true
}
);

module.exports = mongooes.model("Message", MessageModel);
