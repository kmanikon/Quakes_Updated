import React, { useState } from 'react';
import Home from './Components/Home';
import Map from './Components/Map';

import { Navigate, Router, Routes ,Route } from 'react-router-dom';

const App = () => {

  return (
    <div>
      <Routes>
        <Route exact path="/home" element={<Home/>}/>
        <Route exact path="/map" element={<Map/>}/>
        <Route exact path="*" element={<Home/>}/>
      </Routes>
    </div>
  );
};

export default App;
