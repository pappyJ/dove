const jwt = require('jsonwebtoken');

const crypto = require('crypto');

const User = require('./../models/userModel');

const AppError = require('./../errors/appError');

const catchAsync = require('./../errors/catchAsync');

const emailSender = require('./../utils/emailSender');


const { promisify } = require('util');


const createSendToken = (user , statusCode , res) => 

{

    const token = signToken(user._id);

    const cookieOPtions =

    {
        expires: new Date (Date.now() +  process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000), 

        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production')

    {
        cookieOPtions.secure = true;
    }

    res.cookie('jwt' , token , cookieOPtions);


    res.status(statusCode).json({


        status: 'success',

        token,

        data: 

        {
            user
        }


    })
}


const signToken = id =>

{
    return jwt.sign({ id } , process.env.JWT_SECRET , {


        expiresIn: process.env.JWT_EXPIRES_IN

    })
}


exports.signUp = catchAsync(async (req , res , next) => {


    const newUser = await User.create({


        name: req.body.name,

        email: req.body.email,

        password: req.body.password,

        passwordConfirm: req.body.passwordConfirm,

        gender : req.body.gender,

        role: req.body.role,

        photo : req.body.photo,


    });

    createSendToken(newUser , 200 , res);


});


// 1. check if email and password exists

// 2. check if user exists and password is correct

// 3. if everything is ok then send token to client

// 4. check if user change password after token was issued


exports.login = catchAsync(async (req , res , next) => {


    const {email , password} = req.body;

    if(!email || !password)

    {
        return next(new AppError('Invalid Email Or Password' , 401));
    }

    const user = await User.findOne({ email }).select('+password');


    if(!email || !user || !(await user.correctPassword(password , user.password)))

    {
        return next(new AppError('Invalid Email Or Password' , 401));
    }

    if(!(await user.checkLogin()))

    {
        return next(new AppError('Login Chances Exceeded , Try Again In The Next 24 Hours' ,  401))
    }

    // const token = signToken(user._id);
    
    // res.status(200).json({


    //     status: 'success',

    //     token


    // })

    createSendToken(user , 200 , res);

})

exports.logout = async (req , res , next) =>

{
    res.cookie('jwt' , 'loggedout' ,
    
    {

        httpOnly: true,

        expires: new Date( Date.now() + 10 * 1000)

    });

    res.status(200).json({status : 'success'});
}

exports.protect = catchAsync(async (req , res , next) => {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))

    {
        token = req.headers.authorization.split(' ')[1];
    }

    // else

    // if(req.cookies.jwt)

    // {
    //     token = req.cookies.jwt

    // }


    if(!token)

    {
        return next(new AppError('You Are Not Logged In ! Please Log In To Get Access!' , 401))
    }


    //token verification

    const decoded = await promisify(jwt.verify)(token , process.env.JWT_SECRET)


    const currentUser = await User.findById(decoded.id);

    if(!currentUser)

    {
        return next(new AppError('The User Belonging To This Token No Longer Exist!' , 401))
    }

    const passwordCheck = currentUser.passwordChanged(decoded.iat);

    if(passwordCheck)

    {
        return next(new AppError('User Recently Changed Password ! Please Log In Again' , 401))
    }

    req.user = currentUser;

    res.locals.user = currentUser;

    next()

})


exports.restrictTo = (...roles) => 

{

    return (req , res , next) => 

    {
        if(!roles.includes(req.user.role))

        {
            return next(new AppError('You Do Not Have The Permission The Specified Task' , 401));
        }

        next();
    }

}

exports.isLogggedIn = async (req , res , next) =>

{
  try

  {
    let token;

    if(req.cookies.jwt)

    {
        
        token = req.cookies.jwt;

        const decoded = await promisify(jwt.verify)(token , process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id);

        if(!currentUser)

        {
            return next();
        }

        const passwordCheck = currentUser.passwordChanged(decoded.iat);

        if(passwordCheck)

        {
            return next();
        }

        res.locals.user = currentUser;


        return next();

    }

    next();
  }
  
  catch(err)

  {
      return next();
  }
}

exports.forgotPassword = catchAsync(async (req , res , next) => {

    const user = await User.findOne({ email : req.body.email});

    if(!user)

    {
        return next(new AppError('The Specified Email Belongs To No User'));
    }

    const resetToken = user.createResetToken();

    // console.log({resetToken})

    await user.save({validateBeforeSave : false});


    try

    {
        const email = user.email;

        const subject = 'Your Password Reset Token ( Valid For 10 Minutes )';

        const restUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`

        const message = `Forgot Passsword ? Send A PATCH Request With Your New Password And PasswordConfirm
        to ${restUrl}. \nIf You Didn't Forget Your Password, Please Ignore This Email .Pappy J Is Testing Email Seniding With A Real World Mail Server Like Gmail
        `;

        await emailSender({


            email,

            subject,

            message

        });


        res.status(200).json({


            status: 'success',

            message: 'Your Email Has Been Sent'


        })
    }

    catch(err)

    {
        user.passwordResetToken = undefined;

        user.passwordResetExpires = undefined;

        user.save({validateBeforeSave: false});

        console.log(err)

        
        return next(new AppError('There Was An Error Sending The Email , Try Again Later' , 500))
        
    }

})


exports.resetPassword = catchAsync(async (req , res , next) => {


    const userToken = crypto.createHash('sha256')
    
        .update(req.params.token)

        .digest('hex');

    const user = await User.findOne({passwordResetToken: userToken,

        passwordResetExpires: {$gt : Date.now()}
        
    });


    if(!user)

    {
        return next(new AppError('Token Is Invalid Or Has Expired' , 400));
    }
    

    user.password = req.body.password;

    user.passwordConfirm = req.body.passwordConfirm;

    user.passwordResetToken = undefined;

    user.passwordResetExpires = undefined;

    await user.save()

    createSendToken(user , 200 , res);


})

exports.updatePassword = catchAsync(async (req , res , next) => {


    const user = await User.findOne({email : req.user.email}).select('+password');

    // console.log(user)

    if(!user || !(await user.correctPassword(req.body.Oldpassword , user.password)))

    {
        return next(new AppError('Your Current Password Is Wrong' , 401));
    }


    user.password = req.body.password;

    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();

    createSendToken(user , 200 , res);

})