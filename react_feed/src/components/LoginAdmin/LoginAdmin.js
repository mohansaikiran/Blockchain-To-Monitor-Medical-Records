import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {PostData} from '../../services/PostData';
class LoginAdmin extends Component {
constructor(){
super();
this.state = {
username: '',
passworde: '',
redirectToReferrer: false
};
this.login = this.login.bind(this);
this.onChange = this.onChange.bind(this);
}
login() {
if(this.state.username && this.state.passworde){
PostData('loginadmin',this.state).then((result) => {
let responseJson = result;
if(responseJson.userData){
sessionStorage.setItem('userData',JSON.stringify(responseJson));
this.setState({redirectToReferrer: true});
}
else
alert(result.error);
});
}
else
	alert("Please enter username and password");
}
onChange(e){
this.setState({[e.target.name]:e.target.value});
}
render() {
if (this.state.redirectToReferrer) {
return (<Redirect to={'/Admindash'}/>)
}
if(sessionStorage.getItem('userData')){
return (<Redirect to={'/Admindash'}/>)
}
return (
<div className="row" id="Body">
<div className="medium-5 columns left">
<h4>Login Admin</h4>
<input type="text" autocomplete="off" name="username" placeholder="Username" onChange={this.onChange}/>
<input type="password" name="passworde" placeholder="Password" onChange={this.onChange}/>
<input type="submit" className="button" value="Login" onClick={this.login}/>
<a href="/login">Go back?</a>
</div>
</div>
);
}
}
export default LoginAdmin;