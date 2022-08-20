const mongoose = require('mongoose');
const StudentSchema = mongoose.Schema({
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
   Admin:{
      type:Boolean,
      default:false
   },
   ClassRooms:Array  
}); 

module.exports =new mongoose.model("Student",StudentSchema);