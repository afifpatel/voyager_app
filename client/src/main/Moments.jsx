import React from 'react';
import 'whatwg-fetch'
import PropTypes from 'prop-types';
import  qs from 'query-string';
import { parse } from 'query-string';
import { Table, Panel } from 'react-bootstrap';

import FilterTable from './FilterTable.jsx';
import moment from 'moment-timezone'


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
                        <th>Analysis Type</th>
                        <th>Definition ID</th>
                    </tr>
                </thead>
                <tbody>{issueRows}</tbody>
            </Table>
            )

}

const IssueRow = (props) => {

    function onDeleteClick(){
        props.deleteLandmark(props.row_value._id);
    }

    return(
    <tr>
    <td>{props.row_value.start ? format_date(props.row_value.start) : '' }</td>
    <td>{props.row_value.end ? format_date(props.row_value.end) : '' }</td>
    <td>{findDuration(props.row_value.start, props.row_value.end)}</td>
    <td>{props.row_value.analysis_type}</td>
    <td>{props.row_value.moment_definition_id}</td>

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

export default class Moments extends React.Component{

    constructor(props){
        super(props);
        this.state = {
             moments : [] ,
             events : [],
             segments:[],
             toastVisible: false, toastMessage: '', toastType: 'success', 
        };

        // this.createIssue=this.createIssue.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.deleteIssue=this.deleteLandmark.bind(this);
        this.showError = this.showError.bind(this);
        this.dismissToast = this.dismissToast.bind(this);
        }

showError(message) {
    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger' });
}
dismissToast() {
    this.setState({ toastVisible: false });
}

    deleteLandmark(id) {
        fetch(`/api/landmark/${id}`, { method : 'delete' }).then(response => {
            if(!response.ok) console.log("Not ok");
            else this.loadData();
        }).catch(err => {
        })
     }

    setFilter(query){
       // console.log(this.props.location.search);

        //console.log(query);
                
        this.props.history.push( {pathname : this.props.location.pathname, search : qs.stringify(query)});
       
    }
        
    componentDidMount(){
        this.loadData();
    }

    componentDidUpdate(prevProps){
         const oldQuery = parse(prevProps.location.search);
         const newQuery = parse(this.props.location.search);
         console.log('In CDU old new',oldQuery, newQuery);

         if (oldQuery.start === newQuery.start && oldQuery.end === newQuery.end) {
             return;
         }


         this.loadData();
     }

    loadData(){
        fetch(`/api/moments${this.props.location.search}`).then(response =>{
            if(response.ok){
                response.json().then(data => {
                console.log("total count of recordsssss :",data._metadata.total_count);
                // console.log("Records to push:",data.records.moments);

                // let moments = []
                // data.records.forEach( record => {
                //     console.log("Record TO PUSH:",record);
                //     moments.push(record.data.user.moment_history)
                // })

            console.log("Moments :",data.records[0].moments);
            this.setState({ moments : data.records[0].moments });
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
        const query = parse(this.props.location.search);
        console.log("In Moments", query)

        return(
            <div>
                <Panel>
                    <Panel.Heading>
                        <Panel.Title toggle>
                            Filter
                        </Panel.Title>
                    </Panel.Heading>
                        <Panel.Collapse>
                        <Panel.Body>
                            <FilterTable setFilter={this.setFilter} initFilter={query}/>
                        </Panel.Body>
                    </Panel.Collapse>
                </Panel>
                <IssueTable issues_prop={this.state.moments} deleteLandmark={this.deleteLandmark}/>
            </div>
        );
    }
}

Moments.propTypes = {
    location : PropTypes.object.isRequired,
    history: PropTypes.object,
};


