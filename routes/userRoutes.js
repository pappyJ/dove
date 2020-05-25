// start of third party modules

const express = require('express');

const router = express.Router();

const userController = require('./../controllers/userController')

const authController = require('./../controllers/authController')


//the User Controller

router

    .route('/signup')

    .post(authController.signUp)


router

    .route('/login')

    .post(authController.login)


router

    .route('/logout')

    .get(authController.logout)


router

    .route('/forgotPassword')

    .post(authController.forgotPassword)


router

    .route('/resetpassword/:token')

    .patch(authController.resetPassword)



router.use(authController.protect);


router

    .route('/me')

    .get(userController.getMe , userController.getUser)


router

    .route('/updateMe')

    .patch(userController.updateMe)


router

    .route('/updatePassword')

    .patch(authController.updatePassword)


router

    .route('/deleteMe')

    .delete(userController.deleteMe)
    

router.use(authController.restrictTo('admin'));


router
    .route('/')

    .get(userController.getAllUsers)

    .post(userController.createUser)


router

    .route('/:id')

    .patch(userController.updateUser)

    .get(userController.getUser)

    .delete(userController.deleteUser)



    //exporting the router

    module.exports = router;