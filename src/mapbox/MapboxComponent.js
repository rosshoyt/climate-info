import ReactMapGL, { Marker, Popup, WebMercatorViewport } from "react-map-gl";
import React, { useEffect, useState } from "react";
import { withSize } from 'react-sizeme';
import './mapbox.css';
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

  // const location = useStore(state => state.location);
  
  const selectedStation = useStore(state => state.selectedStation);
  const setSelectedStation = useStore(state => state.setSelectedStation);

  const stationsList = useStore(state => state.stationsList);

  const activeStationIDsSet = useStore(state => state.activeStationIDsSet);

  const rawData = useStore(state => state.rawData);

  const getStationsBoundingBox = () => {
    console.log('getting bounding box for ', stationsList, activeStationIDsSet)
    if(stationsList.length > 0) {
      let minLat = Number.MAX_SAFE_INTEGER, minLong = Number.MAX_SAFE_INTEGER;
      let maxLat = Number.MIN_SAFE_INTEGER, maxLong = Number.MIN_SAFE_INTEGER;
      // let minLat = 90, minLong = 180;
      // let maxLat = -90, maxLong = -180;
      // TODO only iterate over active stations
      stationsList.forEach((station, index) => {
        if(activeStationIDsSet.has(station.id)) {
          minLat = Math.min(station.latitude, minLat);
          minLong = Math.min(station.longitude, minLong);
          maxLat = Math.max(station.latitude, maxLat);
          maxLong = Math.max(station.longitude, maxLong);
        }
      });

      let boundingBox = [[maxLong, minLat],[minLong, maxLat]];
      console.log('bounding box', boundingBox)
      return boundingBox
    }
  }
  
  useEffect(() => {
    // listen for escape (to exit the current map selection)
    const listener = (e) => {
      if (e.key === "Escape") {
        setSelectedStation(null);
      }
    };
    window.addEventListener("keydown", listener);

    if(stationsList.length > 0 && activeStationIDsSet.size > 0){
      let view = new WebMercatorViewport({height: size.height, width: size.width})
        .fitBounds(getStationsBoundingBox(), {
          padding: 20,
        })
      setViewport(view)
      console.log('set new viewport', view)
    }

    return () => {
      window.removeEventListener("keydown", listener);
    };

  }, [stationsList, activeStationIDsSet, rawData]);

  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
        mapStyle="mapbox://styles/rosshoyt/ckxcnobzr2em217pez5k3uo54"
      >
        {stationsList.map((station) => (
          activeStationIDsSet.has(station.id) ? 
           (
          <Marker
            key={station.id}
            latitude={station.latitude}
            longitude={station.longitude}
            offsetTop={-16}
            offsetLeft={-11}
          >
            <button
              className="marker-btn"
              onClick={(e) => {
                e.preventDefault();
                setSelectedStation(station);
              }}
            >
              <img src="mapbox-marker-icon-20px-blue.png" alt="location icon" />
            </button>
          </Marker>
        ) :  (<></>))
        )}
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
              {selectedStation.longitude})
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