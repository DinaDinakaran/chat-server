const User = require("../Schema/UserSchemma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
require("dotenv").config()
const mail = process.env.EMAIL_OWNER;
const key = process.env.EMAIL_SECRET_KEY
const Register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    let validUsername = await User.findOne({ username });
    if (validUsername)
      return res.json({ msg: "Username is exist !", status: false });
    let validEmail = await User.findOne({ email });
    if (validEmail) return res.json({ msg: "Email is exist !", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await User.create({
      username,
      email,
      hashedPassword,
    });

    user.hashedPassword = "";
    //console.log(user);
    return res.status(201).json({ status: true, user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const Login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username });

    if (!user) return res.json({ msg: "Username not Exist !", status: false });
    let validUser = await bcrypt.compare(password, user.hashedPassword);
    if (!validUser)
      return res.json({
        msg: "Incorrect Username And Password !",
        status: false,
      });
    user.hashedPassword = "";
    return res.status(200).json({ user, status: true });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const setAvatar = async(req,res,next)=>{
   try {
    let _id = req.params.id;
    let avaterImg = req.body.image;
    let userdata = await User.findByIdAndUpdate(_id,{
       IsAvaterSet:true,
       avaterImg
    },{
      new: true
    })
    //console.log(userdata)
    if(!userdata.IsAvaterSet){
       return res.json({msg:"Profile Picture Is Not Updated. Please try again.",status:false});
    }
    return res.status(201).json({image:userdata.avaterImg,isSet:userdata.IsAvaterSet,msg:"Profile Updated Successfully !",status:true})
   } catch (error) {
    //console.log(error);
    next(error)
   }
     
     
}





let forgetmailer = async(name,email,token)=>{
  try {
     let transport = nodemailer.createTransport({
         host:'smtp.gmail.com',
         port:587,
         secure:false,
         requireTLS:true,
         auth:{
             user:mail,
             pass:key
         }
     })
 
     let message={
         from:process.env.EMAIL_OWNER,
         to:email,
         subject:"Reset Password",
         text:"please click the link for reset your password",
         html:
         `<p> Hi ${name} !
            please click  <a href ="http://localhost:3000/reset-password/${token}"  target="_blank"   >here</a> to rest your password
         `
     }
 
     transport.sendMail(message).then((data)=>{
       //  console.log(data)
        console.log("mail sended")
     }).catch((err)=>{
         console.log(err);
         console.log("somthing went worng")
     })
  } catch (error) {
     console.log(error)
  }
  }

const exportAll = async(req,res,next)=>{
      try {
        let id = req.params.id;
        let list = await User.find({_id:{$ne:id}},{
          new:true
        }).select([
          "username","email","avaterImg","_id"
        ])
       // console.log(list)
        return res.status(200).json({list,status:true})
      } catch (error) {
        console.log(error);
        next(error)
      }
}
 const forgetpassword = async(req,res)=>{
  let payload = req.body;
 // console.log(payload)
  try {
      let validUser = await User.findOne({email:payload.email})
     // console.log('validuser',validUser)
      if(validUser){
          let randomstring_key = randomstring.generate();
          let token_key = jwt.sign({username:validUser.username,_id:validUser._id},randomstring_key,{expiresIn:"10m"})
          ///console.log(token_key)
          validUser.token=token_key
          await User.findOneAndUpdate({email:validUser.email},{$set:validUser}).then((data)=>{
         // console.log(data)
         }).catch((err)=>{
          console.log(err)
         })
            forgetmailer(validUser.username,validUser.email,token_key).then((data)=>{
              res.status(200).json({msg:"Email sent successfuly check your email",status:true})
            }).catch((err)=>{
              res.json({msg:"somthing went worng",status:false})
            })
      }else{
          res.json({msg:"Player is not Exist",status:false})
      }
  } catch (error) {
   console.log(error)   
   res.json({msg:"Somthing Went Worng ! please try agin",status:false})
  }
}
const resetpassword = async(req,res)=>{
  let payload = req.body;
  try {
      let user = await User.findOne({token:payload.token})
      if(user){
          let hashedPassword = await bcrypt.hash(payload.password,10);
          User.findOneAndUpdate({_id:user._id},{$set:{hashedPassword,token:''}}).then((data)=>{
              res.status(201).json({status:true,msg:"Password Updated Successfuly !"})
          }).catch((err)=>{
              console.log(err)
              res.json({msg:"Somthing Went Worng ! Please Try again",status:false});
          })
      }else{
        res.json({msg:"unauthorised ! Please click the link on your email",status:false})
      }
  } catch (error) {
      res.json({msg:"Somthing Went Worng ! please try agin",status:false})
  }
}


module.exports = { Register, Login ,setAvatar,exportAll,forgetpassword,resetpassword};
