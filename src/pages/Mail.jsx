import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setStore } from '../utils/helper';
import { loginProcess } from '../app/redux/reducer';

function Mail() {
  const [isVerified, setIsVerified] = useState(true);
  const verifying = useRef(true);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * It takes a token from the url, sends it to the backend, and if the token is valid, it logs the
   * user in.
   */
  const validate = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get('token');
    if (!token) {
      setIsVerified(false);
      setMessage('Token Not Found');
    }
    await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/confirm-verification?token=${token}`)
      .then((res) => {
        const { data } = res;
        setIsVerified(true);
        setMessage(data.message);
        dispatch(loginProcess(data.data));
        setStore('web-token', data.data.token);
      })
      .catch((err) => {
        setIsVerified(false);
        setMessage(err.response.data.message);
      });
  };

  useEffect(() => {
    if (verifying.current) {
      verifying.current = false;
      validate()
      .then(() => {
        setTimeout(() => {
          navigate('/dashboard')
        }, 3000);
      }).catch(() => {
        setTimeout(() => {
          navigate('/login')
        }, 3000);
      });
    }
  }, []);

  if (!isVerified && !verifying) {
    return (
      <div
        className="container h-100"
        style={{
          minHeight: '100vh',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <div className="row justify-content-center" style={{ width: '100%' }}>
          <h3>{message}</h3>
          <Link to="/login">
            You Will Redirect To Login Page After A Few Seconds. Click here if it feels too long
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container h-100"
      style={{
        minHeight: '100vh',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      <div className="row justify-content-center" style={{ width: '100%' }}>
        <h3>{message}</h3>
        <Link to="/dashboard">
          You Will Redirect To Dashboard After A Few Seconds. Click here if it feels too long.
        </Link>
      </div>
    </div>
  );
}

export default Mail;
