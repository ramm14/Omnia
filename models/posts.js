const mongoose = require("mongoose");
const { Schema } = require("mongoose");




const postSchema = new Schema(
    {
        dateCreated: {
            type: String,
            required: true
        },

        text: {
            type: String,
            maxlength: 240
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true ,  
            ref: 'User'
        }
    }
)

postSchema.post('findOneAndDelete' , async function (doc) {
    if (doc){
        const { User } = require("../models/users");
        console.log(User);
        // console.log(doc.user);
        // console.log(doc.id);
        await User.findByIdAndUpdate(doc.user, {
            $pull: {posts: doc.id}
        }).then(() => {console.log("Post Pulled")});
    }else{
        console.log("No doc")
    }
    console.log('Deleted !');
    
});

const Post = mongoose.model('Posts', postSchema);

module.exports = { Post }