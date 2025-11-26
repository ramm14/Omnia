const mongoose = require("mongoose");
const passportLocaleMoongose = require('passport-local-mongoose');
const { Schema } = require("mongoose");


const profilePicSchema = new Schema({
    url: String,
    filename: String
})

const userSchema = new Schema(
    {
        posts: [{
            type: Schema.Types.ObjectId,
            ref: 'Posts'
        }],

        profilePicture: profilePicSchema,

        email: {
            type: String,
            required: true
        },
        bio: {
            type: String
        }
    }
)
userSchema.plugin(passportLocaleMoongose);

userSchema.post('findOneAndDelete', async function (doc) {
    if (doc){
        const { Post } = require("../models/posts");
        await Post.deleteMany({
            _id:{$in: doc.posts}
        })
    }else{
        console.log("No doc");
    }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };