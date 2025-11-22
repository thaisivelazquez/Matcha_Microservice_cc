import React from "react";
import { useTable } from "react-table";
import './Table.css'; 

function Table({ columns, data }) {
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
          {rows.map((row) => {
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;


