require('dotenv').config();
const path=require('path')

const express=require('express')

//database and models....
const sequelize = require('./util/database');


//routes.........
const userRoutes=require('./routes/user.routes')

const app=express()

const staticPath=path.join(__dirname,'..','front-end');
console.log(staticPath);
app.use(express.static(staticPath))
// app.use('/',(req,res,next)=>{
//     console.log('server running');
//     res.send("running")
// })

app.use(userRoutes)


sequelize
    .sync()
    // .sync({force:true})
    .then(()=>{
        app.listen(process.env.PORT || 3030,()=>{
            console.log(`server running on PORT 3030`);
        })
        
    })
    .catch(err=>{
        console.log("somethis went wrong",err);
    })



