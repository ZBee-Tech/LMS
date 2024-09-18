import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaBars, FaEnvelope } from 'react-icons/fa'; // Import icons
import styles from '../assets/CSS/sidebar.module.css'; 

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.toggleButton} onClick={toggleSidebar}>
        <FaBars className={styles.icon} />
      </div>
      <ul>
        <li>
          <Link to="#home">
            <FaHome className={styles.icon} />
            {!isCollapsed && <span className={styles.label}>Home</span>}
          </Link>
        </li>
        <li>
          <Link to="/leaveform">
            <FaInfoCircle className={styles.icon} />
            {!isCollapsed && <span className={styles.label}>Leave Form</span>}
          </Link>
        </li>
        <li>
          <Link to="#contact">
            <FaEnvelope className={styles.icon} />
            {!isCollapsed && <span className={styles.label}>Contact</span>}
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
