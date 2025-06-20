import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import { fetchReviews } from '@/services/comments/comments';
import styles from '@/components/Sliders/SliderComments.module.css';

const ReviewSlider = () => {
  const [reviews, setReviews] = useState([]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {'★'.repeat(fullStars)}
        {hasHalfStar && '✭'}
        {'☆'.repeat(emptyStars)}
      </>
    );
  };

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviews();
        setReviews(data);
      } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
      }
    };

    loadReviews();
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
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop
        speed={1000}
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            <div className={styles.slideWrapper}>
              <div className={styles.backgroundImage}>
                <div className={styles.space}>
                  <p className={styles.ratingNumber}>{review.averageRating.toFixed(1)}</p>
                  <p className={styles.mark}>{renderStars(review.averageRating)}</p>
                  {/* <p className={styles.username}>{review.username}</p> */}
                </div>
                <p className={styles.text}>{review.comment}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ReviewSlider;