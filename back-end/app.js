const path=require('path')

const express=require('express')

const app=express()

const staticPath=path.join(__dirname,'..','front-end');
console.log(staticPath);
app.use(express.static(staticPath))
// app.use('/',(req,res,next)=>{
//     console.log('server running');
//     res.send("running")
// })
app.listen(process.env.PORT || 3030,()=>{
    console.log(`server running on PORT 3030`);
})



