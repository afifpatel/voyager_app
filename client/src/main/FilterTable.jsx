import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row, FormGroup, FormControl, ControlLabel, InputGroup, ButtonToolbar, Button} from 'react-bootstrap';
import moment from 'moment-timezone'


export default class FilterTable extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            start: props.initFilter.start || '',
            end: props.initFilter.end || '',
            changed: false,
        };
        this.onChangeStart = this.onChangeStart.bind(this);
        this.onChangeEnd = this.onChangeEnd.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.clearFilter = this.clearFilter.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            start: newProps.initFilter.start || '',
            end : newProps.initFilter.end || '',
            changed: false,
        });
    }
    onChangeStart(e){
        // console.log("Start changed", e.target.value)
        this.setState({ start: e.target.value, changed: true});
    }
    onChangeEnd(e){
        this.setState({ end: e.target.value, changed: true});
    }

    applyFilter(){
        // console.log("APPLIED FILTER", this.state.start, this.state.end)
        const new_start = moment.tz(this.state.start,"europe/brussels").format('YYYY-MM-DDTHH:mm:ss.SSS')
        const new_end = moment.tz(this.state.end,"europe/brussels").format('YYYY-MM-DDTHH:mm:ss.SSS')
        // console.log("CHANGED date", new_start, new_end)
        const newFilter = {};
        if(this.state.start) newFilter.start = new_start
        if(this.state.end) newFilter.end = new_end;
        this.props.setFilter(newFilter);
    }
    clearFilter() {
        this.props.setFilter({});
    }
render(){
    
    return(
        <Row>
            <Col sm={3}>
                <FormGroup>
                    <ControlLabel>Start</ControlLabel>
                    <FormControl name="start" type="datetime-local" step="0.001"
                                value={this.state.start} onChange={this.onChangeStart} />
                </FormGroup>
            </Col>
            <Col sm={3}>
                <FormGroup>
                    <ControlLabel>End</ControlLabel>
                    <FormControl name="end" type="datetime-local" step="0.001"
                                value={this.state.end} onChange={this.onChangeEnd} />
                </FormGroup>
            </Col>
            <Col sm={6}>
                <FormGroup>
                    <ControlLabel>&nbsp;</ControlLabel>
                    <ButtonToolbar>
                        <Button bsStyle="primary" onClick={this.applyFilter}>Apply</Button>
                        <Button onClick={this.clearFilter}>Clear</Button>
                    </ButtonToolbar>
                </FormGroup>
            </Col>
        </Row>
    );
}

}

