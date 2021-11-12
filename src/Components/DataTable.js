import React, { useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import useStore from '../store'

// TODO generate columns from data?
const columns = [
  {
    field: 'date',
    headerName: 'Date',
    width: 300,
  },
  
  {
    field: 'datatype',
    headerName: 'Datatype',
    width: 150,
  },
  {
    field: 'station',
    headerName: 'Station',
    width: 300,
  },
  {
    field: 'attributes',
    headerName: 'Attributes',
    width: 150,
  },
  {
    field: 'value',
    headerName: 'Value',
    type: 'number',
    width: 150,
  },
  { field: 'id', headerName: 'Id', width: 120 },
  // {
  //   field: 'attributes',
  //   headerName: 'Attributes',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params) =>
  //     `${params.getValue(params.id, 'firstName') || ''} ${
  //       params.getValue(params.id, 'lastName') || ''
  //     }`,
  // },
];

export default function DataTable() {

  const tableData = useStore(state => state.apiResults);
  
  useEffect(() => {
    // TODO optimize component to only remount when tableData changes
    // console.log('in table useEffect');
  });

  function formatData(data){
    //console.log('data:', data, 'type', typeof(data));
    
    let idSeed = 0;
    let result = [].concat(...data)
    result.forEach(entry => { 
      entry.id = idSeed++; 
    });
    // console.log('result', result);
    return result;
  }

  return (
    <div style={{ height: 800, width: '100%' }}>
      <DataGrid
        rows={ formatData(tableData) }
        columns={columns}
        pageSize={12}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
}