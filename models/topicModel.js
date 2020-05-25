const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({


    name:

    {
        type : String,

        required : [true , 'Every Topic Must Have A Name']
    },

    subject:

    {
        type : mongoose.Schema.ObjectId,

        ref : 'Subject',

        required: [true , 'Every Topic Must Belong To A Subject']
    },

    photo:

    {
        type : String,

        default : 'topic.jpeg'

    },

    description:

    {
        type : String,

    },

})

topicSchema.virtual('subTopics' , 

{

    ref : 'SubTopic',

    foreignField : 'topic',

    localField : '_id'


})


const Topic = mongoose.model('Topic' , topicSchema);

module.exports = Topic;