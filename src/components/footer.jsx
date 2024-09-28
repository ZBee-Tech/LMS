import React from 'react';
import styles from '../assets/CSS/Footer.module.css';  
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLeft}>
          <p>&copy; 2024 Mon application. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
