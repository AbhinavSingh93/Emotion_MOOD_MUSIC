const UserModel = require("../models/registered");
const nodemailer = require('nodemailer');
const jwt=require('jsonwebtoken');

const forgot=async(req,res)=>{
  const {email}= req.body;

  try {

    const user=await UserModel.findOne({email});
  if(!user)
  {
    return res.send({Status:"User not existed"});
  }

  const jwtToken=jwt.sign(
          {_id:user._id},
          process.env.JWT_SECRET,
          {expiresIn:'24h'}
         )

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    }
  });
  
  var mailOptions = {
    from: 'abhinavsingh18813@gmail.com',
    to: email,
    subject: 'Reset Password Link',
    text: `https://mood-music-app.netlify.app/reset-password/${user._id}/${jwtToken}`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      return res.status(500).json({ status: "fail", message: "Mail not sent" });
    } else {
      return res.send({status:"success",message: "Sent Successfully"});
    }
  });
    
  } catch (error) {
    console.error(err);
    return res.status(500).json({ status: "fail", message: "Something went wrong" });
  }
};

module.exports={
  forgot
};