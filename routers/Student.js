const router = require('express').Router();
const classroom = require('../models/classroom');
const Student = require('../models/Student');
const Attendence = require('../models/Attendence');

// Join a Classroom By Student 
router.put("/:id",async(req,res)=>{
   try {
      const newroom = await classroom.findOne({RoomId:req.body.RoomId});
   const user = await Student.findById(req.params.id);
   if(!newroom) res.send("class Room Not Found");
   else if(!newroom.Students.includes(req.params.id)){
      await newroom.updateOne({$push:{Students:req.params.id}});
      await user.updateOne({$push:{ClassRooms:newroom._id}});
      res.send("You Joined Classroom");
   }else{
      res.send("Already in classroom");
   }      
   } catch (error) {
    res.send(error);  
   }

});

// Give Attendence for a Class
router.put('/Give/:id',async(req,res)=>{
   try {
      const attendence = await Attendence.findById(req.params.id);
      const student = await Student.findById(req.body.userId);
      if(student.ClassRooms.includes(attendence.RoomAttendenceId) && !attendence.Present.includes(student._id)){
         await attendence.updateOne({$push:{Present:student._id}});
         res.send("Attendence Mark Sucessfully");
      }else{
         res.send("Not Elegible to Give Attendence");
      }
   } catch (error) {
      res.send(error);
   }   

})



// Get Attendence of a Student For a Perticular Class
router.get('/getAttendence/classroom/:userId/:id',async(req,res)=>{
   let TotalAttendence=[];
   try{
     const student = await Student.findById(req.params.userId);
     const Class = await classroom.findById(req.params.id); 
     for(let count=0;count<Class.Attendence.length;count++){
        const getAttendence = await Attendence.findById(Class.Attendence[count]); 
        if(getAttendence.Present.includes(student._id)){
          const {createdAt,...others} = getAttendence;
          TotalAttendence.push(createdAt);   
        }
     }
     res.send(TotalAttendence);
   }catch (error){
     res.send(error);
   }
});


// Get Attendence for a Stuudent in All Classrooms  
router.get('/getAttendence/classroom/:id',async(req,res)=>{
   let rooms=[];
   let TotalAttendence=[];
    try{
      const student = await Student.findById(req.params.id);
      for(let count=0;count<student.ClassRooms.length;count++){
       const room = await classroom.findById(student.ClassRooms[count]);
       rooms.push(room);
      }  
     for(let c = 0;c<rooms.length;c++){
        let ClassroomAttendence =[];
      for(let count2=0;count2<rooms[c].Attendence.length;count2++){
         const getAttendence = await Attendence.findById(rooms[c].Attendence[count2]);
         if(getAttendence){
            if(getAttendence.Present.includes(student._id)){
              const {createdAt,...others} = getAttendence;
              ClassroomAttendence.push(createdAt);
            }
         }
      }
      TotalAttendence.push(ClassroomAttendence);
     }
      res.send(TotalAttendence);
   }catch (error){
      res.send(error);
   }
});


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