import React, {
  Component
} from 'react';
import './../css/login.css';
//import * as moment from "moment";
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import ToasterBox from './ToasterBox';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rootURL: "http://192.168.1.98:1987/apiCtrl/",
      isLoader: true,
      aadharno: "",
      voterid: "",
      errorMsgObj: {
        alertIs: false,
        alertTitle: "Error",
        alertMsg: "Some Error",
        alertClass: "danger-msg"
      }
    };
    this.submitCalling = this.submitCalling.bind(this, '');
    this.dataEncryption = this.dataEncryption.bind(this, '');
  }
  componentDidMount() {
    this.setState({
      isLoader: false
    });
  }

  /*Data Encryption*/
  dataEncryption(e, data){
    var isDataArr = data.split('').reverse();
    var getDataArr = [];
    for (var a = 0; a < isDataArr.length; a++) {
        var setData = isDataArr[a] + this.getUniqueId() + "-";
        getDataArr.push(setData);
    }
    return getDataArr.join('');
  }
  
  /*Get Unique Code*/
  getUniqueId() {
    var uniqueId = Math.random().toString(36).slice(2);
    return uniqueId.substring(0, 8);
  }

  async submitCalling(e, params) {
    this.setState({
      isLoader: true
    });
    var data = params;
    var sendData = 'application/json.utf_' + data.adhaar_no + '/' + data.voter_id;
    var url = this.state.rootURL + "validateUser";
    var reponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': sendData,
        'Content-Type': 'application/json',
        //'AcceptThis1': data.adhaar_no,
        //'AcceptThis2': data.voter_id
      },
      //body: JSON.stringify(data)
    });
    var result = await reponse.json();
    if(result.success) {
      var msgObj = this.state.errorMsgObj;
      msgObj.alertIs = true;
      msgObj.alertMsg = result.msg;
      msgObj.alertTitle = "Success";
      msgObj.alertClass = "success-msg";
      this.setState({
        errorMsgObj: msgObj,
        isLoader: false
      });
      sessionStorage.setItem('userData', JSON.stringify(result.result[0]));
      setTimeout(()=>{
        this.props.history.push('/Dashboard');
      }, 3000);
    } else {
      var msgObj = this.state.errorMsgObj;
      msgObj.alertIs = true;
      msgObj.alertMsg = result.msg;
      msgObj.alertTitle = "Warning";
      msgObj.alertClass = "warning-msg";
      
      setTimeout(()=>{
        this.setState({
          errorMsgObj: msgObj,
          isLoader: false
        });
      }, 3000);
    }
  }

  loginSubmitFun(e) {
    if (this.state.aadharno != "" && this.state.aadharno != undefined && this.state.voterid != "" && this.state.voterid != undefined) {
      var data = {
        adhaar_no: this.dataEncryption(this.state.aadharno),
        voter_id: this.dataEncryption(this.state.voterid)
      };
      this.submitCalling(data);
    } else {
      var msgObj = this.state.errorMsgObj;
      msgObj.alertIs = true;
      msgObj.alertMsg = "Please fill all credentials...";
      msgObj.alertTitle = "Error";
      msgObj.alertClass = "danger-msg";
      this.setState({
        errorMsgObj: msgObj
      });
    }
    e.preventDefault();
  }

  handleInputs(e) {
    const name = e.target.name;
    this.setState({
      [name]: e.target.value
    });
  }

  render() {
    return (
    <div className="login-main-cont">
      <div className={this.state.isLoader ? 'mainLoader show' : 'mainLoader'}>
        <img src="https://i2.wp.com/swaggyimages.com/wp-content/uploads/2018/05/Indian-Flag-Pics-Free-Download.gif?w=640" alt="Loader" />
      </div>
      <div className="login-main-box">
        <h2><span>Cre</span><span>dent</span><span>ials</span></h2>
        <div className="card login-box">
          <form onSubmit={this.loginSubmitFun.bind(this)}>
            <div className="form-group">
              <label htmlFor="aadharCard">Aadhar Card:</label>
              <input type="number" className="form-control" name="aadharno" id="aadharCard" placeholder="Enter your aadhar card no." value={this.state.aadharno} onChange={this.handleInputs.bind(this)} />
            </div>
            <div className="form-group">
              <label htmlFor="voterId">Voter Id:</label>
              <input type="text" className="form-control" name="voterid" id="voterId" placeholder="Enter your voter id no" value={this.state.voterid} onChange={this.handleInputs.bind(this)} />
            </div>
            <div className="form-btn">
              <button type="submit" className="btn btn-success">Submit</button>
            </div>
          </form>
        </div>
      </div>
      <ToasterBox obj={this.state.errorMsgObj} />
    </div>
    );
  }
}

export default Login;