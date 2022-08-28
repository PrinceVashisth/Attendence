const router = require('express').Router();
const bcrypt = require('bcryptjs');
const classroom = require('../models/classroom');
const Student = require('../models/Student');
const Attendence = require('../models/Attendence');

// Get a Student
router.get('/:id',async(req,res)=>{
   try {
      const student = await Student.findById(req.params.id);
      const {Password,...others} = student._doc;
      res.json({status:true,msg:"student details",data:others});
   } catch (error) {
      res.json({status:false,msg:"Somthing went Wrong"});
   }
})

// Edit A Student Details
router.put('/editStudent',async(req,res)=>{
      const email = req.query.email;
      const userId = req.query.id;
      try {
      if(email){
         const salt = await bcrypt.genSalt(10);
         const newHasshedPassword = await bcrypt.hash(req.body.password,salt);
         const S = await Student.findOneAndUpdate({Email:email},{$set:{Password:newHasshedPassword}});
         res.json({status:true,msg:"Student Update Sucessfully"}); 
      }else{
         const S = await Student.findById(userId);
         S.updateOne({$set:req.body});
         res.json({status:true,msg:"Student Update Sucessfully"}); 
      }
   } catch (error) {
      res.json({status:false,msg:"Somthing Went Wrong"}); 
   }
});

// Join a Classroom By Student 
router.put("/:id",async(req,res)=>{
   try {
      const newroom = await classroom.findOne({RoomId:req.body.RoomId});
   const user = await Student.findById(req.params.id);
   if(!newroom) res.json({status:false,msg:"Somthing Went Wrong"}); 
   else if(!newroom.Students.includes(req.params.id)){
      await newroom.updateOne({$push:{Students:req.params.id}});
      await user.updateOne({$push:{ClassRooms:newroom._id}});
      res.json({status:true,msg:"You Joined Classroom"}); 
   }else{
      res.json({status:false,msg:"Already in classroom"}); 
     
   }      
   } catch (error) {
      res.json({status:false,msg:"Somthing Went Wrong"}); 
   }

});

// Give Attendence for a Class
router.put('/Give/:id',async(req,res)=>{
   try {
      const attendence = await Attendence.findById(req.params.id);
      const student = await Student.findById(req.body.userId);
      if(student.ClassRooms.includes(attendence.RoomAttendenceId) && !attendence.Present.includes(student._id)){
         await attendence.updateOne({$push:{Present:student._id}});
         res.json({status:true,msg:"Attendence Mark Sucessfully"}); 
      }else{
         res.json({status:false,msg:"Not Elegible to Give Attendence"}); 
      }
   } catch (error) {
      res.json({status:false,msg:"Somthing Went Wrong"}); 
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
        const {createdAt,...others} = getAttendence;
        if(getAttendence.Present.includes(student._id)){
          TotalAttendence.push({createdAt,"Present":true});   
         }else{
           TotalAttendence.push({createdAt,"Present":false});   
        }
     }
     res.json({status:true,msg:"Attendence Data",data:TotalAttendence}); 
   }catch (error){
      res.json({status:false,msg:"Somthing Went Wrong"}); 
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
              ClassroomAttendence.push({createdAt,"Present":true});
            }else{
               ClassroomAttendence.push({createdAt,"Present":false});
            }
         }
      }
      TotalAttendence.push(ClassroomAttendence);
     }
     res.json({status:true,msg:"Attendence Data",data:TotalAttendence}); 
   }catch (error){
      res.json({status:false,msg:"Somthing Went Wrong"}); 

   }
});


// Leave classroom 
router.put("/leave/:id",async(req,res)=>{
   const newroom = await classroom.findOne({RoomId:req.body.RoomId});
   const user = await Student.findById(req.params.id);
   if(newroom.Students.includes(req.params.id)){
      await newroom.updateOne({$pull:{Students:req.params.id}});
      await user.updateOne({$pull:{ClassRooms:newroom._id}});
      res.json({status:true,msg:"You Left Classroom"}); 
   }else{
      res.json({status:false,msg:"You Already Left classroom"}); 
   }    
});

module.exports = router;