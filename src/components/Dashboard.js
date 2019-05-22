import React, {Component} from 'react';
//import logo from "../img/logo.png";
//import * as moment from "moment";
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Header from '../components/Header';
import ToasterBox from './ToasterBox';

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      rootURL:"http://192.168.1.201:1987/apiCtrl/",
      resData: [],
      userData: {},
      getFirstObj: {},
      isLoader: true,
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
      userData: userData,
      isLoader: true
    });
    var url = this.state.rootURL + 'getCandidates/' + userData.constituency;
    fetch(url).then(res => res.json()).then((result) => {
      var resultData = result.result;
      for (var i = 0; i < resultData.length; i++) {
        var element = resultData[i];
        element.activeClassIs = false;
      }
      this.setState({
        isLoader: false,
        resData: resultData,
        getFirstObj: result.result[0]
      });
    },(error) => {
        var msgObj = this.state.errorMsgObj;
        msgObj.alertIs = true;
        msgObj.alertMsg = "Something went wrong...";
        msgObj.alertTitle = "Error";
        msgObj.alertClass = "error-msg";
        this.setState({
          errorMsgObj: msgObj,
          isLoader: false
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
    this.setState({
      isLoader: true
    });
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
          resData: allData,
          isLoader: false
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
          errorMsgObj: msgObj,
          isLoader: false
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

  render(){
    return (
      <div className="dashboard-cont">
        <Header />
        <div className="votingportal">
          <div className="main-box">
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
        <ToasterBox obj={this.state.errorMsgObj} />
      </div>
    );
  }
}

export default Dashboard;
