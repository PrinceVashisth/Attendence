const mongoose = require('mongoose');
const StudentSchema = mongoose.Schema({
   Email:{
      type:String,
      required:true,
      unique:true
   },
   College_Id:{
      type:String,
      required:true,
      unique:true
   },
   Username:{
      type:String,
      required:true
     },
   Password:{
      type:String,
      required:true
     },
   resetToken:String,
   Expire:Date,  
   Admin:{
      type:Boolean,
      default:false
   },
   ClassRooms:Array  
}); 

module.exports =new mongoose.model("Student",StudentSchema);