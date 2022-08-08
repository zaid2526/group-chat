const Sequelize=require('sequelize');

const sequelize=require('../util/database')

const Register=sequelize.define('register',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false
    }, 
    phone:{
        type:Sequelize.BIGINT,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    token:{
        type:Sequelize.STRING,
        allowNull:false
    },
    
    

})


module.exports=Register;