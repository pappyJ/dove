const express = require('express');

const subTopicController = require('./../controllers/subTopicController');

const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams : true });


router

    .route('/')

    .get(subTopicController.getAllSubTopics)

    .post(

        authController.protect,

        subTopicController.setTopicIds
        
        // , authController.restrictTo('admin')  

        // , subTopicController.uploadUserData
        
        , subTopicController.createSubTopic)

router
    .route('/:id')
    
    .get(

        subTopicController.setTopicIds,
        
        subTopicController.getSubTopic
        
        )

    .patch(authController.protect 
        
    , authController.restrictTo('admin')  

    // , subTopicController.uploadUserData

    // , subTopicController.updateSubTopic
    
    , subTopicController.updateSubTopic)

    .delete(subTopicController.deleteSubTopic)


module.exports = router;