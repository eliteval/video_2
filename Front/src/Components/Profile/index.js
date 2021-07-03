import React, { Component } from "react";
import { connect } from 'react-redux';
import { Link,Redirect } from "react-router-dom";
import axios from "axios";


class Profile extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div style={{marginTop:"50px",textAlign:"center"}}>
                profle
            </div>
        )
    }

}

const mapStateToProps = state => ({
    auth: state.auth
});



export default connect(mapStateToProps)(Profile)
