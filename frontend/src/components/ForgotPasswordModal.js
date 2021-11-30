import React from 'react'
import { Button,Modal } from 'react-bootstrap'
import ForgotPassword from './ForgotPassword';

class ForgotPasswordModal extends React.Component{

    constructor(){
        super();
        this.state = {
            showHide : false
        }
    }

    handleModalShowHide() {
        this.setState({ showHide: !this.state.showHide })
    }

    render(){
        return(
            <div>
              <div class="text-center">
                <Button variant="btn btn-outline-danger rounded-pill btn-login btn-sm text-uppercase fw-bold"
                  onClick={() => this.handleModalShowHide()}>Forgot Password</Button>
                </div>
                <Modal show={this.state.showHide}>
                    <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
                      <h1 class="display-5 text-center" onClick={() => this.handleModalShowHide()}>Forgot Password</h1>
                    </Modal.Header>
                    <Modal.Body>
                    <ForgotPassword/>
                    </Modal.Body>
                </Modal>

            </div>
        )
    }
}

export default ForgotPasswordModal;
