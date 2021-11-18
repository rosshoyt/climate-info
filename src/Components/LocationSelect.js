/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
import AutocompleteSelector from './AutocompleteSelector';

export default function LocationSelect({setLocation}) {
  const [locations, setLocationOptions] = useState( [ {
    "datacoverage": 1,
    "id": "CITY:US530018",
    "maxdate": "2021-07-02",
    "mindate": "1891-01-01",
    "name": "Seattle, WA US"
  } ] );
  
  useEffect(() => {
    fetchData();
    async function fetchData() {
      const result = await fetch('/api/locations/cities').then(res => res.json()).then(data => {
        //console.log(data.cities);
        setLocationOptions(data.cities);
      });
    }
  }, []);

  return (
    <AutocompleteSelector 
    selectionOptions={locations} 
    setSelection={setLocation}
    id='location-selector'
    label='Enter a location (default: Seattle)'
    />
  );
}