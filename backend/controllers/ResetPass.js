const jwt=require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/registered');

const newpass=async(req,res)=>{
  const {id,token} =req.params;
  const {password}=req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await UserModel.findByIdAndUpdate(
      { _id: id },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: 'User not found' });
    }

    res.json({ status: 'Success', message: 'Password updated successfully' });

  } catch (error) {
    console.error("Reset error:", error.message);
    res.status(400).json({ status: 'Error', message: 'Invalid or expired token' });
  }
};

module.exports={
  newpass
};