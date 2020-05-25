const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({


name:

{
    type : String,

    unique : true,

    required : [true , 'Every Subject Must Have A Name']
},

// topics:

//     {
//         type: mongoose.Schema.ObjectId,

//         ref: 'Topic'
//     },

    photo:

    {
        type : String,

        default: 'course.jpeg'
    }


},

{

    toJSON : { virtuals : true},

    toObject : { virtuals : true}

})

subjectSchema.virtual('topics' , {

    ref : 'Topic',

    foreignField : 'subject',

    localField : '_id'


})



//creating a model out of the subjectschema

const Subject = mongoose.model('Subject' , subjectSchema);

//exporting the subject model

module.exports = Subject;