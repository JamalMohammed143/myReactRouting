import React, {Component} from 'react';
import logo from "../img/logo.png";
//import * as moment from "moment";
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

class Landing extends Component {
  constructor(props){
    super(props);
    this.state = {
      rootURL:"http://192.168.1.98:1987/apiCtrl/",
      resData: [],
      userData: {},
      isLoaded: true
    };
  }
  componentDidMount() {
    var userData = JSON.parse(sessionStorage.getItem('userData'));
    this.setState({
      userData: userData
    });
  }

  render(){
    return (
      <div className="dashboard-cont">
        <header>
          <a href="/">
            <img src={logo} alt="LOGO" />
            <h2>Online Voting Portal</h2>
          </a>
          <div className="user-details" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span className="user-name">{this.state.userData.first_name + " " + this.state.userData.last_name}</span>
            <span className="user-icon"><i className="fas fa-user"></i></span>
          </div>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a className="dropdown-item" href="/">Logout</a>
          </div>
        </header>
        <div className="main-section text-center p-3">
          <h1>Landing Page Working In Progress...</h1>
        </div>
      </div>
    );
  }
}
export default Landing;
