

const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
//models.......
const User=require('../models/register');
const Message=require('../models/chats');
const Register = require('../models/register');

exports.postRegister=(req,res,next)=>{
    // console.log("req user",req.user)
    // console.log(req.body);
    const {name,email,phone,password}=req.body
    // console.log(name,email,phone,password);
    // bcrypt.hash(password,10).then(data=>{
    //     console.log("hash",data);
    // })
    

    User.findOne({where:{email:email}})
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
            const token=jwt.sign({email:email},process.env.JWT_SECRET_KEY);
           
            return User.create({
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
    User.findOne({where:{email:email }})
        .then(data=>{
            if(!data){
                res.json({email:email,isUser:false})
            }else{
                name=data.name;
                id=data.id;
                return bcrypt.compare(password,data.password)
            }
            
        })
        .then(validPassword=>{
            // console.log("valid",validPassword);
            if(validPassword===true){
                
                token=jwt.sign({id:id,email:email},process.env.JWT_SECRET_KEY)
               
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
                    secretToken:token
                })
            }
            if(validPassword===false){
                res.json({
                    name:name,
                    email:email,
                    auth:false,
                    message:'User not authorized'
                
                })
            }
        })
        .catch(err=>{console.log(err);})
}


exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        // console.log(users);
        return res.status(200).json({ users, success: true })
    } catch (err) {
        console.log(err);
    }
}

exports.postMessage= async (req,res,next)=>{
    // console.log("req user",req.user);
    const msg=req.body.msg;
    const {name}=req.user
    try{
        const message=await req.user.createMessage({
                                message:msg,
                            });
        console.log("message post",message);
         res.status(201).json({
            data:message,
            message:'message send',
            name:name
        })
    }catch(err){
         res.status(400).json({message:`msg not sent`})
    }
    
   
}

exports.getMessage= async(req,res,next)=>{
    try{
        const {name}=req.user;
        // const msgs=await req.user.getMessages();
        const msgs=await Message.findAll({include:[{
            model:Register,
            attributes:['id','name']
        }]})
        // console.log("msgs>>>>>>>",msgs);
        res.status(200).json({msgs,name,success:true})
    }catch(err){
        res.status(404).json({success:false})
    }
    
}