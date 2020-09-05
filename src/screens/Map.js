import React from 'react';
import { ResponsiveImage, ResponsiveImageSize } from 'react-responsive-image';
import  MapContainer from '../components/Map';

const Map = (props) => {

    return (
        <div className='main'>
            <MapContainer />
        </div>
      );
}

export default Map;