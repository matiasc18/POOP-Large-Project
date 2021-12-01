import React, { useState } from 'react';
import axios from 'axios';

function ForgotPassword()
{
    var bp = require('./Path.js');
    var storage = require('../tokenStorage.js');

    var email;

    const [message,setMessage] = useState('');

    const doPasswordForget = async event => 
    {
      event.preventDefault();
      var obj = {email:email.value };
      var js = JSON.stringify(obj);

      var config = 
      {
        method: 'post',
        url: bp.buildPath('api/forgotpassword'),
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
            setMessage('Password reset link sent to ' + obj.email);
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
     <div>
       <p class="lead">Please provide your email address below.</p>
       <p class="text-muted"><small>You will receive an email with a password reset link.</small></p>
        <form action="" methods="POST">
          <div class="input-group mb-4">
            <span class="input-group-text p-2">
              <i class="bi bi-envelope"></i>
            </span>
            <input type="email" id="email" class="form-control" placeholder="Email" ref={(c) => 
              email = c}/>
          </div>
        </form>
        <div class="d-grid mb-2">
          <span class="text-success text-center" id="doPasswordForgetResult"><small>{message}</small></span>
          <a onClick={doPasswordForget} class="btn btn-danger rounded-pill btn-block btn-sm text-uppercase fw-bold btn-block">Forget Password</a>
        </div>
      </div>
   );
};

export default ForgotPassword;

