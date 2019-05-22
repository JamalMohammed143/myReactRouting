import React, {
    Component
  } from 'react';
  import './../css/login.css';
  //import * as moment from "moment";
  import $ from 'jquery';
  import Popper from 'popper.js';
  import 'bootstrap/dist/js/bootstrap.bundle.min';
  
  class ToasterBox extends Component {
    constructor(props) {
      super(props);
      console.log('props',props);
      this.state = {
        rootURL: "http://192.168.1.98:1987/apiCtrl/",
        isLoader: true,
        aadharno: "",
        voterid: "",
        errorMsgObj: props.obj
      };
    }
    componentDidMount() {
        
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
      <div>
        <div className={this.state.errorMsgObj.alertIs ? "toaster-bg showToast" : "toaster-bg"}></div>
        <div className={boxClass.join(' ')} role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <strong className="mr-auto">{this.state.errorMsgObj.alertTitle}</strong>
            <button type="button" className="close" data-dismiss="toast" aria-label="Close" onClick={this.closeToaster.bind(this)} autoFocus><i className="fas fa-times"></i></button>
          </div>
          <div className="toast-body">{this.state.errorMsgObj.alertMsg}</div>
        </div>
      </div>
      );
    }
  }
  
  export default ToasterBox;