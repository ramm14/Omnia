const { Post } = require("../models/posts");

const { User } = require("../models/users");

const { connectDB } = require("../utils/dbConnection");

module.exports.showHomePage = async (req , res , next) => {
    const currentDBStatus = res.locals.dbConnected;
    res.locals.dbConnected = await connectDB(currentDBStatus);
        const posts =  await Post.find({}).populate({
            path: "user",
            populate : {
                path: "posts"
            } 
        });
        res.render('home' , { posts })
}



module.exports.makeNewThought = async (req , res , next) => {
    const currentDBStatus = res.locals.dbConnected;
    res.locals.dbConnected = await connectDB(currentDBStatus);
    const user = req.user;
    res.render('new' , { user });
}

module.exports.getNewThoughtData = async (req, res, next ) => {
    const currentDBStatus = res.locals.dbConnected;
    res.locals.dbConnected = await connectDB(currentDBStatus);
    const thoughtData = req.body;
    const owner = await User.findById(req.params.id);
    console.log(owner)
    const now = new Date();
    const trimmedtext = thoughtData.text.trimStart().trimEnd();
    if(trimmedtext.length < 4){
        req.flash('error' , 'Thought cannot be less than 4 characters long.');
        return res.redirect('/newthought');
    }
    thoughtData.dateCreated = now.toLocaleDateString() + " ~ " + now.toLocaleTimeString( { hour: "2-digit", minute: "2-digit" });
    thoughtData.user = owner.id;
    thoughtData.text = trimmedtext;
    console.log(thoughtData);
    await Post.insertOne(thoughtData).then(async (data) =>{
        await owner.posts.push(data.id);
        await owner.save();
        console.log(data);
    });
    res.redirect('/thoughts');
}

module.exports.deleteThought = async (req , res) => {
    const currentDBStatus = res.locals.dbConnected;
    res.locals.dbConnected = await connectDB(currentDBStatus);
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/thoughts');
}