
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
   let link = process.env.DB_LINK
 const   connection = ()=>{
     mongoose.connect(link,{
         useNewUrlParser: "true",
        useUnifiedTopology: "true"
     }).then(()=>{
        console.log("DB connect successfully")
     }).catch((err)=>{
        console.log(err);
     })
}
module.exports = connection