import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Link, NavLink, Redirect} from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      rootURL:"http://192.168.1.98:1987/apiCtrl/",
      loggedIn: false
    };
  }
  componentDidMount() {
    this.setState({
      loggedIn: true
    });
  }

  render() {
    return (
      <div className="main-element">
        <Router>
          {/* <div>
            <NavLink exact activeClassName="active" to={'/'}>Login</NavLink><br/>
            <NavLink activeClassName="active" to={'/Dashboard'}>Dashboard</NavLink>
          </div> */}
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path='/Dashboard' component={Dashboard} />
            <Route path='/Landing' component={Landing} />
          </Switch>
          {/* <Switch>
            <Route exact path='/' component={Login} />
            <Route path='/Dashboard' exact strict render={()=>(
              this.state.loggedIn ? "Dashboard" : (<Redirect to="/" />)
            )} />
            <Route path='/Landing' component={Landing} />
          </Switch> */}
        </Router>
      </div>
    );
  }
}

export default App;
