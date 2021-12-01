import React, { useState } from 'react';

function SearchCards()
{
    var exerciseName = '';
    var exerciseType = '';
    var lowerRepRange;
    var upperRepRange;
    var strengthWeight;
    var cardioTime;
    var search = '';

    const [message,setMessage] = useState('');
    const [searchResults,setResults] = useState('');
    const [strengthList,setStrengthList] = useState([]);
    const [cardioList,setCardioList] = useState([]);

    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud.userId;

    var storage = require('../tokenStorage.js');
    const jwt = require("jsonwebtoken");

    const searchExercise = async event => 
    {
        event.preventDefault();

        var tok = storage.retrieveToken();
        var obj = {userId:userId,search:search.value,jwtToken:tok};
        var js = JSON.stringify(obj);

        try
        {
             // New
            var bp = require('./Path.js');

            const response = await fetch(bp.buildPath('api/searchspecific'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var txt = await response.text();
            var res = JSON.parse(txt);
            var strengthResults = res.strengthResults;
            var cardioResults = res.cardioResults;
            console.log(strengthResults);
            console.log(cardioResults);

            setResults('Exercise(s) have been retrieved');
            setStrengthList(strengthResults);
            setCardioList(cardioResults);
        }
        catch(e)
        {
            alert(e.toString());
            setResults(e.toString());
        }
    };
    
    return(
      <div class="container" id="searchDiv">
        <div class="row">
          <div class="col-md-3">
          <label for="search" class="form-label"></label>
            <button class="btn btn-dark rounded-pill btn-login text-uppercase fw-bold my-3" id="searchExerciseButton" 
              onClick={searchExercise}> Search Exercise(s)</button><br />
            <div class="input-group mb-1">
              <input type="text" id="search" class="form-control rounded-pill" placeholder="Search" ref={(c) => 
                search = c}/>
            </div>  
          </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-8 mt-3">
              <div class="card mb-5 mt-3 border-5 border-dark">
                <div class="card-header text-center p-3"><text class="display-6 text-center">Exercises</text></div>
                <div class="card-body">

                  <div class="row">
                    <div class="col-md-6 p-3">
                    <div class="card mb-5 mt-3 border-5 border-dark">
                      
                      <div class="card-header text-center p-3"><text class="display-6 text-center">Your Strength Exercises</text></div>
                      </div>

                        <div id="strengthList">
                        {
                          strengthList.map(c => 
                            <div key={c._id}>
                              <li class="list-group-item bg-light list-group-horizontal">
                                <div class="card-header bg-light text-center p-3"><text class="display-6 text-center">{c.ExerciseName}</text></div>
                                  <div class="card-body">
                                    <ul class="list-group list-group">
                                      <li class="list-group-item list-group-item-primary">
                                        {'Strength Weight: ' + c.StrengthWeight}
                                      </li>
                                      <li class="list-group-item list-group-item-primary">
                                        {'Lower Rep Range: ' + c.LowerRepRange}
                                      </li>
                                      <li class="list-group-item list-group-item-primary">
                                        {'Upper Rep Range: ' + c.UpperRepRange}
                                      </li>
                                    </ul>
                                  </div>
                                </li>
                            </div>
                         )}
                        </div>
                    </div>

                    <div class="col-md-6 p-3">
                    <div class="card mb-5 mt-3 border-5 border-dark">

                      <div class="card-header text-center p-3"><text class="display-6 text-center">Your Cardio Exercises</text></div>
                      </div>
                      <ul class="list-group list-group-flush">
                        <div id="cardioList">
                        {
                          cardioList.map(c => 
                            <div key={c._id}>
                              <li class="list-group-item bg-light list-group-horizontal">
                                <div class="card-header bg-light text-center p-3"><text class="display-6 text-center">{c.ExerciseName}</text></div>
                                  <div class="card-body">
                                    <ul class="list-group list-group">
                                      <li class="list-group-item list-group-item-primary">
                                        {'Cardio Time: ' + c.CardioTime}
                                      </li>
                                    </ul>
                                  </div>
                                </li>
                            </div>
                         )}
                        </div>
                      </ul>
                    </div>

                </div>

                </div>

              </div>
            </div>

            <div class="col-4 mt-3">
              <div class="card mb-5 mt-3 border-5 border-dark">
              <div class="card-header text-center p-3"><text class="display-6 text-center">Add New Exercise</text></div>
                <div class="card-body">
                  <form>
                    <label for="userName" class="form-label"></label>
                    <div class="input-group mb-1">
                      <span class="input-group-text p-2">
                        <i class="bi bi-person-badge-fill"></i>
                      </span>
                      <input type="text" id="loginName" class="form-control" placeholder="Upper Rep Range" ref={(c) => 
                        upperRepRange = c}/>
                    </div>

                    <label for="password" class="form-label"></label>
                    <div class="input-group mb-4">
                      <span class="input-group-text p-2">
                        <i class="bi bi-lock-fill"></i>
                      </span>
                      <input type="password" id="loginPassword" class="form-control" placeholder="Lower Rep Range" ref={(c) => 
                        lowerRepRange = c} />
                    </div>
                    <div class="text-center">
                      <div class="d-grid mb-2">
                        <span id="loginResult">{message}</span>
                          <a class="btn btn-primary rounded-pill btn-login text-uppercase fw-bold">Login</a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>          

         </div>
      </div>
    );
};

export default SearchCards;

/*
<div id="cardUIDiv">
        <br />
        <input type="text" id="searchText" placeholder="Card To Search For" 
          ref={(c) => search = c} />
        <button type="button" id="searchExerciseButton" class="buttons" 
          onClick={searchExercise}> Search Exercise(s)</button><br />
        <span id="cardSearchResult">{searchResults}</span>
        <div id="cardList">
         {
            cardList.map(c => 
              <div key={c._id}>{c.ExerciseType}{"   "}{c._id}
              <button type="button" id="editExerciseButton" class="buttons" 
              onClick={editExercise(c)}> edit</button>
              </div>
          )}
        </div>
      </div>
      */