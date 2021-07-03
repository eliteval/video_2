import React, { Component, useRef } from "react";
import ReactPlayer from 'react-player'
import { Redirect, Link } from 'react-router-dom'
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "react-string-format";
import { Row, Col, Card, Button } from "react-bootstrap";

import ReactCrop from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';
import './MainEdit.css';

class Edit extends Component {
    constructor(props) {
        super(props);
        this.videoPlayer = React.createRef();
    }
    state = {

        template: JSON.parse(localStorage.getItem('template')),
        videoFilePath: localStorage.getItem('videoFilePath'),
        videoWidth: localStorage.getItem('videoWidth'),
        videoHeight: localStorage.getItem('videoHeight'),
        faceVideo: localStorage.getItem('faceVideo') ? JSON.parse(localStorage.getItem('faceVideo')) : null,
        crop: {
            unit: 'px',
            width: 50,
            height: 50,
            aspect: 1,
            x: 0,
            y: 0
        },
        shouldRedirect: false,
        previewVideo: '',
        loading: false,

    }
    handleCrop = (crop, percentCrop) => {
        this.setState({ crop })
    }

    goToPreview = () => {
        this.setState({
            shouldRedirect: true
        })
    }

    componentDidMount() {
        var divide = 3;
        var prop = this.state;
        const videoRatio = prop.videoHeight / prop.videoWidth;

        if(prop.template.name=="split"){
            var mainVideoRatio = prop.template.mainVideo.height * (1 - prop.template.gamerVideo.height) / prop.template.mainVideo.width;
        }else{
            var mainVideoRatio = prop.template.mainVideo.height / prop.template.mainVideo.width;
        }

        var crop = {};
        if (mainVideoRatio < videoRatio) {
            console.log('sdf')
            crop = {
                unit: 'px',
                width: prop.videoWidth / divide,
                height: prop.videoWidth * mainVideoRatio / divide,
                aspect: 1 / mainVideoRatio,
                x: (prop.videoWidth - (prop.videoWidth / divide)) / 2,
                y: (prop.videoHeight - (prop.videoWidth * mainVideoRatio / divide)) / 2
            }
        } else {
            console.log('wer')
            crop = {
                unit: 'px',
                width: prop.videoHeight / mainVideoRatio / divide,
                height: prop.videoHeight / divide,
                aspect: 1 / mainVideoRatio,
                x: (prop.videoWidth - (prop.videoHeight / mainVideoRatio / divide)) / 2,
                y: (prop.videoHeight - (prop.videoHeight / divide)) / 2
            }

        }
        this.setState({
            crop
        })
    }



    render() {

        if (this.state.shouldRedirect) {
            localStorage.setItem('mainVideo', JSON.stringify(this.state.crop));
            return <Redirect
                to={{
                    pathname: `preview`
                }} />
        }

        return (
            <div>
                {
                    this.state.loading
                        ?
                        <div style={{ marginTop: '100px', textAlign: 'center' }} >
                            <h5>
                                Wait a second...
                            </h5>
                        </div>
                        :
                        <div>
                            <div>
                                <Row>
                                    <Col>
                                        {
                                            this.state.template && this.state.template.gamerVideo
                                                ?
                                                <div>
                                                    <span>Select Facecam&nbsp;&nbsp;</span>
                                                    <input type="checkbox" checked value={1} readOnly />
                                                </div>
                                                :
                                                null
                                        }

                                    </Col>
                                    <Col>
                                        {
                                            this.state.template && this.state.template.mainVideo
                                                ?
                                                <div>
                                                    <span>Select gamefeed&nbsp;&nbsp;</span>
                                                    <input type="checkbox" checked value={1} readOnly />
                                                </div>
                                                :
                                                null
                                        }
                                    </Col>
                                    <Col>
                                        <span>Preview&nbsp;&nbsp;</span>
                                        <input type="checkbox" defaultChecked={false} />
                                    </Col>
                                </Row>
                            </div>

                            <div style={{ textAlign: 'center', paddingTop: '50px' }}>
                                <ReactCrop
                                    crop={this.state.crop}
                                    keepSelection={true}
                                    onChange={(crop, percentCrop) => { this.handleCrop(crop, percentCrop) }}
                                    renderComponent={videoComponent(this.state.videoFilePath,this.videoPlayer)} />
                            </div>
                            <div style={{ marginTop: '30px', marginBottom: "30px", textAlign: 'center' }}>
                                <button onClick={this.goToPreview}>
                                    Preview
                                </button>

                            </div>
                        </div>
                }

            </div>




        )
    }
}

export default Edit;

const videoComponent = (props,videoPlayer) => (

    <video
    ref={videoPlayer}
        onLoadedData={() => videoPlayer.current.play()}
        muted
        loop
        style={{ display: 'block', maxWidth: '100%' }}
        onLoadStart={e => {
            // You must inform ReactCrop when your media has loaded.
            e.target.dispatchEvent(new Event('medialoaded', { bubbles: true }));
        }}
    >
        <source src={props} type="video/mp4" />
    </video>
);