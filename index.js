const express = require('express');
const app = express();
const port  = 80 || process.port.env;

require('./database');
const Auth = require('./routers/Auth');
const Classroom = require('./routers/Classroom');
const Teacher = require('./routers/Teacher');
const Student = require('./routers/Student');
app.use(express.json());

app.use("/api/auth",Auth);
app.use("/api/classroom",Classroom);
app.use("/api/Teacher",Teacher);
app.use("/api/Student",Student);

app.listen(port,()=>{
console.log(`listening at ${port}`);
})