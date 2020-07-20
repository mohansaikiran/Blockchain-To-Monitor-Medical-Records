import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './Homepage.css';
import test from './test.png';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import about from './about.png'
import tryimg from './try.png';
import hod from './hod.png';
import mohan from './mohan.png';
import monica from './monica.png';
import pawan from './pawan.png';
import Faq from "react-faq-component";
import about1 from "./medsys1.png";
import pooja from './pooja.png';
import nmit from './nmit.png';

const data = {
    title: "Frequently Asked Questions!",
    rows: [
        {
            title: "1. Why is blockchain a better option?",
            content: `Blockchain being a distributed network, is a safer option.
                    It is highly secured as it needs address of current block and the previous block in order to access it.
                    The data is encrypted to ensure the security.`,
        },
        {
            title: "2. How does Ethereum wallet work?",
            content:"The cryptocurrency ETHER is used for the transactions. It costs a few ether in order to make a transaction. Metamask acts as an interface to the Ethereum wallet.",
        },
        {
            title: "3. Where is the data stored?",
            content: `As Blockchain is a distributed network, data is stored in various location. 
            The updates to the network is noted in a ledger that are located in all the peers of the network. `,
        },
        {
            title: "4. How do we obtain the private key in the system?",
            content: "Private key for an account is created during the creation of the account in Ethereum network. In the system you can obtain your private key using option get private key which prompts you to enter your password. On entering the correct password you can have access to your private key.",
        },
        {
            title: "5.How to use Metamask? ",
            content: `Metamask is an extension to your Google Chrome browser. You can download the extension using the same. Set up your Ethereum wallet in your Metamask account.`,
        },
        {
            title: "6. How to import my Ethereum account in Metamask? ",
            content: `Once the extension to the browser is downloaded, Import your account using option IMPORT ACCOUNT. Choose the option private key in the pop up. Enter your private key and click import.`,
        },
        {
            title: "7. How to view my medical reports? ",
            content: `Once you consult the doctor, the doctor uploads your medical reports in the system which will be available to you on View Reports section.`
        },
        {
            title: "8. How can a doctor or the hospital access my medical reports? ",
            content: ` If a doctor wants to access your medical reports he sends a request for access which will be notified through an alert message. You can grant access if you wish to give the access in Grant Access Section.`
        },
        {
            title: "9. I am a doctor, when I try to login alert appears saying Login not Approved? ",
            content: ` The administrator approves your registration on reviewing the doctuments provided by you. You will be able to login once it is approved. Please try again in sometime.`
        },
        {
            title: "10. How to book an appointment with a doctor? ",
            content: `You can book an appointment with the doctor in Book Appointment section of your Dashboard. The doctor will approve and confirm the same.`
        },
    ],
};
 
const styles = {
     bgColor: 'white',
    titleTextColor: "black",
    rowTitleColor: "blue",
    // rowContentColor: 'grey',
     arrowColor: "red",
};
 
const config = {
     animate: true,
    arrowIcon: "V",
};
 
class Homepage extends Component {

    constructor(props) {
    super(props);
    
    this.state = {
    data:[],
    userFeed: '',
    redirectToReferlog: false,
    name:'',
    };
    
    }
    
    
    render() {
    if (this.state.redirectToReferlog) {
    return (<Redirect to={'/login'}/>)
    }
   
    return (
        
    <div className="row" id="Body">
    <div className="medium-12 columns">
    <button class= "loginbutton" onClick={ (event)=> {
        this.setState({redirectToReferlog : true});
             }
         }><FontAwesomeIcon icon={faSignInAlt} /> LOGIN</button>
    <Tabs>
        <TabList>
            <Tab><FontAwesomeIcon icon={faHome} /> Home</Tab>
            <Tab><FontAwesomeIcon icon={faQuestionCircle} /> FAQs</Tab>
            <Tab><FontAwesomeIcon icon={faAddressBook} /> Contact Us</Tab>
        </TabList>
        <TabPanel>
            <div class="description">
            <h4 class="para1"><b>The Electronic Health Records systems are the interactive digital version of the patient's medical records. 
            EHRs are real-time systems which make the records available instantly to the associated users ensuring security. 
            They store the medical history, diagnosis and the treatment given to the patient which in turn helps doctor to continue the diagnosis.

            </b></h4>
            </div>
            <img class="about"src= {about1} alt="pic" />
            <div class="description1">
                <h4 class="para1"><b>Blockchain is a peer-to-peer technology for distributed data sharing and computing. Blockchain comes into picture in Healthcare domain as the data in Blockchain
                    are immutable, secured, distributed ans consensual. Keeping our important medical data safe and secure is the most popular blockchain healthcare application at the moment, which isn't surprising.
                    Blockchain is transparent it is also private, concealing the identity of any individual with complex and secure codes that can protect the sensitivity of medical data.</b></h4>
            </div>
            
        
        <img class="about1"src= {about} alt="pic" />
       {/* <img class="about2"src= {tryimg} alt="pic" /> */}
        
        </TabPanel>
        <TabPanel>
        <div>
        <Faq data={data} styles={styles} config={config} />
            </div>
        </TabPanel>
        <TabPanel>
        <h3 class="textstyle">About Us</h3>
            <h4 class="clgname">Nitte Meenakshi Institute of Technology, Bengaluru</h4>
            <div class="college"><h5>Nitte Meenakshi Institute of Technology (NMIT) is an autonomous engineering college with A+ Grade by NAAC, UGC in Bangalore, 
                Karnataka, affiliated to the Visvesvaraya Technological University, Belagavi. The college is approved by the AICTE, New Delhi.</h5></div>
            <br/><br/>
        <img class="nmit"src= {nmit} alt="pic" />
        
        <center>
            
        <div>
            <h5><b>With the support and guidance of </b></h5>
            <br/>
        <img class="testimage1"src= {hod} alt="pic" />
        <br/>
         <h5>Dr. Thippeswamy M. N.<br/> HOD, Department of CSE, NMIT</h5>
         <br/>
        </div>
        </center>
        <h5>We are a group of enthusiastic budding engineers from Nitte Meenakshi Institute of Technology, Bengaluru.
            Being motivated to contribute to the humankind, we developed this website in healthcare domain. We strive to
            help and support you.
        </h5>
        <br/>
        <div class="contactus">
            <div>
                <center>
                <img class="testimage"src= {mohan} alt="pic" />
                    <br/> 
                    <br/> 
                    <h4 class="contact">Mohan Sai Kiran</h4>
                    <h6>kiranms20@gmail.com</h6>
                </center>
            </div>
            <div>
                <center>
                <img class="testimage"src= {pawan} alt="pic" />
                    <br/> 
                    <br/> 
                    <h4 class="contact1">Pawan R. Tanksali</h4>
                    <h6>pawantanksali@gmail.com</h6>
                </center>    
            </div>
            <div>
                <center>
                <img class="testimage"src= {monica} alt="pic" />
                     <br/> 
                    <br/> 
                    <h4 class="contact">Monica Hegde</h4>
                    <h6>monicarhegde@gmail.com</h6>
                </center>	
            </div>
            <div>
                <center>
                <img class="testimage"src= {pooja} alt="pic" />
                    <br/> 
                    <br/> 
                    <h4 class="contact1">Pooja Rani Naik</h4>
                    <h6>ranip2780@gmail.com</h6>
                </center>		
            </div>

        </div>
					
					
                    
                    
                    
                    
                    
                    
				
        </TabPanel>
    </Tabs>

    </div>
    
    
    </div>
    );
    }
    }
    
    export default Homepage;