import React, { Suspense, useEffect,useState } from 'react';
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "./Assets/css/app.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Provider } from 'react-redux';
import Routes from './routes';
import configureStore from './Store/store/configureStore';


const store = configureStore();

const Header = React.lazy(() => import('./Components/Layout/Header'));
const Footer = React.lazy(() => import('./Components/Layout/Footer'));





toast.configure();

function App() {
  return (
    <Suspense fallback={<div>Loading... </div>}>
      <Provider store={store}>
        <Header />
        <Routes />
      </Provider>
    </Suspense>
  );
}

export default App;
