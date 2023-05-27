import React from "react";
import ReactDOM from "react-dom/client";
import "remixicon/fonts/remixicon.css";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import store from "./redux/store";
import { Provider } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter> 
    <Provider store={store}>
    <ToastContainer
    theme="dark"
position="top-right"
autoClose={500}
closeOnClick
pauseOnHover={false}
/>
    <App />
    </Provider>
    </BrowserRouter>
   
  </React.StrictMode>
);
