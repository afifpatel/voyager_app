import React from 'react';
import {BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import { Row, Col, Panel } from 'react-bootstrap';


export default class SwitchChart extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            data: this.props.data,
            activeIndex: 0
        }
        this.handleClick=this.handleClick.bind(this)
    }

    handleClick(data, index) {
        this.setState({
          activeIndex: index,
      });
    }
    render () {
    const { activeIndex, data } = this.state;
      const activeItem = data[activeIndex];
      const style = {
        top: '50%',
        left: 350,
        lineHeight: '24px',
        fill: '#82ca9d'
    };
      
        return (
          <div>
            <Panel style={{marginLeft : '80px'}}>
                <Panel.Heading>Click to toggle between visualizations</Panel.Heading>
                <Panel.Body>
                <Row>
                    <Col sm={6}>
                    <BarChart width={300} height={200} data={data} >
                     <Bar name='Active Visualization' dataKey='value' onClick={this.handleClick}>
                        {
                            data.map((entry, index) => (
                            <Cell cursor="pointer" fill={index === activeIndex ? '#82ca9d' : '#8884d8' } key={`cell-${index}`}/>
                            ))
                        }
                     </Bar>
                     <Legend iconSize={15} width={200} height={140} layout='vertical' verticalAlign='middle' wrapperStyle={style}/>
                    </BarChart>
                    </Col>
                </Row>
                </Panel.Body>
                <Panel.Footer>
                {`"${activeItem.name}": ${activeItem.value}`}
                </Panel.Footer>
           </Panel>
         </div>
      );
    }
  


}