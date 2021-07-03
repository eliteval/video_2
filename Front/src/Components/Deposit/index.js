import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import axios from "axios";
import { toast } from "react-toastify";
import { Row, Col, Card, Button } from "react-bootstrap";
import { connect } from 'react-redux';
import { changeBalance } from '../../Store/actions/actions'
import { PayPalButton } from "react-paypal-button-v2";
import Modal from 'react-modal';

const customStyles = {
    content: {
        width: '50%',
        height: 'auto',
        margin: 'auto',
        marginTop: '120px'
    }
};

class Deposit extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        amount: null,
        modalOpen: false,
    }

    handleVideoUpload = (event) => {
        event.preventDefault();
        console.log('event.target.files')
        var file = event.target.files;
        const formData = new FormData();
        formData.append('myfile', file[0]);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        axios.
            post(`${process.env.REACT_APP_API_URL}/upload`, formData, config)
            .then((response) => {
                this.setState({
                    videoFilePath: `${process.env.REACT_APP_PUBLIC_URL}/uploadedVideos/${response.data}`
                })
            }).catch((error) => {
                console.log(error)
            });

    };
    handleChange = (e) => {
        this.setState({
            amount: e.target.value
        })
    }
    openModal = () => {
        if (this.state.amount > 0)
            this.setState({
                modalOpen: true
            })
        else
            alert('please input amount')
    }
    closeModal = () => {
        this.setState({
            modalOpen: false
        })
    }
    createOrder = (data, actions) => {
        return axios
            .post(
                `${process.env.REACT_APP_API_URL}/paypal/create`, {
                orderId: Date.now(),
                amount: this.state.amount,
                description: 'mechant'
            }
            ).then(function (res) {
                console.log('res')
                console.log(res)
                return res.data.result.id;
            })

    };

    onApprove = (data, actions) => {
        const tt=this;
        return axios
            .post(
                `${process.env.REACT_APP_API_URL}/paypal/capture`, {
                order: {
                    id: data.orderID,
                    userId: this.props.auth.user.id
                }
            }).then(function (res) {
                if (res.data.balance) {
                    let user=JSON.parse(localStorage.getItem('user'));
                    user.balance= res.data.balance;
                    localStorage.setItem('user', JSON.stringify(user));
                    tt.props.changeBalance(res.data.balance);
                    tt.closeModal();
                }
                return res;
            })
    };



    render() {
        console.log('this.props')
        console.log(this.props)
        return (
            <div style={{ marginTop: '100px', textAlign: 'center' }}>
                <div>
                    <h3>
                        Make a deposit
                    </h3>
                </div>
                <div style={{ marginTop: "20px" }}>
                    <span>
                       {this.props.auth.user.balance}
                    </span>
                    <span>
                        &nbsp;&nbsp; usd
                    </span>
                </div>
                <div style={{ marginTop: '50px' }}>
                    <div>
                        amount:
                    </div>
                    <div>
                        <input onChange={(e) => this.handleChange(e)} type="number" />
                    </div>
                </div>
                <div style={{ marginTop: "50px" }}
                    onClick={() => this.openModal()}
                >
                    <button>
                        deposit
                    </button>
                </div>
                <Modal
                    isOpen={this.state.modalOpen}
                    onRequestClose={this.closeModal}
                    contentLabel="Paypal Modal"
                    ariaHideApp={false}
                    style={customStyles}
                >
                    <PayPalButton
                        createOrder={(data, actions) => this.createOrder(data, actions)}
                        onApprove={(data, actions) => this.onApprove(data, actions)}
                        options={{
                            clientId: "Aegg544wO3m11jblWTgE_9xBk6erCLmdbLrrfrTFkfdniH6xrV9zMK7IvXD499YACCG3E4DliH9AQqBO"
                        }}
                    />
                </Modal>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
});

const mapDispatchToProps = dispatch => {
    return {
        changeBalance: (balance) => dispatch(changeBalance(balance)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Deposit)