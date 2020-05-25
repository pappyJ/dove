const Subject = require('./../models/subjectModel');

const factory = require('./../controllers/factoryHandler');

//end of modules import

//setting the ID's

exports.setTourIds = (req , res , next) =>


{
    if(!req.body.tour) req.body.tour = req.params.tourId;

    if(!req.body.user) req.body.user = req.user._id;

    next();

}


//using factory functions

exports.getAllSubjects = factory.getAll(Subject);

exports.getSubject = factory.getOne(Subject , {path : 'topics' , select : 'name -subject -_id'});

exports.createSubject =factory.createOne(Subject);

exports.updateSubject = factory.updateOne(Subject);

exports.deleteSubject= factory.deleteOne(Subject);