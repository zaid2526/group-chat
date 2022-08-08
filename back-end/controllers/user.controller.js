

const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const Register=require('../models/register');

exports.postRegister=(req,res,next)=>{
    // console.log("req user",req.user)
    // console.log(req.body);
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
            const token=jwt.sign({email:email},process.env.PASSWORD_ENCRY_SECRET_KEY);
           
            return Register.create({
                name:name,
                email:email,
                phone:phone,
                password:encryptedPassword, 
                token:token
            })
           
        })
        .then(data=>{
            console.log(data);
            res.json({
                user:data,
                isSucces:true,
                message:`Successfuly signed up....!!`
            })
        })
        .catch(err=>{console.log(err);})
}


exports.postLogIn=(req,res,next)=>{
    const { email, password}=req.body
    let name;
    let token;
    let id;
    // console.log("postLogIn",req.body);
    Register.findOne({where:{email:email }})
        .then(data=>{
            if(!data){
                res.json({email:email,auth:false})
            }else{
                name=data.name;
                id=data.id;
                return bcrypt.compare(password,data.password)
            }
            
        })
        .then(validPassword=>{
            if(validPassword===true){
                console.log("valid",validPassword);
                token=jwt.sign({id:id,email:email},process.env.PASSWORD_ENCRY_SECRET_KEY)
               
                // console.log("token Created",token);
                res.cookie('jwt',token,{
                    // expires: new Date(Date.now() + 30000),
                    httpOnly:true,
                    secure:true
                })

                res.json({
                    name:name,
                    email:email,
                    auth:true,
                    // secretToken:token
                })
            }
            if(validPassword===false){
                res.json({
                    name:name,
                    email:email,
                    auth:false,
                })
            }
        })
        .catch(err=>{console.log(err);})
}