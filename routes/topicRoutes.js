const express = require('express');

const router = express.Router();

const topicController = require('../controllers/topicController');

const authController = require('../controllers/authController');

const subTopicRouter = require('./../routes/subTopicRoutes');

//end of module import

router.use('/:topicId/subtopics' , subTopicRouter);

router.use(authController.protect)

router

    .route('/')

    .get(topicController.getAllTopics)

    .post(

        authController.restrictTo('admin') , 
        
        topicController.setTopicIds , 
        
        topicController.createTopic
        
        )


router

    .route('/:id')

    .get(topicController.getTopic)

    .delete(authController.restrictTo('admin') , topicController.deleteTopic)

    .patch(authController.restrictTo('admin') , topicController.updateTopic);

module.exports = router;