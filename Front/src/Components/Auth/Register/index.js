import React, { Component } from "react";
import { connect } from 'react-redux';
import { saveAuthInfo } from '../../../Store/actions/actions'
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

class Register extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        nameKey: false,
        emailKey: false,
        passwordKey: false,
        confirmPasswordKey: false,
        nameRequired: false,
        emailRequired: false,
        passwordRequired: false,
        confirmPasswordRequired: false,
        serverError: false,
        error: '',
        shouldRedirect:false
    }
    handleInput = (e, key) => {
        this.setState({
            [key]: e.target.value
        })

        if (key == 'name') {
            if (e.target.value.length < 4) {
                this.setState({
                    nameKey: true
                })
            } else {
                this.setState({
                    nameKey: false
                })
            }
            if (e.target.value == '') {
                this.setState({
                    nameRequired: true
                })
            } else {
                this.setState({
                    nameRequired: false
                })
            }

        }
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
        if (key == 'confirmPassword') {
            if (e.target.value != this.state.password) {
                this.setState({
                    confirmPasswordKey: true
                })
            } else {
                this.setState({
                    confirmPasswordKey: false
                })
            }
            if (e.target.value == '') {
                this.setState({
                    confirmPasswordRequired: true
                })
            } else {
                this.setState({
                    confirmPasswordRequired: false
                })
            }
        }
    }
    register = () => {
        if (this.state.name == '') {
            this.setState({
                nameRequired: true
            })
            return;
        }
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
        if (this.state.confirmPassword == '') {
            this.setState({
                confirmPasswordRequired: true
            })
            return;
        }
        if (
            this.state.nameKey ||
            this.state.emailKey ||
            this.state.passwordKey ||
            this.state.confirmPasswordKey
        ) {
            return;
        } else {

            axios
                .post(
                    `${process.env.REACT_APP_API_URL}/auth/register`,
                    {
                        name: this.state.name,
                        email: this.state.email,
                        password: this.state.password,
                        confirmPassword: this.state.confirmPassword,
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
            <div style={{ marginTop: '100px', textAlign: "center" }}>
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
                        name:
                    </div>
                    <input onChange={(e) => this.handleInput(e, 'name')} type="text" />
                    {
                        this.state.nameKey
                            ?
                            <div style={{ color: 'red' }}>
                                name should be greater than 4 characters.
                   </div>
                            :
                            null
                    }
                    {
                        this.state.nameRequired
                            ?
                            <div style={{ color: 'red' }}>
                                name is required.
                            </div>
                            :
                            null
                    }

                </div>
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
                <div style={{ marginTop: "20px" }}>
                    <div>
                        confirm password:
                   </div>
                    <input onChange={(e) => this.handleInput(e, 'confirmPassword')} type="password" />
                    {
                        this.state.confirmPasswordKey
                            ?
                            <div style={{ color: 'red' }}>
                                password did not match.
                   </div>
                            :
                            null
                    }
                    {
                        this.state.confirmPasswordRequired
                            ?
                            <div style={{ color: 'red' }}>
                                confirmed password is required.
                            </div>
                            :
                            null
                    }

                </div>
                <div style={{ marginTop: "20px" }}>
                    <button onClick={() => { this.register() }}>
                        register
                   </button>
                </div>
                <div style={{ marginTop: "20px" }}>
                    <Link to="/login">
                        go to login
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

export default connect(mapStateToProps, mapDispatchToProps)(Register)
