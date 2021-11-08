import React, { useState } from 'react';
import axios from 'axios'

function CardUI()
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
    const [cardList,setCardList] = useState('');

    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud.userId;


    var storage = require('../tokenStorage.js');
    const jwt = require("jsonwebtoken");

    const addExercise = async event => 
    {
        event.preventDefault();

        var tok = storage.retrieveToken();
        var obj = {userId:userId,exerciseName:exerciseName.value,exerciseType:exerciseType.value,
                    lowerRepRange:lowerRepRange.value,upperRepRange:upperRepRange.value,
                    strengthWeight:strengthWeight.value,cardioTime:cardioTime.value,jwtToken:tok};
        var js = JSON.stringify(obj);

        try
        {
            var bp = require('./Path.js');

            const response = await fetch(bp.buildPath('api/addexercise'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var txt = await response.text();
            var res = JSON.parse(txt);

            if( res.error.length > 0 )
            {
                setMessage( "API Error:" + res.error );
            }
            else
            {
                setMessage('Exercise has been added');
            }
        }
        catch(e)
        {
            setMessage(e.toString());
        }
    };

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

            const response = await fetch(bp.buildPath('api/searchcards'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var txt = await response.text();
            var res = JSON.parse(txt);
            var _results = res.results;
            var resultText = '';
            for( var i=0; i<_results.length; i++ )
            {
                resultText += _results[i];
                if( i < _results.length - 1 )
                {
                    resultText += ', ';
                }
            }
            setResults('Exercise(s) have been retrieved');
            setCardList(resultText);
        }
        catch(e)
        {
            alert(e.toString());
            setResults(e.toString());
        }
    };
    
    return(
      <div id="cardUIDiv">
        <br />
        <input type="text" id="searchText" placeholder="Card To Search For" 
          ref={(c) => search = c} />
        <button type="button" id="searchExerciseButton" className="buttons" 
          onClick={searchExercise}> Search Exercise(s)</button><br />
        <span id="cardSearchResult">{searchResults}</span>
        <p id="cardList">{cardList}</p><br /><br />
        <input type="text" id="exerciseText" placeholder="Exercise to Add" 
          ref={(c) => exerciseName = c} />
        <input type="text" id="exerciseType" placeholder="Exercise Type" 
          ref={(c) => exerciseType = c} />
        <input type="text" id="lowerRepRange" placeholder="Lower Rep Range (If strength)" 
          ref={(c) => lowerRepRange = c} />
        <input type="text" id="upperRepRange" placeholder="Upper Rep Range (If strength)" 
          ref={(c) => upperRepRange = c} />
        <input type="text" id="strengthWeight" placeholder="Weight to Add" 
          ref={(c) => strengthWeight = c} />
        <input type="text" id="cardioTime" placeholder="Cardio Time" 
          ref={(c) => cardioTime = c} />
        <button type="button" id="addExerciseButton" className="buttons" 
          onClick={addExercise}> Add Exercise </button><br />
        <span id="cardAddResult">{message}</span>
      </div>
    );
};

export default CardUI;
