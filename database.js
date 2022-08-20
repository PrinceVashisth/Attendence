const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/Attendence",{}).then(
    console.log("database connected")
).catch((e)=>{
    console.log(e);
})
