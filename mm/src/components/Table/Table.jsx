import React from "react";
import { useTable } from "react-table";
import './Table.css';

function Table({ columns, data, handleDeleteRow }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <div className="table-container">
      <div className="title-strip">
        <h1 className="table-title">Insert your matcha details</h1>
      </div>

      <table {...getTableProps()} className="styled-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="header-row">
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="header-cell">
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="data-row">
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} className="data-cell">
                      {cell.column.id === 'photo' ? (
                        <img src={cell.value} alt="Product" className="product-img" />
                      ) : (
                        cell.render("Cell")
                      )}
                    </td>
                  );
                })}
                <td className="data-cell">
                  {/* Delete Button directly in the row */}
                  <button 
                    onClick={() => handleDeleteRow(index)} 
                    className="delete-button">
                    Delete
                  </button>
                </td> {/* Delete button at the end of the row */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
