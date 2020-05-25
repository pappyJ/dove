const express = require('express');

const subjectController = require('./../controllers/subjectController');

const authController = require('./../controllers/authController');

const router = express.Router();

router

    .route('/')

    .get(subjectController.getAllSubjects)

    .post(subjectController.createSubject)

router
    .route('/:id')
    
    .get(subjectController.getSubject)

    .patch(authController.protect 
        
    , authController.restrictTo('admin')  

    // , tourController.uploadTourImages

    // , tourController.resizeTourImages
    
    , subjectController.updateSubject)

    .delete(subjectController.deleteSubject)


module.exports = router;