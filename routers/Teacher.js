const router = require('express').Router();
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Attendence = require('../models/Attendence');
const classroom = require('../models/classroom');
const crypto = require('crypto');
// Get a Teacher
router.get('/:id',async(req,res)=>{
  try {
    const teacher = await Teacher.findById(req.params.id);
    const {Password,...others} = teacher._doc;
    res.json({status:true,msg:"teacher details",data:others}); 
  } catch (error) {
    res.json({status:false,msg:"Somthing Went Wrong"}); 
  }
})

router.post('/reset-password',async(req,res)=>{
    try {
      crypto.randomBytes(32,async(err,buffer)=>{
        if(err){
          res.json({status:false,msg:"Somthing Went Wrong"});
        }else{
          const Token = buffer.toString('hex');
         const teacher = await Teacher.findOne({Email:req.body.email});
         if(teacher){
            teacher.resetToken=Token;
            teacher.Expire = Date.now()+360000;
         }else{
          res.json({status:false,msg:"user Not Exist With That Email"}); 
         }
        }
      })
    } catch (error) {
      res.json({status:false,msg:"Somthing Went Wrong"}); 
    }
});



// Edit a Teacher Details
router.put('/editTeacher/:id',async(req,res)=>{ 
  try {
    const T = await Teacher.findById(userId);
    T.updateOne({$set:req.body});
    res.json({status:true,msg:"user Details Edited Sucessfully"}); 
  } catch (error) {
    res.json({status:false,msg:"Somthing Went Wrong"}); 
  }
     
});

// Get All Present OR Absent Student in A class
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
            Students.push({Username,College_Id,"Present":true});
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


// Delete A Classroom
router.delete('/Delete/classroom/:id',async(req,res)=>{
  try {
    const Classroom = await classroom.findById(req.params.id);
      await Attendence.deleteMany({RoomAttendenceId:Classroom._id});
    for(let count=0;count<Classroom.Students.length;count++){
       await Student.findByIdAndUpdate(Classroom.Students[count],{$pull:{ClassRooms:Classroom._id}});
    }
    await Teacher.findByIdAndUpdate(Classroom.AdminTeacherId,{$pull:{ClassRooms:Classroom._id}});
    await Classroom.delete();
    res.send("Classroom Deleted Sucessfully...");
   } catch (error) {
    res.send(error);
   }
})

module.exports = router;