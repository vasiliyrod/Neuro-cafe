import React from 'react';

import styles from '@/components/Loading/Loading.module.css';

function Loader() {
  return (
    <div className={styles.body_container}>
        <h1 className={styles.h1}>Загрузка...</h1>
        <div className={styles.loading_container}>
          <div className={styles.loading_spinner}></div>
        </div>
    </div>
  );
}

export default Loader;