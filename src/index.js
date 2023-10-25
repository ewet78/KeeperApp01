import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./components/Login.jsx";
import Register from "./components/Registration.jsx";
import MainPage from './components/MainPage.jsx';
import App from "./components/App.jsx";
import PasswordReset from './components/PasswordReset.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const isLoggedIn=window.localStorage.getItem("loggedIn");

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <ToastContainer />
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgotpassword" element={<PasswordReset />} />
      <Route path="/app" element={isLoggedIn==="true"?<App />:<MainPage />} />
    </Routes>
  </BrowserRouter>
  );
