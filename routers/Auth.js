const Routes = require("express").Router();

const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// Register a Student
Routes.post('/', async(req,res)=>{
    const salt = await bcrypt.genSalt(10);
    const HashPassword = await bcrypt.hash(req.body.password,salt);
    const User = await Student.findOne({College_Id:req.body.College_Id});
    if(User){
      res.json({status:false,msg:"User Key Already Taken"});
    }else{
     const user = new Student({
        Email:req.body.email,
        College_Id:req.body.College_Id,
        Username:req.body.username,
        Password:HashPassword,
     })
     try {
          await user.save();
         res.json({status:true,msg:"Student Register Sucessfully..."});
     } catch (error) {
        console.log(error);
     }
    }
});

// login a Student
Routes.post('/login',async(req,res)=>{
    try {
        const student = await Student.findOne({College_Id:req.body.College_Id});
        const {Password,...user} = student._doc;
        if(!user){
           res.json({status:false,msg:"User Not Found"});
        }
      const check = await bcrypt.compare(req.body.password,Password);
      if(!check){res.json({status:false,msg:"Wrong Password"});}
      else{res.json({status:true,msg:"Student successfully Logged in...",user});}  
     } catch (error) {
        res.json({status:false,msg:"Somthing Went Wrong..."});
     }    
}); 

// Register a Teacher
Routes.post('/Teacher/', async(req,res)=>{
   const salt = await bcrypt.genSalt(10);
   const HashPassword = await bcrypt.hash(req.body.password,salt);
   const User = await Teacher.findOne({Teacher_Id:req.body.Teacher_Id});
   if(User){
      res.json({status:false,msg:"Key Already Exist"});
   }else{
    const user = new Teacher({
      Email:req.body.email,
      Teacher_Id:req.body.Teacher_Id,
       Username:req.body.username,
       Password:HashPassword,
    })
    try {
        const {Password,...User} = await user.save();
        res.json({status:true,msg:"Teacher Register Sucessfully..."});
    } catch (error) {
       res.json({status:false,msg:"Somthing Went Wrong"})
    }
   }
});

// Login a Teacher
Routes.post('/Teacher/login',async(req,res)=>{
   try {
       const teacher = await Teacher.findOne({Teacher_Id:req.body.Teacher_Id});
       const {Password,...user} = teacher._doc;
       if(!user){
          res.json({status:false,msg:"User Not Found"});
       }
     const check = await bcrypt.compare(req.body.password,Password);
     if(!check){res.json({status:false,msg:"Wrong Password"});}
     else{res.json({status:true,msg:"Sucessfully logged in...",user});}  
    } catch (error) {
       res.json({status:false,msg:"Somthing went Wrong"})
    }    
}); 

module.exports = Routes;