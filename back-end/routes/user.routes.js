const express=require('express')

const userController=require('../controllers/user.controller')


//middleware....
const Authentication=require('../middleware/authentication')

const router=express.Router();

router.post('/register',userController.postRegister)

router.post('/login', userController.postLogIn)


module.exports= router;