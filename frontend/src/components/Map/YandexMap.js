import React, { useEffect } from 'react';
import config from '../../config/config';

const YandexMap = ({ latitude, longitude }) => {
  useEffect(() => {
    if (!window.ymaps) {
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
            hintContent: 'Местоположение',
            balloonContent: 'Адрес организации',
          });

          map.geoObjects.add(marker);
        });
      };

      script.onerror = () => {
        console.error('Ошибка при загрузке скрипта Яндекс.Карт.');
      };
    } else {
      window.ymaps.ready(() => {
        const map = new window.ymaps.Map('map', {
          center: [latitude, longitude], // Используем переданные координаты
          zoom: 12,
        });

        const marker = new window.ymaps.Placemark([latitude, longitude], {
          hintContent: 'Местоположение',
          balloonContent: 'Адрес организации',
        });

        map.geoObjects.add(marker);
      });
    }
  }, [latitude, longitude]); // Зависимость от координат

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