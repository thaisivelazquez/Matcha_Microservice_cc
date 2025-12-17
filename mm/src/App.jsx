import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar/Navbar';
import LoginPage from './pages/Login_page/login_page';
import Home from './pages/Home/Home';
import Page1 from './pages/page1/page1';
import Page2 from './pages/page2/page2';
import PrefPage from './pages/pref_page/pref_page';
import SearchPage from './pages/search/SearchPage'; 
import Profile from './pages/Profile/Profile';
import MatchaProfile from './pages/mprofile/mprofile';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className='app'>
          <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/home' element={<Home />} />
            <Route path='/Setpreferances' element={<PrefPage />} />  
            <Route path='/page1' element={<Page1 />} />
            <Route path='/page2' element={<Page2 />} />
            <Route path='/search' element={<SearchPage />} /> 
            <Route path='/profile' element={<Profile />} />
            <Route path='/matchaprofile' element={<MatchaProfile />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
