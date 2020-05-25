//declaring the modules

const express = require('express');

const path = require('path');

const morgan = require('morgan');

const AppError = require('./errors/appError');

const globalErrorHandler = require('./errors/errorController');

// const rateLimit = require('express-rate-limit');

const helmet = require('helmet');

const xss = require('xss-clean');

const hpp = require('hpp');

const mongoSanitize = require('express-mongo-sanitize');

const app = express();

//additional auths

app.use(xss());

app.use(mongoSanitize());

app.use(helmet());

app.use(hpp({

    whitelist: ['subject' , 'topic']

}))

//using the body parsers

app.use(express.json( { limit : '10kb'}));


if(process.env.NODE_ENV === 'development')

{
    app.use(morgan('dev'))
}

//initiating the view engines

app.set('view engine' , 'pug');

app.set('views' , path.join(__dirname , 'views'))

//the routers

const userRouter = require('./routes/userRoutes');

const subjectRouter = require('./routes/subjectRoutes');

const topicRouter = require('./routes/topicRoutes');

const subTopicRouter = require('./routes/subTopicRoutes');


//the routes

app.use('/api/v1/users' , userRouter);

app.use('/api/v1/courses' , subjectRouter);

app.use('/api/v1/topics' , topicRouter);

app.use('/api/v1/subtopics' , subTopicRouter);

//catching all invalid routes

app.all('*' , (req , res , next) =>

{

    next(new AppError(`No Route With the name ${req.originalUrl} Found On Our Server` , 404));

})

//catching all the errors using the global error handlers

app.use(globalErrorHandler);


// exorting the app variable

module.exports = app;