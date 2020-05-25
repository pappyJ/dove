const AppError = require('./appError');


//handling invalid DB id's
const handleCastErrorDB = err =>

{
    const message = `Invalid ${err.path} : ${err.value}`;
    
    return new AppError(message , 400);
}

const handleDuplicateFieldDB = err =>

{
    const value =  err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

    const message = `Duplicate Field Value: ${value} Please Use Another Value`;

    return new AppError(message , 400);
}

const handleValidationErrorDB = err => 

{
    const value = Object.values(err.errors).map(el => el.message).join('. ');

    const message = `Invalid Input Field. ${value}`;

    return new AppError(message , 400);
}

const handleJWTError = () => new AppError('Invalid Token. Please Log In Again' , 401)

const handleJWTExpiredError = () => new AppError('Your Token Has Expired! PLease Log In Again' , 401)

//handling our errors with a central middleware

 const sendErrorDev = (err , req , res) =>

 {

     if(req.originalUrl.startsWith('/api'))

     {
        return res.status(err.statusCode).json({


             status : err.status,
 
             error: err,
 
             message: err.message,
 
             stack: err.stack
 
 
         });
     }

     return res.status(err.statusCode).render('error' , 
     
     {

         title: 'Something Went Wrong',

         msg: err.message

     })

 }

 const sendErrorProd = (err , req ,  res) =>

 {

     if(req.originalUrl.startsWith('/api'))

     {
         if(err.isOperational)

         {
             return res.status(err.statusCode).json({


                 status : err.status,
     
                 message: err.message,
     
     
             });
         }

         else

         {

             console.error('Error' , err);


             return res.status(500).json({

                 status: 'error',

                 message: 'Something Went Very Wrong'

             })
         }

     }

     if(err.isOperational)

     {
         return res.status(err.statusCode).render('error',
         
         {

             title: 'Something Went Wrong',

             msg: err.message

         })
     }

     else

     {
         return res.status(err.statusCode).render('error' ,
         
         {

             title: 'Something Went Wrong',

             msg: 'Please Try Again Later!!!'

         });
     }

     
 }

 module.exports = (err , req , res , next) => {



     err.statusCode = err.statusCode ||  500;

     err.status = err.status || 'error';

   
     if(process.env.NODE_ENV === 'development')

     {
         sendErrorDev(err , req , res)
     }

     else

     if(process.env.NODE_ENV === 'production')

     {

         let error = {...err};

         error.message = err.message

         if(error.name === 'CastError')

         {
             error = handleCastErrorDB(error);
         }

         if(error.code === 11000)

         {
             error = handleDuplicateFieldDB(error);
         }

         if (error.name === 'ValidationError')

         {
             error = handleValidationErrorDB(error);
         }

         if(error.name === 'JsonWebTokenError')

         {
             error = handleJWTError(error)
         }

         if(error.name === 'TokenExpiredError')

         {
             error = handleJWTExpiredError();
         }

         sendErrorProd(error , req , res)

     }


     next();


 }