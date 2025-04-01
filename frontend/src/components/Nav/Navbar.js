import React, { useRef, useContext } from 'react';
import { BsJournalText } from "react-icons/bs";

import styles from '@/components/Nav/Navbar.module.css';
import useScroll from '@/hooks/useScroll';
import SideMenu from '@/components/Menu/SideMenu';

import { OrderContext } from '@/context/OrderContext';

const Navbar = () => {
  const navRef = useRef(null);
  useScroll(navRef);

  const { orderCount } = useContext(OrderContext);

  return (
    <nav className={styles.nav} ref={navRef}>
      <div className={styles.container}>
        <div>
          <SideMenu />
        </div>
        <h1 className={styles.name}><a href="/">NEURO</a></h1>
        <ul>
          <li>
            <a href="/order" className={styles.order}>
              {orderCount}
              <BsJournalText size={28} />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;