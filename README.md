# Omnia
Omnia is a blog and social media site where people archive their favourite movies & tv shows and communicate with likeminded individuals.

## Tech Stack
Backend : NodeJS , ExpressJS & PassportJS \
Database : MongoDB (Moongoose) \
File Storage : Cloudinary \
Frontend: Bootstrap , HTML , CSS \
Templating : EJS \
API Integration : OmdAPI

## Functionality
Create , read , edit & delete Posts and User profiles .

Upload and change profile pictures with Cloudinary.

User Authentication and Authorization using PassportJS.

Search for Movies & TV Shows using OmdAPI.

## Prerequisites
Before running this project, ensure you have the following installed and configured:

* Node.js (v18 or higher recommended)

* npm or yarn package manager

* MongoDB installed and running locally

* Download and install from MongoDB Community Server

* Ensure the MongoDB service is running (mongod) before starting the app

 Accounts and API keys for the following services:

* Cloudinary - https://cloudinary.com/documentation/image_upload_api_reference

* OmdbAPI -  http://www.omdbapi.com/

## Environment Variables
Create a .env file in the project root with the following keys:

MONGO_URI=mongodb://localhost:27017/mydatabase\
CLOUDINARY_APIKEY=YOUR_APIKEY\
CLOUDINARY_SECRETKEY=YOUR_SECRETKEY\
CLOUDINARY_NAME=YOUR_CLOUDNAME\
OMDB_API_KEY=YOUR_OMDB_APIKEY

## Installation 
### Clone the repository
* git clone https://github.com/ramm14/Omnia.git
* cd project

### Install dependencies
* npm install

### Start MongoDB locally
* mongod
* Ensure MongoDB is running before starting the app.

### Run the application
* Integrate personal API Keys & URIs into the project
* nodemon app.js





