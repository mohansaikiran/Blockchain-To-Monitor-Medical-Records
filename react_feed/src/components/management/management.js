import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
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
import './management.css';
import patimg from './person1.png';
import { faSearch} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import image from './prescription.png';
class management extends Component{
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
      {
          this.setState({
            patients: [...this.state.patients, patient],
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
    const preCount=await marketplace.methods.preCount().call()
    this.setState({preCount})
    for(var i=0;i<=preCount;i++)
    {
      const pre=await marketplace.methods.prescriptions(i).call()
      this.setState({
        pres: [...this.state.pres,pre]
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
        patients:[],
        patCount:0 ,
        doctors:[],
        reports:[],
        patidToSearch: 0,
        patSearched:[],
        preCount: 0,
        pres:[],
        pid: 0,
        redirectToReferrerz: false,
        showStatus: false,
        };
        this.dataSearch= {};
        this.search=this.search.bind(this);
        this.change = this.change.bind(this);
        this.logout = this.logout.bind(this);
        this.grantAccess=this.grantAccess.bind(this);
        }
        
        componentDidMount() {
          let data = JSON.parse(sessionStorage.getItem('userData'));
        
        
           window.setTimeout(this.grantAccess,2000);
        }
        grantAccess() {
          const url = 'http://localhost:85/react-php/api/preupdate.php'
          axios.get(url).then(response => response.data)
          .then((data) => {
            this.setState({ contacts: data })
            console.log(this.state.contacts)
            this.state.contacts.map((cont)=>{
        
              if(cont.pat_id==this.state.patidToSearch)
        
              {
                 window.flag=1;     
              }
              
              
             })
             if(window.flag==1)
             {
              alert("Your file request has been approved.\n Please check your Dashboard")
              window.flag=0;
             }
           })
           
          }
        logout(){
          return (<Redirect to={'/login'}/>)
          
          }
        search(){        
          if(this.state.patidToSearch)
          {
           console.log(this.state.patidToSearch);
           console.log(this.state.patients)
           this.state.patients.map((patient)=>
           {
               
               if(this.state.patidToSearch==parseInt(patient.id))
               { 
                console.log(patient)   
                   sessionStorage.setItem("patientSearch",JSON.stringify(patient));
                   this.setState({showStatus: true});
                   console.log(this.state.patSearched);
                   
               }
           })
          }
          else{
            alert("Enter Patient ID")
          }
        }
        change(e)
        {
            this.setState({[e.target.name]:e.target.value});
        }
    render()
    {
      if (this.state.redirect) {
        return (<Redirect to={'/viewprescription'}/>)
      }
        this.dataSearch =JSON.parse(sessionStorage.getItem('patientSearch'));
        return(
          <div> 
          <h1 class="welcome1">Management Profile</h1>
          <h5 class="enter">Enter Patient ID</h5>
          <a href="/login" onClick={this.logout} className="logoutclass">Logout</a>
          
            
            <div >
                
                <input type="text"  class="inputbox" autocomplete="off" name="patidToSearch" placeholder="Enter Patient ID Here" onChange={this.change}/>
                <button class="butsearch" onClick={this.search}><FontAwesomeIcon icon={faSearch} /> Search</button>
                <a href="/showpatient" className="showpat" >Show All Patients</a>
                
            </div>
            
            {
                  this.state.showStatus ? 
                  <div class="tabstyle">
                    
                    <Tabs>
                    <TabList>
                    <Tab>Patient Details</Tab>
                    <Tab>Prescriptions</Tab>
                    </TabList>
                    <TabPanel>
                    
                      <div class="mgmtdiv">
                        <img class="patimg" src={patimg} alt="pic"/>
                        <h5 class="patdets1">Patient ID : {this.state.patidToSearch}<br/>
                        Patient Name : {this.dataSearch.name}<br/>
                        Address : {this.dataSearch.addr}<br/>
                        Bloodgroup : {this.dataSearch.blood}</h5>
                      </div>
                      
                    
                    
                    </TabPanel>
                    <TabPanel>
                  
                      {
                        this.state.pres.map((pre)=>
                        {
                          if(parseInt(pre.patidp)==this.state.patidToSearch)
                          {
                            return (
                              <div>
                                <div class="mgmtpres1">
                                  <img class="image1" src={image} alt="pic"/>
                                  <h5 class="presdet">Prescription : {pre.filenamep}<br/>Prescribed on: {pre.datep}<br/>
                                  By : Dr.{pre.docnamep}</h5>
                                  <button class="butreqpre" onClick={(event)=> {
                                  let data1 = {
                                    did: parseInt(pre.docidp),
                                    pid: parseInt(pre.patidp),
                                 
                                  }
                                  console.log(data1)
                                  
                                  if(pre.docidp && pre.patidp){
                                   PostData('PreAccess',data1).then((result) => {
                                   if(result.success)
                                   {
                                   alert(result.success);
                                   }
                                   else
                                   alert(result.error);
                                   }
                                   );
                                   }
                                }} >Request Access</button>
                                {
                      this.state.contacts.map((contacts)=>{
                        if(contacts.status==2 && contacts.pat_id==this.state.patidToSearch)
                        {
                      
                        return(
                          <div class="contain">
                            
                          
                          <button class="viewpr"
                          onClick={(event)=>

                          { 
                            
                            let obj= {
                              patid: contacts.pat_id,
                              docname: contacts.dname,
                              file: contacts.name,
                              filehash: contacts.filehash,
                              ind: contacts.indexp,
                            }
                            sessionStorage.setItem('filedatap',JSON.stringify(obj));
                            
                            this.setState({redirect: true})
                          
                          }}
                          
                          
                          >View Reports</button>
                          
                          </div>
                        )
                        }
                      })
                    }
                                </div>
                                
                              </div>
                            )
                          }
                        }
                        )
                      }
                    </TabPanel>
                    </Tabs>
                  </div>
                  
                  : null
                  
                }
                  
               
            
            </div>
        )
    }
}
export default management;