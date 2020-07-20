import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import './Doctordash.css'
import {PostData} from '../../services/PostData';
import UserFeed from "../UserFeed/UserFeed";
import { confirmAlert } from 'react-confirm-alert';
import '../../styles/react-confirm-alert.css';
import axios from 'axios';
import Linkify from 'react-linkify';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Login from '../../components/Login/Login';
import Web3 from 'web3';
import Marketplace from '../../abis/Marketplace.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo, faMapMarker, faMapMarkerAlt, faIdBadge ,faFileAlt, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { faListAlt , faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTint } from '@fortawesome/free-solid-svg-icons';
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons';
import doc from './doc2.png';
import pat from './pat1.png';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import docround from './docround.png';
import fileimg from './file1.png';
import prescription from './prescription.png';

const ipfsClient = require('ipfs-http-client')
class Doctordash extends Component {
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
  const doctorCount = await marketplace.methods.docCount().call()
this.setState({doctorCount})
let docdataacc = JSON.parse(sessionStorage.getItem('userData'));

  for (var i = 1; i <= doctorCount; i++) {
const doctor = await marketplace.methods.doctors(i).call()
console.log(doctor)
if(doctor.id==docdataacc.id)
{ 
  console.log(doctor)
  
    this.setState({
      doctors: [...this.state.doctors, doctor],
      dname: doctor.name,
      did: doctor.id,
    })
      
       
    
  }
}
window.pid=new Array();
const appCount=await marketplace.methods.AppCount().call()
this.setState({appCount})
for(var i=0;i<=appCount;i++) {
  const app=await marketplace.methods.apps(i).call()
  console.log(parseInt(app.docid))
  if(app.docid==docdataacc.id)
  { window.pid[i]=app.patid;
    console.log(app)
  this.setState({
    appointments: [...this.state.appointments, app],
  })
}
}




const patCount= await marketplace.methods.patCount().call()
this.setState({patCount})
//const patdata = JSON.parse(sessionStorage.getItem('userData'));

for (var i = 1000; i <= patCount; i++) {
  const patient = await marketplace.methods.patients(i).call()
  const pat=parseInt(patient.id)
  //console.log(parseInt(patient[0]))
  //console.log(pat)
  //console.log(patdata.id)
  for(var j=1;j<appCount;j++)
  {
    if(pat==window.pid[j])
  {
    console.log(patient)
      this.setState({
        patients: [...this.state.patients, patient],
      })
    }
  }
  
  }



}
else{
  window.alert('Marketplace contract not deployed to detected network.')
}
}
constructor(props) {
super(props);

this.state = {
patid: 0,
filename: '',
filehash: '',
contacts:[],
doc_id: 0,
added_file_hash: null,
redirectToReferrere: false,
doctors:[],
appointments:[],
patients:[],
dname: '',
did: 0,
redirect: false,
presci:[],
redirectprescribe: false,
prehash: null,
};
this.data = {};
this.ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001');
this.captureFile = this.captureFile.bind(this);
this.captureFile1 = this.captureFile1.bind(this);
this.saveToIpfs = this.saveToIpfs.bind(this);
this.saveToIpfs1 = this.saveToIpfs1.bind(this);

this.handleSubmit = this.handleSubmit.bind(this);
this.logout = this.logout.bind(this);
this.onChange = this.onChange.bind(this);
this.upload = this.upload.bind(this);
this.FileAccess=this.FileAccess.bind(this);
this.grantAccess=this.grantAccess.bind(this);
this.onCha=this.onCha.bind(this);
this.uploadpre=this.uploadpre.bind(this);
this.uploadPrescription=this.uploadPrescription.bind(this);

}

componentDidMount() {
  let data = JSON.parse(sessionStorage.getItem('userData'));


   window.setTimeout(this.grantAccess,2000);
}
grantAccess() {
  const url = 'http://localhost:85/react-php/api/fileupdate.php'
  axios.get(url).then(response => response.data)
  .then((data) => {
    this.setState({ contacts: data })
    console.log(this.state.contacts)
    this.state.contacts.map((cont)=>{

      if(cont.doc_id==this.state.did)

      { window.flag=1;     
      }
      
      
     })
     if(window.flag==1)
     {
      alert("Your file request has been approved.\n Please check your Dashboard")
      window.flag=0;
     }
   })
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

  captureFile1(event) {
    event.stopPropagation()
    event.preventDefault()
    if (document.getElementById('keepFilename').checked) {
      this.saveToIpfsWithFilename(event.target.files)
    } else {
      this.saveToIpfs1(event.target.files)
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

async saveToIpfs1 (files) {
  const source1 = this.ipfs.add(
    [...files],
    {
      progress: (prog) => console.log(`received: ${prog}`)
    }
  )
  try {
    for await (const file of source1) {
      console.log(file)
      this.setState({ prehash: file.path })
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

uploadFiles(patid,doc_id,dname,filename,filehash)
{
  this.state.marketplace.methods.UploadReports(patid,doc_id,dname,filename,filehash).send({from : this.state.account})
	.once('receipt', (receipt) => {
	  //this.setState({ loading: false })
	})
}
uploadPrescription(patid,doc_id,dname,filename,presci,filehash)
{
  this.state.marketplace.methods.uploadPrescription(patid,doc_id,dname,filename,presci,filehash).send({from : this.state.account})
	.once('receipt', (receipt) => {
	  //this.setState({ loading: false })
	})
}
upload() {
  
console.log(this.state)
let data={
  patid: this.state.patid,
  doc_id: this.state.doc_id,
  filename: this.state.filename,
  filehash: this.state.added_file_hash,
  dname: this.state.dname,
}
if(this.state.patid && this.state.filename){
PostData('upload',data).then((result) => {
if(result.success)
{
  this.uploadFiles(this.state.patid,this.state.doc_id,this.state.dname,this.state.filename,this.state.added_file_hash);
alert(result.success);
}
else
alert(result.error);

}
);
}
else
alert("Please enter all the fields");
document.getElementById("myform").reset();
}


ApproveAppointment(patadd,docadd)
      {
        this.state.marketplace.methods.ApproveAppointment(patadd,docadd).send({ from: this.state.account })
        .once('receipt', (receipt) => {
          //this.setState({ loading: false })
        })
        console.log("Appointment Approved")
        alert("Appointment Confirmed")
      
      }

FileAccess(patid,docid) {
 let data1 = {
   did: docid,
   pid: patid,

 }
 console.log(data1)
 
 if(this.state.patid && this.state.doc_id){
  PostData('FileAccess',data1).then((result) => {
  if(result.success)
  {
  alert(result.success);
  }
  else
  alert(result.error);
  }
  );
  }
  //else
  //alert("Patient or Doctor ID not available");
}

onChange(e){
  this.setState({[e.target.name]:e.target.value});
  }
  logout(){
    this.setState({redirectToReferrere: true});
    }
onCha(e) {
  this.setState({[e.target.name]:e.target.value});
}
uploadpre() {
  
console.log(this.state)
let data={
  patid: this.state.patid,
  doc_id: this.state.doc_id,
  filename: this.state.filename,
  filehash: this.state.prehash,
  datep: this.state.presci,
  dname: this.state.dname,
}
if(this.state.patid && this.state.filename && this.state.presci){
PostData('uploadpre',data).then((result) => {
if(result.success)
{
alert(result.success);
this.uploadPrescription(this.state.patid,this.state.doc_id,this.state.dname,this.state.filename,this.state.presci,this.state.prehash);
}
else
alert(result.error);
this.setState({redirectprecribe: true});
}
);
}
else
alert("Please enter all the fields");
document.getElementById("myform").reset();
}
render() {
  if(this.state.redirectToReferrere)
  {
  return (<Redirect to={'/login'}/>)
  }

  //let docdata = JSON.parse(sessionStorage.getItem('userData'));
  this.data = JSON.parse(sessionStorage.getItem('userData'));
  this.state.doc_id = this.data.id;
if (this.state.redirectToReferrer) {
return (<Redirect to={'/login'}/>)
}
if (this.state.redirect) {
  return (<Redirect to={'/viewreports'}/>)
  }
return (
<div className="row" id="Body">
<div className="medium-12 columns">
<h1 class="welcome1"> <img class="doc"src= {doc} alt="pic" /> Doctor Profile </h1>

<a href="/login" onClick={this.logout} className="logout"><FontAwesomeIcon icon={faHandPointLeft} /> Logout</a>            

<Tabs>
    <TabList>
      <Tab><FontAwesomeIcon icon={faInfo} /> View details</Tab>
	  <Tab class="tabs"><FontAwesomeIcon icon={faListAlt} /> Patients</Tab>
	  <Tab><FontAwesomeIcon icon={faCheck} /> Patient approval</Tab>
	  <Tab><FontAwesomeIcon icon={faUpload} /> Upload reports</Tab>
    <Tab><FontAwesomeIcon icon={faUpload} /> Upload Prescription</Tab>
    
    </TabList>
 
    <TabPanel>
      <h3 class="sunhead">My Profile</h3>
      
      { this.state.doctors.map((doctor)=> { 
        console.log(doctor);
                  return(
                    <div>
                      <Card class="card">
      <CardContent>
        <div class="updiv"></div>
        <center><img class="docround"src= {docround} alt="pic" /></center>
        <center><h4><b>Dr. {doctor.name}</b></h4>
        <h6>{doctor.spec}</h6>
        <h6><FontAwesomeIcon icon={faMapMarkerAlt} /> {doctor.addr}</h6></center>
        <p class="content">
        Doctor ID <FontAwesomeIcon icon={faIdBadge} /> : {this.data.id}<br/>
        Email <FontAwesomeIcon icon={faEnvelope} /> : {doctor.email} <br/>
        Account Address <FontAwesomeIcon icon={faAddressCard} /> :<br/> {doctor.docacc}<br/>
        Document <FontAwesomeIcon icon={faFileAlt} /> :<br/><a target='_blank'
                   href={'http://127.0.0.1:8080/ipfs/' + doctor.filehash}>{ doctor.filehash }</a>
        </p>
        <center><button class="privatekey1" onClick= {(event)=>{
          var val=prompt("Please enter your password")
          if(val==this.data.password)
          { this.state.doctors.map((doctor,key)=> { 
            var str="PLEASE COPY YOUR PRIVATE KEY AND IMPORT IN METAMASK        "
            window.confirm(str+doctor.pri)
          })
            
          }
          else{
            alert("Please enter correct password")
          }
      }
    }> Get Private Key

      </button></center>
        
      </CardContent>
    </Card>
                  
                  </div>

)
})
}
    </TabPanel>
	<TabPanel>
      <h3 class="sunhead">Patients</h3>
      {
        this.state.appointments.map((app)=> {
          return(
            <div class="apts">
              <img class="pat"src= {pat} alt="pic" />
              <h3 class="patname1" >{app.patname}</h3>
                  <div class="patdet">
                  <h6>Patient ID <FontAwesomeIcon icon={faIdBadge} /> : {parseInt(app.patid)}</h6>
                  <h6>Address <FontAwesomeIcon icon={faMapMarkerAlt} /> : {app.addr}</h6>
                  </div>
                  
                  
                  <button class="reqacc" 
                       onClick= { (event)=> {
                        let data1 = {
                          did: parseInt(app.docid),
                          pid: parseInt(app.patid),
                       
                        }
                        console.log(data1)
                        
                        if(app.docid && app.patid){
                         PostData('FileAccess',data1).then((result) => {
                         if(result.success)
                         {
                         alert(result.success);
                         }
                         else
                         alert(result.error);
                         }
                         );
                         }
                       }}>Request Access</button>
                    {
                      this.state.contacts.map((contacts)=>{
                        if(contacts.status==2 && contacts.pat_id==app.patid)
                        {
                      
                        return(
                          <div class="contain">
                          <button class="viewrep"
                          onClick={(event)=>

                          { 
                            
                            let obj= {
                              patid: contacts.pat_id,
                              docname: contacts.dname,
                              file: contacts.name,
                              filehash: contacts.filehash,
                              ind: contacts.ind,
                            }
                            sessionStorage.setItem('filedata',JSON.stringify(obj));
                            
                            this.setState({redirect: true})
                          
                          }}
                          

                          >View Reports</button>
                          </div>
                        )
                        }
                      })
                    }
            
            </div>
          )
        })
        }

      
    </TabPanel>
	<TabPanel>
      <h3 class="sunhead">Appointment Approval</h3>
      
      {
        this.state.appointments.map((app)=> {
          return(
            <div class="apts">
              <img class="pat"src= {pat} alt="pic" />
              <h3 class="patname1" >{app.patname}</h3>
                  <div class="patdet">
                  <h6>Patient ID <FontAwesomeIcon icon={faIdBadge} /> : {parseInt(app.patid)}</h6>
                  <h6>Address <FontAwesomeIcon icon={faMapMarkerAlt} /> : {app.addr}</h6>
                  </div>
                  
                  
                  <button class="appt1"
                         onClick=
                           {
                          (event)=>{
                          const val1=app.patadd;
                          const val2=app.docadd;
                          this.ApproveAppointment(val1,val2);
                          console.log(app)
          }
        }>Approve Appointment
           </button>
                    
            
            </div>
          )
        })
        }
          
    </TabPanel>
	<TabPanel>
      <h3 class="sunhead">Upload Report</h3>
      <div className="row " id="sBody">
	  <div className="medium-5 columns left">
	  <form id="myform">
	  <input type="number" name="patid" placeholder="Patient ID" onChange={this.onChange}/>
	  <input type="text" autocomplete="off" name="filename" placeholder="File name" autocomplete="off" onChange={this.onChange}/>
	  <form id='captureMedia' onSubmit={this.handleSubmit}>
          <input type='file' onChange={this.captureFile} /><br/>
          <label htmlFor='keepFilename'><input type='checkbox' id='keepFilename' name='keepFilename' /> keep filename</label>
	  </form>
	  <div>
		<label>Hash:</label><a target='_blank'
			href={'http://127.0.0.1:8080/ipfs/' + this.state.added_file_hash}>
			{this.state.added_file_hash}</a>
	  </div>
	  <input type="text" autocomplete="off" name="filehash" placeholder="File Hash" value={this.state.added_file_hash} onChange={this.onChange}/>
	  <input type="button" className="button" value="Upload" onClick={this.upload}/>
	  </form>
  
	  </div>
    <img class = "rep" src={fileimg} alt="pic"/>
	  </div>

    </TabPanel>
    <TabPanel>
    <h3 class="sunhead">Upload Prescription</h3>
      <div className="row " id="sBody">
	  <div className="medium-5 columns left">
	  <form id="myform">
	  <input type="number" name="patid" placeholder="Patient ID" onChange={this.onCha}/>
	  <input type="text" autocomplete="off" name="filename" placeholder="Presciption name" autocomplete="off" onChange={this.onCha}/>
    <input type="date" name="presci" onChange={this.onCha}/>
	  <form id='captureMedia' onSubmit={this.handleSubmit}>
          <input type='file' onChange={this.captureFile1} /><br/>
          <label htmlFor='keepFilename'><input type='checkbox' id='keepFilename' name='keepFilename' /> keep filename</label>
	  </form>
	  <div>
		<label>Hash:</label><a target='_blank'
			href={'http://127.0.0.1:8080/ipfs/' + this.state.prehash}>
			{this.state.prehash}</a>
	  </div>
	  <input type="text" autocomplete="off" name="prehash" placeholder="File Hash" value={this.state.prehash} onChange={this.onCha}/>
	  <input type="button" className="button" value="Upload" onClick={this.uploadpre}/>
	  </form>
    
	  </div>
    <img class="pres" src={[prescription]} alt="pic"/>
	  </div>
    </TabPanel>
  </Tabs>
</div>
</div>
);

}

}

export default Doctordash;