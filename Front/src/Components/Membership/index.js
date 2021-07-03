import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import axios from "axios";
import { toast } from "react-toastify";
import { Row, Col, Card, Button } from "react-bootstrap";
import { connect } from 'react-redux';
import { PayPalButton } from "react-paypal-button-v2";
import Modal from 'react-modal';
import { changeMembership,changeBalance } from '../../Store/actions/actions'
const customStyles = {
    content: {
        width: '50%',
        height: 'auto',
        margin: 'auto',
        marginTop: '120px'
    }
};

class Membership extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        amount: null,
        modalOpen: false,
    }

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
            modalOpen: false,
            membership: null
        })
    }
    componentDidMount() {
        axios
            .get(
                `${process.env.REACT_APP_API_URL}/membership`,
            ).then(res => {
                if (res.data) {
                    this.setState({
                        membership: res.data
                    })
                }
            })
    }
    selectMembership = (name,price) => {
        if(price>this.props.auth.user.balance){
            alert('Your balance is not enough. Please deposit first!')
            return;
        }
        axios
        .post(
            `${process.env.REACT_APP_API_URL}/membership/change`,{
                userId:this.props.auth.user.id,
                name,
                price
            }
        ).then(res => {
            if (res.data) {
                let user=JSON.parse(localStorage.getItem('user'));
                    user.balance= res.data.balance;
                    user.membership= res.data.membership;
                    localStorage.setItem('user', JSON.stringify(user));
                this.props.changeMembership(res.data.membership);
                this.props.changeBalance(res.data.balance);
            }
        })
    }
    render() {
        console.log('this.props')
        console.log(this.props)
        return (
            <div style={{ marginTop: '100px', textAlign: 'center' }}>
                <div>
                    <h3>
                        Upgrade your membership
                    </h3>
                </div>
                <div style={{ marginTop: '50px', paddingLeft: '5%', paddingRight: '5%' }}>
                    <Row>
                        {
                            this.state.membership &&
                            this.state.membership.map(item => (
                                <Col key={item._id} style={{ backgroundColor: "white", width: '90%', marginLeft: '5%', marginRight: '5%' }}>
                                    <div>
                                        {item.name}
                                    </div>
                                    <div>
                                        {item.description}
                                    </div>
                                    <div>
                                        <span>
                                            price:&nbsp;&nbsp;&nbsp;
                                        </span>
                                        <span>
                                            {item.price && item.price}
                                        </span>
                                    </div>
                                    {
                                        this.props.auth.user&&this.props.auth.user.membership == item.name
                                            ?
                                            <div style={{ marginTop: "50px" }}>
                                                <input type="checkbox" checked value={1} readOnly />
                                                <div style={{ color: "green" }}>
                                                    current membership
                                                </div>
                                            </div>
                                            :
                                            null
                                    }

                                    <div style={{ marginTop: '50px' }}>
                                        <button
                                            onClick={() => this.selectMembership(item.name,item.price)}
                                            disabled={
                                                this.props.auth.user&&this.props.auth.user.membership === item.name ||
                                                item.name=='free'
                                            }
                                        >
                                            Select
                                        </button>
                                    </div>
                                </Col>
                            ))
                        }

                    </Row>
                </div>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
});

const mapDispatchToProps = dispatch => {
    return {
        changeMembership: (membership) => dispatch(changeMembership(membership)),
        changeBalance: (balance) => dispatch(changeBalance(balance)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Membership)