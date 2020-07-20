import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {PostData} from '../../services/PostData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import './Login.css';
import login from './try.png';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';

class Login extends Component {
	
constructor(){
super();
this.state = {
username: '',
password: '',
redirectToReferrer: false,
redirectToReferrerr: false,
redirectToReferrerz: false,
redirectToManage: false,
backToHome: false,
redirectToAdmin: false,
redirectToOtp:false,
};
this.data = {};
this.login = this.login.bind(this);
this.onChange = this.onChange.bind(this);
}
login() {
if(this.state.username && this.state.password){
	if(this.state.username=="admin" && this.state.password=="admin")
	{
		this.setState({redirectToAdmin: true})
	}
	else{
		PostData('login',this.state).then((result) => {

			console.log(result);
			if(result.success)
			{
				this.setState({redirectToOtp : true});
			}
			else
			alert(result.error);
			});
	}

}
else
	alert("Please enter username and password");
}
onChange(e){
this.setState({[e.target.name]:e.target.value});
}

render() {
		

 if(this.state.redirectToOtp)
{
	return(<Redirect to={'/otp'}/>)
}
else if(this.state.redirectToAdmin)
{
	return(<Redirect to={'/admindash'}/>)
}
else if(this.state.backToHome)
{
    return(<Redirect to={'/'}/>)
}
return (
	<div class="whole">
	<div>
		<img class="login"src= {login} alt="pic" />
	<button class="backtohome" onClick={(event)=>{
		this.setState({backToHome: true})
	}}><FontAwesomeIcon icon={faHome} /> Home</button>
<div className="row" id="Body">
<div className="monica">

 <center><Avatar >
          <LockOutlinedIcon />
        </Avatar>
		<h4>Sign in</h4></center>
 <br/>
<input type="text" name="username" autocomplete="off" placeholder="Username" onChange={this.onChange}/>
<input type="password" name="password" placeholder="Password" onChange={this.onChange}/>
<p><a href="/forgotpassword">Forgot Password?</a></p>
<div class="btnstyle"><input type="submit" className="button" value="Login" onClick={this.login}/></div>
<p class="para">Not yet a member ? <a href="/signdoc">  Register</a></p>
</div>
</div>
</div>
</div>
);
}
}
export default Login;