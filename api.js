//load user model
const User = require("./models/user.js");
//load card model
const StrengthExercise = require("./models/strengthExercise.js"); 
const CardioExercise = require("./models/cardioExercise.js");
const bcrypt = require("bcrypt");         // password hashing
const sgMail = require('@sendgrid/mail'); // email verification / password reset
const jwt = require("jsonwebtoken");
require("dotenv").config();

const token = require('./createJWT.js');
const { findById, findByIdAndDelete} = require("./models/user.js");

exports.setApp = function ( app, client )
{

    // USERS
    app.post('/api/login', async (req, res, next) => 
    {
      // incoming: login, password
      // outgoing: error, jwtToken

      const { login, password } = req.body;

      const results = await User.find({ Login: login, Password: password });

      var id = -1;
      var fn = '';
      var ln = '';
      var em = '';

      var ret;

      try
      {
        // Checks if user exists
        if (results.length > 0)
        {
          // Checks if user is verified
          if (results[0].IsVerified)
          {
            // Checks if user input is correct hashed password
            if (await bcrypt.compare(password, results[0].Password))
            {
              id = results[0]._id;
              fn = results[0].FirstName;
              ln = results[0].LastName;
              em = results[0].Email;

              // If user passes all checks, create token and return it
              try
              {
                const jwtToken = token.createToken( fn, ln, id, em );
                ret = {error:"", jwtToken};
                res.status(200).send(ret);
              }
              catch(e)
              {
                ret = {error:e.message, jwtToken: ''};
                res.send(ret);
              }

            }
            else
            {
                ret = {error:"Login/Password incorrect.", jwtToken: ''};
                res.status(401).send(ret);
            }
          }
          else
          {
            ret = {error:"Please check your email for verification.", jwtToken: ''};
            res.status(403).send(ret);
          }
        }
        else
        {
          ret = {error:"There is no account associated with this username.", jwtToken: ''};
          res.status(404).send(ret);
        }
      }
      catch(e)
      {
        ret = {error:e.message, jwtToken: ''};
        res.send(ret);
      }

    });

    app.post('/api/register', async (req, res, next) =>
    {
      // incoming: firstName, lastName, email, login, password
      // outgoing: error

      // Sendgrid key for sending emails to users
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const { firstName, lastName, email, login, password } = req.body;

      // Searches if user already exists with inputed email and username
      const emailResults = await User.find({Email:email});
      const usernameResults = await User.find({Login:login});
      var ret;

      // If inputed email is already in use, send error
      if (emailResults.length > 0)
      {
        ret = {error: 'Email is associated with another user. Please try again with a different email.'};
        return res.status(403).send(ret);
      }

      // If a username already exists, return error
      if (usernameResults.length > 0)
      {
        ret = {error: 'Username is taken, try another.'};
        return res.status(403).send(ret);
      }

      // Create new user
      const newUser = new User({FirstName:firstName, LastName:lastName, Email: email, Login:login, Password:password, IsVerified: false});

      var id = newUser._id;
      var fn = newUser.FirstName;
      var ln = newUser.LastName;
      var em = newUser.Email;

      var jwtToken = '';

      // Save new user into MongoDB
      try
        {
          newUser.save();
          jwtToken = token.createToken( fn, ln, id, em);
        }
        catch(e)
        {
          ret = {error:e.message};
          res.send(ret);
        }

      // Email to be sent to user upon registration
      const message = 
      {
        to: email,
        from: {
          name:  `Poop Large Project`,
          email: `pooplargeproject@gmail.com`,
        },
        subject: `Verify your email`,
        text: `Thank you for signing up. Please verify your email by following the link: ${req.protocol}://${req.headers.host}/verification/?jwtToken=${jwtToken.accessToken}`,
        html: `<h1>Verify your email</h1>
               <p>Thank you for signing up. Please verify your email by following the link:</p>
               <a href="${req.protocol}://${req.headers.host}/api/verification/?jwtToken=${jwtToken.accessToken}">Verify your account</a>`
      };

        // If email successfully sends to user, return empty error
        await sgMail.send(message)
        .then(response => {
          ret = {error: ''};
          res.status(200).send(ret);
        })
        .catch(error => res.send({error:error.message}));
        
    });

    app.get('/api/verification', async (req, res, next) => 
    {
      // incoming: jwtToken (from url, not from the request body)
      // outgoing: nothing 

      // Get jwtToken from the url
      const jwtToken = req.query.jwtToken;
      var ret;

      // Redirect url (homepage)
      const redirect = `${req.protocol}://`+req.headers.host+`/`;

      try{

        // Verify the jwtToken, and then search for user
        const verifiedJwt = jwt.verify( jwtToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(verifiedJwt.userId);
        
        // If user does not exist, log the message and redirect the user
        if (!user)
        {
          ret = {error: 'Trying to verify user that does not exist'};
          console.log(ret);
          return res.status(404).redirect(redirect);
        }
        
        user.IsVerified = true;
        
        // If user is successfully verified and saved, redirect the user to the homepage
        try
        {
          await user.save();
          console.log('Successfully verified');
          res.status(200).redirect(redirect);
        }
        catch(error)
        {
          ret = {error:error.message};
          console.log(ret);
        }
      }
      catch (error)
      {
        ret = {error:error.message}
        console.log(ret);
      }
    });

    app.post('/api/forgotpassword', async (req, res, next) =>
    {
      // incoming: email
      // outgoing: error, and sends email to user

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const { email } = req.body;
      var ret;

      // If user did not input email
      if (!email)
      {
        ret = {error:'Email is required.'}
        return res.status(400).send(ret);
      }

      try
      {
        // Find the user associated with the email
        const user = await User.find({ Email:email });

        // If there is no account associated with the email
        if (!user)
        {
          ret = {error:'There is no account associated with this email.'};
          return res.status(404).send(ret);
        }
        
        // If user is found, create a jwtToken with their information
        var id = user[0]._id;
        var fn = user[0].FirstName;
        var ln = user[0].LastName;
        var em = user[0].Email;
        
        // Send email with the emailToken in the url
        var emailToken = token.createToken( fn, ln, id, em);

        // Redirect url
        const url = `http://${req.headers.host}/resetpassword/?emailToken=${emailToken.accessToken}`;

        const message = 
        {
          to: email,
          from: {
            name:  `Poop Large Project`,
            email: `pooplargeproject@gmail.com`,
          },
          subject: `Reset your password`,
          text: `Please click the following link in order to reset your password. ${url}`,
          html: `<h1>Reset your password</h1>
                 <p>Please click the following link in order to reset your password.</p>
                 <a href="${url}">Reset your password</a>`
        };

        // If email successfully sends to user, return empty error
        // Email will contain link to /resetpassword page
        await sgMail.send(message)
        .then(response => {
          ret = {error:""};
          res.status(200).send(ret);
        })  
        .catch(error => res.send({error:error}));

      }
      catch(e)
      {
        ret = {error:e.message};
        res.send(ret);
      }
    });

    app.put('/api/resetpassword', async (req, res, next) =>
    {
      // incoming: emailToken, newPassword
      // outgoing: error

      const { emailToken, newPassword} = req.body;
      var ret;
      
      // If the token is expired
      try
      {
        if (token.isExpired(emailToken))
        {
          ret = {error:"The JWT is no longer valid."};
          res.status(401).send(ret);
        }
      }
      catch(e)
      {
        ret = {error:e.message};
        res.send(ret);
      }

      // Verify the emailToken, and search for the User to be edited
      try{

        const verifiedJwt = jwt.verify( emailToken, process.env.ACCESS_TOKEN_SECRET);
        const userToEdit = await User.findById(verifiedJwt.userId);

        // If user is found, change the password
        if (userToEdit)
        {
          userToEdit.Password = String(await bcrypt.hash(newPassword, 10));
          userToEdit.save(); 
        }
      }
      catch(e)
      {
        ret = {error:e.message};
        res.send(ret);
      }

      var refreshedToken = null;
      try
      {
        refreshedToken = token.refresh(emailToken);
      }
      catch(e)
      {
        ret = {error:e.message};
        console.log(ret);
        res.send(ret);
      }

      ret = {error: ''};

      res.status(200).send(ret);
      
    });

    // EXERCISES    
    app.post('/api/addexercise', async (req, res, next) =>
    {
      // incoming: userId, exerciseName, exerciseType, lowerRepRange,
      //           upperRepRange, strengthWeight, cardioTime, jwtToken
      // outgoing: error, jwtToken
      
      const { userId, exerciseName, exerciseType, lowerRepRange, upperRepRange, strengthWeight, cardioTime, jwtToken } = req.body;
      var ret = '';

      try
      {
        if( token.isExpired(jwtToken))
        {
          var r = {error:'The JWT is no longer valid', jwtToken: ''};
          res.status(200).json(r);
          return;
        }
      }
      catch(e)
      {
        ret = {error:e.message};
        console.log(ret);
        res.send(ret);
      }

        // Create and insert new exercise according to the exercise type (strength or cardio)
        try 
        {
          if (exerciseType.toLowerCase() === "strength")
          {
              // Create new exercise
              const newExercise = new StrengthExercise({UserId: userId, ExerciseName: exerciseName, LowerRepRange: lowerRepRange, 
                                                          UpperRepRange: upperRepRange, StrengthWeight: strengthWeight});
              newExercise.save();
          }
          else if (exerciseType.toLowerCase() === "cardio")
          {
              // Create new exercise
              const newExercise = new CardioExercise({UserId: userId, ExerciseName: exerciseName, CardioTime: cardioTime});
              newExercise.save();
          }
        }
        catch (e) 
        {
          ret = {ret:e.message};
          console.log(ret);
          res.send(ret);
        }

      var refreshedToken = null;
      try
      {
        refreshedToken = token.refresh(jwtToken);
      }
      catch(e)
      {
        ret = {error:e.message};
        console.log(ret);
        res.send(ret);
      }

      var ret = { error: '', jwtToken: refreshedToken };

      res.status(200).send(ret);
    });

    app.post('/api/searchcards', async (req, res, next) => 
    {
      // incoming: userId, search, jwtToken
      // outgoing: results[], error, jwtToken    

      var error = '';

      const { userId, search, jwtToken } = req.body;

      try
      {
        if( token.isExpired(jwtToken))
        {
          var r = {results: '', error:'The JWT is no longer valid', jwtToken: ''};
          res.status(200).json(r);
          return;
        }
      }
      catch(e)
      {
        console.log(e.message);
      } 

      var _search = search.trim();
      var strengthResults, cardioResults;

      // Find all cards with the specified search parameters and by ID      
      // If the search parameter is empty or a string, find based on name
      if (isNaN(_search) || _search === "")
      {
        strengthResults = await StrengthExercise.find({ExerciseName: {$regex: _search + '.*', $options: 'i'}, UserId: userId});
        cardioResults = await CardioExercise.find({ExerciseName: {$regex: _search + '.*', $options: 'i', }, UserId: userId});
      }
      // If the search parameter is a number, find based on the following fields
      else 
      {
        strengthResults = await StrengthExercise.find({$or: [
                                                      {LowerRepRange: _search, UserId: userId},
                                                      {UpperRepRange: _search, UserId: userId},
                                                      {StrengthWeight: _search, UserId: userId}
                                                    ]});
        cardioResults = await CardioExercise.find({CardioTime: _search, UserId: userId});
      }

      // Loop through results from cardio and strength exercises
      var _ret = [];
      for( var i=0; i<strengthResults.length; i++ )
      {
        _ret.push( strengthResults[i] );
      }
      for( var i=0; i<cardioResults.length; i++ )
      {
        _ret.push( cardioResults[i] );
      }

      var refreshedToken = null;
      try
      {
        refreshedToken = token.refresh(jwtToken);
      }
      catch(e)
      {
        console.log(e.message);
      }

      var ret = { results:_ret, error: '', jwtToken: refreshedToken };

      res.status(200).json(ret);
    });

    app.put('/api/edit', async (req, res, next) => 
    {
      // incoming: _id , exerciseName, exerciseType, lowerRepRange,
      //           upperRepRange, strengthWeight, cardioTime, jwtToken
      // outgoing: error
      
      const {_id, exerciseName, exerciseType, lowerRepRange, upperRepRange, strengthWeight, cardioTime, jwtToken } = req.body;

      try
      {
        if( token.isExpired(jwtToken))
        {
          var r = {error:'The JWT is no longer valid', jwtToken: ''};
          res.status(200).json(r);
          return;
        }
      }
      catch(e)
      {
        console.log(e.message);
      }

        var error = '';
        //Edit exerciseName, lowerRepRange, upperRepRange, strengthWeight, cardioTime to the exercise Type (strenght or cardio)
        try
        {
          if (exerciseType.toLowerCase() === "strength")
            {
              // Edit  streght exercise
              await StrengthExercise.findById(_id,(error, StrenghtEdit) =>
              { 
                StrenghtEdit.ExerciseName =  String(exerciseName), StrenghtEdit.LowerRepRange = Number(lowerRepRange), StrenghtEdit.UpperRepRange = Number(upperRepRange), StrenghtEdit.StrengthWeight = Number(strengthWeight)
                StrenghtEdit.save();
              });
            }
            else if (exerciseType.toLowerCase() === "cardio")
            {
              // Edit  cardio exercise
              await CardioExercise.findById(_id,(error, CardioEdit) => 
              { 
                CardioEdit.ExerciseName = String(exerciseName), CardioEdit.CardioTime = Number(cardioTime)     
                CardioEdit.save();
              });  
            }  
        }
        catch (e) 
        {
            error = e.toString();
        }

      var refreshedToken = null;
      try
      {
        refreshedToken = token.refresh(jwtToken);
      }
      catch(e)
      {
        console.log(e.message);
      }

      var ret = { error: error, jwtToken: refreshedToken };

      res.status(200).json(ret);
    });
     
    app.delete('/api/delete/', async (req, res, next) => 
    {
      // incoming: _id, jwtToken
      // outgoing: error
      const {_id, jwtToken } = req.body;
      
      
      try
      {
        if( token.isExpired(jwtToken))
        {
          var r = {error:'The JWT is no longer valid', jwtToken: ''};
          res.status(200).json(r);
          return;
        }
      }
      catch(e)
      {
        console.log(e.message);
      }

        var error = '';
        //DELETE _Id-objectID to the exercise Type (strenght or cardio)
        try
        {
          await StrengthExercise.findByIdAndDelete(_id);
          await CardioExercise.findByIdAndDelete(_id); 
        }
        catch (e) 
        {
            error = e.toString();
        }

      var refreshedToken = null;
      try
      {
        refreshedToken = token.refresh(jwtToken);
      }
      catch(e)
      {
        console.log(e.message);
      }

      var ret = { error: error, jwtToken: refreshedToken };

      res.status(200).json(ret);
    });

}