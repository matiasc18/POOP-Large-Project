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
   <span class="display-6" id="userName"><small>Logged In As {firstName} {lastName}</small></span><br />
   <button class="btn btn-danger rounded-pill btn-block btn-sm text-uppercase fw-bold btn-block mt-2" id="logoutButton" 
     onClick={doLogout}> Log Out </button>
   </div>
  );
};


export default LoggedInName;
