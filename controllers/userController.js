const User = require('./../models/userModel');

const catchAsync = require('./../errors/catchAsync');

const AppError = require('./../errors/appError');

const factory = require('./factoryHandler');


const filterRequest = (obj , ...valid) =>

{
    const newObj = {};

    Object.keys(obj).forEach(el => {


        if(valid.includes(el))
        
        {
            newObj[el] = obj[el]
        }

    })

    return newObj;
}



    exports.createUser = (req , res) => {


        res.status(500).json({

            status: 'error',

            message: 'This Route Is Not Yet Defined Use /SignUp Instead'

        })

    }

    //using the factory functions

    exports.getAllUsers = factory.getAll(User);

    exports.getUser = factory.getOne(User);

    exports.updateUser = factory.updateOne(User);

    exports.deleteUser = factory.deleteOne(User);

    

    exports.updateMe = catchAsync(async (req , res , next) => {



        if(req.body.password || req.body.passwordConfirm)

        {
            return next(new AppError('This Route Is Not For Password Updates . Please Use /updatePassword' , 400));
        }


        const filterdOptions = filterRequest(req.body , 'name' , 'email');

        if(req.file)

        {
            filterdOptions.photo = req.file.filename
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id , filterdOptions , {

            new: true,

            runValidators: true

        })

    
        res.status(200).json({


            status: 'success',

            data:

            {
                user: updatedUser
            }


        })

    })


exports.deleteMe = catchAsync(async (req , res) => {


    await User.findByIdAndUpdate(req.user.id , {active : false})

    res.status(204).json({



        status: 'Success',
        
        data: null

    })
})


exports.getMe = catchAsync(async (req , res , next) => 

{

    req.params.id = req.user.id

    next();
}

)