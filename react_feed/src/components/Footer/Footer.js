import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';
import './Footer.css';
class Footer extends Component {
render() {
return (
<div className="row" id="footer">
<div className="medium-12 columns">

    <h6 class="dept"><FontAwesomeIcon icon={faCopyright} /> Department of CSE, NMIT</h6>
</div>
</div>
);
}
}
export default Footer;