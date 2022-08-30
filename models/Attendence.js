const mongoose =require('mongoose');
const AttendenceSchema = mongoose.Schema({

     RoomAttendenceId:{
      type:String,
      required:true
     },
     active:{
       type:Boolean,
       default:true
     },
      Present:Array
},{timestamps:true});

module.exports=new mongoose.model('Attendence',AttendenceSchema);