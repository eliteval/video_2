import React, { Component } from "react";
import ReactPlayer from 'react-player'
import { Redirect } from 'react-router-dom'
import axios from "axios";
import "./Home.css";

class Home extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        videoFilePath: null,
        clipUrl: '',
        shouldRedirect: false,
        videoWidth: null,
        videoHeight: null,
        invalidClipUrl: false,
        continue: false
    }
    handleVideoUpload = (event) => {
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
                console.log('response')
                console.log(response)
                this.setState({
                    videoFilePath: `${process.env.REACT_APP_PUBLIC_URL}/uploadedVideos/${response.data}`
                })
            }).catch((error) => {
                console.log(error)
            });

    };
    changeClipUrl = (event) => {
        this.setState({
            clipUrl: event.target.value
        })
    }
    uploadClipByUrl = () => {
        const ytPattern = this.state.clipUrl.indexOf('youtube.com/watch');
        const fbPattern = this.state.clipUrl.indexOf('https://www.facebook.com/');
        const ttPattern = this.state.clipUrl.indexOf('twitch.tv');

        if (ytPattern != -1) {
            axios.
                get(`${process.env.REACT_APP_API_URL}/upload/youtube?clipUrl=${this.state.clipUrl}`)
                .then((response) => {
                    this.setState({
                        videoFilePath: `${process.env.REACT_APP_PUBLIC_URL}/uploadedVideos/${response.data}`
                    })
                }).catch((error) => {
                    console.log(error)
                });
        }
        if (fbPattern != -1) {
            axios.
                post(`${process.env.REACT_APP_API_URL}/upload/fb`, {
                    clipUrl: this.state.clipUrl
                })
                .then((response) => {
                    this.setState({
                        videoFilePath: `${process.env.REACT_APP_PUBLIC_URL}/uploadedVideos/${response.data}`
                    })
                }).catch((error) => {
                    console.log(error)
                });
        }
        if (ttPattern != -1) {
            axios.
                post(`${process.env.REACT_APP_API_URL}/upload/twitch`, {
                    clipUrl: this.state.clipUrl
                })
                .then((response) => {
                    this.setState({
                        videoFilePath: `${process.env.REACT_APP_PUBLIC_URL}/uploadedVideos/${response.data}`
                    })
                }).catch((error) => {
                    console.log(error)
                });
        }
        if (ytPattern == -1 && fbPattern == -1 && ttPattern == -1) {
            this.setState({
                invalidClipUrl: true
            })
        }

    }
    goTemplatePage = () => {
        this.setState({
            shouldRedirect: true
        })

    }
    getVideoSize = (event) => {
        this.setState({
            continue: true
        })
        this.setState({
            videoWidth: event.target.videoWidth,
            videoHeight: event.target.videoHeight
        })
    }
    render() {

        if (this.state.shouldRedirect) {
            localStorage.setItem('videoFilePath',this.state.videoFilePath)
            localStorage.setItem('videoWidth',this.state.videoWidth)
            localStorage.setItem('videoHeight',this.state.videoHeight)
            return <Redirect
                to={{
                    pathname: `template`
                }} />
        }
        return (
            <div>


                <div className="hero-section centered">
                    <div className="w-container">
                        <h1 className="hero-heading">
                            WELCOME TO SOCIALTE
                        </h1>
                        <div className="hero-subheading">
                            <strong>
                                THE WORLDS #1 VIDEO EDITOR FOR CONTENT CREATORS
                            </strong>
                        </div>


                        <div className="text-block">
                            {
                                this.state.invalidClipUrl
                                    ?
                                    <div style={{
                                        backgroundColor: "white", color: 'red',
                                        width: "70%", marginLeft: '11%',
                                        textAlign: "left", padding: '10px'
                                    }}>
                                        <div>
                                            Error Invalid url! Make sure the url looks like any of these:
                                        </div>
                                        <div>
                                            http://www.youtube.com/watch?v=aqz-KE-bpKQ or
                                        </div>
                                        <div>
                                            https://www.facebook.com/ZLaner/videos/1206095443166908 or
                                        </div>
                                        <div>
                                            https://www.twitch.tv/tosjo/clip/RoundDistinctGarbageHassaanChop or
                                        </div>
                                        <div>
                                            https://clips.twitch.tv/RoundDistinctGarbageHassaanChop
                                        </div>

                                    </div>
                                    :
                                    null
                            }

                            <div>
                                <input type="text"
                                    onChange={(e) => { this.changeClipUrl(e) }}
                                    style={{ width: '70%', marginRight: '3%' }}
                                    placeholder="clip url" />
                                <button onClick={() => { this.uploadClipByUrl() }}>Clip</button>
                            </div>

                        </div>

                        <div style={{ marginTop: '20px', alignItems: 'center' }}>
                            <input type="file" onChange={(e) => { this.handleVideoUpload(e) }} />
                        </div>
                        <div style={{ marginTop: '20px' }}>

                            <video
                                style={{ marginRight: "auto", marginLeft: "auto" }}
                                autoPlay
                                controls
                                width="50%"
                                height="50%"
                                src={this.state.videoFilePath}
                                onLoadedMetadata={e => {
                                    this.getVideoSize(e)
                                }}
                            >
                            </video>

                        </div>
                        {
                            this.state.continue
                                ?
                                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                    <button onClick={() => { this.goTemplatePage() }}>
                                        Continue
                                    </button>
                                </div>
                                :
                                null
                        }

                    </div>

                    <div className="container w-container">
                        <div className="w-row">
                            <div className="w-col-4 w-col ">
                                <div className="white-box">
                                    <div>
                                        <img src="https://uploads-ssl.webflow.com/60b522cd7dd4732e654823f9/60b522cd7dd4738c6548240f_feather2-17-white.svg" className="grid-image" />
                                    </div>
                                    <h3>
                                        CLIP
                                    </h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.</p>
                                </div>
                            </div>
                            <div className=" w-col-4 w-col">
                                <div className="white-box">
                                    <div>
                                        <img src="https://uploads-ssl.webflow.com/60b522cd7dd4732e654823f9/60b522cd7dd4738c6548240f_feather2-17-white.svg" className="grid-image" />
                                    </div>
                                    <h3>
                                        CLIP
                                    </h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.</p>
                                </div>
                            </div>
                            <div className=" w-col-4 w-col">
                                <div className="white-box">
                                    <div>
                                        <img src="https://uploads-ssl.webflow.com/60b522cd7dd4732e654823f9/60b522cd7dd4738c6548240f_feather2-17-white.svg" className="grid-image" />
                                    </div>
                                    <h3>
                                        CLIP
                                    </h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a href="#" className="button-2 w-button">
                        START YOUR FREE TRIAL
                    </a>

                </div>
                <div className="section accent">
                    <div className="w-container">
                        <div className="section-title-group">
                            <h2 className="section-heading centered white">
                                HOW IT WORKS(video below we will add)
                            </h2>
                            <div className="section-subheading center off-white">

                            </div>
                        </div>
                        <div className="w-video w-embed">

                        </div>
                    </div>

                </div>
                <section id="call-to-action" className="call-to-action">
                    <div className="centered-container w-container">
                        <h2>
                            <span className="text-span-2">
                                <strong>
                                    Pricing
                                </strong>
                            </span>
                        </h2>
                        <p className="paragraph">
                            <span className="text-span">
                                <strong>
                                    <em>
                                        12.99/mo. unlimited usage
                                    </em>
                                </strong>
                            </span>
                            <br />
                            -
                            <span>
                                <strong>
                                    Tik Tok aspect ratio made easy

                                    <br />
                                    -Facecam cropping
                                    <br />
                                    -Access to all templates
                                    <br />
                                    -Instant Access to Twitch, Facebook, or YouTube clips
                                    <br />
                                    -1,000,000+ GIF Images
                                    <br />
                                    -Ability to post directly to TikTok, Instagram, and YouTube
                                    <br />
                                    -Up to 1GB per edit
                                </strong>
                            </span>
                            <strong>
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                            </strong>

                            <span className="text-span">
                                <strong>
                                    <em>
                                        19.99/mo. unlimited usage
                                    </em>
                                </strong>
                            </span>
                            <br />
                            -
                            <span>
                                <strong>
                                    -Tik Tok aspect ratio made easy

                                    <br />
                                    -Facecam cropping
                                    <br />
                                    -Access to all templates
                                    <br />
                                    -Instant Access to Twitch, Facebook, or YouTube clips
                                    <br />
                                    -1,000,000+ GIF Images
                                    <br />
                                    -Ability to post directly to TikTok, Instagram, and YouTube
                                </strong>
                            </span>
                            <br />
                            <strong>
                                <em className="italic-text">
                                    -Up to 4GB per edit
                                </em>
                            </strong>
                            <span>
                                <strong>
                                    <em>
                                        <br />
                                    </em>
                                </strong>
                            </span>
                            <br />

                        </p>
                        <a href="#" className="w-button">
                            SIGN ME UP!
                        </a>

                    </div>
                </section>
            </div>




        )
    }
}

export default Home;