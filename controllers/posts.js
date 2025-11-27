const { Post } = require("../models/posts");

const { User } = require("../models/users");

const { connectDB } = require("../utils/dbConnection");

module.exports.showHomePage = async (req , res , next) => {
        const posts =  await Post.find({}).populate({
            path: "user",
            populate : {
                path: "posts"
            } 
        });
        res.render('home' , { posts })
}



module.exports.makeNewThought = async (req , res , next) => {
    const currentDBStatus = req.locals.dbConnected;
    req.locals.dbConnected = await connectDB(currentDBStatus);
    const dbStatus = req.app.locals.dbConnected;
    const user = req.user;
    res.render('new' , { user });
}

module.exports.getNewThoughtData = async (req, res, next ) => {
    const currentDBStatus = req.locals.dbConnected;
    req.locals.dbConnected = await connectDB(currentDBStatus);
    const thoughtData = req.body;
    const owner = await User.findById(req.params.id);
    console.log(owner)
    const now = new Date();
    const trimmedtext = thoughtData.text.trimStart().trimEnd();
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
    const currentDBStatus = req.locals.dbConnected;
    req.locals.dbConnected = await connectDB(currentDBStatus);
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/thoughts');
}