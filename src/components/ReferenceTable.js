import React, { useState } from "react";
import data from "../../content/docs/reference/reference.json";
import { DataGridPro } from "@mui/x-data-grid-pro/DataGridPro/DataGridPro";
import { renderCellExpand } from "./RenderCellExpand";
import { GridToolbar } from "@mui/x-data-grid";
import { FormControl, InputLabel, NativeSelect } from "@mui/material";
import { useColorMode } from "@docusaurus/theme-common";

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
        <option key="all" value="all">
          All Services
        </option>
        <option key="proxy" value="proxy">
          Proxy
        </option>
        <option key="authenticate" value="authenticate">
          Authenticate
        </option>
        <option key="authorize" value="authorize">
          Authorize
        </option>
        <option key="databroker" value="databroker">
          Databroker
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

function filterHidden(item) {
  return !item.enterpriseOnly;
}

export default function ReferenceTable() {
  const [pageSize, setPageSize] = useState(25);
  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };

  const { colorMode } = useColorMode();

  const references = Object.values(data);
  const columns = [
    {
      headerName: "Name",
      field: "title",
      flex: 1,
      renderCell: function NameCell(params) {
        return (
          <a href={`/docs/reference${params.row.path}`}>{params.row.title}</a>
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
      field: "type",
      flex: 1,
      renderCell: renderCellExpand,
    },
    /*{
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
    },*/
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
          "color": colorMode === 'dark' ? 'rgba(224,224,224,1);' : 'rgba(0, 0, 0, 0.54);',
          "& .MuiDataGrid-columnHeader:last-child .MuiDataGrid-columnSeparator--sideRight":
            {
              display: "none",
            },
          "& .MuiDataGrid-sortIcon": {
            "color": colorMode === 'dark' ? 'rgba(224,224,224,1);' : 'rgba(0, 0, 0, 0.54);',
          },
          "& .MuiDataGrid-menuIconButton": {
            "color": colorMode === 'dark' ? 'rgba(224,224,224,1);' : 'rgba(0, 0, 0, 0.54);',
          }
        }}
        columns={columns}
        rows={references.filter(filterHidden)}
        componentsProps={{
          toolbar: {
            printOptions: {
              disableToolbarButton: true
            },
            csvOptions: {
              disableToolbarButton: true
            }
          }
        }}
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  );
}
