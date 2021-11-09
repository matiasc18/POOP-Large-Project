import React, { useState } from 'react';
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

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
        <Form>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control placeholder="First Name" ref={(c) => firstName = c} />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control placeholder="Last Name" ref={(c) => lastName = c} />
                </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formGridAddress2">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="Email Address" ref={(c) => email = c} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGridAddress1">
                <Form.Label>Login Name</Form.Label>
                <Form.Control placeholder="Login Name" ref={(c) => loginName = c} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGridAddress2">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" ref={(c) => loginPassword = c} />
            </Form.Group>

            <Button variant="primary" type="submit" onClick={doRegister}>
                Submit
            </Button>
        </Form>
     </div>
    );
};

export default Register;
