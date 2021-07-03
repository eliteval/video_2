import React, { Suspense } from 'react';
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { Switch, Route,Router } from "react-router-dom";
import "./Assets/css/app.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from 'react-redux';
import { createBrowserHistory } from "history";
import fb from "./Components/FB";


const Home = React.lazy(() => import('./Components/Home'));
const Template = React.lazy(() => import('./Components/Template'));
const FaceEdit = React.lazy(() => import('./Components/FaceEdit'));
const MainEdit = React.lazy(() => import('./Components/MainEdit'));
const Preview = React.lazy(() => import('./Components/Preview'));
const Save = React.lazy(() => import('./Components/Save'));
const YoutubeExample = React.lazy(() => import('./Components/YoutubeExample'));
const FB = React.lazy(() => import('./Components/FB'));

const Profile = React.lazy(() => import('./Components/Profile'));
const Deposit = React.lazy(() => import('./Components/Deposit'));
const Membership = React.lazy(() => import('./Components/Membership'));

const Login = React.lazy(() => import('./Components/Auth/Login'));
const Register = React.lazy(() => import('./Components/Auth/Register'));

export const history = createBrowserHistory();

toast.configure();

const Routes = (props) => {
    console.log('props')
    console.log(props)

    return (
        <>
            {
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route  path="/template" component={Template} />
                        <Route exact path="/face-edit" component={FaceEdit} />
                        <Route exact path="/main-edit" component={MainEdit} />
                        <Route exact path="/preview" component={Preview} />
                        <Route exact path="/save" component={Save} />
                        <Route exact path="/youtube" component={YoutubeExample} />
                        <Route exact path="/fb" component={FB} />
                        <Route exact path="/profile" component={Profile} />
                        <Route exact path="/deposit" component={Deposit} />
                        <Route exact path="/membership" component={Membership} />

                        <Route exact path="/login" component={Login} />
                        <Route exact path="/register" component={Register} />
                    </Switch>

            }
        </>


    );
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Routes)
