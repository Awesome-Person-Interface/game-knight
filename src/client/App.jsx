import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CurrentGame from './views/CurrentGame';
import Home from './views/Home';
import Login from './views/Login';
import GameNights from './views/GameNights';
import Groups from './views/Groups';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="home" element={<Home />} />
        <Route path="gamenights" element={<GameNights />} />
        <Route path="groups" element={<Groups />} />
        <Route path="current-game" element={<CurrentGame />} />
      </Routes>
    </div>
  );
}

export default App;
