import React, { Component } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "react-string-format";

import "./Footer.css";

class Footer extends Component {
    constructor(props) {
        super(props);  
    }
    render() {
       return(
           <div>
               <div className="footer footer-height">
                   <div className="w-container">
                       <div className="w-row">
                           <div className="w-col w-col-4">
                               <h5>
                               about SOCIALITE
                               </h5>
                               <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.</p>
                           </div>
                           <div className="w-col w-col-4">
                               <h5>
                               useful links
                               </h5>
                               <a href="#" className="footer-link">
                               Phasellus gravida semper nisi
                               </a>
                               <a href="#" className="footer-link">
                               Suspendisse nisl elit
                               </a>
                               <a href="#" className="footer-link">
                               Dellentesque habitant morbi
                               </a>
                               <a href="#" className="footer-link">
                               Etiam sollicitudin ipsum
                               </a>
                           </div>
                           <div className="w-col w-col-4">
                               <h5>
                               social
                               </h5>
                               <div className="footer-link-wrapper w-clearfix">
                                   <img src="https://uploads-ssl.webflow.com/60b522cd7dd4732e654823f9/60b522cd7dd4738382482448_social-18.svg" width="20"
                                   className="info-icon" />
                                   <a href="#" className="footer-link with-icon">
                                   Twitter
                                   </a>
                               </div>
                               <div className="footer-link-wrapper w-clearfix">
                                   <img src="https://uploads-ssl.webflow.com/60b522cd7dd4732e654823f9/60b522cd7dd4733c53482429_social-03.svg" width="20"
                                   className="info-icon" />
                                   <a href="#" className="footer-link with-icon">
                                   Twitter
                                   </a>
                               </div>
                               <div className="footer-link-wrapper w-clearfix">
                                   <img src="https://uploads-ssl.webflow.com/60b522cd7dd4732e654823f9/60b522cd7dd473d235482410_social-11.svg" width="20"
                                   className="info-icon" />
                                   <a href="#" className="footer-link with-icon">
                                   Twitter
                                   </a>
                               </div>
                               <div className="footer-link-wrapper w-clearfix">
                                   <img src="https://uploads-ssl.webflow.com/60b522cd7dd4732e654823f9/60b522cd7dd4738382482448_social-06.svg" width="20"
                                   className="info-icon" />
                                   <a href="#" className="footer-link with-icon">
                                   Twitter
                                   </a>
                               </div>
                               <div className="footer-link-wrapper w-clearfix">
                                   <img src="https://uploads-ssl.webflow.com/60b522cd7dd4732e654823f9/60b522cd7dd4738382482448_social-12.svg" width="20"
                                   className="info-icon" />
                                   <a href="#" className="footer-link with-icon">
                                   Twitter
                                   </a>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
               <div className="footer center">
                   <div className="w-container">
                       <div className="footer-text">
                       Copyright SociaLite Inc. Made in Webflow.
                       </div>
                   </div>
               </div>
           </div>
       )
    }
}

export default Footer;