import ReactMapGL, { Marker, Popup } from "react-map-gl";
import React, { useEffect, useState } from "react";
import { withSize } from 'react-sizeme'
import './mapbox.css'
import { useQuery } from "react-query";
import axios from "axios";
import useStore from "../store";
import mapboxgl from 'mapbox-gl';

// Fix env variable loading in production (fix via https://github.com/visgl/react-map-gl/issues/1266#issuecomment-753686953)
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

function MapboxComponent({ size }) {
  const [viewport, setViewport] = useState({
    latitude: 47.608013,
    longitude: -122.335167,
    width: size.width,
    height: size.height
  });
  
  //const [stationsList, setLocationsList] = useState([]);

  const location = useStore(state => state.location)
  //const setLocation = useStore(state => state.setLocation)
  
  const selectedStation = useStore(state => state.selectedStation)
  const setSelectedStation = useStore(state => state.setSelectedStation)

  const stationsList = useStore(state => state.stationsList)
  const setStationsList = useStore(state => state.setStationsList)

  //const withSizeHOC = withSize()

  useEffect(() => {
    // listen for escape (to exit the current map selection)
    console.log('height/widht', size.height, size.width)
    const listener = (e) => {
      if (e.key === "Escape") {
        setSelectedStation(null);
      }
    };
    window.addEventListener("keydown", listener);
    // load station data
    // fetch("api/locations/get/stations/" + selectedLocation)
    //   .then((res) => res.json())
    //   .then((data) => setLocationsList(data["results"]));

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  useQuery({
    
    queryKey: [location.id],
      
    staleTime: Number.MAX_SAFE_INTEGER,
  
    refetchOnWindowFocus: false,
  
    queryFn: () => {
      let url = 'api/locations/get/stations/' + location.id;
      console.log('fetching url', url )
      return axios.get(url).then((res) => res.data)
    },

    onSettled: (data, error, variables, context) => {
      if(error !== null){
        console.log(error);
        if(data === null || data === undefined) {
          console.log("did not recieve response to stations query")
        }
        else if(Object.keys(data).includes('message')){   
          let errorMessage =  data['message'];
          console.log("Server returned error", errorMessage,"on request for stations")
          // TODO add error code from react query onto timeseries error message?
        }
      }
      else if(data !== null || data !== undefined) {
        // TODO improve results processing. Sometimes may not get past Object.keys check
        if(Object.keys(data).includes('stations')){
          if(data.stations.length > 0){     
            console.log('got stations', data.stations)
            setStationsList(data.stations);
          } else{
            console.log('stations list was 0 length')
            //deleteTimeseriesRawData(timeseriesInfo)
          }
        }

        // else {
        //   console.log('No results in response to stations query');
        //   if(Object.keys(data).includes('message')){      
        //     console.log('error message:', data['message'])
        //     //timeseriesInfo.errorMessage = 'error - ' + data['message'];
        //   }
        // }
      }
    }
  })

  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
      >
        {stationsList.map((location) => (
          <Marker
            key={location.id}
            latitude={location.latitude}
            longitude={location.longitude}
            mapStyle="mapbox://styles/rosshoyt/ckxchveng0e2615mvgavza25k" //"mapbox://styles/rosshoyt/ckxcnobzr2em217pez5k3uo54"
            offsetTop={-20}
            offsetLeft={-15}
          >
            <button
              className="marker-btn"
              onClick={(e) => {
                e.preventDefault();
                setSelectedStation(location);
              }}
            >
              <img src="location-icon.png" alt="location icon" />
            </button>
          </Marker>
        ))}
        {selectedStation ? (
          <Popup
            latitude={selectedStation.latitude}
            longitude={selectedStation.longitude}
            onClose={() => {
              setSelectedStation(null);
            }}
          >
            <h4>{selectedStation.name}</h4>
            <div>
              Latitude/Longitude: ({selectedStation.latitude},{" "}
              {selectedStation.latitude}
            </div>
            <div>
              Elevation: {selectedStation.elevation}{" "}
              {selectedStation.elevationUnit}
            </div>
          </Popup>
        ) : (
          <></>
        )}
      </ReactMapGL>
    </div>
  );
}

export default withSize({ monitorHeight: true })(MapboxComponent)