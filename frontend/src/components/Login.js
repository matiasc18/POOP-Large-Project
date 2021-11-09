import React, { useState } from 'react';
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

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
            if (res.error) 
            {
                setMessage('User/Password combination incorrect');
            }
            else 
            {
                storage.storeToken(res);
                var jwt = require('jsonwebtoken');

                var ud = jwt.decode(storage.retrieveToken(),{complete:true});
                var userId = ud.payload.userId;
                var firstName = ud.payload.firstName;
                var lastName = ud.payload.lastName;
                
                var user = {firstName:firstName,lastName:lastName,userId:userId}
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
        <Form>
            <Form.Group className="mb-3" controlId="formGridAddress1">
                <Form.Label>Login Name</Form.Label>
                <Form.Control placeholder="Login Name" ref={(c) => loginName = c} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGridAddress2">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" ref={(c) => loginPassword = c} />
            </Form.Group>

            <Button variant="primary" type="submit" onClick={doLogin}>
                Submit
            </Button>
        </Form>
     </div>
    );
};

export default Login;
