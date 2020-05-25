const catchAsync = require('./../errors/catchAsync');

const AppError = require('./../errors/appError');

const APIFeatures = require('./../utils/apiFeatures');

//end of importing functions

exports.deleteOne = Model => catchAsync(async (req , res , next) => {


        const doc = await Model.findByIdAndDelete(req.params.id);

        if(!doc)

        {
            return next(new AppError(`No Document With That ID Found` , 404)) ;
        }


        res.status(204).json({


            status: 'success',

            data: null
            
            
        })

});


exports.updateOne = Model =>  catchAsync(async (req , res, next) => {


        const doc = await Model.findByIdAndUpdate(req.params.id , req.body ,
            
        {new: true , runValidators: true})


        if(!doc)

        {
            return next(new AppError(`No Document With That ID Found` , 404)) ;
        }


        res.status(200).json({


            status: 'success',

            data: 

            {
                data : doc
            }

        })

})


exports.createOne = Model =>  catchAsync(async (req , res , next) => {

    

    const doc = await Model.create(req.body);

    res.status(201).json({


        status: 'success',

        data: 

        {
            data: doc
        }

    })



});

exports.getOne = ( Model , populateOptions ) => catchAsync(async (req , res , next) => {

    let query = Model.findById(req.params.id)

    if(populateOptions)

    {
        query = query.populate(populateOptions)
    }


        const doc = await query;


        if(!doc)

        {
            return next(new AppError(`No Document With That ID Found` , 404)) ;
        }

        res.status(200).json({


            status: 'success',

            data:

            {
                data : doc
            }

            
        })

    });


exports.getAll = Model => catchAsync(async (req , res , next) => {

    let filter = {}

    if(req.params.topicId)

    {
        filter = { topic : req.params.topicId }
    }


        const features = new APIFeatures(Model.find( filter ) , req.query)

        .filter()

        .sort()

        .limitFields()

        .Pagination();
        

        const doc = await features.query;

        // const doc = await features.query.explain();

        res.status(200).json({


                status: 'success',

                results: doc.length,

                requestedAt: req.requestTime,

                data:

                {
                    data : doc
                }


        })

    });