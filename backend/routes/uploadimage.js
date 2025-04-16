const express = require('express');
const router = express.Router(); 
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const {imageControl}=require('../controllers/imageController');

router.post('/image', upload.single('image'), imageControl);

module.exports=router;