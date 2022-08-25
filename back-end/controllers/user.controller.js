

const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
//models.......
const {Op}=require('sequelize')
const User=require('../models/register');
const Message=require('../models/chats');
const Register = require('../models/register');
const Group = require('../models/group');
const UserGroup=require('../models/userGroup')
const UserGroupMessage=require('../models/userGroupMessage');
const { json } = require('body-parser');

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
        const lastMsgId=req.params.lastMsgId
        console.log("lastMsgId",lastMsgId);
        const {name}=req.user;
        // const msgs=await req.user.getMessages();
        const msgs=await Message.findAll({
            where:{id:{ [Op.gt]: lastMsgId }},
            include:[{
                model:Register,
                attributes:['id','name']
            }]
        })
        // console.log("msgs>>>>>>>",msgs);
        res.status(200).json({msgs,name,success:true})
    }catch(err){
        res.status(404).json({success:false})
    }
    
}

exports.createGroup=async (req,res,next)=>{
    try{    
        // const groupName=req.body.groupName;
        const {groupName}=req.body;
        console.log(groupName);
        // const group=await req.user.getGroups()
        // console.log(">>>>>>>>",group);
        req.user.createGroup({
                groupName:groupName
            },{
                through:{isAdmin:true}
            })
            .then(group=>{
                res.json({group})
            })
    }catch(err){
        console.log("errrr>>>",err);
    }

    
}

exports.addIntoGroup = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const { userId } = req.body
        const {email}=req.user;
        console.log("groupId", userId, groupId);
        const group = await req.user.getGroups({ where: { id: groupId } })
        const isAdmin=group[0].usergroup.isAdmin
        console.log(isAdmin);
        // res.json({ group })
        
        if(isAdmin){
            // console.log(user);
            const user = await User.findOne({ where: { id: userId } })
            if(!user){
                res.json({user:false})
            }
            const groupAdded=await user.addGroup(group,{through:UserGroup})
            console.log("added");
            res.json({groupAdded,added:true,email})
        }
        if(!isAdmin){
            res.json({added:false,email})
        }
        
    } catch (err) {
        console.log("catch err", err);
    }
}
exports.removeFromGroup=async(req,res,next)=>{
    console.log("removed from group");
    const {userId,groupId}=req.body;
    console.log(typeof userId,typeof groupId);
    const {id}=req.user;
    console.log(id);
    const user=await User.findByPk(userId)
    // const group=await req.user.getGroups({where:{id:groupId}});


    // const user =await group.getUsers({where:{id:userId}})
    let group=await user.getGroups({where:{id:groupId}})

    let removed=await user.destroy({where:{id:userId},include:[{model:Group}]})
    // console.log(group);
    // console.log(user);


    res.json({group,user,removed})
}

exports.getAllGroup=async (req,res,next)=>{
    const {id}=req.user;
    console.log(id);
    let group= await req.user.getGroups()
    res.json({group})
}

exports.postUserGroupMessage= async (req,res,next)=>{
    // console.log("req user",req.user);
    const {id,email,name}=req.user;
    const {msg}=req.body
    // console.log(msg,id,email);
    const groupId=req.params.groupId;

    // console.log("groupdetails",msg,id,email,groupId);

    const message=await UserGroupMessage.create({
        message:msg,
        groupId:groupId,
        registerId:id
        
    });
    res.json({message,name,msg})
    // console.log(message);
    
}
exports.getGroupMessage= async(req,res,next)=>{
    const groupId=req.params.groupId;
    const msgs=await UserGroupMessage.findAll({
        where:{groupId:groupId},
        include:[{
            model:User,
            attributes:['name','email']
        }]
    })
    // const msgs=await req.user.getUserGroupMessages({where:{groupId:groupId}})
    // console.log("msgs>>>>>>>",msgs[0].groupId);
    res.status(200).json({msgs,success:true})
    
}

exports.getGroupUsers= async (req,res,next)=>{
    const groupId=req.params.groupId;
    const group= await req.user.getGroups({
        where:{id:groupId},
        include:[{
            model:User,
            attributes:['id','name','email']
        }]
    })
    // console.log("group>>>>>",group);
    // const users= await group.getUser();
    // console.log(users);
    
    res.json({group})
}

exports.createAdmin=async (req,res,next)=>{
    const groupId=req.params.groupId;
    const {userId}=req.body
    
    const group= await req.user.getGroups({
        where:{id:groupId},
        include:[{
            model:User,
            attributes:['id','name','email']
        }]
    })
    // const user=await group.getUsers();

    // const {isAdmin}=group[0].usergroup
    group[0].registers.forEach(user => {
        if(user.usergroup.registerId==userId){
            if(user.usergroup.isAdmin===false){
                // req.user.addGroup(group[0],{through:{isAdmin:true}})
                user.usergroup.update({isAdmin:true})
                    .then(()=>{
                        res.json({group,nowAdmin:true})
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                
            }else{
                res.json({group,nowAdmin:false})
            }
            
        }
        
        
    });
    
    
}

exports.removeAdmin=async (req,res,next)=>{
    const groupId=req.params.groupId;
    const {userId}=req.body
    
    const group= await req.user.getGroups({
        where:{id:groupId},
        include:[{
            model:User,
            attributes:['id','name','email']
        }]
    })

    group[0].registers.forEach(user => {
        if(user.usergroup.registerId==userId){
            if(user.usergroup.isAdmin===true){
                // req.user.addGroup(group[0],{through:{isAdmin:true}})
                user.usergroup.update({isAdmin:false})
                    .then(()=>{
                        res.json({group,nowAdmin:false})
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                
            }else{
                res.json({group,nowAdmin:true})
            }
            
        }
        
        
    });
    

}

