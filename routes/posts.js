
const posts = require("../controllers/posts");

const express = require('express');

const router = express.Router({ mergeParams: true });

const {  joiPostSchema } = require("../utils/joiSchemas");

const catchErrors = require("../utils/catchErrors");

const checkIsLoggedIn = (req , res , next) => {
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error' , 'Login Required.');
        return res.redirect("/login");
    }
    next();

}

const ExpressError = require("../utils/ExpressError");

const checkPostSchema = (req, res, next) =>{
    const { error } = joiPostSchema.validate(req.body);
    if (error){
        const message = error.details.map(e => e.message).join(",");
        throw new ExpressError(message, 400);
    }
    else{
        next();
    }
}

router.get('/thoughts' , catchErrors(posts.showHomePage));

router.get('/newthought' , checkIsLoggedIn ,catchErrors(posts.makeNewThought));

router.post('/:id/newthought', checkPostSchema, checkIsLoggedIn ,catchErrors(posts.getNewThoughtData));

router.delete('/:id/removethought', checkIsLoggedIn ,catchErrors(posts.deleteThought));



module.exports = router;