const { User } = require("../models/users");

const { Post } = require("../models/posts");

const { cloudinary } = require("../cloudinary");

const connectDB = require("../utils/dbConnection");

module.exports.getSignUpPage = async  (req , res , next) => {
    res.render('signup');
}

module.exports.addNewUser = async  (req , res , next) => {
    const currentDBStatus = res.locals.dbConnected;
    req.locals.dbConnected = await connectDB(currentDBStatus);
    try{
        const { email, username, password } = req.body;
        const { filename, path } = req.file;
        const user = new User({ email, username, profilePicture:{url:path , filename:filename} });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome !');
            res.redirect('/profile');
        })}
    catch (e){
        req.flash('error' , e.message);
        res.redirect('/newUser');
    }

}

module.exports.getEditProfilePage = async (req , res , next) => {
    const currentDBStatus = res.locals.dbConnected;
    req.locals.dbConnected = await connectDB(currentDBStatus);
    const user = await User.findById(req.user.id);
    res.render("editProfile" , { user } );
}

module.exports.updateProfile = async  (req , res, next) => {
    const currentDBStatus = res.locals.dbConnected;
    req.locals.dbConnected = await connectDB(currentDBStatus);
    const user = await User.findById(req.user.id);
    if (req.file){
        const { filename, path } = req.file;
        user.profilePicture.url = path;
        user.profilePicture.filename = filename;
    }
    user.bio = req.body.bioText;
    await user.save();
    res.redirect("/profile");
}

module.exports.profilePage = async  (req , res ) => {
    const currentDBStatus = res.locals.dbConnected;
    req.locals.dbConnected = await connectDB(currentDBStatus);
    const user = await User.findById(req.user.id).populate({
        path: "posts",
        populate : {
            path: "user"
        }
    }) ;
    res.render('profile', { user });
}

module.exports.getOtherUserProfile = async  (req , res ) => {
    const currentDBStatus = req.locals.dbConnected;
    req.locals.dbConnected = await connectDB(currentDBStatus);
    console.log("here");
    const { id } = req.params;
    console.log(id);
    const user = await User.findById(id).populate({
        path: "posts",
        populate : {
            path: "user"
        }
    });
    res.render('profile' , { user });
}

module.exports.deleteUser =  async  (req , res ) => {
    const currentDBStatus = req.locals.dbConnected;
    req.locals.dbConnected = await connectDB(currentDBStatus);
    if (req.user.id != req.params.id){
        req.flash('error' , 'Please login into your account');
        return res.redirect("/login");
    }
    await User.findByIdAndDelete(req.params.id).then(() => {console.log('Deleted profile !')});
    req.flash("success" , "Account Successfully Deleted !");
    return res.redirect('/register');
}

module.exports.findSearchUser = async (req , res) => {
    const currentDBStatus = req.locals.dbConnected;
    req.locals.dbConnected = await connectDB(currentDBStatus);
    try{
        const { searchedUser } = req.body;
        const user = await User.findOne({username:searchedUser});
        res.redirect(`/${user.id}/foreign`);
    }
    catch(e){
        req.flash('error' , "Could not find user matching username , please try again .");
        res.redirect("/thoughts");
    }

}

module.exports.getLoginPage = async  (req , res) => {
    res.render('loginPage');
}

module.exports.loginUser = async  (req , res ) => {
    req.flash('success', 'Welcome Back');
    // const redirectUrl = req.session.returnTo || '/thoughts';
    delete req.session.returnTo;
    res.redirect('/profile');
}

module.exports.getAllUsers = async (req , res ) => {
    const users = await User.find({});
    res.render('allUsers' , { users });
}


module.exports.logoutUser = async  (req , res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'You have been logged out');
        res.redirect('/thoughts');
        });
}