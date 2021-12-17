import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import useStore from '../store'

export default function DataTable() {

  const rawData = useStore(state => state.rawData);
  
  useEffect(() => {
  }, [rawData]);

  // reads the list of lists containing data and extracts keys from the first 
  // entry of the first list.
  function updateColumns(rawData) {
    let newColumns = [];
    if(rawData.length > 0){
      let timeseries = rawData[0];
      let data = timeseries['data']
      if(data.length > 0){
        let dataEntry = data[0];        
        Object.keys(dataEntry).forEach(key => {
          if(!newColumns.includes(key)) {
            newColumns.push(
              {
                field: key,
                headerName: key,
                width: 175,
              }
            );
          }
        });
      }
    }
    return newColumns;
  }


  // reads the data list of lists, creating a new single list of data with 
  // unique ids for each data entry
  function formatData(data){
    let idSeed = 0;
    let formattedData = [];
    data.forEach(timeseriesList => {
      timeseriesList['data'].forEach(entry => {
        entry['id'] = idSeed++;
        formattedData.push(entry);
      })
    });
    return formattedData;
  }

  return (
    <>
      <DataGrid
        rows={ formatData(rawData) }
        columns={updateColumns(rawData)}
        pageSize={12}
        checkboxSelection
        disableSelectionOnClick
      />
    </>
  );
}