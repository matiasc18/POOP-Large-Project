# CURRENTLY!!!!!
 - The main branch as of 11/30/21 @ 6:00pm is the most up-to-date branch, including the entire starting template modified to work with
   strength and cardio exercises (as opposed to just cards from the template,) this version has add, search, login, and register endpoints
   complete, as well as the template for the MongoDB schema (models folder).

# LargePoopProject

 - This is the Cards template that Leinecker gave us instructions for in the MERN-A,B,C files.
 - You are able to log in, search for cards, and add cards (per each user.)

## Installing dependencies

 - This is missing the node_modules folder, since it was in the .gitignore (really big folders), when running it on your own pc
   make sure to install the dependencies with 'npm install' in both the root directory and the /frontend directory. There are 
   vulnerabilities when doing this, but the program works as intended.

## Getting it running locally

 - This is made to work locally, run npm start from the root directory first, and then again from the frontend directory to get 
   fully running.
 - This is also missing the .env file in the cards directory, which are the environmental variables both for connecting to MongoDB
   and for using json web tokens.
 - If you're gonna test this locally on your pc, make sure to add a .env file to the root directory with 2 variables: MONGODB_URI and 
   ACCESS_TOKEN_SECRET. 
    - MONGODB_URI should be set to your MongoDB connection string, which you 
      get when creating a cluster with MongoDB and clicking the "connect" option. 
    - ACCESS_TOKEN_SECRET can be set to whatever you wish, it's for creating 
      and decoding jwt tokens.

## Getting it running on Heroku

 - If you want to test it on Heroku, in the 'Path.js' file, set 'const app_name' equal to the name of your Heroku app. 
 - Add the .env variables into Heroku as explained in MERN-B, and follow the instructions on MERN-B for deploying on Heroku.
 - Finally, to run on Heroku you must modify 'package.json' in the root directory as explained on page 2 of MERN-B.


This might be really confusing so if you have any questions just ask me in the Discord and I'll try to help.
