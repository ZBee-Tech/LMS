import React from 'react';
import styles from '../assets/CSS/Footer.module.css';  
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLeft}>
          <p>&copy; 2024 My App. All rights reserved.</p>
        </div>
     
     
      </div>
    </footer>
  );
};

export default Footer;
