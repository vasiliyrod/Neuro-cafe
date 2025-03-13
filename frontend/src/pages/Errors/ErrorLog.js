import React, { useContext} from 'react';

import styles from '@/pages/Errors/ErrorLog.module.css'
import { OrganisationContext } from '@/context/OrganisationContext';
import Loader from '@/components/Loading/Loading';

const ErrorPage = () => {
  const { organisation, error } = useContext(OrganisationContext);

  if (error) {
    return null;
  }

  if (!organisation) {
    return <Loader />;
  }

  return (
    <div className={styles.body_container}>
        <p> Вы не авторизоованы.</p>
        <img
            src='https://i.postimg.cc/7ZTWMTzR/Group-12.png'
            alt="ERROR"
          />

        <p> Войдите через наше телеграм приложение.</p>

        <a
            href={organisation.tg_link}
            target="tg"
            rel="tg"
            className={styles.iconLink}
          >
          Перейти в приложение
        </a>
    </div>
  );
};

export default ErrorPage;