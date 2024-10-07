import React, { useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Import the Firestore instance

function About() {
  // Inline CSS styles for the header
  const headerStyle = {
    backgroundColor: '#282c34', // Dark background color
    color: 'white', // White text color
    padding: '20px', // Increased padding for better spacing
    textAlign: 'center', // Center align text
    borderBottom: '5px solid #FFA500', // Thicker light blue border at the bottom
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)' // Subtle shadow for depth
  };

  // Inline CSS styles for the heading
  const headingStyle = {
    margin: '0', // Remove default margin
    fontSize: '2.5em', // Larger font size for prominence
    fontWeight: 'bold', // Make heading bold
    letterSpacing: '1px' // Slightly increase letter spacing
  };

  // Inline CSS styles for the paragraph container
  const paragraphContainerStyle = {
    padding: '20px', // Padding around the paragraph container
    textAlign: 'center' // Center align text within the container
  };

  // Inline CSS styles for the paragraph
  const paragraphStyle = {
    color: '#000000', // Black text color for the paragraph
    fontSize: '1.1em', // Slightly larger font size for readability
    lineHeight: '1.8', // Increased line height for better readability
    margin: '20px auto', // Margin for spacing above and below the paragraph
    maxWidth: '750px', // Max width for the paragraph container
    padding: '0 15px', // Horizontal padding to prevent text from touching the edges
    textAlign: 'justify' // Justify text alignment for a cleaner look
  };

  // Add "About Us" text to Firestore
  useEffect(() => {
    const addAboutTextToFirestore = async () => {
      try {
        const aboutText = `The Admin Panel of the Staff Bus Service Management System serves as the backbone of efficient transportation management at Kotelawala Defence University (KDU) Southern Campus. Designed with ease of use and functionality in mind, the Admin Panel allows administrators to oversee the entire bus service, from managing routes and schedules to monitoring real-time GPS tracking and seat bookings. The intuitive interface simplifies daily operations, enabling quick updates, seamless coordination, and effective handling of all transport-related tasks.
        
        Through this centralized platform, administrators can efficiently manage bus availability, send automated notifications, and handle user feedback. Additionally, the panel ensures smooth communication between staff and transport services, enhancing overall operational efficiency. By providing these tools, the system offers a reliable and user-friendly experience for both administrators and users, ultimately ensuring that the transport service meets the needs of all stakeholders.`;

        // Set the document in Firestore
        await setDoc(doc(db, 'About', 'aboutText'), { text: aboutText });
        console.log('Text added to Firestore successfully.');
      } catch (error) {
        console.error('Error adding text to Firestore:', error);
      }
    };

    addAboutTextToFirestore();
  }, []);

  return (
    <>
      <header style={headerStyle}>
        <h1 style={headingStyle}>About Us</h1>
      </header>
      <div style={paragraphContainerStyle}>
        <p style={paragraphStyle}>
          The Admin Panel of the Staff Bus Service Management System serves as the backbone of efficient transportation management at Kotelawala Defence University (KDU) Southern Campus. Designed with ease of use and functionality in mind, the Admin Panel allows administrators to oversee the entire bus service, from managing routes and schedules to monitoring real-time GPS tracking and seat bookings. The intuitive interface simplifies daily operations, enabling quick updates, seamless coordination, and effective handling of all transport-related tasks.
          <br /><br />
          Through this centralized platform, administrators can efficiently manage bus availability, send automated notifications, and handle user feedback. Additionally, the panel ensures smooth communication between staff and transport services, enhancing overall operational efficiency. By providing these tools, the system offers a reliable and user-friendly experience for both administrators and users, ultimately ensuring that the transport service meets the needs of all stakeholders.
        </p>
      </div>
      {/* Footer */}
      <footer style={{
        backgroundColor: '#263043',
        color: '#ffffff',
        textAlign: 'center',
        padding: '15px 0',
        fontSize: '14px',
        marginTop: 'auto' // Ensures footer stays at the bottom
      }}>
        KDU_go Staff Bus Management System &copy; 2023. All Rights Reserved.
      </footer>
    </>
  );
}

export default About;
