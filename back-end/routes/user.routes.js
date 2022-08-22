const express=require('express')

const userController=require('../controllers/user.controller')


//middleware....
const Authentication=require('../middleware/authentication')

const router=express.Router();

router.post('/register',userController.postRegister)

router.post('/login', userController.postLogIn)

router.get('/users',Authentication.auth, userController.getUsers)
router.post('/message',Authentication.auth, userController.postMessage)
router.get('/message/:lastMsgId',Authentication.auth,userController.getMessage);

router.post('/creategroup',Authentication.auth,userController.createGroup)
router.post('/addingroup/:groupId',userController.addIntoGroup)
router.post('/getgroup',Authentication.auth,userController.getAllGroup)

// router.post('/usergroupmessage/:groupId',Authentication.auth,userController.postUserGroupMessage)
router.post('/usergroupmessage/:groupId',userController.postUserGroupMessage)
router.get('/getgroupmessage/:groupId',userController.getGroupMessage)


module.exports= router;