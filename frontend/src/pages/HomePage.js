import React from 'react';

import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import Register from '../components/Register';

const HomePage = () =>
{
    return(
      <div>
        <PageTitle />
        <Login />
        <Register />
      </div>
    );
};

export default HomePage;
