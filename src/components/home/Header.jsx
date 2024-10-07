import React from 'react';
import { 
  BsFillBellFill, 
  // BsFillEnvelopeFill, 
  BsPersonCircle, 
  BsJustify, 
  BsBoxArrowRight  // Import logout icon
} from 'react-icons/bs';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation

function Header({ OpenSidebar }) {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    
    alert('You have been logged out.');

    // Redirect to login page and replace the history entry to prevent backward navigation
    navigate('/login', { replace: true });
  };

  return (
    <header className='header'>
      {/* Sidebar toggle button */}
      <div className='menu-icon'>
        <BsJustify className='icon' onClick={OpenSidebar} />
      </div>

      {/* Icons on the right side */}
      <div className='header-icon'>
        <BsFillBellFill className='icon-header' />
        {/* <BsFillEnvelopeFill className='icon-header' /> */}
        <BsPersonCircle className='icon-header' />
        <BsBoxArrowRight className='icon-header' onClick={handleLogout} title="Logout" />
      </div>
    </header>
  );
}

export default Header;
