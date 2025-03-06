import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import styles from './SliderStaff.module.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';
import { fetchStaff } from '../../services/organisation/staff';

const StaffSlider = () => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const data = await fetchStaff();
        setStaff(data);
      } catch (error) {
        console.error('Ошибка при загрузке изображений:', error);
      }
    };

    loadStaff();
  }, []);

  return (
    <div className={styles.sliderContainer}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
        spaceBetween={20}
        slidesPerView={3}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
        }}
        loop
        breakpoints={{
          768: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          480: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          300: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
        }}
      >
        {staff.map((person) => (
          <SwiperSlide key={person.id}>
            <div className={styles.slideWrapper}>
              <img src={person.photo_link} alt={`Slide ${person.id}`} className={styles.slideImage} />
              <div className={styles.slideContent}>
                <p className={styles.slideName}>{person.name}</p>
                <p className={styles.slideRole}>{person.status}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={`swiper-button-next ${styles.customNextButton}`}></div>
      <div className={`swiper-button-prev ${styles.customPrevButton}`}></div>

    </div>
  );
};

export default StaffSlider;