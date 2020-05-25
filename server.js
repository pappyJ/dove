const dotenv = require('dotenv');

dotenv.config({ path : './config.env'});

const app = require(`./app`);

process.on('uncaughtException' , err =>

{

    console.log(err.name , err.message);

    console.log('UNCAUGHT EXECEPTION! Shutting Down!!!')

    process.exit(1);

});

//connecting to the database

const mongoose = require('mongoose');

try

{
    mongoose.connect(process.env.DB_LOCAL, 

    {

        useCreateIndex : true,

        useNewUrlParser : true,

        useUnifiedTopology : true,

        useFindAndModify : false
        
    })

    .then(() =>
    
    {
        console.log('Database Connected Successfully!!!');
    })

}

catch(err)

{
    console.log('Error In Connecting To Database' , err);
}


const port = process.env.PORT || 9000

const server = app.listen(port , () =>

{

    console.log(`Listening To Port ${port}`)

})

//handling unhandled error rejections

process.on('unhandledRejection' , err => {

    console.log(err.name , err.message);

    console.log('UNHANDLED REJECTION! Shutting Down')

    server.close(() => {

        process.exit(1);

    })

})