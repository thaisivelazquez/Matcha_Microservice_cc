import React, { useState } from 'react';
import './page1.css';
import Navbar from '../../components/Navbar/Navbar';
import Table from '../../components/Table/Table';

const Page1 = () => {
  
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

 
  const initialData = [
    { 'Product Name': 'matcha', 'Photo': '$1', 'Time': 30, 'Grams': '30g', 'Cost': '$29', 'Price per gram': '$0.96' },
    { 'Product Name': 'matcha', 'Photo': '$1', 'Time': 30, 'Grams': '30g', 'Cost': '$29', 'Price per gram': '$0.96' },
    { 'Product Name': 'matcha', 'Photo': '$1', 'Time': 30, 'Grams': '30g', 'Cost': '$29', 'Price per gram': '$0.96' },
    { 'Product Name': 'matcha', 'Photo': '$1', 'Time': 30, 'Grams': '30g', 'Cost': '$29', 'Price per gram': '$0.96' },
  ];

  
  const [data, setData] = useState(initialData);

  
  const [newRow, setNewRow] = useState({
    'Product Name': '',
    'Photo': '',
    'Grams': '',
    'Cost': '',
    'Price per gram': '',
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

   
    const currentTime = new Date().toLocaleString(); 

    
    setData((prevData) => [
      ...prevData,
      {
        ...newRow,
        Time: currentTime,
      },
    ]);

    setNewRow({
      'Product Name': '',
      'Photo': '',
      'Grams': '',
      'Cost': '',
      'Price per gram': '',
    });
  };

  return (
    <div>
      <Navbar />

      {/* Table component */}
      <Table columns={columns} data={data} />

      {/* Form for adding a new row */}
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
            name="Photo"
            value={newRow['Photo']}
            onChange={handleInputChange}
            placeholder="Photo"
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="Grams"
            value={newRow['Grams']}
            onChange={handleInputChange}
            placeholder="Grams"
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="Cost"
            value={newRow['Cost']}
            onChange={handleInputChange}
            placeholder="Cost"
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="Price per gram"
            value={newRow['Price per gram']}
            onChange={handleInputChange}
            placeholder="Price per gram"
            required
          />
        </div>
        <button type="submit">Add Row</button>
      </form>
    </div>
  );
};

export default Page1;
