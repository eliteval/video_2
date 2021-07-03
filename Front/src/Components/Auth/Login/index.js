import React, { Component } from "react";
import { connect } from 'react-redux';
import {saveAuthInfo} from '../../../Store/actions/actions'
import { Link,Redirect } from "react-router-dom";
import axios from "axios";


class Login extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        email:'',
        password:'',

        emailKey: false,
        passwordKey: false,

        emailRequired: false,
        passwordRequired: false,

    }
    handleInput = (e, key) => {
        this.setState({
            [key]: e.target.value
        })

        if (key == 'email') {
            const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
            const result = pattern.test(e.target.value);
            if (result === true) {
                this.setState({
                    emailKey: false,
                })
            } else {
                this.setState({
                    emailKey: true
                })
            }
            if (e.target.value == '') {
                this.setState({
                    emailRequired: true
                })
            } else {
                this.setState({
                    emailRequired: false
                })
            }

        }
        if (key == 'password') {
            if (e.target.value.length < 4) {
                this.setState({
                    passwordKey: true
                })
            } else {
                this.setState({
                    passwordKey: false
                })
            }
            if (e.target.value == '') {
                this.setState({
                    passwordRequired: true
                })
            } else {
                this.setState({
                    passwordRequired: false
                })
            }
        }
    }
    login = () => {

        if (this.state.email == '') {
            this.setState({
                emailRequired: true
            })
            return;
        }
        if (this.state.password == '') {
            this.setState({
                passwordRequired: true
            })
            return;
        }
        if (
            this.state.emailKey ||
            this.state.passwordKey
        ) {
            return;
        } else {
            axios
                .post(
                    `${process.env.REACT_APP_API_URL}/auth/login`,
                    {
                        email: this.state.email,
                        password: this.state.password,
                    }

                )
                .then((res) => {
                    if (res.data.status > 300) {
                        this.setState({
                            serverError: true,
                            error: res.data.error
                        })
                    }else{

                        localStorage.setItem('user',JSON.stringify(res.data.user));
                        localStorage.setItem('token',res.data.token)
                        this.props.saveAuthInfo(res.data.user, res.data.token);
                        this.setState({shouldRedirect:true})
                    }
                    
                });
        }
    }
    render() {
        if( this.state.shouldRedirect){
            return <Redirect
            to="/"  />
        }

        return (
            <div style={{marginTop:'100px', textAlign:"center"}}>
                {
                    this.state.serverError
                        ?
                        <div style={{color:"red"}}>
                            {this.state.error}
                            </div>
                        :
                        null
                }
                <div style={{ marginTop: "20px" }}>
                    <div>
                        email:
                    </div>
                    <input onChange={(e) => this.handleInput(e, 'email')} type="email" />
                    {
                        this.state.emailKey
                            ?
                            <div style={{ color: 'red' }}>
                                email is invalid.
                   </div>
                            :
                            null
                    }
                    {
                        this.state.emailRequired
                            ?
                            <div style={{ color: 'red' }}>
                                email is required.
                            </div>
                            :
                            null
                    }

                </div>
                <div style={{ marginTop: "20px" }}>
                    <div>
                        password:
                   </div>
                    <input onChange={(e) => this.handleInput(e, 'password')} type="password" />
                    {
                        this.state.passwordKey
                            ?
                            <div style={{ color: 'red' }}>
                                password should be greater than 4 characters.
                   </div>
                            :
                            null
                    }
                    {
                        this.state.passwordRequired
                            ?
                            <div style={{ color: 'red' }}>
                                password is required.
                            </div>
                            :
                            null
                    }

                </div>
               <div style={{marginTop:"20px"}}>
                   <button onClick={()=>{this.login()}}>
                       Login
                   </button>
               </div>
               <div style={{marginTop:"20px"}}>
                   <Link to="/register">
                       not register? please register now.
                   </Link>
               </div>
            </div>
        )
    }

}

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = dispatch => {
    return {
        saveAuthInfo: (user,token) => dispatch(saveAuthInfo(user,token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login)
