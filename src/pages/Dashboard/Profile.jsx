import React, { useRef, useState } from 'react';
// import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Row, 
  Form,
  Button,
} from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import Main from './Main';
import FormPassword from './Component/FormPassword';
import { getStore } from '../../utils/helper';
import { updateProfile } from '../../app/redux/reducer';

function Profile() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.app.dataUser);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);
  const newFullnameValue = useRef();
  const [isFormPasswordOpen, setIsFormPasswordOpen] = useState(false);

  /**
   * If the form password is open, close it. If the form password is closed, open it.
   */
  const formPasswordHandler = () => {
    if (isFormPasswordOpen) {
      setIsFormPasswordOpen(false);
    } else {
      setIsFormPasswordOpen(true);
    }
  }

  /**
   * It's a function that will be called when the form is submitted, it will send a request to the
   * server to update the user's profile, and if the request is successful, it will update the user's
   * profile in the state and show a success message, otherwise it will show an error message.
   */
  const formProfileHandler = async (event) => {
    event.preventDefault();
    setIsLoadingForm(true);
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/update-profile`, {
      fullname: newFullnameValue.current.value,
    }, {
      headers: {
        'Authorization': getStore('web-token'),
      }
    }).then(res => {
      const {data} = res;
      dispatch(updateProfile(data.data));
      setIsLoadingForm(false);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: data.message,
      })
    }).catch(err => {
      setIsLoadingForm(false);
      if (err.response.status === 400 || err.response.status === 422) {
        setErrorMessage(err.response.data.message)
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
    <Main>
      <Container>
        <Row className="mt-4 mb-5">
          <ul>
            {
              errorMessage.map(value => (
                <li key={value.param} style={{ 'color': 'red' }}>{value.msg}</li>
              ))
            }
          </ul>
          <Form onSubmit={event => formProfileHandler(event)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" disabled value={userData.email} />
              <Form.Text className="text-muted">
                We will never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Fullname</Form.Label>
              <Form.Control type="text" placeholder="Password" ref={newFullnameValue} defaultValue={userData.fullname} />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoadingForm}>
              {isLoadingForm ? 'Loading...' : 'Save Changes'}
            </Button>
          </Form>
        </Row>
        {
          userData.registerType === 'email' ?
          <Button variant="warning" type="button" onClick={formPasswordHandler}>
            Change Password
          </Button> : null
        }
        {
          isFormPasswordOpen ? 
          <FormPassword /> : null
        }
      </Container>
    </Main>
  );
};

export default Profile;
