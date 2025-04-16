const express = require('express');
const router = express.Router(); 
const {newpass}=require('../controllers/ResetPass');
const { ResetPasswordValidation } = require('../Middlewares/AuthValidation');

router.post('/newpass/:id/:token',ResetPasswordValidation,newpass);

module.exports=router;