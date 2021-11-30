import React from 'react';

import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import Register from '../components/Register';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

const HomePage = () =>
{
  /*
    return(
      <div>
        <PageTitle />
                    <Login />
                  <Register />
              </div>
    );*/

    //col-sm-6 col-md-3 mt-5
    //col-sm-6 col-md-5
    return(
      <div>
        <PageTitle />
        <div class="container my-5">
          <div class="row justify-content-center">
            <div class="col-sm-12 col-md-5 col-lg-4 col-xl-3 col-xxl-3 mt-5">
              <div class="card mb-5 mt-3 border-5 border-dark">
                <div class="card-header text-center p-3"><text class="display-6 text-center">Sign Up</text></div>
                <div class="card-body">
                  <Login />
                  <ForgotPasswordModal/>
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-7 col-lg-5 col-xl-4 col-xxl-4">
              <div class="card border-5 border-dark">
                <div class="card-header text-center p-3"><text class="display-6 text-center">Register</text></div>
                <div class="card-body">
                  <Register />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default HomePage;
