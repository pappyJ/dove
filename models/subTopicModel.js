const mongoose = require('mongoose');

const subTopicScema = new mongoose.Schema({


    name:
    
    {
        type : String,

        unique : true,

        required: [true , 'Every Sub Topic Must Have A Name']
    },

    video:

    {
        type : String,

        required : [true , 'Every SubTopic Must Have A Video'],

    },

    description:

    {
        type : String,

    },


    topic: 
    
    {
        type : mongoose.Schema.ObjectId,

        ref: 'Topic',

        required : [true , 'Every SubTopic Must Have A Topic']
    },

    createdAt:

    {
        type : Date,

        default: Date.now
    }

},

{
    toJSON : { virtuals : true},

    toObject : { virtuals : true}
})

const SubTopic = mongoose.model('SubTopic' , subTopicScema);

module.exports = SubTopic;