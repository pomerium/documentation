import {useColorMode} from '@docusaurus/theme-common';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import React, {useState} from 'react';

import data from '../../content/docs/reference/reference.json';
import {renderCellExpand} from './RenderCellExpand';

function filterHidden(item) {
  return !item.enterpriseOnly;
}

export default function ReferenceTable() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const {colorMode} = useColorMode();

  const references = Object.values(data);
  const columns = [
    {
      headerName: 'Name',
      field: 'title',
      flex: 1,
      renderCell: function NameCell(params) {
        return (
          <a href={`/docs/reference${params.row.path}`}>{params.row.title}</a>
        );
      },
    },
    {
      headerName: 'Description',
      field: 'description',
      flex: 2,
      renderCell: renderCellExpand,
    },
    {
      headerName: 'Type',
      field: 'type',
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
            {params.row.services.map(function (service) {
              return <div>{service}</div>;
            })}
          </div>
        );
      },
    },*/
  ];

  return (
    <div style={{width: '100%'}}>
      <DataGrid
        initialState={{
          sorting: {
            sortModel: [{field: 'title', sort: 'asc'}],
          },
        }}
        disableRowSelectionOnClick
        autoHeight
        pageSizeOptions={[5, 10, 25, 50]}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        showToolbar
        sx={{
          color:
            colorMode === 'dark'
              ? 'rgba(224,224,224,1);'
              : 'rgba(0, 0, 0, 0.54);',
          '& .MuiDataGrid-columnHeader:last-child .MuiDataGrid-columnSeparator--sideRight':
            {
              display: 'none',
            },
          '& .MuiDataGrid-sortIcon': {
            color:
              colorMode === 'dark'
                ? 'rgba(224,224,224,1);'
                : 'rgba(0, 0, 0, 0.54);',
          },
          '& .MuiDataGrid-menuIconButton': {
            color:
              colorMode === 'dark'
                ? 'rgba(224,224,224,1);'
                : 'rgba(0, 0, 0, 0.54);',
          },
        }}
        columns={columns}
        rows={references.filter(filterHidden)}
        slots={{
          toolbar: GridToolbar,
        }}
        slotProps={{
          toolbar: {
            printOptions: {
              disableToolbarButton: true,
            },
            csvOptions: {
              disableToolbarButton: true,
            },
          },
        }}
      />
    </div>
  );
}
