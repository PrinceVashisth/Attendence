const mongoose = require('mongoose');
const TeacherSchema = mongoose.Schema({
   Email:{
      type:String,
      required:true,
      unique:true
   },
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
   resetToken:String,
   Expire:Date,
   Admin:{
      type:Boolean,
      default:true
     }  
});

module.exports =new mongoose.model("Teacher",TeacherSchema);