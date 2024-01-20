const messageModel = require("../model/messageModel");

module.exports.addMsg = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = await messageModel.create({
            message:{text:message},
            users:{from, to},
            sender: from,
        })
        if(data){
             return res.json({msg:"Message added succesfully"});
            }
        else{return res.json({msg:"Failed to add message"})}
    }
    catch (err) {
        next(err);
    }
}
module.exports.getAllMsg = async (req, res, next) => {
   try{
     const {from, to} = req.body;
     const messeges = await messageModel.find({
        $or: [
            {
                users: { $elemMatch: { from: from, to: to } },
            },
            {
                users: { $elemMatch: { from: to, to: from } },
            },
        ],
    }).sort({updatedAt: 1})
     const projectMessages = messeges.map((msg)=>{
        return {
            fromSelf: msg.sender.toString() === from,
            message: msg.message.text
        }
     })
     res.json(projectMessages);
   }
   catch(err){
    next(err)
   }
}