import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserPlus, FaBars, FaEnvelope, FaCalendarAlt, FaUserTie, FaUsers, FaClipboardList, FaFileAlt } from 'react-icons/fa';  
import styles from '../assets/CSS/sidebar.module.css'; 

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole, setUserRole] = useState('');
  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    if (savedRole) {
      setUserRole(savedRole);
    }

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);  
      } else {
        setIsCollapsed(false); 
      }
    };

     handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth >= 768) {  
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.toggleButton} onClick={toggleSidebar}>
        <FaBars className={styles.icon} />
      </div>
      <ul>
        {userRole === 'CEO' && (
          <>
            <li>
              <Link to="/ceohome">
                <FaHome className={styles.icon} />
                {!isCollapsed && <span className={styles.label}>Home</span>}
              </Link>
            </li>
            <li>
              <Link to="/addusers">
                <FaUserPlus className={styles.icon} />
                {!isCollapsed && <span className={styles.label}>Add Users</span>}
              </Link>
            </li>
            <li>
              <Link to="/leavesDataCEO">
                <FaEnvelope className={styles.icon} />
                {!isCollapsed && <span className={styles.label}>Leave Requests</span>}
              </Link>
            </li>
          </>
        )}

        {userRole === 'Employee' && (
          <>
            <li>
              <Link to="/leaveform">
                <FaFileAlt className={styles.icon} />
                {!isCollapsed && <span className={styles.label}>Leave Form</span>}
              </Link>
            </li>
            <li>
              <Link to="/leaveoverview">
                <FaClipboardList className={styles.icon} />
                {!isCollapsed && <span className={styles.label}>Leave Requests</span>}
              </Link>
            </li>
          </>
        )}

        {userRole === 'HOD' && (
          <>
            <li>
              <Link to="/leavesDataHOD">
                <FaClipboardList className={styles.icon} />
                {!isCollapsed && <span className={styles.label}>Leave Requests</span>}
              </Link>
            </li>
          </>
        )}

        {userRole === 'Admin' && (
          <>
            <li>
              <Link to="/adminhome">
                <FaUsers className={styles.icon} />
                {!isCollapsed && <span className={styles.label}>Users</span>}
              </Link>
            </li>
            <li>
              <Link to="/leavereqsall">
                <FaCalendarAlt className={styles.icon} />
                {!isCollapsed && <span className={styles.label}>Leave Requests</span>}
              </Link>
            </li>
          </>
        )}

        {userRole === 'HR Manager' && (
          <>
            <li>
              <Link to="/HomeHR">
                <FaHome className={styles.icon} />
                {!isCollapsed && <span className={styles.label}>Home</span>}
              </Link>
            </li>
            <li>
              <Link to="/addHOD">
                <FaUserTie className={styles.icon} />
                {!isCollapsed && <span className={styles.label}>Add HOD/Employee</span>}
              </Link>
            </li>
            <li>
              <Link to="/leavesDataHR">
                <FaEnvelope className={styles.icon} />
                {!isCollapsed && <span className={styles.label}>Leave Requests HR</span>}
              </Link>
            </li>
            <li>
              <Link to="/addleavetype">
                <FaCalendarAlt className={styles.icon} />
                {!isCollapsed && <span className={styles.label}>Add Leave Type</span>}
              </Link>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
