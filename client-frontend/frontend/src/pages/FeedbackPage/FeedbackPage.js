import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

import { submitFeedback } from '@/services/comments/comments';
import styles from '@/pages/FeedbackPage/FeedbackPage.module.css';

const FeedbackPage = () => {
  const [overallRating, setOverallRating] = useState(0);
  const [aiRating, setAiRating] = useState(0);
  const [atmosphereRating, setAtmosphereRating] = useState(0);
  const [staffRating, setStaffRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [comment, setComment] = useState('');
  const [recommend, setRecommend] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userID = Cookies.get('UID');

    if (!userID) {
      navigate('/errorlog');
      return;
    }

    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.backgroundColor = '#778477';
    }

    return () => {
      if (navbar) {
        navbar.style.backgroundColor = '';
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = {
      overallRating,
      aiRating,
      atmosphereRating,
      staffRating,
      foodRating,
      comment,
      recommend,
    };

    try {
      const response = await submitFeedback(feedbackData);
      console.log('Отзыв успешно отправлен:', response);
      setSubmitted(true);

      toast.success('Спасибо за ваш отзыв!', {
        className: styles.toastSuccess,
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate('/history');
      }, 3000);
    } catch (error) {
      console.error('Ошибка при отправке отзыва:', error);
      alert('Произошла ошибка при отправке отзыва.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title1}>Оставьте ваш отзыв</h1>

      <div className={styles.section}>
        <h2 className={styles.title}>Общие впечатления</h2>
        <RatingStars rating={overallRating} setRating={setOverallRating} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.title}>ИИ-помощник</h2>
        <RatingStars rating={aiRating} setRating={setAiRating} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.title}>Атмосфера</h2>
        <RatingStars rating={atmosphereRating} setRating={setAtmosphereRating} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.title}>Персонал</h2>
        <RatingStars rating={staffRating} setRating={setStaffRating} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.title}>Кухня</h2>
        <RatingStars rating={foodRating} setRating={setFoodRating} />
      </div>

      <h2 className={styles.title1}>Если есть, что писать:</h2>

      <textarea
        className={`${styles.commentInput} ${styles.inputtext}`}
        placeholder="Оставьте ваш комментарий..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className={styles.section}>
        <h2 className={styles.title2}>Порекомендовали бы вы нас друзьям?</h2>
        <button
          className={`${styles.recommendButton} ${styles.yes} ${recommend === true ? styles.selected : ''}`}
          onClick={() => setRecommend(true)}
        >
          Да
        </button>
        <button
          className={`${styles.recommendButton} ${styles.no} ${recommend === false ? styles.selected : ''}`}
          onClick={() => setRecommend(false)}
        >
          Нет
        </button>
      </div>

      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={submitted}
      >
        {submitted ? 'Спасибо за отзыв!' : 'Отправить отзыв'}
      </button>

      <ToastContainer
        toastClassName={styles.toast}
      />
    </div>
  );
};

const RatingStars = ({ rating, setRating }) => {
  return (
    <div className={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${styles.star} ${star <= rating ? styles.filled : ''}`}
          onClick={() => setRating(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default FeedbackPage;