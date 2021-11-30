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
      <div id="loginDiv">
        <span id="inner-title">PLEASE REGISTER</span><br />
        <input type="text" id="firstName" placeholder="First Name" ref={(c) => firstName = c} /><br />
        <input type="text" id="lastName" placeholder="Last Name" ref={(c) => lastName = c} /><br />
        <input type="text" id="email" placeholder="Email" ref={(c) => email = c} /><br />
        <input type="text" id="loginName" placeholder="Username" ref={(c) => loginName = c}  /><br />
        <input type="password" id="loginPassword" placeholder="Password" ref={(c) => 
          loginPassword = c} /><br />
        <input type="submit" id="loginButton" class="buttons" value = "Register"
          onClick={doRegister} />
        <span id="loginResult">{message}</span>
     </div>
    );
};

export default Register;
