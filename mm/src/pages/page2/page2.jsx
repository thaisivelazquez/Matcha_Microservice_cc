import React, { useState } from 'react';
import './page2.css';  
import Navbar from '../../components/Navbar/Navbar';
import Table from '../../components/Table/Table';

const Page2 = () => {

  const columns = React.useMemo(
    () => [
      {
        Header: 'Product Name',
        accessor: 'Product Name',
      },
      {
        Header: 'Rating out of 5',
        accessor: 'Rating',
      },

      
      {
        Header: 'Origin',
        accessor: 'Origin',
      },
      
      {
        Header: 'Rating/Price per g',
        accessor: 'Rating/Price per g',
      },
      
    ],
    []
  );


  const initialData = [
    { 'Product Name': 'matcha1', 'Rating': '3', 'Origin': 'home', 'Rating/Price per g': '$0.96'},
    { 'Product Name': 'matcha', 'Rating': '3', 'Origin': 'home', 'Rating/Price per g': '$0.96' },
    { 'Product Name': 'matcha', 'Rating': '3', 'Origin': 'home', 'Rating/Price per g': '$0.96' },
    { 'Product Name': 'matcha', 'Rating': '3', 'Origin': 'home', 'Rating/Price per g': '$0.96' }
  ];


  const [data, setData] = useState(initialData);

  
  const [newRow, setNewRow] = useState({
    'Product Name': '',
    'Rating': '',
    'Description': '',
    'Rating/Price per g': ''
  });

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prevRow) => ({
      ...prevRow,
      [name]: value,
    }));
  };

  
  const handleAddRow = (e) => {
    e.preventDefault();
   
    setData((prevData) => [...prevData, newRow]);
 
    setNewRow({
      'Product Name': '',
      'Rating': '',
      'Description': '',
      'Rating/Price per g': ''
    });
  };


  const handleDeleteRow = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  return (
    <div>
      <Navbar />

      
      <Table columns={columns} data={data} handleDeleteRow={handleDeleteRow} />

     
      <form onSubmit={handleAddRow} className="table-input-form">
        <div>
          <input
            type="text"
            name="Product Name"
            value={newRow['Product Name']}
            onChange={handleInputChange}
            placeholder="Product Name"
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="Rating"
            value={newRow['Rating']}
            onChange={handleInputChange}
            placeholder="Rating"
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="Description"
            value={newRow['Description']}
            onChange={handleInputChange}
            placeholder="Description"
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="Rating/Price per g"
            value={newRow['Rating/Price per g']}
            onChange={handleInputChange}
            placeholder="Rating/Price per g"
            required
          />
        </div>
        <button type="submit">Add Row</button>
      </form>
    </div>
  );
};

export default Page2;
