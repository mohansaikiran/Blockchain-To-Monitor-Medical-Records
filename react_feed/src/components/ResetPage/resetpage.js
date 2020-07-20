import React, {Component} from 'react';
import {PostData} from '../../services/PostData';
import {Redirect} from 'react-router-dom';
import './resetpage.css'
class resetpage extends Component
{
    
    constructor(props)
    {
        super(props);
        this.state={
            password:'',
            confirmpassword:'',
            redirectLogin: false,
        }
        this.onChange=this.onChange.bind(this);
        this.newPassword=this.newPassword.bind(this);
    }
    
    newPassword()
    {
        const search=window.location.search;
        const params=new URLSearchParams(search);
        const id=params.get('id');
        if(this.state.password && this.state.confirmpassword)
        {
            if(this.state.password==this.state.confirmpassword){
                let data={
                    password: this.state.password,
                    id: id,
                }
                
                PostData('newPassword',data).then((result) => {
                    console.log(result)
                    if(result.success)
                    {
                     alert(result.success)
                    this.setState({redirectLogin: true})
                    }
                    else{
                        alert(result.error)
                    }
                });
                }
                else
                    alert("Passwords don't match");
        }
        else{
            alert("Enter new password");
        }
       
    }
    onChange(e){
        this.setState({[e.target.name]:e.target.value});
        }
    render()
    {
        if(this.state.redirectLogin)
        {
            return(<Redirect to={'/login'}/>)
        }
        return(
            <div class="resetdiv">
                <h3>Reset Password</h3><br/>
                <input type="password" class="resetinputs" name="password" placeholder="Enter New Password" onChange={this.onChange}/>
                <input type="password" class="resetinputs" name="confirmpassword" placeholder="Confirm New Password" onChange={this.onChange}/>
                <br/><button class="savebutton" value="Save" onClick={this.newPassword}>SAVE</button>
            </div>
        )
    }
}
export default resetpage;