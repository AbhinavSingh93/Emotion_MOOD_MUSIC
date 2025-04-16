const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const AuthRouter=require('./routes/AuthRouter');
const Forgotpassword=require('./routes/Forgotpassword');
const Resetpassword=require('./routes/Resetpassword');
const uploadimage=require('./routes/uploadimage');
const fetchmusic =require('./routes/fetchmusic');

require('dotenv').config();
require('./models/db');
const cors=require('cors');

const PORT=process.env.PORT||5000;

app.get('/',(req,res)=>{
  res.send("Hi i am there");
});

app.use(bodyParser.json());
app.use(cors());

app.use('/auth',AuthRouter);
app.use('/forgot-password',Forgotpassword);
app.use('/reset-password',Resetpassword);
app.use('/uploadimage',uploadimage);
app.use('/fetch',fetchmusic);


app.listen(PORT,()=>{
  console.log("Server is listening on Port: ",PORT);
});