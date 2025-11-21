import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Page1 from './pages/page1/page1';
import Page2 from './pages/page2/page2';
import LoginPage from './pages/Login_page/login_page';
import PrefPage from './pages/pref_page/pref_page';

const App = () => {
  return (
    <Router>
      <div className='app'>
        <Routes>
          <Route path='/Login_page' element={<LoginPage />} />
          <Route path='/' element={<Home />} />
          <Route path='/Setpreferances' element={<PrefPage />} />  
          <Route path='/page1' element={<Page1 />} />
          <Route path='/page2' element={<Page2 />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
