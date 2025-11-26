if(process.env.NODE_ENV !== "production "){
    require("dotenv").config();
}

const { joiUserSchema , usernameSearchSchema } = require("../utils/joiSchemas");

const catchErrors = require("../utils/catchErrors");

const ExpressError = require("../utils/ExpressError");

const express = require('express');

const multer  = require('multer');

const passport = require("passport");

const users  = require("../controllers/users");

const router = express.Router({ mergeParams: true });

const { cloudinary , storage } = require("../cloudinary");

const upload = multer({ storage });

// const checkUserSchema = (req, res, next) =>{
//     const { error } = joiUserSchema.validate(req.body);
//     if (error){
//         const message = error.details.map(e => e.message).join(",");
//         throw new ExpressError(message, 400);
//     }
//     else{
//         next();
//     }
// }
//  revisit , make sure the schemachecks check the data that will be received from the post request . 
const checkUserSearchSchema = (req, res, next) =>{
    const { error } = usernameSearchSchema.validate(req.body);
    if (error){
        const message = error.details.map(e => e.message).join(",");
        throw new ExpressError(message, 400);
    }
    else{
        next(); 
    }
}


const checkIsLoggedIn = (req , res , next) => {
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error' , 'Login Required.');
        return res.redirect("/login");
    }
    next();

}


router.get("/newUser", catchErrors(users.getSignUpPage));

router.post("/newUser", upload.single('image'), catchErrors(users.addNewUser));  

// checkUserSchema

router.get("/edit/profile", checkIsLoggedIn , catchErrors(users.getEditProfilePage));

router.patch("/edit/profile" ,checkIsLoggedIn , upload.single('profilePic') ,catchErrors(users.updateProfile));

router.get("/profile", checkIsLoggedIn , catchErrors(users.profilePage));

router.get("/login", catchErrors(users.getLoginPage));

router.post("/login" ,passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }) ,catchErrors(users.loginUser));

router.get("/users", checkIsLoggedIn ,catchErrors(users.getAllUsers));

router.post("/searchUser" ,checkIsLoggedIn , catchErrors(users.findSearchUser));

router.get("/logout" , catchErrors(users.logoutUser));

 // Other Individual's Profiles
router.get("/:id/foreign", checkIsLoggedIn ,catchErrors(users.getOtherUserProfile));


router.delete('/:id/profile/delete', checkIsLoggedIn , catchErrors(users.deleteUser));


module.exports = router;