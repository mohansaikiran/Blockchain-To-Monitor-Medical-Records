import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import './Admindash.css';
import {PostData} from '../../services/PostData';
import UserFeed from "../UserFeed/UserFeed";
import { confirmAlert } from 'react-confirm-alert';
import '../../styles/react-confirm-alert.css';
import axios from 'axios';
import Linkify from 'react-linkify';
import Web3 from 'web3';
import Marketplace from '../../abis/Marketplace.json';
import docimg from './doc2.png';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Admindash extends Component {
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
        const networkId = await web3.eth.net.getId()
        const networkData = Marketplace.networks[networkId]
        //const networkData1 = DocReg.networks[networkId]
        if(networkData) {
		  const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
		  this.setState({ marketplace })
		  const doctorCount = await marketplace.methods.docCount().call()
	  this.setState({doctorCount})
      for (var i = 1; i <= doctorCount; i++) {
		const doctor = await marketplace.methods.doctors(i).call()
		if(doctor.id==1)
        this.setState({
          doctors: [...this.state.doctors, doctor]
        })
      }
		}
		else{
			window.alert('Marketplace contract not deployed to detected network.')
		}
	}
constructor(props) {
super(props);

this.state = {
contacts:[],
doctors:[],
redirectToReferrer: false,
};
this.logout = this.logout.bind(this);
this.createDoctor=this.createDoctor.bind(this)
}

componentDidMount() {
    const url = 'http://localhost:85/react-php/api/details.php'
    axios.get(url).then(response => response.data)
    .then((data) => {
      this.setState({ contacts: data })
      console.log(this.state.contacts)
     })
  }
  createDoctor(id,name,spec,email,addr,hash) {
	console.log("in the function createDoctor")
	let doc=window.web3.eth.accounts.create();
	console.log(doc.address)
	console.log(doc)
	this.state.marketplace.methods.createDoctor(id,name,spec,email,addr,hash,doc.address,doc.privateKey).send({from : this.state.account})
	.once('receipt', (receipt) => {
	  //this.setState({ loading: false })
	})
  }
  

logout(){
//sessionStorage.setItem("userData",1234);
sessionStorage.clear();
this.setState({redirectToReferrer: true});
}

render() {
if (this.state.redirectToReferrer) {
return (<Redirect to={'/login'}/>)
}
return (
<div class="maindiv">

<div className="row" id="Body">
<div className="medium-12 columns">
<h1 class="welcome1"> Admin Profile </h1>
<a href="#" onClick={this.logout} className="logout">Logout</a>
		<h3 class="docverify">Doctor Verification</h3>
        {
          this.state.contacts.map((contacts) => (
          <div class="doctotlist">
          <img class="docadmin" src={docimg} alt="pic"/>
          <p class="doctordetailsp">
          Name : { contacts.name }<br/>
          Doctor ID : { contacts.doc_id}<br/>
          Specialization : {contacts.spec}<br/>
          Address : {contacts.address}<br/>
          Username : {contacts.username}<br/>
          Password : {contacts.password}<br/>
          Email : {contacts.email}<br/>
          </p>
          <p class="verify">
          Certificate : <a target='_blank'
    href={'http://127.0.0.1:8080/ipfs/' + contacts.filehash}>{ contacts.filehash }</a>
          </p>
          <button class="acceptdoc" onClick={ (event) =>
				{
					
					let did = parseInt(contacts.doc_id);
					let uname = contacts.username;
          let pword = contacts.password;
          let docemail=contacts.email;
					this.postData = {doct_id:did,username:uname,pasword:pword,email:docemail};
					PostData('changestat', this.postData).then((result) => {
						
						
					
					if(result.success)
					{
					alert(result.success);
					this.createDoctor(contacts.doc_id,contacts.name,contacts.spec,contacts.email,contacts.address,contacts.filehash)
					}
					else
					alert(result.error)
				}
				);
				}
				} 
		 > <FontAwesomeIcon icon={faThumbsUp}/> Accept
       </button><button class="rejectdoc" onClick = { (event) =>
				{
					alert("Doctor not approved");
			} }><FontAwesomeIcon icon={faThumbsDown}/> Reject</button>
            
          </div>
        
		
        ))}

</div>
</div>
<div>
	<table>
<tbody id="DoctorsList">
              { this.state.doctors.map((doctor,key)=> { 
                  return(
                    <tr key={key}>
                    <th scope="row">{doctor.id.toString()}</th>
                    <td>{doctor.name}</td>
</tr>
)
})
}
</tbody>
</table>
</div>
</div>
);
}
}

export default Admindash;