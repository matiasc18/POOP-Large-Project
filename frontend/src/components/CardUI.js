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
    const [strengthList,setStrengthList] = useState([]);
    const [cardioList,setCardioList] = useState([]);

    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud.userId;

    var storage = require('../tokenStorage.js');
    const jwt = require("jsonwebtoken");

    async function addExercise() 
    {
        //event.preventDefault();

        var tok = storage.retrieveToken();
        var obj = {userId:userId,exerciseName:exerciseName.value,exerciseType:exerciseType.value,
                    lowerRepRange:lowerRepRange.value,upperRepRange:upperRepRange.value,
                    strengthWeight:strengthWeight.value,cardioTime:cardioTime.value,jwtToken:tok};
        var js = JSON.stringify(obj);

        console.log(js);
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

    async function searchExercise() 
    {
        //event.preventDefault();

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

    async function editExercise(editId) 
    {
      //event.preventDefault();

      //console.log(editId);

      var tok = storage.retrieveToken();
      var obj = {_id:editId,ExerciseName:exerciseName.value,
        LowerRepRange:lowerRepRange.value,UpperRepRange:upperRepRange.value,
        StrengthWeight:strengthWeight.value,CardioTime:cardioTime.value,jwtToken:tok};
      var js = JSON.stringify(obj);

      //console.log(js);

      try
      {
           // New
          var bp = require('./Path.js');

          const response = await fetch(bp.buildPath('api/edit'),
              {method:'PATCH',body:js,headers:{'Content-Type': 'application/json'}});

          var txt = await response.text();
          var res = JSON.parse(txt);
          var _results = res.results;
          
          setResults('Exercise has been edited');
          //setCardList(_results);


      }
      catch(e)
      {
          alert(e.toString());
          setResults(e.toString());
      }
    };

    async function deleteExercise(deleteId) 
    {

        //event.preventDefault();

        //console.log(deleteId);
        
        var tok = storage.retrieveToken();
        var obj = {_id:deleteId,jwtToken:tok};
        var js = JSON.stringify(obj);

        //console.log(js);

        try
        {
            // New
            var bp = require('./Path.js');

            const response = await fetch(bp.buildPath('api/delete/'),
                {method:'DELETE',body:js,headers:{'Content-Type': 'application/json'}});

            var txt = await response.text();
            //console.log(txt);
            //var res = JSON.parse(txt);
            //var _results = res.results;
            
            setResults('Exercise Deleted');
            
            //searchExercise;
            //setCardList(_results);
        }
        catch(e)
        {
            alert(e.toString());
            setResults(e.toString());
        }
        
    };

    function editButtons(_idExerciseType, _idEdit){
      if(_idExerciseType=='cardio'){
        editExercise(_idEdit);
        searchExercise();
        console.log('cardio');
      } else{
        editExercise(_idEdit);
        searchExercise();
        console.log('strength');
      }
    }
    
    /*<button type="button" id="editExerciseButton" class="buttons" 
            onClick={() => {editExercise(c._id);searchExercise();}}> edit</button>*/ 


    return(
      <div class="container" id="searchDiv">
        <div class="row">
          <div class="col-md-3">
          <label for="search" class="form-label"></label>
          <button type="button" id="searchExerciseButton" class="btn btn-success border-5 border-light rounded-pill btn-login text-uppercase fw-bold my-3" 
          onClick={searchExercise}> Search Exercise(s)</button><br />
          <input type="text" id="searchText" class="form-control rounded-pill" placeholder="Card To Search For" 
          ref={(c) => search = c} onChange={searchExercise}/>
        
          </div>
        </div>

        <div class="row justify-content-center">
            <div class="col-sm-12 col-md-12 col-lg-8 mt-3">
              <div class="card mb-5 mt-3 border-5 border-success" style={{borderRadius:20}}>
                <div class="card-header text-center p-3"><text class="display-6 text-center">Exercises</text></div>
                <div class="card-body ">

                  <div class="row">
                    <div class="col-md-6 p-3">
                    <div class="card mb-5 mt-3 bg-danger border-3 border-success">
                      <div class="card-header text-center p-3"><text class="display-6 text-light text-center">Your Strength Exercises</text></div>
                      </div>
                        <div id="strengthList">
                        {
                          strengthList.map(c => 
                            <div key={c._id}>
                              <li class="list-group-item border-3 border-success list-group-horizontal">
                                <div class="card-header text-dark text-center p-3"><text class="display-6 text-center">{c.ExerciseName}</text></div>
                                  <div class="card-body">
                                  <div class="btn-group">
                                    <button type="button" class="btn btn-danger btn-close btn-close-danger dropdown mb-2" data-bs-toggle="dropdown" aria-expanded="false"></button>
                                    <ul class="dropdown-menu border-5 border-dark bg-dark text-light">
                                      <div class="text-center">
                                        <h5 class="text-center text-danger fw-bold"><small>Delete exercise?</small></h5>
                                        <text class="fw-bold"><small>You cannot undo this once its deleted.</small></text><br/>
                                        <button type="button" id="deleteExerciseButton" class="btn-close mt-2 mb-2" aria-label="Close" 
                                          onClick={() => {deleteExercise(c._id);searchExercise();}}></button>
                                      </div>
                                    </ul>
                                  </div>
                                    <ul class="list-group list-group">
                                      <li class="list-group-item list-group-item-danger">
                                        {'Strength Weight: ' + c.StrengthWeight + ' lbs.'}
                                      </li>
                                      <li class="list-group-item list-group-item-success">
                                        {'Lower Rep Range: ' + c.LowerRepRange + ' reps'}
                                      </li>
                                      <li class="list-group-item list-group-item-danger">
                                        {'Upper Rep Range: ' + c.UpperRepRange + ' reps'}
                                      </li>
                                    </ul>
                                  </div>
                                </li>
                            </div>
                         )}
                        </div>
                    </div>
                    <div class="col-md-6 p-3">
                    <div class="card mb-5 mt-3 bg-success border-3 border-danger">
                      <div class="card-header text-center p-3"><text class="display-6 text-light text-center">Your Cardio Exercises</text></div>
                      </div>
                      <ul class="list-group list-group-flush">
                        <div id="cardioList">
                        {
                          cardioList.map(c => 
                            <div key={c._id}>
                              <li class="list-group-item border-3 border-danger list-group-horizontal">
                                <div class="card-header text-center p-3"><text class="display-6 text-center">{c.ExerciseName}</text></div>
                                  <div class="card-body">
                                  <div class="btn-group">
                                    <button type="button" class="btn btn-danger btn-close dropdown mb-2" data-bs-toggle="dropdown" aria-expanded="false"></button>
                                    <ul class="dropdown-menu">
                                      <div class="text-center">
                                        <h5 class="text-center text-danger fw-bold"><small>Delete exercise?</small></h5>
                                        <text class="fw-bold"><small>You cannot undo this once its deleted.</small></text><br/>
                                        <button type="button" id="deleteExerciseButton" class="btn-close mt-2 mb-2" aria-label="Close" 
                                          onClick={() => {deleteExercise(c._id);searchExercise();}}></button>
                                      </div>
                                    </ul>
                                  </div>
                                    <ul class="list-group list-group">
                                      <li class="list-group-item list-group-item-success">
                                        {'Cardio Time: ' + c.CardioTime + ' minutes'}
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
            <div class="col-sm-12 col-md-12 col-lg-4 mt-3">
              <div class="card mb-5 mt-3 border-5 border-success" style={{borderRadius:20}}>
              <div class="card-header text-center p-3"><text class="display-6 text-center">Add New Exercise</text></div>
                <div class="card-body">
                <form>
                <div class="row justify-content-center">
                  <div class="col-md-6">
                      <label for="strengthExerciseType" class="form-label"></label>
                        <div class="input-group mb-1">
                          <span class="input-group-text p-2">
                            <i class="bi bi-person-badge-fill"></i>
                          </span>
                          <select name="exerciseType" id="exerciseType" class="form-control" placeholder="Exercise Type"ref={(c) => exerciseType = c}>
                            <option value="strength">Strength</option>
                            <option value="cardio">Cardio</option>
                          </select>
                        </div>  
                      </div>
                      </div>
                  <div class="row justify-content-center">
                      <div class="col-md-6">
                      <label for="strengthExerciseName" class="form-label"></label>
                        <div class="input-group mb-1">
                          <span class="input-group-text p-2">
                            <i class="bi bi-person-badge-fill"></i>
                          </span>
                          <input type="text" id="strengthExerciseName" class="form-control" placeholder="Exercise Name" ref={(c) => 
                            exerciseName = c}/>
                        </div>  
                      </div>
                      <div class="col-md-6">
                      <label for="strengthWeight" class="form-label"></label>
                        <div class="input-group mb-1">
                          <span class="input-group-text p-2">
                          <i class="bi bi-arrows-expand"></i>
                          </span>
                          <input type="number" id="strengthWeight" class="form-control" placeholder="Weight (lbs.)" ref={(c) => 
                            strengthWeight = c}/>
                        </div>
                      </div>
                    </div>
                    <div class="row justify-content-center">
                      <div class="col-md-6">
                      <label for="lowerRepRange" class="form-label"></label>
                        <div class="input-group mb-1">
                          <span class="input-group-text p-2">
                          <i class="bi bi-caret-down-fill"></i>
                          </span>
                          <input type="number" id="lowerRepRange" class="form-control" placeholder="Min Reps" ref={(c) => 
                            lowerRepRange = c}/>
                        </div>
                      </div>
                      <div class="col-md-6">
                      <label for="upperRepRange" class="form-label"></label>
                        <div class="input-group mb-1">
                          <span class="input-group-text p-2">
                          <i class="bi bi-caret-up-fill"></i>
                          </span>
                          <input type="number" id="upperRepRange" class="form-control" placeholder="Max Reps" ref={(c) => 
                            upperRepRange = c}/>
                        </div>
                      </div>
                    </div>
                    <div class="row justify-content-center">
                      <div class="col-md-6">
                      <label for="cardioTime" class="form-label"></label>
                        <div class="input-group mb-1">
                          <span class="input-group-text p-2">
                          <i class="bi bi-stopwatch-fill"></i>
                          </span>
                          <input type="number" id="cardioTime" class="form-control" placeholder="Cardio Time" ref={(c) => 
                            cardioTime = c}/>
                        </div>
                      </div>
                    </div>
                    <div class="text-center">
                      <div class="d-grid mt-3">
                      <button type="button" id="addExerciseButton" class="btn btn-danger rounded-pill btn-login text-uppercase fw-bold" 
                        onClick={() => {addExercise();searchExercise();}}> Add Exercise </button><br />
                        <span id="loginResult">{message}</span>
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

export default CardUI;

/*
import React, { useState } from 'react';
import axios from 'axios';
import EditCardioModal from '../components/EditCardioModal';
import EditStrengthModal from '../components/EditStrengthModal';

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
    const [cardList,setCardList] = useState([]);

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
            var results = res.results;

            setResults('Exercise(s) have been retrieved');
            setCardList(results);
        }
        catch(e)
        {
            alert(e.toString());
            setResults(e.toString());
        }
    };
    
    /*const displayEditModal = exerciseToEdit => async event =>
    {
      //event.preventDefault();
      return <EditCardioModal/>;
      //if ((exerciseToEdit.ExerciseType).toLowerCase() === 'cardio')
      //{
        //const x = new EditCardioModal(exerciseToEdit);
        //EditCardioModal.render();
      //}
      /*else if ((exerciseToEdit.ExerciseType).toLowerCase() === 'cardio')
      {
        console.log('cardio');
      }
    }

    const editExercise = editId => async event => 
    {
      event.preventDefault();

      //console.log(editId);

      var tok = storage.retrieveToken();
      var obj = {_id:editId,ExerciseName:exerciseName.value,
        LowerRepRange:lowerRepRange.value,UpperRepRange:upperRepRange.value,
        StrengthWeight:strengthWeight.value,CardioTime:cardioTime.value,jwtToken:tok};
      var js = JSON.stringify(obj);

      //console.log(js);

      try
      {
           // New
          var bp = require('./Path.js');

          const response = await fetch(bp.buildPath('api/edit'),
              {method:'PATCH',body:js,headers:{'Content-Type': 'application/json'}});

          var txt = await response.text();
          var res = JSON.parse(txt);
          var _results = res.results;
          
          setResults('Exercise has been edited');
          //setCardList(_results);
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
        <button type="button" id="searchExerciseButton" class="buttons" 
          onClick={searchExercise}> Search Exercise(s)</button><br />
        <span id="cardSearchResult">{searchResults}</span>
          <div id="cardList">
          {
              cardList.map(c => 
                <div key={c.ExerciseName}>
                    {c.ExerciseName}
                    <button type="button" id="editExerciseButton" class="buttons" 
                      >edit</button>  
                </div>
            )}
          </div>
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
        <button type="button" id="addExerciseButton" class="buttons" 
          onClick={addExercise}> Add Exercise </button><br />
        <span id="cardAddResult">{message}</span>
      </div>
    );
};

export default CardUI;*/

/*

  cardList.map(c => 
  <div key={c._id}>{c.ExerciseType}{"   "}{c._id}
  <button type="button" id="editExerciseButton" class="buttons" 
  onClick={editExercise(c)}> edit</button>  
  </div>

  <li class="list-group-item">A second item</li>
  <li class="list-group-item">A third item</li>
  <li class="list-group-item">A fourth item</li>
  <li class="list-group-item">And a fifth one</li>


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
            <div key={c._id}>{c.ExerciseName}</div>
          )}
        </div>
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
        <button type="button" id="addExerciseButton" class="buttons" 
          onClick={addExercise}> Add Exercise </button><br />
        <span id="cardAddResult">{message}</span>
      </div>
*/

/*
<button type="button" id="editExerciseButton" class="buttons" 
              onClick={displayEditModal(c)}> edit</button>
              */
/*
<div id="cardUIDiv">
        <br />
        <input type="text" id="searchText" placeholder="Card To Search For" 
          ref={(c) => search = c} onChange={searchExercise}/>
        <button type="button" id="searchExerciseButton" class="buttons" 
          onClick={searchExercise}> Search Exercise(s)</button><br />
        <span id="cardSearchResult">{searchResults}</span>
        <div id="cardList">
         {
            cardList.map(c => 
            <div key={c._id} >{c.ExerciseName}{"   "}{c._id}{"   "}{c.ExerciseType}
            
            <button type="button" id="editExerciseButton" class="buttons" 
            onClick={() => {editButtons(c.ExerciseType, c._id)}}> edit</button>

            <button type="button" id="deleteExerciseButton" class="buttons" 
            onClick={() => {deleteExercise(c._id);searchExercise();}}> delete</button>
            
            </div>
          )}
        </div><br /><br />
        <input type="text" id="exerciseText" placeholder="Exercise to Add" 
          ref={(c) => exerciseName = c} />
        <label for="exerciseType">Choose Exercise Type:</label>
        <select name="exerciseType" id="exerciseType" ref={(c) => exerciseType = c}>
          <option value="strength">Strength</option>
          <option value="cardio">Cardio</option>
        </select>
        <input type="text" id="lowerRepRange" placeholder="Lower Rep Range (If strength)" 
          ref={(c) => lowerRepRange = c} />
        <input type="text" id="upperRepRange" placeholder="Upper Rep Range (If strength)" 
          ref={(c) => upperRepRange = c} />
        <input type="text" id="strengthWeight" placeholder="Weight to Add" 
          ref={(c) => strengthWeight = c} />
        <input type="text" id="cardioTime" placeholder="Cardio Time" 
          ref={(c) => cardioTime = c} />
        <button type="button" id="addExerciseButton" class="buttons" 
          onClick={() => {addExercise();searchExercise();}}> Add Exercise </button><br />
        <span id="cardAddResult">{message}</span>
      </div>
*/