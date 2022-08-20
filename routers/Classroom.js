const router = require('express').Router();
const Classroom = require('../models/classroom');
const Teacher = require('../models/Teacher');
const Attendence = require('../models/Attendence');

// Create a Classroom
router.post('/:id', async(req,res)=>{
      const Room = await Classroom.findOne({RoomId:req.body.RoomId});
      if(Room){
        res.send("RoomId Is Already In Use");
      }else{
        const NewRoom = new Classroom({
            RoomName:req.body.name,
            userId:req.params.id,
            RoomId:req.body.RoomId,
        });
        try {            
            const data = await NewRoom.save();
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
        const resp = await Classroom.findByIdAndUpdate(req.body.Id,{$set:req.body});
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
         await Classroom.findByIdAndDelete(req.body.userId);
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
     try{
      const attendence = new Attendence({
        userId:req.params.id,
        AttendenceId:req.body.AttendenceId
      });
      const resp = await attendence.save();
      req.send(resp);
     }catch (error){
      res.send(error);
     }
});

module.exports = router;