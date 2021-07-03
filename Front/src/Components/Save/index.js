import React, { Component, useRef } from "react";
import ReactPlayer from 'react-player'
import { Redirect, Link } from 'react-router-dom'
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "react-string-format";
import { Dropdown, DropdownButton } from "react-bootstrap";


import ReactCrop from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';
import './Save.css';
import { saveAs } from 'file-saver';


class Save extends Component {
    constructor(props) {
        super(props);
        this.videoPlayer = React.createRef();

    }
    state = {
        savedVideo: localStorage.getItem('savedVideo'),
        displayPercentInSave: localStorage.getItem('displayPercentInSave'),
        shouldRedirect: false,
        url: null,
        authed: false
    }
    uploadGoogleDrive = () => {
        axios
            .get(
                `${process.env.REACT_APP_API_URL}/googleDrive/upload`)
            .then((res) => {
                if (res.status == 200) {
                    this.setState({
                        shouldRedirect: true,
                    })
                }
            }).catch((error) => {
                console.log(error)
            });
    }
    download = () => {
        saveAs(
            `${process.env.REACT_APP_PUBLIC_URL}/editedVideos/${this.state.savedVideo}`,
            this.state.savedVideo
        )
    }
    goToHome = () => {
        this.setState({
            shouldRedirect: true
        })
    }
    componentDidMount() {
        axios
            .get(
                `${process.env.REACT_APP_API_URL}/googleDrive/?fileName=${this.state.savedVideo}`)
            .then((res) => {
                if (res.status == 200) {
                    console.log('res')
                    console.log(res)
                    if (res.data.authed) {
                        this.setState({
                            authed: true
                        })
                    } else {
                        this.setState({
                            url: res.data.url,
                            authed: false
                        })
                    }

                }
            }).catch((error) => {
                console.log(error)
            });
    }

    render() {

        if (this.state.shouldRedirect) {
            if (localStorage.getItem('faceVideo')) {
                localStorage.removeItem('faceVideo')
            }
            if (localStorage.getItem('mainVideo')) {
                localStorage.removeItem('mainVideo')
            }
            if (localStorage.getItem('savedVideo')) {
                localStorage.removeItem('savedVideo')
            }
            if (localStorage.getItem('template')) {
                localStorage.removeItem('template')
            }
            if (localStorage.getItem('videoFilePath')) {
                localStorage.removeItem('videoFilePath')
            }
            if (localStorage.getItem('videoHeight')) {
                localStorage.removeItem('videoHeight')
            }
            if (localStorage.getItem('videoWidth')) {
                localStorage.removeItem('videoWidth')
            }
            if (localStorage.getItem('displayPercentInSave')) {
                localStorage.removeItem('displayPercentInSave')
            }

            return <Redirect
                to={{
                    pathname: '/',
                }}
            />
        }

        return (

            <div>
                <div style={{ display: 'flex', width: "100%" }}>

                    {
                        this.state.savedVideo
                            ?
                            <video
                                muted
                                playsInline 
                                ref={this.videoPlayer}
                                onLoadedData={() => {
                                    this.videoPlayer.current.play();
                                }}
                                style={{ marginRight: "auto", marginLeft: "auto" }}
                                autoPlay
                                controls
                                src={`${process.env.REACT_APP_PUBLIC_URL}/editedVideos/${this.state.savedVideo}`}
                            >
                            </video>
                            :
                            null
                    }
                </div>
                <div style={{ textAlign: 'center', padding: "30px" }}>

                    <button onClick={this.goToHome}>
                        go to home
                    </button>

                </div>
                <div>
                    <button onClick={this.download}>
                        download
                    </button>
                    <DropdownButton id="dropdown-basic-button" title="upload">
                        {
                            !this.state.authed
                                ?
                                <a href={this.state.url}>
                                    Google drive
                                </a>
                                :
                                <button onClick={this.uploadGoogleDrive}>
                                    Google drive
                                </button>
                        }


                    </DropdownButton>
                </div>
            </div >




        )
    }
}

export default Save;
