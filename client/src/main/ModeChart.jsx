import React from 'react';
import {Radar, RadarChart, PolarGrid, Legend,PolarAngleAxis, PolarRadiusAxis,
    RadialBarChart, RadialBar} from 'recharts';
import { Col, Panel } from 'react-bootstrap';



export default class ModeChart extends React.Component {

    // render () {
    //     return (
    //       <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={this.props.data}>
    //         <PolarGrid />
    //         <PolarAngleAxis dataKey="mode" />
    //         <PolarRadiusAxis/>
    //         <Radar name="Mike" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}/>
    //       </RadarChart>
          
    //   );
    
    render () {
        const style = {
            top: 0,
            left: 350,
            lineHeight: '24px'
        };
        return (
        <Panel style={{marginLeft : '80px'}}>
            <Panel.Heading>Modes of Transport</Panel.Heading>
            <Panel.Body>
            <RadialBarChart width={500} height={300} cx={150} cy={150} innerRadius={30} outerRadius={140} barSize={15} data={this.props.data}>
            <RadialBar minAngle={50} label={{ position: 'insideStart', fill: '#fff' }} background clockWise={true} dataKey='value'/>
            <Legend iconSize={15} width={120} height={140} layout='vertical' verticalAlign='middle' wrapperStyle={style}/>
            </RadialBarChart>
            </Panel.Body>
        </Panel>
      );
    }
    

}