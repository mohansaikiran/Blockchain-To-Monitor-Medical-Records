import React, { Component } from 'react';
import './styles/foundation.min.css';
import './styles/custom.css';
import Routes from './routes';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import MobileHeader from './components/MobileHeader/MobileHeader';
import Web3 from 'web3'
import './App.css';
import Marketplace from './abis/Marketplace.json'
import Navbar from './Navbar'
import Main from './Main'
class App extends Component {
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
          const productCount = await marketplace.methods.patCount().call()
          this.setState({productCount})
          
    
          //const regdoctor = web3.eth.Contract(DocReg.abi, networkData1.address)
          //this.setState({ regdoctor })
          const doctorCount = await marketplace.methods.docCount().call()
          this.setState({doctorCount})
          for (var i = 1; i <= doctorCount; i++) {
            const doctor = await marketplace.methods.doctors(i).call()
            this.setState({
              doctors: [...this.state.doctors, doctor]
            })
          }
          const pat= await marketplace.methods.patientname().call()
          this.setState({pat})
          const AppCount =await marketplace.methods.AppCount().call()
          this.setState({AppCount})
          for( var i=1;i<=AppCount;i++) 
          {
            const apps=await marketplace.methods.apps(i).call()
            this.setState({
              appointments: [...this.state.appointments, apps]
            })
          }
          console.log(this.state.patients)
         // console.log(productCount.toString())
          //console.log(doctorCount.toString())
          this.setState({ loading: false})
        } else {
          window.alert('Marketplace contract not deployed to detected network.')
        }
      }
      
      constructor(props) {
        super(props)
        this.state = {
            appName: "MedicoChain",
            home: false,
          account: '',
          acc: '',
          productCount: 0,
          doctorCount: 0,
          Appcount: 0,
          patients: [],
          doctors: [],
          appointments: [],
          loading: false
        }
        this.createPatient=this.createPatient.bind(this)
        this.createDoctor=this.createDoctor.bind(this)
        this.bookAppointment= this.bookAppointment.bind(this)
        this.searchPatient=this.searchPatient.bind(this)
        this.ApproveAppointment=this.ApproveAppointment.bind(this)
    
      }
      
      createPatient(id,name, price) {
        //this.setState({ loading: false })
        let pat=window.web3.eth.accounts.create();
        console.log(pat.address);
        console.log("Account created")
        this.state.marketplace.methods.createPatient(id,name,price,pat.address).send({ from: this.state.account })
        .once('receipt', (receipt) => {
          //this.setState({ loading: false })
        })
      }
      createDoctor(id,name,email,bloodgrp,addr,hash) {
        console.log("in the function createDoctor")
        let doc=window.web3.eth.accounts.create();
        this.state.marketplace.methods.createDoctor(id,name,email,bloodgrp,addr,hash,doc.address).send({from : this.state.account})
        .once('receipt', (receipt) => {
          //this.setState({ loading: false })
        })
      }
      
      bookAppointment(id1,id2) {
        
        //this.setState({ loading: true })
        this.state.marketplace.methods.bookAppointments(id1,id2).send({ from: this.state.account })
        .once('receipt', (receipt) => {
          //this.setState({ loading: false })
        })
        console.log("Appointment booked")
        
      }
      searchPatient(ad) {
        console.log("In search function")
        this.state.marketplace.methods.searchPatient(ad)
      }
      ApproveAppointment(patadd,docadd)
      {
        this.state.marketplace.methods.ApproveAppointment(patadd,docadd).send({ from: this.state.account })
        .once('receipt', (receipt) => {
          //this.setState({ loading: false })
        })
        console.log("Appointment Approved")
      }
/*constructor(){
super();
this.state={
appName: "ReactJS Feed Example",
home: false
}
}*/
render() {
return (
    <div>
<div className="off-canvas-wrapper">
<div className="off-canvas-wrapper-inner" data-off-canvas-wrapper>
<div className="off-canvas-content" data-off-canvas-content>
 <MobileHeader name={this.state.appName}/> 
<Header name={this.state.appName}/> 
<Routes name={this.state.appName}/>


<hr/>
<Footer/>
</div>
</div>
</div>
</div>
);
}
}
export default App;
