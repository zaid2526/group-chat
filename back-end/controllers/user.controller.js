const Register=require('../models/register');

exports.postRegister=(req,res,next)=>{
    // console.log("req user",req.user)
    console.log(req.body);
    console.log("req,user",req.user);
    const {name,email,phone,password}=req.body
    // console.log(name,email,phone,password);
    // bcrypt.hash(password,10).then(data=>{
    //     console.log("hash",data);
    // })
    

    Register.findOne({where:{email:email}})
        .then(data=>{
            if(data){
               res.json({
                email:data.email,
                isSucces:false,
                message:`User already exist....!!`
            }); 
            }
            else{
                return bcrypt.hash(password, 10)
                
            }
        })
        .then(encryptedPassword=>{
            // console.log("jsddgs",encryptedPassword);
           
            return Register.create({
                name:name,
                email:email,
                phone:phone,
                password:encryptedPassword, 
            })
           
        })
        .then(data=>{
            console.log(data);
            res.json({
                user:data,
                isSucces:true,
                message:`User registration successfull....!!`
            })
        })
        .catch(err=>{console.log(err);})


    
}