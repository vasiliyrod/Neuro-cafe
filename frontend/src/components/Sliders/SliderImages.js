import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import styles from './SliderImages.module.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { fetchImages } from '../../services/organisation/images';

const ImageSlider = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const data = await fetchImages();
        setImages(data);
      } catch (error) {
        console.error('Ошибка при загрузке изображений:', error);
      }
    };

    loadImages();
  }, []);

  return (
    <div className={styles.sliderContainer}>
      <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{
            clickable: true,
            el: '.swiper-pagination',
          }}
          autoplay={{ delay: 3000 }}
          loop
        >
          {images.map((image) => (
            <SwiperSlide key={image.id}>
              <div className={styles.slideWrapper}>
                <div
                  className={styles.backgroundImage}
                  style={{ backgroundImage: `url(${image.link})` }}
                ></div>
                <img src={image.link} alt={`Slide ${image.id}`} className={styles.slideImage} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
    </div>
  );
};

export default ImageSlider;