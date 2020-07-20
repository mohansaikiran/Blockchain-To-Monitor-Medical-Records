import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {PostData} from '../../services/PostData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import './otp.css';
import Avatar from '@material-ui/core/Avatar';
import LockOpenIcon from '@material-ui/icons/LockOpen';
class otp extends Component
{
    constructor()
    {
        super();
        this.state={
            backToHome:false,
            redirectToReferrer: false,
            redirectToReferrerr: false,
            redirectToReferrerz: false,
            redirectToManage: false,
            otp,
        }
        this.onChange=this.onChange.bind(this);
        this.verifyOtp=this.verifyOtp.bind(this);
    }
    onChange(e){
        this.setState({[e.target.name]:e.target.value});
        
        }

    verifyOtp()
    {
        if(this.state.otp>0){
            PostData('verifyOtp',this.state).then((result) => {
    if(result.error)
    {
        alert(result.error)
    }
    else{
        let responseJson = result;
        if(responseJson.userData){
        let jsondata = JSON.stringify(responseJson.userData);
        sessionStorage.setItem('userData',jsondata);
        this.data = JSON.parse(sessionStorage.getItem('userData'));
        if(this.data.username=="admin" && this.data.password=="admin")
            this.setState({redirectToReferrerr: true});
        else if(this.data.id==-1 && this.data.username=="management" && this.data.password=="management")
        this.setState({redirectToManage: true});
        else if(this.data.id<999)
        this.setState({redirectToReferrer: true});
        else if(this.data.id>=1000)
        this.setState({redirectToReferrerz: true});
        
        
        }
    }
               
            });
            }
            else
                alert("Please enter OTP");
    }
    render()
    {
        if (this.state.redirectToReferrer) {
            return (<Redirect to={'/doctordash'}/>)
            }
            else if(this.state.redirectToReferrerr) {
            return (<Redirect to={'/admindash'}/>)
            }
            else if(this.state.redirectToReferrerz)
            {
                return(<Redirect to={'/Patientdash'}/>)
            }
            else if(this.state.redirectToManage)
            {
                return(<Redirect to={'/management'}/>)
            }
            else if(this.state.backToHome)
            {
                return(<Redirect to={'/'}/>)
            }
        return(
            <div class="whole2">
	<div>
	<button class="backtohome2" onClick={(event)=>{
		this.setState({backToHome: true})
	}}><FontAwesomeIcon icon={faHome} /> Home</button>
<div className="row" id="Body">
<div className="monica2">
<br/><br/>
 <center><Avatar >
          <LockOpenIcon />
        </Avatar><br/>
		<h4>Verify OTP</h4>
        <h6>Please enter the OTP sent to your registered Email address</h6></center>
 <br/>
<center>
<input type="text" autocomplete="off" name="otp" class="writeemail1" placeholder="Enter OTP" onChange={this.onChange}/>
</center>
<div class="btnstyle"><input type="submit" className="button" value="Verify OTP" onClick={this.verifyOtp}/><br/><br/></div>
</div>
</div>
</div>
</div>
        )
    }
}
export default otp;