const express = require('express');
const router = express.Router(); 
const {forgot}=require('../controllers/forgotControllers');

router.post('/forgot',forgot);

module.exports=router; 