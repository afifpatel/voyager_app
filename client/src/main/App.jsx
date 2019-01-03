import React from 'react'               //import npm installed libs...replacement to html script includes
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import  RoutedApp  from './RoutedApp.jsx';
import AddMoment from './AddMoment.jsx';
import AddEvent from './AddEvent.jsx';


const contentNode = document.getElementById('contents');

const Header = () => (
<Navbar fluid>
    <Navbar.Header>
        <Navbar.Brand>Voyager</Navbar.Brand>
    </Navbar.Header>
    <Nav>
        <LinkContainer to="/dashboard">
            <NavItem>Dashboard</NavItem>
        </LinkContainer>
    </Nav>
    <Nav>
        <LinkContainer to="/moments">
            <NavItem>Moments</NavItem>
        </LinkContainer>
    </Nav>
    <Nav>
        <LinkContainer to="/events">
            <NavItem>Events</NavItem>
        </LinkContainer>
    </Nav>
    {window.location.pathname.includes('moments') ? 
    <Nav pullRight>
        <NavItem><AddMoment /></NavItem>
    </Nav> : ''}
    {window.location.pathname.includes('events') ? 
    <Nav pullRight>
        <NavItem><AddEvent /></NavItem>
    </Nav> : ''}

</Navbar>
);

export default function App(props){

    return(
        <div>
        <Header />
        <div className="container-fluid">
            {props.children}
            {/* <hr />
            <h5><small>
            Full source code available at this <a href = "https://github.com/afifpatel/voyager_app">
            GitHub repistory</a>
            </small></h5> */}
        </div>
        </div>
    )
};

App.propTypes = {
    children: PropTypes.object.isRequired,
};

ReactDOM.render(<RoutedApp />,contentNode);

if (module.hot) {           //for module refresh only on change, rather than whole browser
    module.hot.accept();
}