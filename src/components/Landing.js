import React, {Component} from 'react';
//import logo from "../img/logo.png";
//import * as moment from "moment";
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Header from '../components/Header';

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
        <Header />
        <div className="main-section">
          <h1>Landing Page Working In Progress...</h1>
        </div>
      </div>
    );
  }
}
export default Landing;
