const User = require("../model/userModel.js");
const bcrypt = require("bcrypt");

module.exports.register = async(req,res,next)=>{
   try{
    const {username, email, password} = req.body
   const usernameCheck = await User.findOne({ username })
   if(usernameCheck){
    return res.json({msg:"Username is already used",status: false});
   }
   const emailCheck = await User.findOne({email});
   if(emailCheck){
    return res.json({msg: "Email already used", status: false});
   }
   const hashedPassword = await bcrypt.hash(password,10);
   const user = await User.create({
    username,
    email,
    password: hashedPassword,
   })
   delete user.password;
   return res.json({status: true, user});
   }catch(err){
    next(err);
   }
};
module.exports.login = async(req,res,next)=>{
   try{
    const {username, email, password} = req.body
   const user = await User.findOne({email});
   if(!user){
    return res.json({msg: "Email or password are incorrect", status: false});
   }
   const hashedPassword = user.password;
   const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
   if(isPasswordCorrect){
      delete user.password;
      return res.json({status: true, user});
   }else{
      return res.json({msg: "Email or password are incorrect", status: false});
   }
   }catch(err){
    next(err);
   }
};

module.exports.setAvatar = async(req,res,next)=>{
     try{
        const userId = req.params.id;
        const avatarImage1 = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
         isAvatarImageSet: true,
         avatarImage: avatarImage1
       });
         if(userData){
            return res.json({
               isSet: true,
               image:userData.avatarImage1
            })
         }else{
            return res.json({
               isSet: false
            })
         }
     }catch(err){
         next(err)
     }
}

module.exports.getAllUsers = async(req,res,next)=>{
   try{
     const users = await User.find({_id:{$ne: req.params.id}}).select([
      'email',
      "username",
      "avatarImage",
      "_id"
     ]);
     return res.json(users)
   }
   catch(err){ 
      next(err);
   }
}