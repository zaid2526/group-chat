require('dotenv').config();
const path=require('path')

const express=require('express')
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')

//database and models....
const sequelize = require('./util/database');
const User=require('./models/register');
const Message=require('./models/chats')
const Group=require('./models/group');
const UserGroup=require('./models/userGroup')
const UserGroupMessage=require('./models/userGroupMessage')

//routes.........
const userRoutes=require('./routes/user.routes')

const app=express()


app.use(bodyParser.json())
app.use(cookieParser())
const staticPath=path.join(__dirname,'..','front-end');
console.log(staticPath);
app.use(express.static(staticPath))
// app.use('/',(req,res,next)=>{
//     console.log('server running');
//     res.send("running")
// })



app.use(userRoutes)


User.hasMany(Message);
Message.belongsTo(User);

User.belongsToMany(Group,{through:UserGroup});
Group.belongsToMany(User,{through:UserGroup});

Group.hasMany(UserGroupMessage);
UserGroupMessage.belongsTo(Group);

User.hasMany(UserGroupMessage);
UserGroupMessage.belongsTo(User);

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



