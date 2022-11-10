import React, { useRef, useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import ReactFacebookLogin from 'react-facebook-login';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Link , useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import { loginProcess } from '../app/redux/reducer';
import { getStore, setStore } from '../utils/helper';

function Login () {
  const email = useRef();
  const password = useRef();
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingLoginGoogle, setLoadingLoginGoogle] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isNotVerified, setIsNotVerified] = useState(false);
  const [isLoadingResend, setIsLoadingResend] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  /**
   * Handling resend email verification
   * @param {*} event 
   */
  const resendEmail = async (event) => {
    event.preventDefault();
    setIsLoadingResend(true);
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/resend-verification`, {
      email: email.current.value,
      verificationType : 'email',
    }).then((res) => {
      setIsLoadingResend(false);
      Swal.fire({
        icon: 'success',
        title: res.data.message
      });
    }).catch((err) => {
      setIsLoadingResend(false);
      Swal.fire({
        icon: 'success',
        title: err.response.data.message
      });
    })
  };

  /**
   * Handling Login Facebook
   * @param {*} response 
   */
  const handleLoginFacebook = async (response) => {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
      type: 'facebook',
      email: response.email,
      fullname: response.name
    }).then(res => {
      const {data} = res;
      dispatch(loginProcess(data.data));
      setStore('web-token', data.data.token);
      setLoadingLoginGoogle(false);
      navigate('/dashboard');
    }).catch(err => {
      Swal.fire({
        icon: 'error',
        title: 'Oopss...',
        text: err.response.data.message,
      });
      setLoadingLoginGoogle(false);
    });
  }

  /**
   * Handling Login google
   * @param {*} googleData 
   */
  const handleLoginGoogle = async (googleData) => {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
      type: 'google',
      token: googleData.credential,
    }).then(response => {
      const {data} = response;
      dispatch(loginProcess(data.data));
      setStore('web-token', data.data.token);
      setLoadingLoginGoogle(false);
      navigate('/dashboard');
    }).catch(err => {
      Swal.fire({
        icon: 'error',
        title: 'Oopss...',
        text: err.response.data.message,
      });
      setLoadingLoginGoogle(false);
    });
  }

  /**
   * Submit login process
   * @param {*} event 
   */
  const submitLogin = async (event) => {
    event.preventDefault();
    setLoadingLogin(true);

    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
      type: 'email',
      email: email.current.value,
      password: password.current.value,
    }).then((response) => {
      const {data} = response;
      dispatch(loginProcess(data.data));
      setStore('web-token', data.data.token);
      setLoadingLogin(false);
      navigate('/dashboard');
    }).catch((err) => {
      if (err.response.data !== null && !err.response.data.isEmailVerified) {
        setIsNotVerified(true);
      }

      setErrorMessage(err.response.data.message);
      setLoadingLogin(false);
    });
  };

  useEffect(() => {
    if (getStore('web-token')) {
      navigate('/dashboard');
    }
  })

  return (
    <div className="container">
			<div className="row justify-content-center">
				<div className="col-md-6 text-center mb-5">
					<h2 className="heading-section">Login</h2>
				</div>
			</div>
      {
        loadingLoginGoogle ? <div>Loading....</div> :
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="login-wrap p-0">
              <h5 className="mb-4 text-center">
                Not Have an account?
                <Link to="/register" className="mb-4 text-center"> Sign Up Here </Link>
              </h5>
              <form onSubmit={event => submitLogin(event)} className="signin-form">
                <span style={{ 'color' : 'red' }}>
                  {
                    errorMessage !== '' ? errorMessage : ''
                  }
                </span>
                {
                  isNotVerified ? 
                  <div className="mb-3">
                    <span>Did not receive any email?</span>
                    <button onClick={event => resendEmail(event)} type="button" className="btn" style={{ 'padding' : '0' }}>
                      <u>{ isLoadingResend ? 'Sending...' : 'Resend Email Verification' }</u>
                    </button>
                  </div>
                  : ''
                }
                <div className="form-group mb-1">
                  <input type="email" className="form-control" placeholder="Email" ref={email} required />
                </div>
                <div className="form-group mb-1">
                  <input id="password-field" type="password" className="form-control" ref={password} placeholder="Password" required />
                </div>
                <div className="form-group mb-1">
                  <button type="submit" disabled={loadingLogin} className="form-control btn btn-primary submit px-3">
                    {
                      loadingLogin ? 'Loading...' : 'Login'
                    }
                  </button>
                </div>
              </form>
              <p className="w-100 text-center">&mdash; Or Sign In With &mdash;</p>
              <div className="social d-flex text-center">
                <ReactFacebookLogin
                  cssClass="btn btn-primary p-2 mx-2"
                  appId={process.env.REACT_APP_FACEBOOK_APPLICATION_ID}
                  callback={handleLoginFacebook}
                  fields="name,email"
                  textButton="Facebook"
                  icon="fa fa-facebook"
                />
                <GoogleLogin 
                  text="Google"
                  onSuccess={handleLoginGoogle}
                />
              </div>
            </div>
          </div>
        </div>
      }
		</div>
  );
};

export default Login;
