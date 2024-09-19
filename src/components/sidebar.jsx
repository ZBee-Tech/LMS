import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaBars, FaEnvelope } from 'react-icons/fa'; // Import icons
import styles from '../assets/CSS/sidebar.module.css'; 

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
     const savedRole = localStorage.getItem('role');
    if (savedRole) {
      setUserRole(savedRole);
    }
  }, []);

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
        
    
        {userRole === 'CEO' ? (
          <>
  <li>
    <Link to="/addusers">
      <FaInfoCircle className={styles.icon} />
      {!isCollapsed && <span className={styles.label}>Add Users</span>}
    </Link>
    
  </li>
  <li>
    <Link to="/leavesDataCEO">
      <FaEnvelope className={styles.icon} />
      {!isCollapsed && <span className={styles.label}>Leave Requests </span>}
    </Link>
    
  </li>
  </>
) : (
<></>
)
}
{userRole === 'HR Manager' ? (
          <>
  <li>
    <Link to="/addHOD">
      <FaInfoCircle className={styles.icon} />
      {!isCollapsed && <span className={styles.label}>Add HOD/Employee</span>}
    </Link>
    
  </li>
  <li>
    <Link to="/leavesDataHR">
      <FaEnvelope className={styles.icon} />
      {!isCollapsed && <span className={styles.label}>Leave Requests HR </span>}
    </Link>
    
  </li>
  </>
) : (
  <></>
)
}

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
