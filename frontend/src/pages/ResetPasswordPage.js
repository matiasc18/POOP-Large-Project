import React from 'react';

import ResetPassword from '../components/ResetPassword';

const ResetPasswordPage = () =>
{
    return(
        <div class="container my-5">
          <div class="row justify-content-center">
            <div class="col-sm-12 col-md-5 col-lg-4 col-xl-3 col-xxl-3 mt-5">
              <div class="card mb-5 mt-3 border-5 border-dark">
                <div class="card-header text-center p-3"><text class="display-6 text-center">Reset Password</text></div>
                <div class="card-body">
                <span class="text-center" id="inner-title">Reset your password</span>
                    <ResetPassword/>
                </div>
              </div>
            </div>
        </div>
        </div>
    );
}

export default ResetPasswordPage;