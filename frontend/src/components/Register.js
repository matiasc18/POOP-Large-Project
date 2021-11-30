import React, { useState } from 'react';
import axios from 'axios';

function Register()
{
    var bp = require('./Path.js');
    var storage = require('../tokenStorage.js');

    var firstName;
    var lastName;
    var loginName;
    var loginPassword;
    var email;

    const [message,setMessage] = useState('');

    const doRegister = async event => 
    {
        event.preventDefault();

        var obj = {firstName:firstName.value,lastName:lastName.value,email:email.value,login:loginName.value,password:loginPassword.value};
        var js = JSON.stringify(obj);

        var config = 
        {
            method: 'post',
            url: bp.buildPath('api/register'),
            headers: 
            {
                'Content-Type': 'application/json'
            },
            data: js
        };

        axios(config)
            .then(function (response) 
        {
            setMessage('Verification email sent to your account.')
        })
        .catch(function (error) 
        {
            if (error.response)
            {
                setMessage(error.response.status + ' Error: ' + error.response.data.error);
            }
        });
    }

    return(
        <form>
        <div class="row">
          <div class="col-md-6">
          <label for="firstName" class="form-label"></label>
            <div class="input-group mb-1">
              <span class="input-group-text p-2">
                <i class="bi bi-person-badge-fill"></i>
              </span>
              <input type="text" id="firstName" class="form-control" placeholder="First Name" ref={(c) => 
                firstName = c}/>
            </div>  
          </div>
          <div class="col-md-6">
          <label for="lastName" class="form-label"></label>
            <div class="input-group mb-1">
              <span class="input-group-text p-2">
                <i class="bi bi-person-badge-fill"></i>
              </span>
              <input type="text" id="lastName" class="form-control" placeholder="Last Name" ref={(c) => 
                lastName = c}/>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
          <label for="email" class="form-label"></label>
            <div class="input-group mb-1">
              <span class="input-group-text p-2">
                <i class="bi bi-person-badge-fill"></i>
              </span>
              <input type="text" id="loginName" class="form-control" placeholder="Username" ref={(c) => 
                loginName = c}/>
            </div>
          </div>
          <div class="col-md-6">
          <label for="userName" class="form-label"></label>
            <div class="input-group mb-4">
              <span class="input-group-text p-2">
                <i class="bi bi-envelope"></i>
              </span>
              <input type="email" id="email" class="form-control" placeholder="Email" ref={(c) => 
                email = c}/>
            </div>
          </div>
        </div>
        <hr/>
        <div class="row">
          <div class="col">
          <label for="password" class="form-label"></label>
            <div class="input-group mb-4">
              <span class="input-group-text p-2">
                <i class="bi bi-lock-fill"></i>
              </span>
              <input type="password" id="loginPassword" class="form-control" placeholder="Password" ref={(c) => 
                loginPassword = c}/>
              <span class="input-group-text">
                <span class="tt" data-bs-placement="bottom" title="Enter an email address we can reply to.">
                  <i class="bi bi-question-circle text-muted"></i>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="text-center">
        <div class="d-grid">
				<a onClick={doRegister} class="btn btn-primary rounded-pill btn-login text-uppercase fw-bold">Register</a>
        <span id="registerResult">{message}</span>
        </div>
        </div>
		</form>
    );
};

export default Register;

/*
<div class="col-md-6">
          <label for="confirmPassword" class="form-label"></label>
            <div class="input-group mb-4">
              <span class="input-group-text p-2">
                <i class="bi bi-lock-fill"></i>
              </span>
              <input type="password" id="confirmPassword" class="form-control" placeholder="Confirm Password"/>
              <span class="input-group-text">
                <span class="tt" data-bs-placement="bottom" title="Enter an email address we can reply to.">
                  <i class="bi bi-question-circle text-muted"></i>
                </span>
              </span>
            </div>
          </div>
*/
