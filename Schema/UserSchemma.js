const mongooes = require("mongoose");

const userModel = new mongooes.Schema({
  username: {
    type: String,
    Unique: true,
    trim: true,
    required:true,
  },
  email:{
    type: String,
    Unique: true,
    trim: true,
    required:true,
  },
  hashedPassword:{
    type: String,
    required:true,
  },
  IsAvaterSet:{
    type:Boolean,
    default:false,
  },
  avaterImg:{
    type:String,
    default:""
  },
  token:{
    type:String,
    default:""
  }
});

module.exports = mongooes.model("User", userModel);
