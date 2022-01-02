import React, { useEffect } from 'react';
import AutocompleteSelector from './AutocompleteSelector';

export default function LocationSelect({ location, setLocation, locationsList, setLocationsList}) {

  useEffect(() => {
    fetchData();
    async function fetchData() {
      const result = await fetch('/api/locations/cities').then(res => res.json()).then(data => {
        //console.log(data.cities);
        setLocationsList(data.cities);
      });
    }
  }, []);

  return (
    <AutocompleteSelector
      selection={location}
      selectionOptions={locationsList} 
      setSelection= { (newLocation) => { if (newLocation !== null) setLocation(newLocation) } }
      id='location-selector'
    />
  );
}