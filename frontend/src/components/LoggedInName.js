import React from 'react';

function LoggedInName()
{
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud.id;
    var firstName = ud.firstName;
    var lastName = ud.lastName;

    const doLogout = event => 
    {
        event.preventDefault();

        localStorage.removeItem("user_data")
        window.location.href = '/';
    };

  return(
   <div class="container" id="loggedInDiv">
   <p class="display-6 fw-bold text-success text-end" id="userName"><small>Logged in as {firstName} {lastName}</small></p><br />
   <button class="btn btn-danger rounded-pill border-5 border-light btn-block btn-sm text-uppercase fw-bold btn-block" style={{float: 'right'}} id="logoutButton" 
     onClick={doLogout}> Log Out </button>
   </div>
  );
};


export default LoggedInName;
