import React from 'react';

import styles from '@/pages/Errors/Error.module.css'

const ErrorPage = () => {
  return (
    <div className={styles.body_container}>
        <p> Извините, страница не смогла загрузиться.</p>
        <img
            src='https://i.postimg.cc/7ZTWMTzR/Group-12.png'
            alt="ERROR"
          />
        <p> Повторите попытку позже.</p>
    </div>
  );
};

export default ErrorPage;