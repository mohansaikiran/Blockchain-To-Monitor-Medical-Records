import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import './Patientdash.css'
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
import { faInfo, faThumbsUp , faHandPointLeft, faEnvelope , faSearch, faThumbsDown, faPrescription } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt , faMapMarker, faIdBadge , faTint , faAddressCard, faMapMarkerAlt, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import { faBook} from '@fortawesome/free-solid-svg-icons';
import Card from '@material-ui/core/Card';
import pat from './patient.png';
import CardContent from '@material-ui/core/CardContent';
import doctorimg from './doc2.png';
import fileimg from './file1.png';
import report1 from './file2.png';
import prescription from './prescription.png';
import paticon from './patient1.png';
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
const patCount= await marketplace.methods.patCount().call()
this.setState({patCount})
const patdata = JSON.parse(sessionStorage.getItem('userData'));

for (var i = 1000; i <= patCount; i++) {
  const patient = await marketplace.methods.patients(i).call()
  const pat=parseInt(patient.id)
  //console.log(parseInt(patient[0]))
  console.log(pat)
  console.log(patdata.id)
  if(pat==patdata.id)
  {
    console.log(patient)
      this.setState({
        patients: [...this.state.patients, patient],
        pid: patient.id,
      })
    }
  }

//for listing doctors and appointments
  const doctorCount = await marketplace.methods.docCount().call()
this.setState({doctorCount})
let pdata = JSON.parse(sessionStorage.getItem('userData'));

  for (var i = 1; i <= doctorCount; i++) {
const doctor = await marketplace.methods.doctors(i).call()
{ 
    this.setState({
      doctors: [...this.state.doctors, doctor],
       
    })
  }
}

const repCount=await marketplace.methods.repCount().call()
this.setState({repCount})
for(var i=0;i<=repCount;i++)
{    
    const rep= await marketplace.methods.reports(i).call()
    if(pdata.id==rep.patid)
    {console.log(rep)
    this.setState({
      reports: [...this.state.reports,rep]
    })
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
contacts:[],
patients:[],
patCount:0 ,
doctors:[],
reports:[],
pid: 0,
docToSearch: '',
redirectToReferrerz: false,
search : false,
docSearched :[],
showsearched:false,
};

this.logout = this.logout.bind(this);
this.grantAccess=this.grantAccess.bind(this);
this.searchChange=this.searchChange.bind(this);
}

componentDidMount() {
  let data = JSON.parse(sessionStorage.getItem('userData'));


   window.setTimeout(this.grantAccess,2000);
}
grantAccess() {
  const url = 'http://localhost:85/react-php/api/files.php'
  axios.get(url).then(response => response.data)
  .then((data) => {
    this.setState({ contacts: data })
    console.log(data)
    console.log(this.state.contacts)
    this.state.contacts.map((cont)=>{
      console.log(cont)
      if(cont.pat_id==this.state.pid)
      {
        window.tag=1;
      }
      
      
     })
     if(window.tag==1)
     {
      alert("You have Pending File Requests.\n Please check your Dashboard")
      window.tag=0;
     }
     
   })
   

}

searchChange(e)
{
  this.setState({[e.target.name]:e.target.value});
  this.setState({search:true});
}

bookAppointment(id1,id2) {
        
  //this.setState({ loading: true })
  this.state.marketplace.methods.bookAppointments(id1,id2).send({ from: this.state.account })
  .once('receipt', (receipt) => {
    //this.setState({ loading: false })
  })
  console.log("Appointment booked")
  
}

logout(){
  this.setState({redirectToReferrerz: true})
  if(this.state.redirectToReferrerz)
  {
  return (<Redirect to={'/login'}/>)
  }
  }

render() {
  let docdata = JSON.parse(sessionStorage.getItem('userData'));
if (this.state.redirectToReferrerz) {
return (<Redirect to={'/login'}/>)
}
return (
<div className="row" id="Body">
<div className="medium-12 columns">
<img class="paticon" src= {paticon} alt="pic" />
<h2 class="patprofile">Patient Profile</h2>
<a href="#" onClick={this.logout} className="logout"><FontAwesomeIcon icon={faHandPointLeft} /> Logout</a>

<Tabs>
    <TabList>
      <Tab><FontAwesomeIcon icon={faInfo} /> View details</Tab>
	  <Tab><FontAwesomeIcon icon={faCalendarAlt} /> Get Appointment</Tab>
	  <Tab><FontAwesomeIcon icon={faBook} /> View Reports</Tab>
	  <Tab><FontAwesomeIcon icon={faThumbsUp} /> Grant Access</Tab>
    </TabList>
    
     
    <TabPanel>

    <h3>My Profile</h3>
      
      { this.state.patients.map((patient)=> { 
                  return(
                    <div>
      <Card class="card1">
      <CardContent>
        <div class="updiv"></div>
        <center><img class="patround" src= {pat} alt="pic" /></center>
        <center>
          <h4>{patient.name}</h4>
        <h6><FontAwesomeIcon icon={faMapMarkerAlt} /> {patient.addr}</h6></center>
        <p class="content">
        Patient ID <FontAwesomeIcon icon={faIdBadge} /> : {docdata.id}<br/>
        Email <FontAwesomeIcon icon={faEnvelope} /> : {patient.email}<br/>
        Blood Group <FontAwesomeIcon icon={faTint} /> : {patient.blood} <br/>
        Account Address <FontAwesomeIcon icon={faAddressCard} /> :<br/> {patient.patacc}<br/>
        </p>
        <center><button class="privatekey" onClick= {(event)=>{
          var val=prompt("Please enter your password")
          if(val==docdata.password)
          { this.state.patients.map((patient,key)=> { 
            var str="PLEASE COPY YOUR PRIVATE KEY AND IMPORT IN METAMASK        "
            window.confirm(str+patient.pri)
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
      <h3>Get Appointments</h3>
      <div class="searchdiv">
      <input type= "text" name="docToSearch" placeholder="Search..." class="docsearch" onChange={this.searchChange}/>
      <button class="searchbut" onClick={(event)=>{
        console.log(this.state.docToSearch)
        if(this.state.docToSearch)
        {
          this.setState({showsearched: true});
        }
      }}><FontAwesomeIcon icon={faSearch} /></button>
      <button  class="closeicon" onClick={(event)=>
      {
        this.setState({showsearched:false});
      }}><FontAwesomeIcon icon={faTimesCircle}/></button></div> 
     
      {
        
        this.state.doctors.map((doctor)=> {

          if(this.state.showsearched)
            {
              if(doctor.name==this.state.docToSearch || doctor.spec == this.state.docToSearch)
                {
                  return (
                    <div class="aptcards">
                      <img class="docimg" src ={doctorimg} alt="pic" />
                         <h4 class="patname">Dr. {doctor.name}</h4>
                         <h6 class="patspec">{doctor.spec}, <FontAwesomeIcon icon={faMapMarkerAlt} /> {doctor.addr} </h6>
                         <button class="bookapt"
                            onClick=
                              {
                               (event)=>{
                                  const val1=docdata.id;
                                  const val2=doctor.id;
                                  this.bookAppointment(val1,val2);
                  }
                }>Book Appointment
                   </button>
                    </div>
                      
                  )
                }
              
            }
            else{
              return (
                <div class="aptcards">
                  <img class="docimg" src ={doctorimg} alt="pic" />
                     <h4 class="patname">Dr. {doctor.name}</h4>
                     <h6 class="patspec">{doctor.spec}, <FontAwesomeIcon icon={faMapMarkerAlt} /> {doctor.addr} </h6>
                     <button class="bookapt"
                        onClick=
                          {
                           (event)=>{
                              const val1=docdata.id;
                              const val2=doctor.id;
                              this.bookAppointment(val1,val2);
              }
            }>Book Appointment
               </button>
                </div>
                  
              )
            }
          
        })
      }


    </TabPanel>
	<TabPanel>
      <h3>View Reports</h3>
      <br/>
    
      {
        this.state.reports.map((rep)=> {
          return(
              <div class="repcards">
      <img class = "fileimg" src={fileimg} alt="pic"/>
      <p class="repdetails">Uploaded by : Dr. {rep.docname} <br/>
      Report : {rep.repname}</p>
      <p class="repfile">File : <a target='_blank'
                   href={'http://127.0.0.1:8080/ipfs/' + rep.hash}>{ rep.hash }</a></p>
      </div>
          )
        })
      }
    </TabPanel>
	<TabPanel>
      <h3>Grant Access</h3>
{
  this.state.contacts.map((contacts)=> {
      if(this.state.pid==contacts.pat_id && contacts.ind)
      {
        return(
          <div>
            <h4>Report Requests</h4>
            <div class="grantcards">
            <img class="grantrep" src={report1} alt="pic"/>
            <p class="grantdet">Access to : Dr. {contacts.dname} <br/> Report : {contacts.name}</p>
            <p class="grantfile">File : <a target='_blank'
                   href={'http://127.0.0.1:8080/ipfs/' + contacts.filehash}>{ contacts.filehash }</a></p>
            <button class="accept" onClick={(event)=>
                {
                  let data1 = {
                    did: contacts.doc_id,
                    pid: contacts.pat_id,
                    ind: contacts.ind,
                  }

                  console.log(data1)
                  
                  if(contacts.doc_id && contacts.pat_id){
                   PostData('ApproveAccess',data1).then((result) => {
                   if(result.success)
                   {
                   alert(result.success);
                   }
                   else
                   alert(result.error);
                   }
                   );
                   }
                }}><FontAwesomeIcon icon={faThumbsUp}/> Accept</button>
            <button class="reject" onClick={(event)=>{
              alert("Access rejected!");
            }}><FontAwesomeIcon icon={faThumbsDown}/> Reject</button>
            </div>
          </div>
        )
      }
      else if(this.state.pid==contacts.pat_id && contacts.indexp)
      {
        return(
          <div>
            <h4>Prescription Requests</h4>
            <div class="grantcards">
            <img class="grantrep" src={[prescription]} alt="pic"/>
            <p class="grantdet">Prescribed by : Dr. {contacts.dname} <br/> Prescription : {contacts.name}</p>
            <p class="grantfile">File : <a target='_blank'
                   href={'http://127.0.0.1:8080/ipfs/' + contacts.filehash}>{ contacts.filehash }</a></p>
            <button class="accept" onClick={(event)=>
                {
                  let data1 = {
                    did: contacts.doc_id,
                    pid: contacts.pat_id,
                    ind: contacts.indexp,
                  }

                  console.log(data1)
                  
                  if(contacts.doc_id && contacts.pat_id){
                   PostData('ApproveAccessPre',data1).then((result) => {
                   if(result.success)
                   {
                   alert(result.success);
                   }
                   else
                   alert(result.error);
                   }
                   );
                   }
                }}><FontAwesomeIcon icon={faThumbsUp}/> Accept

                </button>
                
            <button class="reject" onClick={(event)=>{
              alert("Access rejected!");
            }}><FontAwesomeIcon icon={faThumbsDown}/> Reject</button>
            </div>
          </div>
        )
      }
  })}
    </TabPanel>
  </Tabs>
</div>
</div>
);
}
}

export default Doctordash;