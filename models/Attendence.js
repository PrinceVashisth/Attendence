const mongoose =require('mongoose');
const AttendenceSchema = mongoose.Schema({
     userId:{
      type:String,
      required:true
     },
     AttendenceId:{
        type:String,
        required:true
     },
      Present:Array
},{timestamps:true});

module.exports=new mongoose.model('Attendence',AttendenceSchema);