import React from 'react'
import { Button,Modal } from 'react-bootstrap'
import CardUI from './CardUI';

var exerciseName, lowerRepRange, upperRepRange, strengthWeight;

class EditStrengthModal extends React.Component{

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
                <Modal show={this.state.showHide}>
                    <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
                      <h1 class="display-5 text-center" onClick={() => this.handleModalShowHide()}>Edit Exercise</h1>
                    </Modal.Header>
                    <Modal.Body>
                        <div class="row">
                            <div class="col-md-6">
                            <label for="exerciseName" class="form-label"></label>
                                <div class="input-group mb-1">
                                <span class="input-group-text p-2">
                                    <i class="bi bi-person-badge-fill"></i>
                                </span>
                                <input type="text" id="exerciseName" class="form-control" placeholder="Exercise Name" ref={(c) => 
                                    exerciseName = c}/>
                                </div>  
                            </div>
                            <div class="col-md-6">
                            <label for="lowerRepRange" class="form-label"></label>
                                <div class="input-group mb-1">
                                <span class="input-group-text p-2">
                                    <i class="bi bi-person-badge-fill"></i>
                                </span>
                                <input type="text" id="lowerRepRange" class="form-control" placeholder="Lower Rep Range" ref={(c) => 
                                    lowerRepRange = c}/>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                            <label for="upperRepRange" class="form-label"></label>
                                <div class="input-group mb-1">
                                <span class="input-group-text p-2">
                                    <i class="bi bi-person-badge-fill"></i>
                                </span>
                                <input type="text" id="upperRepRange" class="form-control" placeholder="Upper Rep Range" ref={(c) => 
                                    upperRepRange = c}/>
                                </div>  
                            </div>
                            <div class="col-md-6">
                            <label for="strengthWeight" class="form-label"></label>
                                <div class="input-group mb-1">
                                <span class="input-group-text p-2">
                                    <i class="bi bi-person-badge-fill"></i>
                                </span>
                                <input type="text" id="strengthWeight" class="form-control" placeholder="Strength Weight" ref={(c) => 
                                    strengthWeight = c}/>
                                </div>
                            </div>
                        </div>
                        <a class="btn btn-primary rounded-pill btn-block btn-sm text-uppercase fw-bold btn-block">Forget Password</a>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default EditStrengthModal;