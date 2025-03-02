import React, { useContext, useEffect} from 'react';

import { OrganisationContext } from '../../context/OrganisationContext';

import styles from './AboutCafe.module.css';

const AboutCafe = () => {
  const { organisation } = useContext(OrganisationContext);

  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.backgroundColor = 'white';
    }

    return () => {
      if (navbar) {
        navbar.style.backgroundColor = '';
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.welcomeText}>Добро пожаловать!</h1>
        <p classname={styles.text_typical}>В наше NEURO кафе — идеальное место для <br/>
        гурманов и любителей вкусной еды! </p>

        <div className={styles.section}>
            <img
              src='https://i.postimg.cc/7ZTWMTzR/Group-12.png'
              alt="NEURO Logo"
              className={styles.image}
            />
        </div>

         <div className={styles.title}>
           <p>  О КАФЕ </p>
         </div>

         <p className={styles.text_typical1}>В нашем кафе каждый визит становится уникальным
         кулинарным путешествием благодаря персонализированному подходу: вы выбираете блюдо,
         основываясь на своих вкусовых предпочтениях и бюджете. </p>

         <img
              src="https://i.postimg.cc/FHcqnpC2/icons8-chatbot-48.png"
              alt="NEURO Logo"
              className={styles.image1}
         />


        <p className={styles.addressText}>Адрес: {organisation.address}</p>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>Контакты:</p>
          <p className={styles.footerText}>Email: {organisation.email}</p>
          <p className={styles.footerText}>Телефон: {organisation.phone}</p>
          <a
            href={organisation.tg_link}
            target="_blank"
            rel="noopener noreferrer"
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