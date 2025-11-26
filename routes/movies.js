
const express = require('express');

const { movieSearchSchema } = require("../utils/joiSchemas");

const ExpressError = require("../utils/ExpressError");


const movies = require("../controllers/movies");

const router = express.Router({ mergeParams: true });

const catchErrors = require("../utils/catchErrors");

const checkMovieSearchSchema = (req , res , next) => {
    const { error } = movieSearchSchema.validate(req.body);
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
} // We need this but now currently testing..



router.get("/movies" , catchErrors(movies.getMovieSearchPage));

router.post("/searchMovie", catchErrors(movies.findMedia));


module.exports = router;

