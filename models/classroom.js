const mongoose = require('mongoose');

const ClassRoomSchema = mongoose.Schema({
   userId:{
    type:String,
    required:true
   },
   RoomName:{
    type:String,
    required:true
   },
   RoomId:{
    type:String,
    required:true
   },
   Students:Array,
   Attendence:Array
},{timestamps:true});

module.exports = mongoose.model("Classroom",ClassRoomSchema);