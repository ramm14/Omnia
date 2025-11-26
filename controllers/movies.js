const axios = require("axios");


module.exports.findMedia = async (req, res) => {
    console.log(req.body);
    const movieToSearch = req.body.movieName;
    const response = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&`,{params:{t:movieToSearch}});
    const movieData = response.data
    res.render("movieResults", { movieData })
}

module.exports.getMovieSearchPage = async (req ,res) =>{
    res.render("movieSearch");
}