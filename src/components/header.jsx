import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import styles from '../assets/CSS/Header.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const queryClient = useQueryClient();  
  const navigate = useNavigate();  

  // Retrieve user info from local storage
  const userName = localStorage.getItem('fullName') || 'User';
  const userRole = localStorage.getItem('role') || 'Role';

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
  };

  const handleLogout = () => {
    queryClient.clear();
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    navigate('/');
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
        <div className={styles.dropdown}>
          <div className={styles.avatar} onClick={toggleProfileDropdown}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKqLoqUmsRrIYZhDUsffr5nkWfPcqC0guRC6Rpilz0C_VFhVRgr51-juuumrbvbEZ4V8k&usqp=CAU"
              alt="User Avatar"
              loading="lazy"
              className={styles.prof}
            />
          </div>
          <div className={`${styles.dropdownMenu} ${profileDropdownOpen ? styles.open : ''}`}>
            <div className={styles.dropdownItem}>
              <span className={styles.userName}>{userName}  <span className={styles.userRole}>({userRole})  </span></span>
          
            </div>
            <div className={styles.dropdownItem}>
              <Link to="/update-profile">My profile</Link>
            </div>
            <div className={styles.dropdownItem} onClick={handleLogout}>
              Logout
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
