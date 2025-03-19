import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styles from '@/pages/StartPage/StartPage.module.css';
import { OrganisationContext } from '@/context/OrganisationContext';

const StartPage = () => {
  const { organisation } = useContext(OrganisationContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!organisation || !organisation.email || !organisation.phone) {
      navigate('/error');
    }
  }, [organisation, navigate]);

  if (!organisation) {
    return null;
  }

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <img
              src='https://i.postimg.cc/7ZTWMTzR/Group-12.png'
              alt="NEURO Logo"
              className={styles.image}
            />
          </div>
          <div className={styles.section}>
            <p className={styles.sectionText1}>Выбирай быстро, смело<br /> и по настроению!<br /></p>
          </div>
          <div className={styles.section}>
            <Link to={`/chat`} className={styles.sectionButton}>ОТКРЫТЬ ЧАТ</Link>
          </div>
          <div className={styles.section}>
            <p className={styles.sectionText}><br /><br />И просто наслаждайся!</p>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>КОНТАКТЫ:</p>
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
          <p className={styles.footerText1}>От команды ГОСТА</p>
        </div>
      </footer>
    </div>
  );
};

export default StartPage;