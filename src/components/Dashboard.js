import React, {Component} from 'react';
import logo from "../img/logo.png";
//import * as moment from "moment";
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      rootURL:"http://192.168.1.201:1987/apiCtrl/",
      resData: [],
      userData: {},
      getFirstObj: {},
      isLoaded: true,
      errorMsgObj: {
        alertIs: false,
        alertTitle: "Error",
        alertMsg: "Some Error",
        alertClass: "danger-msg"
      }
    };
    this.SubmitVote = this.SubmitVote.bind(this, '');
    this.voteSubmiting = this.voteSubmiting.bind(this, '');
    this.dataEncryption = this.dataEncryption.bind(this, '');
  }
  componentDidMount() {
    var userData = JSON.parse(sessionStorage.getItem('userData'));
    this.setState({
      userData: userData
    });
    var url = this.state.rootURL + 'getCandidates/' + userData.constituency;
    fetch(url).then(res => res.json()).then((result) => {
      var resultData = result.result;
      for (var i = 0; i < resultData.length; i++) {
        var element = resultData[i];
        element.activeClassIs = false;
      }
      this.setState({
        isLoaded: false,
        resData: resultData,
        getFirstObj: result.result[0]
      });
    },(error) => {
        this.setState({
          isLoaded: true
        });
      }
    );
  }

  /*Data Encryption*/
  dataEncryption(e, data) {
    var isDataArr = data.split('').reverse();
    var getDataArr = [];
    for (var a = 0; a < isDataArr.length; a++) {
      var uniqueId = Math.random().toString(36).slice(2);
      var setData = isDataArr[a] + uniqueId.substring(0, 8) + "-";
      getDataArr.push(setData);
    }
    return getDataArr.join('');
  }
  
  async voteSubmiting(e, params, index) {
    var data = params;
    var allData = this.state.resData;
    var sendData = 'application/json.utf_' + data.adhaar_no + '/' + data.voter_id + '/' + data.constituency + '/' + data.candidateId;
    var url = this.state.rootURL + "submitVote";
    var reponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': sendData,
        'Content-Type': 'application/json',
        // 'AcceptThis1': data.adhaar_no,
        // 'AcceptThis2': data.voter_id,
        // 'AcceptThis3': data.constituency,
        // 'AcceptThis4': data.candidateId
      },
      //body: JSON.stringify(data)
    });
    var result = await reponse.json();
    if(result.success) {
        allData[index].activeClassIs = true;
        this.setState({
          resData: allData
        });
        $('#votedSuccessModal').modal('show');
      } else {
        //alert(result.msg);
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

  SubmitVote(e, params, index) {
    var userData = JSON.parse(sessionStorage.getItem('userData'));
    var data = {
      adhaar_no: this.dataEncryption(userData.adhaar_no.toString()),
      voter_id: this.dataEncryption(userData.voter_id),
      constituency : this.dataEncryption(params.constituency),
      candidateId:  this.dataEncryption(params.candUniqueId)
    };
    this.voteSubmiting(data, index);
  }

  votedSuccessfuly(e) {
    this.props.history.push('/Landing');
  }

  closeToaster(e) {
    var msgObj = this.state.errorMsgObj;
      msgObj.alertIs = false;
      this.setState({
        errorMsgObj: msgObj
      });
  }

  render(){
    let boxClass = ["toast", "cstm-toaster"];
    if(this.state.errorMsgObj.alertIs) {
      boxClass.push('showToast');
      boxClass.push(this.state.errorMsgObj.alertClass);
    }
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
        <div className="votingportal">
          <div className="voting-place">Place: <strong>{this.state.getFirstObj.city || '--'}</strong></div>
          <div className="innerbox">
            {this.state.resData.map((item, index) => (
                <div className="member1" key={index}>
                    <div className="icon">
                        <img src={item.party_symbol} alt="Symbol" />
                    </div>
                    <div className="partie">
                        <h5>{item.first_name + ' ' +item.last_name}</h5>
                        <p className="party-person">{item.full_name}</p>
                    </div>
                    <div className="voting">
                        <button type="button" onClick={this.SubmitVote.bind(this, item, index)} className={item.activeClassIs ? 'btn btn-success btn-sm active':'btn btn-success btn-sm'}>{item.activeClassIs ? 'VOTED':'VOTE'}</button>
                    </div>
                </div>
            ))}
          </div>
        </div>
        <div className="modal fade voted-success-modal" id="votedSuccessModal" tabIndex="-1" role="dialog" aria-labelledby="successModal"
          aria-hidden="true" data-backdrop="false" data-keyboard="false">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
                <div className="modal-body">
                  <div className="check">
                        <i className="fas fa-check"></i>
                   </div>
                    <p>You Voted Successfully!!!</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-success btn-block" onClick={this.votedSuccessfuly.bind(this)}>Close</button>
                </div>
            </div>
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

export default Dashboard;
