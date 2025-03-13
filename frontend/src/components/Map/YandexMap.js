import React, { useEffect } from 'react';

import { loadYandexMapScript, initYandexMap } from '@/services/Map/Map';
import config from '@/config/config';

const YandexMap = ({ latitude, longitude }) => {
  useEffect(() => {
    loadYandexMapScript(config.apiMap, () => {
      initYandexMap(latitude, longitude, 'map');
    });
  }, [latitude, longitude]);

  return (
    <div
      id="map"
      style={{
        width: '90%',
        height: '350px',
        border: '5px solid rgb(110, 121, 110)',
        borderRadius: '30px',
        overflow: 'hidden',
      }}
    ></div>
  );
};

export default YandexMap;