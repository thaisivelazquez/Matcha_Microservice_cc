import React from 'react';
import './page1.css';
import Navbar from '../../components/Navbar/Navbar';
import Table from '../../components/Table/Table';

const Page1 = () => {
  // Define the columns for the table
  const columns = React.useMemo(
    () => [
    {
        Header: 'Product Name',
        accessor: 'Product Name',   
    },
    
    {
        Header: 'Photo',
        accessor: 'Photo',
    },

    {
        Header: 'Time',
        accessor: 'Time',
    },

    {
        Header: 'Grams',
        accessor: 'Grams',
    },


    {
        Header: 'Cost',
        accessor: 'Cost',
    },

    {
        Header: 'Price per gram',
        accessor: 'Price per gram',
    },
    ],
    []
  );




  const data = React.useMemo(
    () => [
      { 'Product Name': 'matcha', 'photo': '$1', 'Time': 30, 'Grams': '30g', 'Cost': '$29', 'Price per gram':'$0.96'},
      { 'Product Name': 'matcha', 'photo': '$1', 'Time': 30, 'Grams': '30g', 'Cost': '$29', 'Price per gram':'$0.96'},
      { 'Product Name': 'matcha', 'photo': '$1', 'Time': 30, 'Grams': '30g', 'Cost': '$29', 'Price per gram':'$0.96'},
      { 'Product Name': 'matcha', 'photo': '$1', 'Time': 30, 'Grams': '30g', 'Cost': '$29', 'Price per gram':'$0.96'}
    ],
    []
  );

  return (
    <div>
      <Navbar />
    
      
      
      <Table columns={columns} data={data} />  



    </div>
  );
};

export default Page1;
