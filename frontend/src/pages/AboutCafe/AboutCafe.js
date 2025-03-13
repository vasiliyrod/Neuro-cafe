import React, { useContext, useEffect } from 'react';

import { OrganisationContext } from '@/context/OrganisationContext';
import styles from '@/pages/AboutCafe/AboutCafe.module.css';
import ImageSlider from '@/components/Sliders/SliderImages';
import StaffSlider from '@/components/Sliders/SliderStaff';
import ReviewSlider from '@/components/Sliders/SliderComments';
import YandexMap from '@/components/Map/YandexMap';
import Loader from '@/components/Loading/Loading';


const AboutCafe = () => {
  const { organisation, error } = useContext(OrganisationContext);

  useEffect(() => {
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

  if (error) {
    return null;
  }

  if (!organisation || !organisation.latitude || !organisation.longitude) {
    return <Loader />;
  }

  const latitude = parseFloat(organisation.latitude);
  const longitude = parseFloat(organisation.longitude);

  if (isNaN(latitude) || isNaN(longitude)) {
    console.error('Некорректные координаты:', organisation.latitude, organisation.longitude);
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.welcomeText}>Добро пожаловать!</h1>
        <p className={styles.text_typical}>В наше NEURO кафе — идеальное место для <br />
          гурманов и любителей вкусной еды! </p>

        <div className={styles.section}>
          <img
            src='https://i.postimg.cc/7ZTWMTzR/Group-12.png'
            alt="NEURO Logo"
            className={styles.image}
          />
        </div>

        <div className={styles.title}>
          <p>О КАФЕ</p>
        </div>

        <div className={styles.gridContainer}>
          <p className={styles.text_typical1}>
            В нашем кафе каждый визит становится уникальным
            кулинарным путешествием благодаря персонализированному подходу.
          </p>

          <div>
              <p className={styles.title1}>С ПОМОЩЬЮ НАШЕГО ПОМОЩНИКА</p>

              <img
                src="https://i.postimg.cc/13jSDWSg/icons8-chatbot-96.png"
                alt="NEURO Logo"
                className={styles.image1}
              />
          </div>

          <p className={styles.text_typical1}>
            Узнайте больше о каждом блюде и его сочетаниях,
            заказывайте с учетом индивидуальных предпочтений, используя помощника с ИИ.
          </p>
        </div>
      </div>

      <div className={styles.title}>
          <p>ВАШ ЖДЕТ<br/>НЕВЕРОЯТНАЯ АТМОСФЕРА</p>
          <ImageSlider />
      </div>

      <p className={styles.title2}>В NEURO cafe дружелюбный персонал.<br /><br />
          <span className={styles.title2_1}>всегда готов помочь, чтобы сделать каждый ваш визит особенным.</span></p>
      <StaffSlider />

      <div className={styles.title}>
          <p>ОТЗЫВЫ КЛИЕНТОВ</p>
          <ReviewSlider />
      </div>


      <p className={styles.title2}>ГДЕ МЫ НАХОДИМСЯ?</p>
      <p className={styles.addressText}>Адрес: {organisation.address}</p>

      <div className={styles.centre}>
        <YandexMap latitude={latitude} longitude={longitude} />
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>Контакты:</p>
          <p className={styles.footerText}>Email: {organisation.email}</p>
          <p className={styles.footerText}>Телефон: {organisation.phone}</p>
          <a
            href={organisation.tg_link}
            target="tg"
            rel="tg"
            className={styles.iconLink}
          >
            <img
              src="https://img.icons8.com/?size=100&id=F4ZPUh2Mk5tk&format=png&color=000000"
              alt="Figma Icon"
              className={styles.icon}
            />
          </a>
          <p className={styles.footerText}>От команды {organisation.name}</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutCafe;