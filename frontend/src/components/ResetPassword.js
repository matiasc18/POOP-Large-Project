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
        })
        .catch(function (error) 
        {
          if (error.response)
            setMessage(error.response.status + ' Error: ' + error.response.data.error);
        });
        
    }

   return(
    
    <div id="resetPasswordDiv">
    <span id="inner-title">Reset your password</span><br />
    <input type="password" id="newPassword" placeholder="New Password" ref={(c) => 
      newPassword = c} /><br />
    <input type="submit" id="passwordResetButton" class="buttons" value = "Reset Password"
      onClick={doPasswordReset} />
    <span id="passwordResetResult">{message}</span>
    </div>
   );
};

export default ResetPassword;
