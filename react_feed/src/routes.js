import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Welcome from '././components/Welcome/Welcome';
import Home from '././components/Home/Home';
import Login from '././components/Login/Login';
import Signup from '././components/Signup/Signup';
import Signdoc from '././components/Signdoc/Signdoc';
import LoginAdmin from '././components/LoginAdmin/LoginAdmin';
import Admindash from '././components/Admindash/Admindash';
import Doctordash from '././components/Doctordash/Doctordash';
import NotFound from '././components/NotFound/NotFound';
import Patientdash from '././components/Patientdash/Patientdash';
import viewReports from '././components/viewReports/viewReports';
import management from '././components/management/management';
import showpatient from '././components/showpatient/showpatient';
import viewprescription from '././components/viewprescription/viewprescription';
import Homepage from '././components/Homepage/Homepage';
import forgotpassword from './components/forgotpassword/forgotpassword';
import resetpage from './components/ResetPage/resetpage';
import otp from './components/VerifyOtp/otp';
const Routes = () => (
<BrowserRouter >
<Switch>

<Route exact path="/" component={Homepage}/>
<Route path="/home" component={Home}/>
<Route path="/login" component={Login}/>
<Route path="/otp" component={otp}/>
<Route path="/resetpage" component={resetpage}/>
<Route path="/LoginAdmin" component={LoginAdmin}/>
<Route path="/Admindash" component={Admindash}/>
<Route path="/management" component={management}/>
<Route path="/Signup" component={Signup}/>
<Route path="/Signdoc" component={Signdoc}/>
<Route path="/Doctordash" component={Doctordash}/>
<Route path="/Patientdash" component={Patientdash}/>
<Route path="/viewReports" component={viewReports}/>
<Route path="/showpatient" component={showpatient}/>
<Route path="/viewprescription" component={viewprescription}/>
<Route path="/forgotpassword" component={forgotpassword}/>
<Route path="*" component={NotFound}/>

</Switch>
</BrowserRouter>
);
export default Routes;