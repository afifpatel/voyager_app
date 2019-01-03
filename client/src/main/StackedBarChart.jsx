import React from 'react';
import {ScatterChart, Scatter, Cell, XAxis, YAxis, CartesianGrid, Tooltip, LegendLineChart, 
        Line, LineChart, AreaChart, Area, Brush, Legend} from 'recharts';

export default class StackedBarChart extends React.Component {

    componentWillReceiveProps(nextProps){
        if(nextProps.value !== this.props.value){
            this.setState({count:nextProps.value});
        }
    }

render () {

    //Sortinggg......
    // this.props.data.sort(function(a,b){
    //     return a.distance - b.distance;
    // })   

    // console.log("PROPS IN CHART", this.props)
  	return (
        <div>
        <LineChart width={1500} height={300} data={this.props.data}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="name" hide={true}/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend wrapperStyle={{
        paddingTop: "10px"
    }}/>
       <Line name="distance in kms"type="monotone" dataKey="distance" stroke="#8884d8" activeDot={{r: 8}}/>
       <Line name="duration in mins" type="monotone" dataKey="duration" stroke="#82ca9d" />
      </LineChart>
        {/* <h1>Distance</h1>
      <LineChart width={1500} height={200} data={this.props.data} syncId="anyId"
            margin={{top: 10, right: 30, left: 0, bottom: 0}}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="name" hide={true}  />
        <YAxis dataKey="distance" label={{ value: "kms", angle: -90, position: 'insideLeft' }}/>
        <Tooltip/>
        <Line type='monotone' dataKey='distance' stroke='#8884d8' fill='#8884d8' />
      </LineChart>
      <h1>Duration</h1>
      <LineChart width={1500} height={200} data={this.props.data} syncId="anyId"
            margin={{top: 10, right: 30, left: 0, bottom: 0}}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="name" hide={true}/>
        <YAxis dataKey="duration" label={{ value: "Minutes", angle: -90, position: 'insideLeft' }} />
        <Tooltip/>
        <Line type='monotone' dataKey='duration' stroke='#82ca9d' fill='#82ca9d' />
        <Brush />
      </LineChart> */}
      {/* <AreaChart width={1500} height={200} data={this.props.data} syncId="anyId"
            margin={{top: 10, right: 30, left: 0, bottom: 0}}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="name"/>
        <YAxis/>
        <Tooltip/>
        <Area type='monotone' dataKey='distance' stroke='#82ca9d' fill='#82ca9d' />
      </AreaChart> */}

    	{/* <ScatterChart width={1000} height={400} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
      	<CartesianGrid />
        <XAxis dataKey={'duration'} type="number" name='duration'  
           domain={[0, 'dataMax']}
           ticks={[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 80,120, 160]}
            interval={0}/>
          <YAxis dataKey={'distance'} type="number" name='distance' 
            domain={[0, 'dataMax']}
            ticks={[5, 10, 15, 20, 25, 30, 35, 40, 60]}
            interval={0}
            />
        <Scatter name='A school' data={this.props.data} fill='#8884d8'/>
      	<Tooltip cursor={{strokeDasharray: '3 3'}}/>
      </ScatterChart> */}
      </div>

// ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180]} domain={['dataMin', 'dataMax']}
    );
  }

}

