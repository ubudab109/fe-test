import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Navbar,
  Container,
  NavDropdown,
  Modal,
  Button,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { logoutProcess } from '../../app/redux/reducer';
import { clearAllItem, getStore, validateToken } from '../../utils/helper';

function Main({ children }) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.app.dataUser);

  /**
   * When the user clicks the logout button, open the logout modal.
   */
  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  /**
   * When the user clicks the 'X' button, the logout modal will close.
   */
  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  /**
   * Logout function is used to logout the user from the application
   * 
   * @param {*} event
   */
  const logout = async (event) => {
    event.preventDefault();
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/logout`, null, {
      headers : {
        Authorization: getStore('web-token'),
      }
    })
    .then(() => {
      clearAllItem();
      dispatch(logoutProcess());
      navigate('/login');
    }).catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Something went wrong",
      });
    })
  }

  /**
   * The validate function is an async function that returns the result of the validateToken function.
   * @returns The function validate is returning a promise.
   */
  const validate = async () => {
    const res = await validateToken();
    return res;
  };

  useEffect(() => {

    setInterval(() => {
      validate().then((res) => {
        if (!res) {
          clearAllItem();
          navigate('/login');
        }
      });
    }, 10800000);
  });

  return (
    <div>
      <Modal show={isLogoutModalOpen} onHide={closeLogoutModal}>
        <Modal.Header closeButton>
          <Modal.Title>Logout</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are You Sure Want To Logout?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeLogoutModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={event => logout(event)}>Logout</Button>
        </Modal.Footer>
      </Modal>

      {/* NAVBAR */}
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand>
            <Link to="/dashboard"  style={{ 'color' : 'white', 'textDecoration' : 'none' }}>Dashboard</Link>
          </Navbar.Brand>
          <NavDropdown style={{ color: 'white' }} title={`Halo ${userData.fullname}`} id="basic-nav-dropdown">
            <Link className="dropdown-item" to="/profile" style={{ 'color' : 'black', 'textDecoration' : 'none' }}>Profile</Link>

            <NavDropdown.Divider />
            <NavDropdown.Item onClick={openLogoutModal}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Container>
      </Navbar>
      {children}
    </div>
  );
}

Main.propTypes = {
  children: PropTypes.element.isRequired
}

export default Main;
