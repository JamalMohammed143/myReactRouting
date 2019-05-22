import React, {
  Component
} from 'react';
import './../css/login.css';
//import * as moment from "moment";
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rootURL: "http://192.168.1.201:1987/apiCtrl/",
      isLoaded: true,
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
    console.log('result', result);
    if(result.success) {
      var msgObj = this.state.errorMsgObj;
      msgObj.alertIs = true;
      msgObj.alertMsg = result.msg;
      msgObj.alertTitle = "Success";
      msgObj.alertClass = "success-msg";
      this.setState({
        errorMsgObj: msgObj
      });
      sessionStorage.setItem('userData', JSON.stringify(result.result[0]));
      //setTimeout(function(){
        this.props.history.push('/Dashboard');
      //}, 3000);
    } else {
      var msgObj = this.state.errorMsgObj;
      msgObj.alertIs = true;
      msgObj.alertMsg = result.msg;
      msgObj.alertTitle = "Warning";
      msgObj.alertClass = "warning-msg";
      this.setState({
        errorMsgObj: msgObj
      });
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
      console.log(this.state.errorMsgObj);
    }
    e.preventDefault();
  }

  handleInputs(e) {
    const name = e.target.name;
    this.setState({
      [name]: e.target.value
    });
  }

  closeToaster(e) {
    var msgObj = this.state.errorMsgObj;
      msgObj.alertIs = false;
      this.setState({
        errorMsgObj: msgObj
      });
  }

  render() {
    let boxClass = ["toast", "cstm-toaster"];
    if(this.state.errorMsgObj.alertIs) {
      boxClass.push('showToast');
      boxClass.push(this.state.errorMsgObj.alertClass);
    }
    return (
    <div className="login-main-cont">
      <div className="login-main-box">
        <h2><span>Cre</span><span>denti</span><span>als</span></h2>
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
      <div className={this.state.errorMsgObj.alertIs ? "toaster-bg showToast" : "toaster-bg"}></div>
      <div className={boxClass.join(' ')} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header">
          <strong className="mr-auto">{this.state.errorMsgObj.alertTitle}</strong>
          <button type="button" className="close" data-dismiss="toast" aria-label="Close" onClick={this.closeToaster.bind(this)}><i className="fas fa-times"></i></button>
        </div>
        <div className="toast-body">{this.state.errorMsgObj.alertMsg}</div>
      </div>
    </div>
    );
  }
}

export default Login;