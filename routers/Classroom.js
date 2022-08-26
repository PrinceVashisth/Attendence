const router = require('express').Router();
const Teacher = require('../models/Teacher');
const Attendence = require('../models/Attendence');
const classroom = require('../models/classroom');

// Create a Classroom
router.post('/:id', async(req,res)=>{
      const Room = await classroom.findOne({RoomId:req.body.RoomId});
      const teacher = await Teacher.findById(req.params.id);
      if(Room){
        res.send("RoomId Is Already In Use");
      }else{
        try { 
        const NewRoom = new classroom({
            RoomName:req.body.name,
            AdminTeacherId:req.params.id,
            RoomId:req.body.RoomId,
        });       
            const data = await NewRoom.save();
           await teacher.updateOne({$push:{ClassRooms:data._id}});
            res.send(data);
        } catch (error) {
            res.send(error);
        }
      }
})

// Edit a Classroom
router.put('/edit/:id',async(req,res)=>{
    const teacher = await Teacher.findById(req.params.id);
    try {
      if(teacher && teacher.Admin){
        const resp = await classroom.findByIdAndUpdate(req.body.Id,{$set:req.body});
        res.send(resp);
      }
      else{
        res.send("You are Not Allowed To Change");
      }
    } catch (error) {
      res.send(error);
    }
});

// Delete a Classroom
router.delete('/:id',async(req,res)=>{
    const teacher = await Teacher.findById(req.params.id);
    try {
      if(teacher && teacher.Admin){
         await classroom.findByIdAndDelete(req.body.userId);
        res.send("Classroom Deleted Sucessfully");
      }
      else{
        res.send("You are Not Allowed To Delete Classroom");
      }
    } catch (error) {
      res.send(error);
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
     req.send("Attendence Section Is Created Sucessfully...");
    }catch (error){
     res.send(error);
    }
});

module.exports = router;