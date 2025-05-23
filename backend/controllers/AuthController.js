const UserModel=require("../models/registered");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const signup=async(req,res)=>{
    try {
      const{name,email,password}=req.body;
      const user=await UserModel.findOne({email});
      if(user){
        return res.status(409).json({message:'User already exist,you can login',success:false});
      }
      const usermodel=new UserModel({name,email,password});
      usermodel.password=await bcrypt.hash(password,10);
      await usermodel.save();

      res.status(201).json({message:"signup succesfully",success:true});
    } catch (err) {
      res.status(500).json({message:"Internal server error",success:false});
    }
};

const login=async(req,res)=>{
  try {
    const{email,password}=req.body;
    const user=await UserModel.findOne({email});
    if(user){
      const decryptedpassword= await bcrypt.compare(password,user.password);
      if(decryptedpassword){
       const jwtToken=jwt.sign(
        {email:user.email,_id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:'24h'}
       )

        res.status(201).json({
          message:"login succesfull",
          success:true,
          jwtToken,
          email,
          name:user.name
        });
      }
      else
      {
        res.status(400).json({message:"Wrong password",success:false});
      }
  }else{
   res.status(400).json({message:"Auth failed email or password is wrong",success:false});}
} catch (err) {
    res.status(500).json({message:"Internal Server error",success:false});
  }
};

module.exports={
  signup,
  login
}