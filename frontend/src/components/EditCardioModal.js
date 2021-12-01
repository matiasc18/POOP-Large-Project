import React from 'react'
import { Button,Modal } from 'react-bootstrap'

function EditCardioModal({ setOpenModal }) {
  return (
      <div class="row justify-content-center">
          <div class="col-4">
      <div class="container">
    <div class="modalBackground bg-light">
      <div class="modalContainer ms-5 pt-5 pb-5">
        <div class="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="title">
          <h1>Delete Exercise?</h1>
        </div>
        <div className="body">
          <p>You cannot undo this once its deleted.</p>
        </div>
        <div className="footer">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button>Continue</button>
        </div>
      </div>
    </div>
    </div>
    </div>
    </div>
  );
}

export default EditCardioModal;

/*
class EditCardioModal extends React.Component{

    constructor(c){
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
                <Modal show={this.state.showHide}>
                    <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
                      <h1 class="display-5 text-center" onClick={() => this.handleModalShowHide()}>Edit Exercise</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <h1>Hello</h1>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}*/
/*
class EditCardioModal extends React.Component{
    constructor()
    {
        super();
        this.state={
            show:false
        }
    }

    handleModal()
    {
        this.setState({show:true});
    }

    render(){
        return(
            <div>
                <Button onCLick={() => {this.handleModal()}}>Open Modal</Button>
                <Modal show={this.state.show}>
                    <Modal.Header>Modal Head Part</Modal.Header>
                    <Modal.Body>
                        Hello
                    </Modal.Body>
                    <Modal.Footer>
                        <Button>
                            Close Modal
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default EditCardioModal;
*/
/*

<div class="text-center">
                <Button variant="btn btn-outline-danger rounded-pill btn-login btn-sm text-uppercase fw-bold"
                  onClick={() => this.handleModalShowHide()}>Edit Exercise</Button>
                </div>

                */