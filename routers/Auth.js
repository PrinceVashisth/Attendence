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
       res.send("User Key Already Taken");
    }else{
     const user = new Student({
        Email:req.body.email,
        College_Id:req.body.College_Id,
        Username:req.body.username,
        Password:HashPassword,
     })
     try {
         const User = await user.save();
         res.send(User);
     } catch (error) {
        console.log(error);
     }
    }
});

// login a Student
Routes.post('/login',async(req,res)=>{
    try {
        const user = await Student.findOne({College_Id:req.body.College_Id});
        if(!user){
           res.send("User Not Found");
        }
      const check = await bcrypt.compare(req.body.password,user.Password);
      if(!check){res.send("Wrong Password");}
      else{res.send(user);}  
     } catch (error) {
        console.log(error);
     }    
}); 

// Register a Teacher
Routes.post('/Teacher/', async(req,res)=>{
   const salt = await bcrypt.genSalt(10);
   const HashPassword = await bcrypt.hash(req.body.password,salt);
   const User = await Teacher.findOne({Teacher_Id:req.body.Teacher_Id});
   if(User){
      res.send("Key Already Exist");
   }else{
    const user = new Teacher({
      Email:req.body.email,
      Teacher_Id:req.body.Teacher_Id,
       Username:req.body.username,
       Password:HashPassword,
    })
    try {
        const User = await user.save();
        res.send(User);
    } catch (error) {
       console.log(error);
    }
   }
});

// Login a Teacher
Routes.post('/Teacher/login',async(req,res)=>{
   try {
       const user = await Teacher.findOne({Teacher_Id:req.body.Teacher_Id});
       if(!user){
          res.send("User Not Found");
       }
     const check = await bcrypt.compare(req.body.password,user.Password);
     if(!check){res.send("Wrong Password");}
     else{res.send(user);}  
    } catch (error) {
       console.log(error);
    }    
}); 

module.exports = Routes;