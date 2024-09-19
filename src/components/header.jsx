import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../assets/CSS/Header.module.css';

const Header = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>
        <Link to="/">
          <img
            src="https://mdbcdn.b-cdn.net/img/logo/mdb-transaprent-noshadows.webp"
            alt="MDB Logo"
            loading="lazy"
          />
        </Link>
      </div>

      <div className="d-flex align-items-center">
        <Link className={styles.icon} to="#">
          <i className="fas fa-shopping-cart"></i>
        </Link>

        <div className={styles.dropdown}>
          <div
            className={`${styles.icon}`}
            onClick={toggleNotificationDropdown}
          >
            <i className="fas fa-bell"></i>
            <span className={styles.badge}>1</span>
          </div>
          <div className={`${styles.dropdownMenu} ${notificationDropdownOpen ? styles.open : ''}`}>
            <div className={styles.dropdownItem}>Some news</div>
            <div className={styles.dropdownItem}>Another news</div>
            <div className={styles.dropdownItem}>Something else here</div>
          </div>
        </div>

        <div className={styles.dropdown}>
          <div
            className={styles.avatar}
            onClick={toggleProfileDropdown}
          >
            <img
              src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
              alt="User Avatar"
              loading="lazy"
            />
          </div>
          <div className={`${styles.dropdownMenu} ${profileDropdownOpen ? styles.open : ''}`}>
            <div className={styles.dropdownItem}>
              <Link to="#">My profile</Link>
            </div>
            <div className={styles.dropdownItem}>
              <Link to="#">Settings</Link>
            </div>
            <div className={styles.dropdownItem}>
              <Link to="#">Logout</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
