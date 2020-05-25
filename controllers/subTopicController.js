const SubTopic = require('./../models/subTopicModel');

const factory = require('./../controllers/factoryHandler');

const multer = require('multer');

const sharp = require('sharp');

//end of modules import

//setting the ID's

exports.setTopicIds = (req , res , next) =>


{
    if(!req.body.topic) req.body.topic = req.params.topicId;

    next();

}

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req , file , cb) =>

// {
//     if(file.mimetype.startsWith('image'))

//     {
//         cb(null , true)
//     }

//     else

//     {
//         cb(new AppError('Not An Image ! Please Upload Only Images' , 400) , false);
//     }
// }

// const upload = multer({ 

//     storage : multerStorage,

//     fileFilter: multerFilter

// });

// exports.resizeUserPhoto = catchAsync(async (req , res , next) =>

// {
//     if (!req.file)

//     {
//         return next();
//     }

//     req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

//     await sharp(req.file.buffer)

//     .resize(500 , 500)

//     .toFile(`public/img/users/${req.file.filename}`)

//     next();
// });

// exports.uploadUserData = upload.single('video');
//using factory functions

exports.getAllSubTopics = factory.getAll(SubTopic);

exports.getSubTopic = factory.getOne(SubTopic , {path : 'topic' , select : 'name'});

exports.createSubTopic =factory.createOne(SubTopic);

exports.updateSubTopic = factory.updateOne(SubTopic);

exports.deleteSubTopic= factory.deleteOne(SubTopic);