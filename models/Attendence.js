const mongoose =require('mongoose');
const AttendenceSchema = mongoose.Schema({
     RoomAttendenceId:{
      type:String,
      required:true
     },
      Present:Array
},{timestamps:true});

module.exports=new mongoose.model('Attendence',AttendenceSchema);