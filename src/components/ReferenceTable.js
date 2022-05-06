import React, { useState } from "react";
import data from "../../docs/reference/reference.json";
import { DataGridPro } from "@mui/x-data-grid-pro/DataGridPro/DataGridPro";
import { renderCellExpand } from "./RenderCellExpand";
import { getGridStringOperators, GridToolbar } from "@mui/x-data-grid";
import { FormControl, InputLabel, NativeSelect } from "@mui/material";

/**
@Alex //todo update the options of this select when you add the real services to the JSON
 */
function ServiceSelector(props) {
  const { item, applyValue } = props;

  return (
    <FormControl>
      <InputLabel shrink id="serviceSelector">
        Service
      </InputLabel>
      <NativeSelect
        id="serviceSelector"
        value={item?.value || ""}
        onChange={(evt) => {
          applyValue({ ...item, value: evt.target.value });
        }}
      >
        <option key="none" value="none">
          &nbsp;
        </option>
        <option key="todo" value="todo">
          todo
        </option>
        <option key="todo2" value="todo2">
          todo2
        </option>
        <option key="test" value="test">
          test
        </option>
      </NativeSelect>
    </FormControl>
  );
}

const serviceOperator = [
  {
    label: "is",
    value: "is",
    getApplyFilterFn: (filterItem) => {
      if (
        !filterItem.columnField ||
        !filterItem.value ||
        !filterItem.operatorValue ||
        filterItem.value === "none"
      ) {
        return null;
      }

      return (params) => {
        return params.value.indexOf(filterItem.value) > -1;
      };
    },
    InputComponent: ServiceSelector,
  },
];

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
      filterOperators: serviceOperator,
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
