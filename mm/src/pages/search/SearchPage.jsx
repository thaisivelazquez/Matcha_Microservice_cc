import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

const SearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query');

  return (
    <div>
      <Navbar /> 
      <h1>Search Results for: "{query}"</h1>
      
    </div>
  );
};

export default SearchPage;
