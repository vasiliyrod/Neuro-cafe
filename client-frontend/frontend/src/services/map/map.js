export const loadYandexMapScript = (apiKey, callback) => {
  if (!window.ymaps) {
    const script = document.createElement('script');
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (callback) callback();
    };

    script.onerror = () => {
      console.error('Ошибка при загрузке скрипта Яндекс.Карт.');
    };
  } else if (callback) {
    callback();
  }
};

export const initYandexMap = (latitude, longitude, mapId) => {
  window.ymaps.ready(() => {
    const map = new window.ymaps.Map(mapId, {
      center: [latitude, longitude],
      zoom: 16,
    });

    const marker = new window.ymaps.Placemark([latitude, longitude], {
      hintContent: 'Местоположение',
      balloonContent: 'Адрес кафе',
    });

    map.geoObjects.add(marker);
  });
};