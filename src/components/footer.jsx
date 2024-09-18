import React from 'react';
import styles from '../assets/CSS/Footer.module.css'; // Import the CSS module

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLeft}>
          <p>&copy; 2024 My App. All rights reserved.</p>
        </div>
        <div className={styles.footerCenter}>
          <ul className={styles.footerLinks}>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className={styles.footerRight}>
          <p>Follow us:</p>
          <ul className={styles.socialMedia}>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
