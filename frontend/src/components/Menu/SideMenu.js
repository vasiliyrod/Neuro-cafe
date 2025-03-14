import React, { Component } from 'react';

import styles from '@/components/Menu/SideMenu.module.css';

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  toggleMenu = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  render() {
    const { isOpen } = this.state;

    return (
      <>
        <button onClick={this.toggleMenu} className={styles.menuButton}>
          {isOpen ? '✕' : '☰'}
        </button>

        <aside className={`${styles.sideMenu} ${isOpen ? styles.open : ''}`}>
          <div className={styles.sideMenuOverlay} onClick={this.toggleMenu} />
          <div className={styles.sideMenuContent}>
            <div className={styles.link}>
                <img src="https://i.postimg.cc/zvWrqPjR/icons8-32.png" alt="О нас" width="25" />
                <a href="/about_cafe" className={styles.current}> О нас</a>
            </div>
            <div className={styles.link}>
                <img src="https://i.postimg.cc/prMSJVfp/icons8-48-1.png" alt="О нас" width="25" />
                <a href="/menu" className={styles.current}> Меню</a>
            </div>
            <div className={styles.link}>
                <img src="https://i.postimg.cc/PfZsp9WC/icons8-50.png" alt="О нас" width="25" />
                <a href="/chat" className={styles.current}> Чат с ИИ</a>
            </div>
            <div className={styles.link}>
                <img src="https://i.postimg.cc/CMfYCzgL/icons8-50.png" alt="О нас" width="25" />
                ︎<a href="/order" className={styles.current}> Корзина</a>
            </div>
            <div className={styles.link}>
                  <img src="https://i.postimg.cc/ydZ5R3SM/icons8-50.png" alt="О нас" width="25" />
                  <a href="/history" className={styles.current}> История</a>
            </div>
          </div>
        </aside>
      </>
    );
  }
}

export default SideMenu;