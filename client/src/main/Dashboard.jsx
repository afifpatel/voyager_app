import React from 'react';
import 'whatwg-fetch'
import { parse } from 'query-string';
import { Table, Row, Col } from 'react-bootstrap';
import moment from 'moment-timezone'

import StackedBarChart from './StackedBarChart.jsx'
import SwitchChart from './SwitchChart.jsx';
import ModeChart from './ModeChart.jsx';

export default class Dashboard extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            cars_array : [],
            total_car_distance : 0,
            total_transport_duration: 0, total_stationary_duration: 0, total_tranports :0 ,
            total_transport_distance: 0,
            cars : 0,flights : 0,bikes : 0, walks : 0
        }
    }

    componentDidMount(){
        this.loadData();
    }

    componentDidUpdate(prevProps){
         const oldQuery = parse(prevProps.location.search);
         const newQuery = parse(this.props.location.search);
        //  console.log('In CDU old new',oldQuery, newQuery);

         if (oldQuery.start === newQuery.start && oldQuery.end === newQuery.end) {
             return;
         }
         this.loadData();
     }

    loadData(){
        fetch(`/api/dashboard${this.props.location.search}`).then(response =>{
            if(response.ok){
                response.json().then(data => {
                // console.log("total count of recordsssss :",data._metadata.total_count);
                // console.log("Records to push:",data.records.moments);

                let cars = [], car_distance = 0, transport_distance=0, transport_duration=0, 
                    stationary_duration=0, car_index = 0, count=0;
                let mcar=0,mwalk=0,mflight=0,mbike=0
                data.records.forEach( record => {
                    // console.log("Record TO PUSH:",record);
                    let event = record.data.user.event_history;
                    event.type === "Transport" ?
                        (   count++, 
                            transport_duration+=findDiff(event.start,event.end) ) : 
                         stationary_duration+=findDiff(event.start,event.end)

                    transport_distance+= event.distance ? event.distance : 0;
                    switch(event.mode){
                        case "car":{
                            mcar++
                            break }
                        case "walking":{
                            mwalk++
                            break }
                        case "flight":{
                            mflight++
                            break }
                        case "biking":{
                            mbike++
                            break }
                        default: break;
                        }
                    // console.log("TRANSPORTTTTTT duration distance", transport_duration, transport_distance)
                    if(event.mode == "car"){
                        car_index++;
                        const car_name = "C" + car_index;
                        const car = Object.assign({},event)
                        car["distance"]= Math.round(event.distance/1000)
                        car["name"] = car_name,
                        car["duration"] = Math.round(findDiff(event.start,event.end)/60000)
                        cars.push(car)
                        // cars.push({
                        //      "name" : car_name,
                        //      "distance" : event.distance/1000, 
                        //      "duration" : findDiff(event.start,event.end),
                        //      "waypoints" : event.waypoints
                        //      })
                        car_distance+=event.distance;
                        // console.log("CARRRRRRRRRRRRR FOUND and new distance", car_distance)
                    }
                    // moments.push(record.data.user.moment_history)
                })
            //  console.log("Total Transport :",count);

            // console.log("Cars :",cars);
            this.setState({ 
                cars_array : cars, total_car_distance : car_distance, 
                total_transport_distance: transport_distance,
                total_transport_duration: transport_duration , total_stationary_duration: stationary_duration,
                total_tranports : count,
                cars : mcar, flights : mflight, walks : mwalk, bikes: mbike
            });
            });
        } else {
                respons.json().then( err =>{
                    // alert("Failed to fetch issues:" + error.message)
                    this.showError(`Failed to fetch issues ${error.message}`);
                });
            }
        }).catch(err => {
            // alert("Error in fetching data from server:", err);
            this.showError(`Error in fetching data from server: ${err}`);
        });
    }

    render(){
        const car_distance = this.state.total_car_distance;
        const total_distance = this.state.total_transport_distance;
        const total_transport_duration = this.state.total_transport_duration;
        const total_stationary_duration = this.state.total_stationary_duration;
        const transport_count = this.state.total_tranports;
        const cars = this.state.cars;
        const flights = this.state.flights;
        const bikes = this.state.bikes;
        const walks = this.state.walks;


        const data = [12, 5, 6, 6, 9, 10];
        let transport_data = []
        transport_data.push({ "name": "Total duration of transport by stationary mode in hours", value: Math.round(total_stationary_duration/(1000*3600))})
        transport_data.push({ "name": "Total duration of transport by transport mode in hours", value: Math.round(total_transport_duration/(1000*3600))})
        transport_data.push({ "name": "Total amount of transport by transport mode", value: transport_count})
        transport_data.push({ "name": "Total distance travelled by transport mode x10 kms", value: Math.round(total_distance/10000) })
        transport_data.push({ "name": "Total distance travelled by car in kms", value: Math.round(car_distance/1000) })


        let mode_data = []
        mode_data.push({ name : 'Flight' , value: flights, fill: '#83a6ed' })
        mode_data.push({ name : 'Biking' , value: bikes, fill: '#82ca9d' })
        mode_data.push({ name : 'Walking' , value: walks, fill: '#8884d8'})
        mode_data.push({ name : 'Car' , value: cars, fill: '#ffc658' })


        // console.log("Mode Data", mode_data)


        // console.log("CARS STATE", this.state.cars_array)
        // console.log("Transport Data to panel", transport_data)

        return(
            <div className="App">
            <Row>
            <Col sm={6}>
            {this.state.total_transport_duration != 0 && <SwitchChart data={transport_data} />}
            </Col>
            <Col sm={6}>
            {this.state.cars != 0 && <ModeChart data={mode_data} />}
            </Col>
            </Row>
            <h3 style={{margin:'10px 10px 10px'}}>Car Metrics</h3> 
            {this.state.cars_array.length !== 0 && <StackedBarChart data = {this.state.cars_array} />}
{/*            
                <h1>Total Cars Distance = {car_distance}</h1> 
                <h1>Total Transport Distance = {total_distance}</h1> 
                <h1>Total Transport Duration = {formatDuration(total_transport_duration)}</h1>   
                <h1>Total Stationary Duration = {formatDuration(total_stationary_duration)}</h1>                      */}
                {/* <IssueTable issues_prop={this.state.cars}/> */}
            </div>
        )
    }
}

function findDiff(start, end){
    var start_date = moment.tz(start,"europe/brussels").format('YYYY-MM-DDTHH:mm:ss.SSS')
    start_date = new Date(start_date).getTime()
    var end_date = moment.tz(end,"europe/brussels").format('YYYY-MM-DDTHH:mm:ss.SSS')
    end_date = new Date(end_date).getTime()

    // console.log("start and end date", start_date, end_date)


    var difference_ms= end_date - start_date;
    var one_day=1000*60*60*24;

    // const duration = diff/one_day;

     //take out milliseconds
    // difference_ms = difference_ms/1000;
    // var seconds = Math.floor(difference_ms % 60);
    // difference_ms = difference_ms/60; 
    // var minutes = Math.floor(difference_ms % 60);
    // difference_ms = difference_ms/60; 
    // var hours = Math.floor(difference_ms % 24);  
    // var days = Math.floor(difference_ms/24);
        
    // console.log("Duration", difference_ms)

    return difference_ms;
    // return days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds';
}

function IssueTable(props){
    // console.log("Props", props.issues_prop)
    const issueRows= props.issues_prop.map(  (element, index) => <IssueRow key={index} row_value={element} deleteLandmark={props.deleteLandmark}/>)
    return(
            <Table bordered condensed hover responsive>
                <thead>
                    <tr>
                        <th>Start</th>
                        <th>End</th>
                        <th>Duration</th>
                        <th>Distance</th>
                    </tr>
                </thead>
                <tbody>{issueRows}</tbody>
            </Table>
            )

}

const IssueRow = (props) => {

    return(
    <tr>
    <td>{props.row_value.start ? format_date(props.row_value.start) : '' }</td>
    <td>{props.row_value.end ? format_date(props.row_value.end) : '' }</td>
    <td>{findDuration(props.row_value.start, props.row_value.end)}</td>
    <td>{props.row_value.distance}</td>

</tr>
    );
};

function findDuration(start, end){
    var start_date = moment.tz(start,"europe/brussels").format('YYYY-MM-DDTHH:mm:ss.SSS')
    start_date = new Date(start_date).getTime()
    var end_date = moment.tz(end,"europe/brussels").format('YYYY-MM-DDTHH:mm:ss.SSS')
    end_date = new Date(end_date).getTime()

    // console.log("start and end date", start_date, end_date)


    var difference_ms= end_date - start_date;
    var one_day=1000*60*60*24;

    // const duration = diff/one_day;

     //take out milliseconds
    difference_ms = difference_ms/1000;
    var seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms/60; 
    var minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms/60; 
    var hours = Math.floor(difference_ms % 24);  
    var days = Math.floor(difference_ms/24);
        
    // console.log("Duration", duration)

    return days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds';
}

function format_date(iso_date){

    const moment_date = moment.tz(iso_date,"europe/brussels").format('YYYY-MM-DDTHH:mm:ss.SSS')


    // console.log("Date",moment_date)
    const obj = new Date(moment_date)
    // console.log("new Date",obj)

    var year = obj.getUTCFullYear();
    var month = obj.getUTCMonth()+1;
    var dt = obj.getUTCDate();

    if (dt < 10) {
    dt = '0' + dt;
    }
    if (month < 10) {
    month = '0' + month;
    }


    const date = month +"/"+ dt +"/"+ year;
    var hours = checkTime(obj.getHours())
    var minutes =  checkTime(obj.getMinutes())
    var seconds = checkTime(obj.getSeconds());
    var ms = checkTime(obj.getMilliseconds());
    
    if (ms < 100){
        ms = ms+"0"
    }

    // console.log("formatted Date",date)

    const time = hours +":" + minutes + ":" + seconds + ":" + ms
    // console.log("formatted Time",time)


    return (<div>
            <span style={{color : '#336699'}}>{date}</span>
            <span>{'   '}</span>
            <span style={{color : '#9fbfdf'}}>{time}</span>
            </div>
    )
}

function checkTime(i){
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}  

function formatDuration(difference_ms){
    difference_ms = difference_ms/1000;
    var seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms/60; 
    var minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms/60; 
    var hours = Math.floor(difference_ms % 24);  
    var days = Math.floor(difference_ms/24);
        
    // console.log("Duration", duration)

    return days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds';
}
