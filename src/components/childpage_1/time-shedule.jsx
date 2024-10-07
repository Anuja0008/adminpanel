import React from 'react';

function TimeShedule() {
  return (
    <div>
      <header style={styles.header}>
        <h1 style={styles.title}>Time Schedule</h1>
      </header>
      
      <div style={styles.scheduleContainer}>
        <div style={styles.card}>
          <div style={styles.iconContainer}>
            <div style={styles.icon}>TUE</div>
          </div>
          <div style={styles.details}>
            <ul style={styles.list}>
              <li>Kadawatha Interchange</li>
              <li>to</li>
              <li>KDUSC</li>
            </ul>
          </div>
        </div>
        
        <div style={styles.card}>
          <div style={styles.iconContainer}>
            <div style={styles.icon}>SAT</div>
          </div>
          <div style={styles.details}>
            <ul style={styles.list}>
              <li>KDUSC</li>
              <li>to</li>
              <li>Kadawatha Interchange</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    backgroundColor: '#3582a5',
    padding: '10px',
    color: 'white',
    textAlign: 'center',
  },
  title: {
    margin: 0,
    fontSize: '24px',
  },
  scheduleContainer: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: '#f5f5f5',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  iconContainer: {
    flexShrink: 0,
    paddingRight: '10px',
  },
  icon: {
    width: '50px',
    height: '50px',
    backgroundColor: '#FFC107',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#3E3E3E',
  },
  details: {
    flex: 1,
  },
  list: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    fontSize: '16px',
    lineHeight: '1.6',
  },
};

export default TimeShedule;
