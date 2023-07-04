const MessageModel = require("../Schema/MessageSchema")
const addmsg = async(req,res,next)=>{
const {from,to,message} = req.body;
const addedmessage = await MessageModel.create({
    message:{
        text:message
    },
    users:[from,to],
    sender:from
})
if(addedmessage) return res.status(201).json({msg:"messages added sucessfuly"});
        return res.json({msg:"messages not added "})

}
const getAll = async(req,res,next)=>{
    const {from,to} = req.body;
    const listoffmsg = await MessageModel.find({
        users:{
            $all:[from,to]
        }
    }).sort({updatedAt:1});
    //console.log(listoffmsg)
    const proccessedmsg = listoffmsg.map((msg)=>{
        return{
            me:msg.sender.toString()=== from,
            message:msg.message.text
        }
    })
    //console.log(proccessedmsg)
    return res.status(200).json(proccessedmsg);
}




module.exports = { addmsg,getAll};