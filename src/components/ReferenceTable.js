import React, { useState } from "react";
import data from "../../docs/reference/reference.json";
import { DataGridPro } from "@mui/x-data-grid-pro/DataGridPro/DataGridPro";
import { renderCellExpand } from "./RenderCellExpand";

export default function ReferenceTable() {
  const [pageSize, setPageSize] = useState(10);
  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };

  const references = Object.values(data);
  const columns = [
    {
      headerName: "Id",
      field: "id",
      flex: 1,
      hide: true,
    },
    {
      headerName: "Name",
      field: "title",
      flex: 1,
      renderCell: function NameCell(params) {
        return (
          <a href={`/docs/reference/${params.row.id}`}>{params.row.title}</a>
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
      headerName: "Categories",
      field: "categories",
      sortable: false,
      flex: 1,
      renderCell: function CategoryCell(params) {
        return (
          <div>
            {params.row.categories.map(function (cat) {
              return <div>{cat}</div>;
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
        rowsPerPageOptions={[5, 10, 25, 50]}
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
      />
    </div>
  );
}
