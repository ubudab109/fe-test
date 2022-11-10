import axios from 'axios';
import React, { useState } from 'react';
import { 
  Row, 
  Form,
  Button, 
} from 'react-bootstrap';
import Swal from 'sweetalert2';
import { getStore, strongPassword } from '../../../utils/helper';

function FormPassword() {

  const [errorPassword, setIsErrorPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  
  const [formPassword, setFormPassword] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMesage] = useState([]);

  const [isLoadingChangePassword, setIsLoadingChangePassword] = useState(false);

  /**
   * If the password is not strong, set the error state to true. Otherwise, set the error state to
   * false.
   */
  const handlerStrongPassword = (event) => {
    if (!strongPassword(event.target.value)) {
      setIsErrorPassword({
        ...errorPassword,
        newPassword: true,
      });
    } else {
      setIsErrorPassword({
        ...errorPassword,
        newPassword: false,
      });
    }
  }

  /**
   * If the value of the input field is not equal to the value of the password field, then set the
   * error state to true.
   */
  const confirmPasswordHandler = (event) => {
    if (event.target.value !== formPassword.newPassword) {
      setIsErrorPassword({
        ...errorPassword,
        confirmPassword: true,
      });
    } else {
      setIsErrorPassword({
        ...errorPassword,
        confirmPassword: false,
      });
    }
  }

  /**
   * The passwordHandler function takes an event as an argument, and then sets the formPassword state
   * to the event's target's name and value.
   */
  const passwordHandler = (event) => {
    setFormPassword({
      ...formPassword,
      [event.target.name] : event.target.value,
    });
  }

  /**
   * The function is used to change the user's password, and the function will be called when the user
   * clicks the submit button.
   */
  const submitChangePassword = async (event) => {
    event.preventDefault();
    setIsLoadingChangePassword(true);
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/change-password`, {
      oldPassword: formPassword.oldPassword,
      newPassword: formPassword.newPassword,
      confirmPassword: formPassword.confirmPassword,
    }, {
      headers: {
        'Authorization' : getStore('web-token'),
      }
    }).then(res => {
      setIsLoadingChangePassword(false);
      setErrorMesage([]);
      setFormPassword({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setErrorMesage([]);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: res.data.message,
      });
    }).catch(err => {
      setIsLoadingChangePassword(false);
      if (err.response.status === 400 || err.response.status === 422) {
        setErrorMesage(err.response.data.message)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.response.data.message
        });
      }
    })
  }

  return (
    <Row className="mt-4">
      <ul>
        {
          errorMessage.map(value => (
            <li key={value.msg} style={{ 'color' : 'red' }}>{value.msg}</li>
          ))
        }
      </ul>
      <Form onSubmit={event => submitChangePassword(event)}>
        <Form.Group className="mb-3" controlId="currentPassword">
          <Form.Label>Current Password</Form.Label>
          <Form.Control 
            onChange={event => passwordHandler(event)} 
            name="oldPassword" 
            type="password" 
            value={formPassword.oldPassword} 
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="newPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            onInput={event => handlerStrongPassword(event)}
            onChange={event => passwordHandler(event)} 
            name="newPassword" 
            type="password" 
            value={formPassword.newPassword} 
          />
          {
            errorPassword.newPassword ? 
            <span style={{ 'color' : 'red' }}>
              The password length must be greater than or equal to 8,
              must contain one or more uppercase characters,
              must contain one or more lowercase characters,
              must contain one or more numeric values,
              must contain one or more special characters
            </span> : null
          }
        </Form.Group>

        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            onInput={event => confirmPasswordHandler(event)}
            onChange={event => passwordHandler(event)} 
            name="confirmPassword" 
            type="password" 
            value={formPassword.confirmPassword} 
          />
          {
            errorPassword.confirmPassword ? 
            <span style={{ 'color' : 'red' }}>
              Confirmation password does not match
            </span> : null
          }
        </Form.Group>


        <Button 
          variant="primary" 
          type="submit"
          disabled={
            errorPassword.confirmPassword || errorPassword.newPassword || isLoadingChangePassword
          }
        >
          {isLoadingChangePassword ? 'Loading...' : 'Save'}
        </Button>
      </Form>
    </Row>
  );
};

export default FormPassword;
