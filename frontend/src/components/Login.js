import React, { useState } from 'react';
import axios from 'axios';

function Login()
{
    var bp = require('./Path.js');
    var storage = require('../tokenStorage.js');

    var loginName;
    var loginPassword;

    const [message,setMessage] = useState('');

    const doLogin = async event => 
    {
        event.preventDefault();

        var obj = {login:loginName.value,password:loginPassword.value};
        var js = JSON.stringify(obj);

        var config = 
        {
            method: 'post',
            url: bp.buildPath('api/login'),
            headers: 
            {
                'Content-Type': 'application/json'
            },
            data: js
        };

        axios(config)
            .then(function (response) 
        {
            var res = response.data;

            // If login was successful, log the user in
            setMessage('Successfully logged in');
            storage.storeToken(res.jwtToken);
            var jwt = require('jsonwebtoken');

            var ud = jwt.decode(storage.retrieveToken(),{complete:true});
            var userId = ud.payload.userId;
            var firstName = ud.payload.firstName;
            var lastName = ud.payload.lastName;
                
            var user = {firstName:firstName,lastName:lastName,userId:userId}
            localStorage.setItem('user_data', JSON.stringify(user));
            window.location.href = '/cards';

        })
        .catch(function (error) 
        {
            // If there was an error in logging in, show the user the error
            if (error.response)
            {
                setMessage('Error: ' + error.response.data.error);
            }
        });
    }

    return(
			<form>
        <label for="userName" class="form-label"></label>
        <div class="input-group mb-1">
          <span class="input-group-text p-2">
            <i class="bi bi-person-badge-fill"></i>
          </span>
          <input type="text" id="loginName" class="form-control" placeholder="Username" ref={(c) => 
            loginName = c}/>
        </div>

        <label for="password" class="form-label"></label>
        <div class="input-group mb-4">
          <span class="input-group-text p-2">
            <i class="bi bi-lock-fill"></i>
          </span>
          <input type="password" id="loginPassword" class="form-control" placeholder="Password" ref={(c) => 
            loginPassword = c} />
          <span class="input-group-text">
            <span class="tt" data-bs-placement="bottom" title="Enter an email address we can reply to.">
              <i class="bi bi-question-circle text-muted"></i>
            </span>
          </span>
        </div>
        <div class="text-center">
          <div class="d-grid mb-2">
            <span class="text-danger" id="loginResult">{message}</span>
				      <a onClick={doLogin} class="btn btn-success rounded-pill mt-3 btn-login text-uppercase fw-bold">Login</a>
          </div>
        </div>
			</form>
    );
};

export default Login;

