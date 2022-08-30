const router = require('express').Router();
const Teacher = require('../models/Teacher');
const Attendence = require('../models/Attendence');
const classroom = require('../models/classroom');


router.get('/:id',async(req,res)=>{
  try {
    const Class = await classroom.findById(req.params.id);
    res.json({status:true,msg:"get a classroom",data:Class});    
  } catch (error) {
    res.json({status:false,msg:"Somthing went Wrong"});
  }
})

// Create a Classroom
router.post('/:id', async(req,res)=>{
      const Room = await classroom.findOne({RoomId:req.body.RoomId});
      const teacher = await Teacher.findById(req.params.id);
      if(Room){
        res.json({status:false,msg:"RoomId Is Already In Use"});
      }else{
        try { 
        const NewRoom = new classroom({
            RoomName:req.body.name,
            AdminTeacherId:req.params.id,
            RoomId:req.body.RoomId,
        });       
           await NewRoom.save();
           await teacher.updateOne({$push:{ClassRooms:NewRoom._id}});
           res.json({status:true,msg:"room is created Sucessfully"});
        } catch (error) {
          res.json({status:false,msg:"Somthing Went Wrong"});
        }
      }
})

// Edit a Classroom
router.put('/edit/:id',async(req,res)=>{
    const teacher = await Teacher.findById(req.params.id);
    try {
      if(teacher && teacher.Admin){
        await classroom.findByIdAndUpdate(req.body.Id,{$set:req.body});
        res.json({status:true,msg:"Classroom Edited Sucessfully..."});
      }
      else{
        res.json({status:false,msg:"You can not edit details of Room"});
      }
    } catch (error) {
      res.json({status:false,msg:"somthing went Wrong"});
    }
});

// Delete a Classroom
router.delete('/:id',async(req,res)=>{
    const teacher = await Teacher.findById(req.params.id);
    try {
      if(teacher && teacher.Admin){
         await classroom.findByIdAndDelete(req.body.userId);
         res.json({status:true,msg:"Room Is Delete Sucessfully"});
      }
      else{
        res.json({status:false,msg:"You are Not Allowed To Delete Classroom"});
      }
    } catch (error) {
      res.json({status:false,msg:"Somthing went Wrong"});
      
    }
});

// Create An Attendence Room
router.post('/create/room/:id',async(req,res)=>{
  const Classroom = await classroom.findById(req.params.id);
    try{
     const attendence = new Attendence({
       RoomAttendenceId:req.params.id
     });
     await Classroom.updateOne({$push:{Attendence:attendence._id}});
     await attendence.save();
     res.json({status:true,msg:"Attendence Section Is Created Sucessfully..."});
   
    }catch (error){
      res.json({status:false,msg:"Somthing went Wrong"});
    }
});

module.exports = router;