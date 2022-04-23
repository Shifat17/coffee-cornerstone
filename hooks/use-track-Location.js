import { useState, useContext } from 'react';
import { ACTION_TYPES, StoreContext } from '../store/storeContext';

const useTrackLocation = () => {
  const [locationErrMessage, setLocationErrMessage] = useState('');
  const [isFindingLocation, setIsfindingLocation] = useState(false);
  // const [latlng, setLatLng] = useState('');
  const { dispatch } = useContext(StoreContext);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // setLatLng(`${latitude}, ${longitude}`);
    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: { latLong: `${latitude},${longitude}` },
    });
    setLocationErrMessage('');
    setIsfindingLocation(false);
  };

  const error = () => {
    setIsfindingLocation(false);
    setLocationErrMessage('Cannot retrieve your location');
  };

  const handleTrackLocation = () => {
    setIsfindingLocation(true);
    if (!navigator.geolocation) {
      setLocationErrMessage('Geolocation is not supported by your browser');
      setIsfindingLocation(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    locationErrMessage,
    handleTrackLocation,
    isFindingLocation,
  };
};

export default useTrackLocation;
