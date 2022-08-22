const Sequelize = require('sequelize');

const sequelize = require('../util/database')

const UserGroupMessage = sequelize.define('usergroupmessage',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    message:Sequelize.STRING

    
})

module.exports = UserGroupMessage;