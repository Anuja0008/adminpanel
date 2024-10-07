import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaHome, FaMapMarkerAlt } from 'react-icons/fa'; // Import icons
import { BsFillTelephoneFill, BsInfoCircleFill,BsGrid1X2Fill } from 'react-icons/bs'; // Import additional icons

function CenterDetails() {
  const navigate = useNavigate();

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: '#263043',
    color: '#e67e22',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    borderBottom: '4px solid #e67e22',
    fontFamily: 'Poppins, sans-serif',
    position: 'relative',
  };

  const logoStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  };

  const iconStyle = {
    fontSize: '28px',
    cursor: 'pointer',
    color: '#fff',
    transition: 'color 0.3s',
  };

  const contentStyle = {
    marginTop: '20px',
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#ecf0f1',
    fontFamily: 'Poppins, sans-serif',
  };

  const cardContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '30px',
    marginTop: '40px',
  };

  const cardStyle = {
    width: '220px',
    height: '150px',
    border: '1px solid #2980b9',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)',
    padding: '20px',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
  };

  const footerStyle = {
    backgroundColor: '#263043',
    color: '#ffffff',
    textAlign: 'center',
    padding: '15px 0',
    fontSize: '14px',
    marginTop: 'auto',
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  // Define an array of colors for the card backgrounds
  const cardColors = ['#949a9c', '#949a9c', '#949a9c', '#949a9c', '#949a9c'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={headerStyle}>
        <div style={logoStyle}>🏢 Center Details</div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <FaHome onClick={() => navigate('/home')} style={iconStyle} aria-label="Home" />
          <BsGrid1X2Fill
          onClick={() => navigate('/childpage_1/seat-reservation')}
          style={{
            fontSize: '25px',
            cursor: 'pointer',
            transition: 'color 0.3s',
            color: '#fff',
          }}
        />
          <FaMapMarkerAlt onClick={() => navigate('/location')} style={iconStyle} aria-label="Location" />
          <FaBell onClick={() => navigate('/childpage_1/Notification')} style={iconStyle} aria-label="Notifications" />
          <BsFillTelephoneFill onClick={() => navigate('/childpage_1/Details')} style={iconStyle} aria-label="Contact" />
          <BsInfoCircleFill onClick={() => navigate('/childpage_1/About')} style={iconStyle} aria-label="About" />
        </div>
      </header>
      <div style={contentStyle}>
        <div style={cardContainerStyle}>
          {['/childpage_1/Ticket-prices', '/childpage_1/time-schedule', '/childpage_1/Bus-info', '/childpage_1/student-details', '/childpage_1/Driver-info'].map((path, index) => (
            <div
              key={index}
              style={{ ...cardStyle, backgroundColor: cardColors[index] }}
              onClick={() => handleCardClick(path)}
              tabIndex="0"
              role="button"
              aria-label={path.split('/').pop().replace('-', ' ')}
              onKeyPress={(e) => e.key === 'Enter' && handleCardClick(path)} // Handle Enter key for accessibility
            >
              <div style={{ fontSize: '40px', marginBottom: '15px', color: '#fff' }}>
                {index === 0 && '🎟️'}
                {index === 1 && '🗓️'}
                {index === 2 && '🚌'}
                {index === 3 && '🎓'}
                {index === 4 && '👨‍✈️'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#fff' }}>
                {['Ticket Prices', 'Time Schedule', 'Bus Details', 'Student Details', 'Driver Details'][index]}
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer style={footerStyle}>
        © 2024 Your Company Name. All rights reserved.
      </footer>
    </div>
  );
}

export default CenterDetails;
