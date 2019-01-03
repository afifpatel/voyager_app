import React from 'react';
import { withRouter } from 'react-router-dom';
import { Nav, NavItem, Glyphicon, Modal, Form, FormGroup, FormControl, 
        ControlLabel, Button, ButtonToolbar } from 'react-bootstrap';
import PropTypes from 'prop-types';
import  qs from 'query-string';


class AddMoment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLocation : {
                start : '',
                end: ''
            },
        showing: false,
        toastVisible: false, toastMessage: '', toastType: 'success',
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.submit = this.submit.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
    this.onChangeEnd=this.onChangeEnd.bind(this)
    this.onChangeStart=this.onChangeStart.bind(this)
    }
    
    componentDidMount() {
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const coords = pos.coords;
                this.setState({
                    currentLocation: {
                        lat: coords.latitude,
                        lng: coords.longitude
                    }
                })
            },
            (error) => console.log(JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 2000, maximumAge: 2000 }
)
        }
  }

    onChangeStart(e){
        // console.log("Start changed", e.target.value)
        this.setState({ start: e.target.value, changed: true});
    }
    onChangeEnd(e){
        this.setState({ end: e.target.value, changed: true});
    }

    showModal() {
        // console.log("show")
        this.setState({ showing: true });
    }
    hideModal() {
        // console.log("Hideeeeeeeeeeeeeeee")
        this.setState({ showing: false });
    }
    
    showError(message) {
        this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
    }
    dismissToast() {
        this.setState({ toastVisible: false });
    }

    submit(e) {
        e.preventDefault();
        this.hideModal();
        const form = document.forms.addMoment;
        const newMoment = {
            start: form.start.value, 
            end: form.end.value,
            analysis_type: form.type.value,
            moment_definition_id: form.id.value,
        };

        // console.log("new Moment ", newMoment)

        fetch('/api/moment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMoment),
        }).then(response => {
            if (response.ok) {
                response.json().then(result => {
                    // console.log("Added Moment response", result)
                this.props.history.push(`/moments`);
            });
            } else {
                response.json().then(error => {
                this.showError(`Failed to add issue: ${error.message}`);
            });
    }
    }).catch(err => {
            this.showError(`Error in sending data to server: ${err.message}`);
    });
    }
    render() {
        // console.log("showing------> ",this.state.showing)
        // let current_pos=null;
        
        // console.log("showing------> ",this.current_pos)


        return (
            <div onKeyDown={e => e.stopPropagation()} >
                {/* <Button onClick={this.showModal}><Glyphicon glyph="plus" /> Create Issue</Button> */}
                <span onClick={this.showModal}><Glyphicon glyph="plus" /> Create Moment</span>
                <Modal show={this.state.showing} onHide={this.hideModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Moment</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form name="addMoment">
                            <FormGroup>
                                <ControlLabel>Start</ControlLabel>
                                <FormControl name="start" type="datetime-local" step="0.001"
                                            // value={this.state.start} onChange={this.onChangeStart}
                                             />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>End</ControlLabel>
                                <FormControl name="end" type="datetime-local" step="0.001"
                                            // value={this.state.end} onChange={this.onChangeEnd} 
                                            />
                            </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Analysis Type</ControlLabel>
                                    <FormControl name="type" type="text" placeholder="Enter Analysis Type" />
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Definition ID</ControlLabel>
                                    <FormControl name="id" type="text" placeholder="Enter Definitio ID" />
                                </FormGroup>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <ButtonToolbar>
                                <Button type="button" bsStyle="primary"  onClick={this.submit}>Submit</Button>
                                <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
                            </ButtonToolbar>
                        </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

AddMoment.propTypes = {
    router: PropTypes.object,
};

export default withRouter(AddMoment);