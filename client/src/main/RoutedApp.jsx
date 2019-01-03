import React from 'react'               //import npm installed libs...replacement to html script includes
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import { Switch, Redirect, browserHistory} from 'react-router';
import App from './App.jsx';
import Moments from './Moments.jsx';
import Events from './Events.jsx';
import Dashboard from './Dashboard.jsx';


class RoutedApp extends React.Component {

render(){
     
    return(
        <Router history={browserHistory}>
            <App>
            <Switch>
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/moments" component={withRouter(Moments)} />
                <Route exact path="/events" component={withRouter(Events)} />
                <Redirect from="*" to="/dashboard" />
            </Switch>
            </App>
        </Router>
    )
    
}
}

export default RoutedApp;
