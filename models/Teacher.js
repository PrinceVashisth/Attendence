const mongoose = require('mongoose');
const TeacherSchema = mongoose.Schema({
   Username:{
      type:String,
      required:true
     },   
   Teacher_Id:{
      type:String,
      required:true,
      unique:true
     },
   Password:{
        type:String,
        required:true
     },
   ClassRooms:Array,
   Admin:{
      type:Boolean,
      default:true
     }  
});

module.exports =new mongoose.model("Teacher",TeacherSchema);