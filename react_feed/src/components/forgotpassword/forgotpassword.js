import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {PostData} from '../../services/PostData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import './forgotpassword.css';
import Avatar from '@material-ui/core/Avatar';
import LockOpenIcon from '@material-ui/icons/LockOpen';
class forgotpassword extends Component
{
    constructor()
    {
        super()
        this.state={
            backToHome:false,
            email:'',
            uname:'',
            redirectLog : false,
        }
        this.onChange=this.onChange.bind(this);
        this.fPassword=this.fPassword.bind(this);
    }
    onChange(e){
        this.setState({[e.target.name]:e.target.value});
        }
    fPassword()
        {
            console.log(this.state.email)
            if(this.state.email && this.state.uname){
                PostData('fPassword',this.state).then((result) => {
                    if(result.success)
                        {
                            this.setState({redirectLog : true})
                        }
                        else
                        {
                                console.log("Resetting password failed!")
                        }
        
                });
                }
                else
                    alert("Please enter an Email Id");
        }
    render()
    {
        if(this.state.backToHome)
{
	return(<Redirect to={'/'}/>)
}
else if(this.state.redirectLog)
{
	return(<Redirect to={'/login'}/>)
}
        return(
            <div class="whole1">
	<div>
	<button class="backtohome1" onClick={(event)=>{
		this.setState({backToHome: true})
	}}><FontAwesomeIcon icon={faHome} /> Home</button>
<div className="row" id="Body">
<div className="monica1">
<br/><br/>
 <center><Avatar >
          <LockOpenIcon />
        </Avatar><br/>
		<h4>Forgot Password</h4></center>
 <br/>
<center>
<input type="text" name="uname" class="writeemail" autocomplete="off" placeholder="Enter Username " onChange={this.onChange}/>
<input type="text" name="email" class="writeemail" autocomplete="off" placeholder="Enter Email address" onChange={this.onChange}/>
</center>
<div class="btnstyle"><input type="submit" className="button" value="Send Email" onClick={this.fPassword}/><br/><br/></div>
</div>
</div>
</div>
</div>
        )
    }
}
export default forgotpassword;