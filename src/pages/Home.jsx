import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clearAllItem, validateToken } from '../utils/helper';

function Home() {

  const [routeLoginRegister, setRouteLoginRegister] = useState({
    login: '',
    register: '',
  });

  /**
   * The validate function is an async function that returns the result of the validateToken function.
   * @returns The function validate is returning a promise.
   */
  const validate = async () => {
    const res = await validateToken();
    return res;
  };

  useEffect(() => {
    validate().then(
      (res) => {
        if (!res) {
          setRouteLoginRegister({
            login: 'login',
            register: 'register',
          });
          clearAllItem();
        } else {
          setRouteLoginRegister({
            login: 'dashboard',
            register: 'dashboard',
          });
        }
      },
      []
    );
  });

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
        <div className="col-xl-2 col-lg-2 col-md-4 col-sm-12 mt-2 text-center">
          <Link to={routeLoginRegister.login} className="btn btn-success" type="button">
            Login
          </Link>
        </div>
        <div className="col-xl-2 col-lg-2 col-md-4 col-sm-12 mt-2 text-center">
          <Link to={routeLoginRegister.register} className="btn btn-warning" type="button">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
