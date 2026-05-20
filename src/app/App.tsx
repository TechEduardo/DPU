import React, { useEffect, useState, useContext } from 'react';
import Routs from './Routes'
import { BrowserRouter } from 'react-router-dom';

import { UserRole } from './contexts/UserContext';

import './app.css';

const App = () => {
  return (
    <div>
        <BrowserRouter>
          <UserRole>
              <Routs/>
          </UserRole>
        </BrowserRouter>
    </div>
  )
}
export default App;