import React, {Component} from 'react';
import {PostData} from '../../services/PostData';
import {Redirect} from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Web3 from 'web3';
import Marketplace from '../../abis/Marketplace.json';
import './Signup.css'
class Signup extends Component {
	async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
      }
    
      async loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      }
	  async loadBlockchainData() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        var acc = web3.eth.accounts[0];
        console.log(acc)
        const networkId = await web3.eth.net.getId()
        const networkData = Marketplace.networks[networkId]
        //const networkData1 = DocReg.networks[networkId]
        if(networkData) {
		  const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
		  this.setState({ marketplace })
		  const patCount = await marketplace.methods.patCount().call()
		  console.log(parseInt(patCount._hex))
		  let patid=parseInt(patCount._hex)
		  console.log(patid)
		  this.setState({patCount})
		  console.log(this.state)
      for (var i = 1; i <= patCount; i++) {
		const patient = await marketplace.methods.patients(i).call()
        this.setState({
          patients: [...this.state.patients, patient]
        })
      }
		}
		else{
			window.alert('Marketplace contract not deployed to detected network.')
		}
	}
constructor(props){
super(props);
this.state = {
username: '',
password: '',
email: '',
name: '',
id: 0,
bloodgrp: '',
address: '',
redirectToReferrera: false,
patients:[],
patCount:0 ,
};
this.signup = this.signup.bind(this);
this.onChange = this.onChange.bind(this);
this.createPatient= this.createPatient.bind(this);
}

signup() {
	
		  
	

		  let patid=parseInt(this.state.patCount._hex)
		  console.log(patid)
		let data= {
			id: patid+1,
			username:this.state.username,
			password: this.state.password,
			email: this.state.email,
		}

	
if(this.state.username && this.state.password && this.state.email && this.state.name && this.state.address){
PostData('signup',data).then((result) => {
if(result.success)
{
	//alert(result.success);
	this.setState({redirectToReferrera: true});
	this.createPatient(this.state.name,this.state.email,this.state.bloodgrp,this.state.address);
}
else
	alert(result.error);
}
);
}
else
	alert("Please enter the details");
}
onChange(e){
this.setState({[e.target.name]:e.target.value});
}
createPatient(name,email,bloodgrp,addr) {
	console.log("in the function createDoctor")
	let pat=window.web3.eth.accounts.create();
	console.log(pat.address)
	console.log(pat)
	this.state.marketplace.methods.createPatient(name,email,bloodgrp,addr,pat.address,pat.privateKey).send({from : this.state.account})
	.once('receipt', (receipt) => {
	  //this.setState({ loading: false })
	})
  }
render() {
if (this.state.redirectToReferrera) {
return (<Redirect to={'/login'}/>)
}
return (
<div className="row " id="sBody">
<div className="medium-5 columns left">
<Tabs>
	<TabList>
	  <Tab>REGISTER PATIENT</Tab>
	  <Tab><a href="/signdoc">REGISTER DOCTOR</a></Tab>
	</TabList>
	<TabPanel>
	<h4>Signup</h4>
<input type="text" autocomplete="off" name="email" placeholder="Email" onChange={this.onChange}/>
<input type="text" autocomplete="off" name="name" placeholder="Name" onChange={this.onChange}/>
<input type="text" autocomplete="off" name="username" placeholder="Username" onChange={this.onChange}/>
<input type="password" name="password" placeholder="Password" onChange={this.onChange}/>
<input type="text" autocomplete="off" name="bloodgrp" placeholder="Blood Group" onChange={this.onChange}/>
<textarea name="address" rows="5" cols="20" placeholder="Address" onChange={this.onChange}/>
<input type="submit" className="button" value="Sign Up" onClick={this.signup}/>
</TabPanel>
</Tabs>
<button class="appointment3" onClick={(event)=>{
  this.setState({redirectToReferrera : true});
}}>Back</button>
</div>
</div>
);
}
}
export default Signup;