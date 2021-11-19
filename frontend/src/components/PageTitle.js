import React from 'react';
import Alert from 'react-bootstrap/Alert';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

function PageTitle()
{
   return(
     <>
      <Navbar>
        <Container>
          <Navbar.Brand>Fitness Tracker</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {/* <Navbar.Text>
              Signed in as: <a href="#login">Mark Otto</a>
            </Navbar.Text> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
     </>

   );
};

export default PageTitle;
