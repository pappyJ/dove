const Topic = require('./../models/topicModel');

const factory = require('./../controllers/factoryHandler');

//end of modules import

exports.setTopicIds = (req , res , next) =>


{
    if(!req.body.subject) req.body.subject = req.params.subject;

    next();

}


//using factory functions

exports.getAllTopics = factory.getAll(Topic);

exports.getTopic = factory.getOne(Topic , {path : 'subject' , select : 'name'});

exports.createTopic =factory.createOne(Topic);

exports.updateTopic = factory.updateOne(Topic);

exports.deleteTopic = factory.deleteOne(Topic);