import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from "@tanstack/react-table";
import './Table.css';

function Table({ columns, data, handleDeleteRow }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="table-container">
      <div className="title-strip">
        <h1 className="table-title">Insert your matcha details</h1>
      </div>

      <table className="styled-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="header-row">
              {headerGroup.headers.map(column => (
                <th key={column.id} className="header-cell">
                  {flexRender(column.columnDef.header, column.getContext())}
                </th>
              ))}
              <th className="header-cell">Actions</th>
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <tr key={row.id} className="data-row">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="data-cell">
                  {cell.column.id === 'Product Name' ? (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  ) : (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
                </td>
              ))}
              <td className="data-cell">
                <button 
                  onClick={() => handleDeleteRow(index)} 
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
