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
            var res = response.data;
            if (res.error) 
            {
                setMessage('Login already exists');
            }
            else 
            {
                storage.storeToken(res);
                var jwt = require('jsonwebtoken');

                var ud = jwt.decode(storage.retrieveToken(),{complete:true});
                var userId = ud.payload.userId;
                var firstName = ud.payload.firstName;
                var lastName = ud.payload.lastName;
                var email = ud.payload.email;
                
                var user = {firstName:firstName,lastName:lastName,userId:userId, email:email}
                localStorage.setItem('user_data', JSON.stringify(user));
                window.location.href = '/cards';
            }
        })
        .catch(function (error) 
        {
            console.log(error);
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
        <input type="submit" id="loginButton" className="buttons" value = "Register"
          onClick={doRegister} />
        <span id="loginResult">{message}</span>
     </div>
    );
};

export default Register;
