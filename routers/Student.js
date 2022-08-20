const router = require('express').Router();
const classroom = require('../models/classroom');
const Student = require('../models/Student');

// Join a Classroom By Student 
router.put("/:id",async(req,res)=>{
   const newroom = await classroom.findOne({RoomId:req.body.RoomId});
   const user = await Student.findById(req.params.id);
   if(!newroom) res.send("class Room Not Found");
   else if(!newroom.Condidate.includes(req.params.id)){
      await newroom.updateOne({$push:{Condidate:req.params.id}});
      await user.updateOne({$push:{classRooms:newroom.id}});
      res.send("You Joined Classroom");
   }else{
      res.send("Already in classroom");
   }
});

// Get Attendence  
// router.get('',async(req,res)=>{
   
// });

// Leave classroom 
router.put("/leave/:id",async(req,res)=>{
   const newroom = await classroom.findOne({RoomId:req.body.RoomId});
   const user = await Student.findById(req.params.id);
   if(newroom.Students.includes(req.params.id)){
      await newroom.updateOne({$pull:{Students:req.params.id}});
      await user.updateOne({$pull:{ClassRooms:newroom._id}});
      res.send("You Left Classroom");
   }else{
      res.send("You Already Left classroom");
   }    
});

module.exports = router;