import React, { Component } from 'react';

import styles from './SideMenu.module.css';

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
                ⓘ<a href="/about_cafe" className={styles.current}> О нас</a>
            </div>
            <div className={styles.link}>
                𓌉◯𓇋<a href="/menu" className={styles.current}>Меню</a>
            </div>
            <div className={styles.link}>
                ✎𓂃<a href="/chat" className={styles.current}> Чат с ИИ</a>
            </div>
            <div className={styles.link}>
                ☕︎<a href="/order" className={styles.current}> Корзина</a>
            </div>
            <div className={styles.link}>
                  ⟳  <a href="/" className={styles.current}> Лист ожидания</a>
            </div>
          </div>
        </aside>
      </>
    );
  }
}

export default SideMenu;