let dbConnected = null;

const mongoose = require("mongoose");

async function connectDB(dbConnected){ 
    if(dbConnected){
        return dbConnected;
    }
    try {
        const db = await mongoose.connect("mongodb+srv://gitHubViewer:github123@omniacluster.kzv6in9.mongodb.net/?appName=OmniaCluster", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to DB!");
        return true;
        }
    catch (e) {
        console.log("Error connecting to DB");
        console.log(e);
        return false;
    }
    
}

module.exports = { connectDB };