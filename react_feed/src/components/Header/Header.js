import React, { Component } from 'react';
import logo from './images.png';
import './Header.css';
import nittelogo from './nitte ryt white.png';
class Header extends Component {
render() {
    // var imgdata=document.createElement("img");
    // imgdata.src="images.png";
    // var src=document.getElementById('x')
    // src.appendChild(imgdata);
return (
<div className="callout headcolor" id="Header">
<div className="row column">
<img class="logo"src= {logo} alt="pic" />
<img class="nittelogo"src= {nittelogo} alt="pic" />
<h1 class="title">MedicoChain</h1>
{/* <div id='x'></div> */}
</div>
</div>
);
}
}
export default Header;