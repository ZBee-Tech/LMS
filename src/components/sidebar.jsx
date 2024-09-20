import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaBars, FaEnvelope } from 'react-icons/fa';  
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
  
        
    
        {userRole === 'CEO' ? (
          <>

<li>
    <Link to="/ceohome">
      <FaInfoCircle className={styles.icon} />
      {!isCollapsed && <span className={styles.label}>Home</span>}
    </Link>
    
  </li>
  <li>
    <Link to="/addusers">
      <FaHome className={styles.icon} />
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
    
{userRole === 'Employee' ? (
          <>
  <li>
    <Link to="/leaveform">
      <FaInfoCircle className={styles.icon} />
      {!isCollapsed && <span className={styles.label}>LeaveForm</span>}
    </Link>
    
  </li>
  <li>
    <Link to="/leaveoverview">
      <FaEnvelope className={styles.icon} />
      {!isCollapsed && <span className={styles.label}>Leave Requests </span>}
    </Link>
    
  </li>
  </>
) : (
<></>
)


}

{userRole === 'HOD' ? (
          <>
  <li>
    <Link to="/leavesDataHOD">
      <FaInfoCircle className={styles.icon} />
      {!isCollapsed && <span className={styles.label}>Leave Requests</span>}
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
    <Link to="/HomeHR">
      <FaHome className={styles.icon} />
      {!isCollapsed && <span className={styles.label}>Home</span>}
    </Link>
    
  </li>
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
  <li>
    <Link to="/addleavetype">
      <FaHome className={styles.icon} />
      {!isCollapsed && <span className={styles.label}>Add Leave Type</span>}
    </Link>
    
  </li>
  </>
) : (
  <></>
)
}

  
      </ul>
    </aside>
  );
};

export default Sidebar;
