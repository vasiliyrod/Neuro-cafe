import React, { useContext } from 'react';

import { OrganisationContext } from '../../context/OrganisationContext';

import styles from './AboutCafe.module.css';

const AboutCafe = () => {
  const { organisation } = useContext(OrganisationContext);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.welcomeText}>ДОБРО ПОЖАЛОВАТЬ</h1>
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