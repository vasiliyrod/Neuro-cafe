import React, { useEffect, useRef } from 'react';
import config from '../../config/config';

const YandexMap = ({ latitude, longitude }) => {
  const mapRef = useRef(null);


  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${config.apiMap}&lang=ru_RU`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.ymaps.ready(() => {
        const map = new window.ymaps.Map('map', {
          center: [latitude, longitude],
          zoom: 12,
        });

        const marker = new window.ymaps.Placemark([latitude, longitude], {
          hintContent: 'ул. Пушкина, д. Колотушкина',
          balloonContent: 'NEURO cafe',
        });

        map.geoObjects.add(marker);
        mapRef.current = map;
      });
    };

    return () => {
      document.head.removeChild(script);
      if (mapRef.current) {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
          mapContainer.innerHTML = '';
        }
        mapRef.current = null;
      }
    };
  }, [latitude, longitude]);

  return (
    <div
      id="map"
      style={{
        width: '80%',
        height: '300px',
        border: '5px solid rgb(110, 121, 110)',
        borderRadius: '30px',
        overflow: 'hidden',
      }}
    ></div>
  );
};

export default YandexMap;