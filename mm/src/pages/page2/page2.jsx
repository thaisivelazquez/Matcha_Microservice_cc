import React, { useState } from 'react';
import './page2.css';  
import Navbar from '../../components/Navbar/Navbar';
import Table from '../../components/Table/Table';

const Page2 = () => {
  // Define the columns for the table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Product Name',
        accessor: 'Product Name',
      },
      {
        Header: 'Rating',
        accessor: 'Rating',
      },
      {
        Header: 'Description',
        accessor: 'Description',
      },
      {
        Header: 'Rating/Price per g',
        accessor: 'Rating/Price per g',
      },
    ],
    []
  );

  // Initial data for the table
  const initialData = [
    { 'Product Name': 'matcha1', 'Rating': '30g', 'Description': '$29', 'Rating/Price per g': '$0.96' },
    { 'Product Name': 'matcha', 'Rating': '30g', 'Description': '$29', 'Rating/Price per g': '$0.96' },
    { 'Product Name': 'matcha', 'Rating': '30g', 'Description': '$29', 'Rating/Price per g': '$0.96' },
    { 'Product Name': 'matcha', 'Rating': '30g', 'Description': '$29', 'Rating/Price per g': '$0.96' }
  ];

  // State to hold the table data
  const [data, setData] = useState(initialData);

  // State to hold input field values for adding a new row
  const [newRow, setNewRow] = useState({
    'Product Name': '',
    'Rating': '',
    'Description': '',
    'Rating/Price per g': ''
  });

  // Handle changes to input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prevRow) => ({
      ...prevRow,
      [name]: value,
    }));
  };

  // Handle form submission (add new row)
  const handleAddRow = (e) => {
    e.preventDefault();
    // Add the new row to the existing data
    setData((prevData) => [...prevData, newRow]);
    // Reset the form fields
    setNewRow({
      'Product Name': '',
      'Rating': '',
      'Description': '',
      'Rating/Price per g': ''
    });
  };

  return (
    <div>
      <Navbar />

      {/* Table component */}
      <Table columns={columns} data={data} />

      {/* Form for adding a new row (moved below the table) */}
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
