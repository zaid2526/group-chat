const jwt=require('jsonwebtoken');

const Register=require('../models/register');


exports.auth=(req,res,next)=>{
    try{
        const token=req.cookies.jwt
        const verifyUser=jwt.verify(token,process.env.JWT_SECRET_KEY)
        // const {id,email}=jwt.verify(token,process.env.JWT_SECRET_KEY)
        // console.log("verifyUser",verifyUser);
        Register.findOne({where:{email:verifyUser.email}})
            .then(user=>{

                    // console.log("user",user);
                    req.user=user;
                    next();
                
            })
            .catch(err=>{console.log(err);})

        
    }catch(err){
        res.status(401).send({err,message:'unauthorized user'})
    }
    
}