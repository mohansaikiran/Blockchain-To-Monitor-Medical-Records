import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import './Home.css';
import {PostData} from '../../services/PostData';
import UserFeed from "../UserFeed/UserFeed";
import { confirmAlert } from 'react-confirm-alert';
import '../../styles/react-confirm-alert.css';

class Home extends Component {

constructor(props) {
super(props);

this.state = {
data:[],
userFeed: '',
redirectToReferrer: false,
name:'',
};

}


logout(){
sessionStorage.setItem("userData",'');
sessionStorage.clear();
this.setState({redirectToReferrer: true});
}

render() {
if (this.state.redirectToReferrer) {
return (<Redirect to={'/login'}/>)
}

return (
<div className="row" id="Body">
<div className="medium-12 columns">

</div>


</div>
);
}
}

export default Home;