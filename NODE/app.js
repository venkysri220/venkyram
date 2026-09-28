const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json())
mongoose.connect('mongodb://localhost:27017/college')
.then(()=>{
    console.log("successfully connect")
})
.catch((err)=>{
     console.log("erre connect")
})
const user=new mongoose.Schema({
    name:{
        type:String,
        require:false
    },
      age:{
        type:Number,
        require:true
      }
})
const User=mongoose.model('User',user)

app.post('/sin',async (req, res) => {
  const ser=await User.create(req.body)
  res.send(ser)
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});