const router = require('express').Router();
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Attendence = require('../models/Attendence');
const classroom = require('../models/classroom');
// Get All Present Student in A class
router.get('/classroom/:userId/:id',async(req,res)=>{
    let Presents=[];
      try {
        const teacher = await Teacher.findById(req.params.userId);
        const Classroom = await classroom.findById(req.params.id);
        const attendence = await Attendence.find({RoomAttendenceId:Classroom._id});
        for (let count=0;count<attendence.length;count++){
         const {Present,createdAt,...others} = attendence[count];
         let Students=[];
         for(let person=0;person<Present.length;person++){
            const {Username,College_Id,...others} = await Student.findById(Present[person]);
            Students.push({Username,College_Id});
         }
        Presents.push({Students,createdAt});
        }
        res.send(Presents);
      } catch (error) {
        res.send(error);
      } 
});



// Get ALL Student Present class Wise
// router.get('/attendence/:id',async(req,res)=>{
//     let Classrooms=[];
//     let Attendences=[];
//      const teacher = await Teacher.findById(req.params.id);
//      for (let count=0;count<teacher.classRooms.length;count++){
//      const Classroom = await classroom.findById(teacher.ClassRooms[count]);
//      Classrooms.push(classroom); 
//   }   
//      for(let count=0;count<Classrooms.length;count++){
//       const attendence =await Attendence.findById(Classrooms.Attendence[count]);
//       Attendences.push(attendence);
//      }
//    res.send(Attendences);  
// });

// Get All Student  

module.exports = router;