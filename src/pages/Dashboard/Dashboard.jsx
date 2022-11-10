import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
} from 'react-bootstrap';
import Swal from 'sweetalert2';
import { formatDate, getStore } from '../../utils/helper';
import Main from './Main';

function Dashboard() {
  const [cardData, setCardData] = useState({
    totalUser: null,
    activeToday: null,
    averageSessionUser: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [userData, setUserData] = useState([]);

  /**
   * This function is used to fetch data from the backend and set the data to the state
   */
  const fetchAllData = async () => {
    setIsLoading(true);
    await axios.get(`${process.env.REACT_APP_BACKEND_URL}/dashboard`, {
      headers: {
        'Authorization' : getStore('web-token'),
      }
    }).then(res => {
      setIsLoading(false);
      const {data} = res.data;
      setUserData(data.listUsers);
      setCardData({
        totalUser: data.totalUsers,
        activeToday: data.activeSessionToday,
        averageSessionUser: data.averageSessionByWeek
      });
    }).catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Oops..',
        text: 'There was an error when fetching data',
      })
      setIsLoading(false);
    })
  };

  const refreshData = async () => {
    await fetchAllData();
  }


  useEffect(() => {
    fetchAllData();
  }, []);


  return (
    <Main>
      <Container>
      <Row className="mt-5">
        <Button variant="primary" onClick={refreshData}  >Refresh Data</Button>
      </Row>
      {/* CARD */}
      <Row className="mt-4">
        {
          isLoading ? 
          <p>Fetching...</p>
          :
          <>
            <Col lg={4} md={4} sm={12}>
              <Card>
                <Card.Body>
                  <Card.Title>Total User Signup</Card.Title>
                  <Card.Text>
                    {cardData.totalUser}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={4} sm={12}>
              <Card>
                <Card.Body>
                  <Card.Title>Total User Active Today</Card.Title>
                  <Card.Text>
                    {cardData.activeToday}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={4} sm={12}>
              <Card>
                <Card.Body>
                  <Card.Title>Average Active Session in Last 7 Days</Card.Title>
                  <Card.Text>
                    {cardData.averageSessionUser}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </>
        }
      </Row>

      {/* TABLE USER */}
      <Row className="mt-4">
        <Col lg={12} md={12} sm={12}>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Registered At</th>
                <th>Number Times Logged In</th>
                <th>Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {
                isLoading && userData.length < 1 ? 
                <tr>
                  <th colSpan={5}>Fetching...</th>
                </tr>
                :
                userData.map(value => (
                  <tr key={value.id}>
                    <td>{value.fullname}</td>
                    <td>{value.email}</td>
                    <td>
                      {formatDate(new Date(value.created_at))}
                    </td>
                    <td>{value.timesLoggedIn}</td>
                    <td>
                      {
                        value.session.length > 0 ? formatDate(new Date(value.session[value.session.length - 1].lastSeen))
                        : ''
                      }
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
    </Main>
  );
};

export default Dashboard
