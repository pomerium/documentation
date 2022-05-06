import React, { useState } from "react";
import data from "../../docs/reference/reference.json";
import { DataGridPro } from "@mui/x-data-grid-pro/DataGridPro/DataGridPro";
import { renderCellExpand } from "./RenderCellExpand";
import { GridToolbar } from "@mui/x-data-grid";

export default function ReferenceTable() {
  const [pageSize, setPageSize] = useState(10);
  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };

  const references = Object.values(data);
  const columns = [
    {
      headerName: "Name",
      field: "title",
      flex: 1,
      renderCell: function NameCell(params) {
        return (
          <a href={`/docs/reference/${params.row.path}`}>{params.row.title}</a>
        );
      },
    },
    {
      headerName: "Description",
      field: "description",
      flex: 2,
      renderCell: renderCellExpand,
    },
    {
      headerName: "Type",
      field: "_type",
      flex: 1,
      valueGetter: function getType(params) {
        return params.row?.attributes?.Type || "";
      },
      renderCell: renderCellExpand,
    },
    {
      headerName: "Services",
      field: "services",
      sortable: false,
      flex: 1,
      renderCell: function ServicesCell(params) {
        return (
          <div>
            {params.row.services.map(function (serv) {
              return <div>{serv}</div>;
            })}
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <DataGridPro
        initialState={{
          sorting: {
            sortModel: [{ field: "title", sort: "asc" }],
          },
        }}
        disableSelectionOnClick
        autoHeight
        rowsPerPageOptions={[5, 10, 25, 50, 100, 250]}
        pagination
        pageSize={pageSize}
        onPageSizeChange={changePageSize}
        sx={{
          "& .MuiDataGrid-columnHeader:last-child .MuiDataGrid-columnSeparator--sideRight":
            {
              display: "none",
            },
        }}
        columns={columns}
        rows={references}
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  );
}
