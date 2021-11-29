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
            if (res.error) 
            {
                setMessage(res.error);
            }
        })
        .catch(function (error) 
        {
            console.log(error);
        });
    }

   return(
     <body>
      <h1 id="title">Reset password</h1>
      <form action="" methods="POST">
        <label for="email">Email</label>
        <input type="email" id="email" placeholder="Email" ref={(c) => 
          email = c} /><br />
        <br />
        <input type="submit" id="emailButton" class="buttons" value = "Submit Email"
          onClick={doPasswordForget} />
      </form>
     </body>
   );
};

export default ForgotPassword;
