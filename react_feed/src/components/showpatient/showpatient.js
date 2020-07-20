import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import Web3 from 'web3';
import Marketplace from '../../abis/Marketplace.json';
import './showpatient.css';
class showpatient extends Component {
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
        
        for (var i = 1001; i <= patCount; i++) {
          const patient = await marketplace.methods.patients(i).call()
          {
              this.setState({
                patients: [...this.state.patients, patient],
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
            patients:[],
            patCount:0 ,
            pid: 0,
            };
            
            }
render() {
    return (
        <div>
        <a href="/management" class="back">Back</a>
       <h4 class="showpathead">Patient List</h4><br/><br/>
       <center><table><tr>
         <th>PATIENT ID</th>
         <th>PATIENT NAME</th>
         </tr></table></center>
        { 
            this.state.patients.map((patient)=>
            {
                return(
                  
                  <center>
                  <table border="1px solid red">
                      <tr>
                        <td>{parseInt(patient.id)}</td>
                        <td>{patient.name}</td>
                      </tr>
                    </table>
                  </center>
                    
                    
                 

                )
            }
            )
        }
        </div>
        
    )
}
}
export default showpatient;