import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import ReactFacebookLogin from 'react-facebook-login';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { loginProcess } from '../app/redux/reducer';
import { isValidEmail, setStore, strongPassword } from '../utils/helper';

function Register() {
  const [loadingRegisterOauth, setLoadingLoginOauth] = useState();

  const email = useRef();
  const fullname = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loadingRegister, setLoadingRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);
  const [notValid, setNotValid] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    fullname: false,
  });

  const [isError, setIsError] = useState(false);

  /**
   * Handling Register Facebook
   * @param {*} response
   */
  const handleRegisterFacebook = async (response) => {
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        type: 'facebook',
        email: response.email,
        fullname: response.name,
      })
      .then((res) => {
        const { data } = res;
        dispatch(loginProcess(data.data));
        setStore('web-token', data.data.token);
        setLoadingLoginOauth(false);
        navigate('/dashboard');
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oopss...',
          text: err.response.data.message,
        });
        setLoadingLoginOauth(false);
      });
  };

  /**
   * Handling google register
   * @param {*} googleData
   */
  const handleRegisterGoogle = async (googleData) => {
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        type: 'google',
        token: googleData.credential,
      })
      .then((response) => {
        const { data } = response;
        dispatch(loginProcess(data.data));
        setStore('web-token', data.data.token);
        setLoadingLoginOauth(false);
        navigate('/dashboard');
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oopss...',
          text: err.response.data.message,
        });
        setLoadingLoginOauth(false);
      });
  };

  /**
   * Submit register
   * @param {*} event
   */
  const submitRegister = async (event) => {
    event.preventDefault();
    setLoadingRegister(true);
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/register`, {
        type: 'email',
        fullname: fullname.current.value,
        email: email.current.value,
        password: password.current.value,
        confirm_password: confirmPassword.current.value,
      })
      .then((res) => {
        const { data } = res;
        setLoadingRegister(false);
        setIsError(false);
        setErrorMessage([]);
        Swal.fire({
          icon: 'success',
          title: 'Great',
          text: data.message,
        }).then(() => {
          navigate('/login');
        });
      })
      .catch((err) => {
        const errData = err.response.data;
        if (errData.status === 400 || errData.status === 422) {
          setIsError(true);
          setErrorMessage(errData.message);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: errData.message,
          });
        }
        setLoadingRegister(false);
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center mb-5">
          <h2 className="heading-section">Register</h2>
        </div>
      </div>
      {loadingRegisterOauth ? (
        <div>Loading....</div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="login-wrap p-0">
              <h5 className="mb-4 text-center">
                Have an account?
                <Link to="/login" className="mb-4 text-center">
                  {' '}
                  Sign In Here{' '}
                </Link>
              </h5>
              <form onSubmit={(event) => submitRegister(event)} className="signin-form">
                <ul>
                  {isError && !loadingRegister
                    ? errorMessage.map((value) => (
                        <li key={value.param} style={{ color: 'red' }}>
                          {value.msg}
                        </li>
                      ))
                    : ''}
                </ul>
                <div className="form-group mb-1">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Fullname"
                    ref={fullname}
                    required
                  />
                </div>
                <div className="form-group mb-1">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    onInput={(event) => {
                      if (!isValidEmail(event.target.value) || event.target.value === '') {
                        setNotValid({
                          ...notValid,
                          email: true,
                        });
                      } else {
                        setNotValid({
                          ...notValid,
                          email: false,
                        });
                      }
                    }}
                    ref={email}
                    required
                  />
                  {notValid.email ? <span style={{ color: 'red' }}>Email is Not Valid</span> : null}
                </div>
                <div className="form-group mb-1">
                  <input
                    id="password-field"
                    type="password"
                    className="form-control"
                    ref={password}
                    onInput={(event) => {
                      if (!strongPassword(event.target.value) || event.target.value === '') {
                        setNotValid({
                          ...notValid,
                          password: true,
                        });
                      } else {
                        setNotValid({
                          ...notValid,
                          password: false,
                        });
                      }
                    }}
                    placeholder="Password"
                    required
                  />
                  {notValid.password ? (
                    <span style={{ color: 'red' }}>
                      The password length must be greater than or equal to 8, must contain one or
                      more uppercase characters, must contain one or more lowercase characters, must
                      contain one or more numeric values, must contain one or more special
                      characters
                    </span>
                  ) : null}
                </div>
                <div className="form-group mb-1">
                  <input
                    id="confirm-password-field"
                    type="password"
                    className="form-control"
                    ref={confirmPassword}
                    onInput={(event) => {
                      if (event.target.value !== password.current.value) {
                        setNotValid({
                          ...notValid,
                          confirmPassword: true,
                        });
                      } else {
                        setNotValid({
                          ...notValid,
                          confirmPassword: false,
                        });
                      }
                    }}
                    placeholder="Confirm Password"
                    required
                  />
                  {
                    notValid.confirmPassword ? 
                    <span style={{ 'color' : 'red' }}>
                      Confirmation password does not match
                    </span> : null
                  }
                </div>
                <div className="form-group mb-1">
                  <button
                    type="submit"
                    disabled={notValid.email || notValid.password || notValid.confirmPassword || loadingRegister}
                    className="form-control btn btn-primary submit px-3"
                  >
                    {loadingRegister ? 'Loading...' : 'Sign Up'}
                  </button>
                </div>
              </form>
              <p className="w-100 text-center">&mdash; Or Sign Up With &mdash;</p>
              <div className="social d-flex text-center">
                <ReactFacebookLogin
                  cssClass="btn btn-primary p-2 mx-2"
                  appId={process.env.REACT_APP_FACEBOOK_APPLICATION_ID}
                  callback={handleRegisterFacebook}
                  fields="name,email"
                  textButton="Facebook"
                  icon="fa fa-facebook"
                />
                <GoogleLogin text="Google" onSuccess={handleRegisterGoogle} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
