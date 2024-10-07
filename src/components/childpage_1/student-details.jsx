import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../firebase/firebase'; // Assuming firebase.js is in the same folder
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { FaHome } from 'react-icons/fa'; // Import the home icon from react-icons

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "userdata")); // Fetch data from the 'userdata' collection
        const studentList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Get document ID
        setStudents(studentList);
      } catch (err) {
        setError(`Error fetching student data: ${err.message}`); // Improved error message
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.headerText}>Student Details</h2>
        <FaHome 
          style={styles.homeIcon} 
          onClick={() => navigate('/home')} // Navigate to home on click
        />
      </header>
      <main style={styles.mainContent}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Enrollment Number</th>
              <th style={styles.th}>Full Name</th>
              <th style={styles.th}>Phone Number</th>
              <th style={styles.th}>Role</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id}> {/* Use student.id for key */}
                  <td style={styles.td}>{student.email}</td>
                  <td style={styles.td}>{student.enrollmentNum}</td>
                  <td style={styles.td}>{student.fullName}</td>
                  <td style={styles.td}>{student.phoneNumber}</td>
                  <td style={styles.td}>{student.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={styles.noData}>No student data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2024 Your Company Name</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // Ensure the container takes at least the full viewport height
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    width: '100%', // Use 100% to prevent overflow issues
    position: 'fixed', // Keep header fixed at the top
    left: 0, // Align to the left of the viewport
    textAlign: 'center',
    backgroundColor: '#263043',
    padding: '15px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
    zIndex: 1, // Ensure the header is above other elements
    display: 'flex', // Use flexbox for header layout
    justifyContent: 'space-between', // Space out the items
    alignItems: 'center', // Center items vertically
  },
  headerText: {
    margin: 0,
    color: '#fff',
    fontSize: '24px',
  },
  homeIcon: {
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer', // Change cursor to pointer on hover
    marginRight: '20px', // Add some space from the right edge
  },
  mainContent: {
    flex: 1, // Allow the main content to grow and fill available space
    padding: '20px',
    marginTop: '60px', // Adjust margin to avoid overlap with header
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  th: {
    backgroundColor: '#ffac1c',
    color: '#fff',
    padding: '10px',
    textAlign: 'left',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    color: '#333',
  },
  noData: {
    textAlign: 'center',
    color: '#888',
    padding: '10px',
  },
  loading: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '18px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '18px',
  },
  footer: {
    width: '100%', // Use 100% to prevent overflow issues
    backgroundColor: '#263043',
    textAlign: 'center',
    padding: '15px',
    position: 'relative', // Position relative to the container
    bottom: 0, // Stick to the bottom of the container
  },
  footerText: {
    margin: '0',
    fontSize: '14px',
  },
};

export default StudentDetails;
