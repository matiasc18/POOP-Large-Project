import React, { useState } from 'react';
import axios from 'axios';
const url = require('url');

function ResetPassword()
{
    var bp = require('./Path.js');
    var storage = require('../tokenStorage.js');

    var newPassword;

    const [message,setMessage] = useState('');

    const doPasswordReset = async event => 
    { 
      event.preventDefault()

      // Get current url, in order to get the email token from the url
      const currentUrl = new URL(window.location.href);
      const search_params = currentUrl.searchParams;
      const emailToken = search_params.get('emailToken');

      // Body contains new password and email token
      var obj = {newPassword:newPassword.value, emailToken:emailToken};
      var js = JSON.stringify(obj);

      var config = 
      {
        method: 'put',
        url: bp.buildPath('api/resetpassword'),
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
            setMessage('Successfully reset password');
            window.location.href = '/';
        })
        .catch(function (error) 
        {
          if (error.response)
            setMessage(error.response.status + ' Error: ' + error.response.data.error);
        });
        
    }

   return(
    
      <div id="resetPasswordDiv">
        <label for="password" class="form-label"></label>
        <div class="input-group mb-4">
          <span class="input-group-text p-2">
            <i class="bi bi-lock-fill"></i>
          </span>
          <input type="password" id="newPassword" class="form-control" placeholder="Password" ref={(c) => 
            newPassword = c} />
        </div>
        <div class="text-center">
          <div class="d-grid mb-2">
            <a onClick={doPasswordReset} class="btn btn-primary rounded-pill btn-login text-uppercase fw-bold">Reset Password</a>
            <br/>
            <span id="passwordResetResult">{message}</span>
          </div>
        </div>
      </div>
   );
};

export default ResetPassword;