const mongoose=require('mongoose');

const mongo_url=process.env.MONGO_URL;

mongoose.connect(mongo_url).then(()=>{
  console.log('Mongo db connected');
}).catch((err)=>{
  console.log('MongoDb connection error:',err);
});