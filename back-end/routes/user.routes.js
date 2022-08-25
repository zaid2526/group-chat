const express=require('express')

const userController=require('../controllers/user.controller')


//middleware....
const Authentication=require('../middleware/authentication')

const router=express.Router();

router.post('/register',userController.postRegister)

router.post('/login', userController.postLogIn)

router.get('/users/:groupId',Authentication.auth, userController.getGroupUsers);
router.get('/users',Authentication.auth, userController.getUsers);


router.post('/message',Authentication.auth, userController.postMessage)
router.get('/message/:lastMsgId',Authentication.auth,userController.getMessage);

router.post('/creategroup',Authentication.auth,userController.createGroup)
router.post('/addingroup/:groupId',Authentication.auth,userController.addIntoGroup)
router.post('/getgroup',Authentication.auth,userController.getAllGroup);
router.post('/removefromgroup',Authentication.auth,userController.removeFromGroup);


// router.post('/usergroupmessage/:groupId',Authentication.auth,userController.postUserGroupMessage)
router.post('/creategroupmessage/:groupId',Authentication.auth,userController.postUserGroupMessage)
router.get('/getgroupmessage/:groupId',Authentication.auth,userController.getGroupMessage)

router.post('/createadmin/:groupId',Authentication.auth,userController.createAdmin)
router.post('/removeadmin/:groupId',Authentication.auth,userController.removeAdmin)

module.exports= router;