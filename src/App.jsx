import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import routeList from './routes/Route';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="App">
        <RouterProvider router={routeList} />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
