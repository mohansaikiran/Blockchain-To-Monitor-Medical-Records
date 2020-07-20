import React, {Component} from 'react';
import {PostData} from '../../services/PostData';
import {Redirect} from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './Signdoc.css';
const ipfsClient = require('ipfs-http-client')
class Signdoc extends Component {
constructor(props){
super(props);
this.state = {
username: '',
password: '',
name: '',
spec:'',
address: '',
email: '',
added_file_hash: null,
filehash: '',
redirectToReferrer: false
};
this.ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001');
this.captureFile = this.captureFile.bind(this);
this.saveToIpfs = this.saveToIpfs.bind(this);
this.handleSubmit = this.handleSubmit.bind(this);
this.signup = this.signup.bind(this);
this.onChange = this.onChange.bind(this);
}
captureFile(event) {
    event.stopPropagation()
    event.preventDefault()
    if (document.getElementById('keepFilename').checked) {
      this.saveToIpfsWithFilename(event.target.files)
    } else {
      this.saveToIpfs(event.target.files)
    }
}
async saveToIpfs (files) {
    const source = this.ipfs.add(
      [...files],
      {
        progress: (prog) => console.log(`received: ${prog}`)
      }
    )
    try {
      for await (const file of source) {
        console.log(file)
        this.setState({ added_file_hash: file.path })
      }
    } catch (err) {
      console.error(err)
    }
}
async saveToIpfsWithFilename (files) {
    const file = [...files][0]
    const fileDetails = {
      path: file.name,
      content: file
    }
    const options = {
      wrapWithDirectory: true,
      progress: (prog) => console.log(`received: ${prog}`)
    }

    const source = this.ipfs.add(fileDetails, options)
    try {
      for await (const file of source) {
        console.log(file)
        this.setState({ added_file_hash: file.cid.toString() })
      }
    } catch (err) {
      console.error(err)
    }
}
handleSubmit (event) {
    event.preventDefault()
  }
signup() {
if(this.state.username && this.state.password && this.state.name && this.state.address && this.state.email && this.state.spec){
	alert("Your request has been submitted to admin please wait for approval");
PostData('signdoc',this.state).then((result) => {
let responseJson = result;
if(responseJson.userData){
//sessionStorage.setItem('userData',JSON.stringify(responseJson));
this.setState({redirectToReferrer: true});
}
else
alert(result.error);
})
}
else
	alert("Please enter all the fields");
}

onChange(e){
this.setState({[e.target.name]:e.target.value});
}
render() {
if (this.state.redirectToReferrer) {
return (<Redirect to={'/login'}/>)
}
return (
<div className="row " id="sBody">
<div className="medium-5 columns left">
<Tabs>
	<TabList>
	  <Tab>REGISTER DOCTOR</Tab>
	  <Tab><a href="/signup">REGISTER PATIENT</a></Tab>
	</TabList>
	<TabPanel>
		<h4>Signup doctor</h4>
		<input type="text" autocomplete="off" name="name" placeholder="Name" onChange={this.onChange}/>
		<input type="text" autocomplete="off" name="username" placeholder="Username" onChange={this.onChange}/>
		<input type="password" name="password" placeholder="Password" onChange={this.onChange}/>
    <input type="text" autocomplete="off" name="spec" placeholder="Specialization" onChange={this.onChange}/>
		<input type="text" autocomplete="off" name="email" placeholder="Email" onChange={this.onChange}/>
		<textarea name="address" rows="5" cols="20" placeholder="Address" onChange={this.onChange}/>
		<form id='captureMedia' onSubmit={this.handleSubmit}>
           <input type='file' onChange={this.captureFile} /><br/>
           <label htmlFor='keepFilename'><input type='checkbox' id='keepFilename' name='keepFilename' /> keep filename</label>
		</form>
		<div>
		<label>Hash:</label><a target='_blank'
			href={'http://127.0.0.1:8080/ipfs/' + this.state.added_file_hash}>
			{this.state.added_file_hash}</a>
		</div>
		<input type="text" autocomplete="off" name="filehash" placeholder="File Hash" value={this.state.added_file_hash} onChange={this.onChange} />
		<input type="submit" className="button" value="Sign Up" onClick={this.signup}/>
	</TabPanel>
</Tabs>
<button class="appointment3" onClick={(event)=>{
  this.setState({redirectToReferrer : true});
}}>Back</button>
</div>

</div>
);
}
}
export default Signdoc;