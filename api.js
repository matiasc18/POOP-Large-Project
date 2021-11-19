//load user model
const User = require("./models/user.js");
//load card model
const StrengthExercise = require("./models/strengthExercise.js"); 
const CardioExercise = require("./models/cardioExercise.js");

var token = require('./createJWT.js');

exports.setApp = function ( app, client )
{

    //////////////////////////////////////////////////////
    //                     USERS                        //
    //////////////////////////////////////////////////////

    app.post('/api/login', async (req, res, next) => 
    {
      // incoming: login, password
      // outgoing: userId, firstName, lastName, email, error

      var error = '';

      console.log("Login request recieved");
      console.log(req.body);

      const { login, password } = req.body;

      const results = await User.find({ Login: login, Password: password });

      var id = -1;
      var fn = '';
      var ln = '';
      var em = '';

      var ret;

      if( results.length > 0 )
      {
        id = results[0]._id;
        fn = results[0].FirstName;
        ln = results[0].LastName;
        em = results[0].Email;

        try
        {
          const token = require("./createJWT.js");
          ret = token.createToken( fn, ln, id, em );
          console.log("Creating token");
        }
        catch(e)
        {
          ret = {error:e.message};
        }
      }
      else
      {
          ret = {error:"Login/Password incorrect"};
      }

      res.status(200).json(ret);
    });

    app.post('/api/register', async (req, res, next) => 
    {
      // incoming: firstName, lastName, email, login, password
      // outgoing: id, firstName, lastName, email, error
      
      var error = '';

      const { firstName, lastName, email, login, password } = req.body;

      // Create new user with all inputted information
      // userId is based off of mongodb ObjectID
      const newUser = new User({FirstName:firstName, LastName:lastName, Email: email, Login:login, Password:password});

      // Search if user already exists
      const results = await User.findOne({Login:newUser.Login});

      var id = newUser._id;
      var fn = newUser.FirstName;
      var ln = newUser.LastName;
      var em = newUser.Email;

      var ret;

      // If the user does not already exist, save it into users document (mongodb)
      if( results == null )
      {
        try
        {
          newUser.save();
          const token = require("./createJWT.js");
          ret = token.createToken( fn, ln, id, em );
        }
        catch(e)
        {
          ret = {error:e.message};
        }
      }
      else
      {
          ret = {error:"Login already exists"};
      }

      res.status(200).json(ret);
    });

    //////////////////////////////////////////////////////
    //                     CARDS                        //
    //////////////////////////////////////////////////////

    app.post('/api/addexercise', async (req, res, next) =>
    {
      // incoming: userId, exerciseName, exerciseType, lowerRepRange,
      //           upperRepRange, strengthWeight, cardioTime, jwtToken
      // outgoing: error
      
      const { userId, exerciseName, exerciseType, lowerRepRange, upperRepRange, strengthWeight, cardioTime, jwtToken } = req.body;

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

    app.post('/api/searchcards', async (req, res, next) => 
    {
      // incoming: userId, search, jwtToken
      // outgoing: results[], error    

      var token = require('./createJWT.js');
      var error = '';

      const { userId, search, jwtToken } = req.body;

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
        _ret.push( strengthResults[i].ExerciseName );
      }
      for( var i=0; i<cardioResults.length; i++ )
      {
        _ret.push( cardioResults[i].ExerciseName );
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

      var ret = { results:_ret, error: error, jwtToken: refreshedToken };

      res.status(200).json(ret);
    });
}