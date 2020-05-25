const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

const crypto = require('crypto');

const slugify = require('slugify');

const userSchema = new mongoose.Schema({


    name:

    {
        type : String,
        
        required: [true , 'Every User Must Have A Name']
    },

    email:

    {
        type : String,

        unique : true,

        lowercase : true,

        validate : [validator.isEmail , 'Please Input A Valid Email'],

        required : [true , 'Every User Must Have An Email']
    },

    slug : String,

    password:

    {
        type : String,

        required : [true , 'Please Provide Your Password'],

        minlength: [8 , 'Passwords Must Be Greter Or Equal To Eight Characters'],

        select : false
    },

    passwordConfirm :

    {
        type : String,

        required : [true , 'Please Confirm Your Password'],

        validate: 

        {
            validator : 
            
            function(el) 

            {
                return this.password === el
            },

            message : 'Passwords Dont Match'
        },

    },

    gender:

    {
        type : String,

        lowercase : true,

        required : [true , 'Every User Must Have A Gender'],

        enum:

        {
            values : ['male' , 'female' , 'other'],

            message: 'Gender Must Be Male , Female Or Other'
        }
    },

    isActivated: 

    {
        type : Boolean,

        default: false
    },

    role:

    {
        type : String,

        default: 'user'
    },

    subscription:

    {
        type : Number,

        default : 0
    },

    passwordChangedAt:

    {
        type : Date
    },

    passwordResetToken: String,

    passwordResetExpires: Date,

    photo:

    {
        type : String,

        default : 'default.jpg'
    },

    limit:

    {
        type: Number,

        default: 0
    },

    limitExpiresIn:

    {
        type: Date,
    }


})

userSchema.pre('save' , function (next)

{
    this.slug = slugify(this.name , { lower : true});

    next();
})

userSchema.pre('save' , async function (next){


    if(!this.isModified('password'))

    {
        return next();
    }

    this.password = await bcrypt.hash(this.password , 12);

    this.passwordConfirm = undefined;

    next();

})

userSchema.pre('save' , function(next)

{
    if(!this.isModified('password') || !this.isNew)

    {
        return next();
    }

    this.passwordChangedAt = Date.now() - 1000;

    next();
}

)


userSchema.pre(/^find/ , function(next) 

{
    this.find({isActivated: {$ne: false}})

    next();
}

)

userSchema.methods.checkLogin = async function()

{

    if(this.limit < 3)

    {
        this.limit = this.limit + 1;

        await this.save({validateBeforeSave: false})

        return this.limit;
    }

    if(this.limitExpiresIn < Date.now())

    {
        this.limit = 0;
        
        this.limitExpiresIn = undefined

        await this.save({validateBeforeSave: false})

        return this;
    }
    

    if(this.limit > 3)

    {
        this.limitExpiresIn = Date.now() + 24 * 60 * 60 * 1000;

        await this.save({validateBeforeSave: false})
        
        return false
    }

}


userSchema.methods.correctPassword = async function(candidatePassword , userPassword)

{
    return await bcrypt.compare(candidatePassword , userPassword);
}

userSchema.methods.passwordChanged = function(JWTTimestamp)

{
    if(this.passwordChangedAt)

    {

        const realtime = parseInt(this.passwordChangedAt.getTime() , 10) / 1000;

        return JWTTimestamp <  realtime;
        
    }

    
    
}

userSchema.methods.createResetToken =  function ()

{
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}

//creating a model out of the userschema

const User = mongoose.model('User' , userSchema);

//exporting the user model

module.exports = User;