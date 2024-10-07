import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { collection, getDocs, doc, /*setDoc*/ } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import '@fortawesome/fontawesome-free/css/all.min.css';
 import {  BsFillArchiveFill,BsFillTelephoneFill,BsInfoCircleFill } from 'react-icons/bs';
import { deleteDoc } from 'firebase/firestore'; // Import deleteDoc
import { FaHome, FaMapMarkerAlt, FaBell } from 'react-icons/fa';





const TOTAL_SEAT_COUNT = 45;

const SeatReservation = () => {
  const [seatData, setSeatData] = useState({});
  const [destinations, setDestinations] = useState([]);
  const [availableSeatCount, setAvailableSeatCount] = useState(TOTAL_SEAT_COUNT);
  const [bookedSeatCount, setBookedSeatCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'reservations'));
        const seats = {};
        const destinationCounts = {};

        let bookedCount = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const seatId = data.seatId;

          if (seatId) {
            seats[seatId] = data.seat_state;

            if (data.seat_state) {
              bookedCount++;
              const normalizedDestination = data.destination ? data.destination.trim().toLowerCase() : '';

              if (normalizedDestination) {
                if (!destinationCounts[normalizedDestination]) {
                  destinationCounts[normalizedDestination] = {
                    count: 1,
                    fullNames: [data.fullName],
                    originalName: data.destination
                  };
                } else {
                  destinationCounts[normalizedDestination].count++;
                  destinationCounts[normalizedDestination].fullNames.push(data.fullName);
                }
              }
            }
          }
        });

        setSeatData(seats);
        setBookedSeatCount(bookedCount);
        setAvailableSeatCount(TOTAL_SEAT_COUNT - bookedCount);

        const destinationList = Object.entries(destinationCounts).map(([_, info]) => ({
          destination: info.originalName,
          count: info.count,
          fullNames: info.fullNames,
        }));

        setDestinations(destinationList);
      } catch (error) {
        console.error('Error fetching seat data:', error);
      }
    };

    fetchSeats();
  }, []);

  const makeAllSeatsAvailable = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'reservations'));
      
      // Create an array of delete promises
      const deletePromises = querySnapshot.docs.map((seatDoc) => deleteDoc(doc(db, 'reservations', seatDoc.id)));
  
      // Execute all delete operations
      await Promise.all(deletePromises);
  
      // Update local state to reflect all seats are available
      setSeatData({});
      setAvailableSeatCount(TOTAL_SEAT_COUNT);
      setBookedSeatCount(0);
      setDestinations([]);
  
      alert('All seats have been set to available, and reservations have been deleted.');
    } catch (error) {
      console.error('Error setting all seats to available and deleting documents:', error);
    }
  };

  const handleSeatClick = (seatNumber) => {
    if (seatNumber) {
      navigate(`/childpage_1/seat-details/${seatNumber}`);
    }
  };

  const seatStyle = (seatNumber) => {
    const isBooked = seatData[seatNumber];
    return {
      width: '45px',
      height: '45px',
      backgroundColor: isBooked ? '#FFA500' : '#E0F7FA',
      border: seatNumber <= 20 ? '2px solid #FF3D00' : '1px solid #004D40',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'background-color 0.3s, transform 0.3s',
      transform: 'scale(1.05)',
      fontSize: '1rem',
      color: isBooked ? '#FFF' : '#000',
    };
  };

  const rows = [
    [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45],
    [2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42, 46],
    [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47],
    [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48]
  ];

  const generatePDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('KDU_go Staff Bus Management System', 10, 10);
    doc.setFontSize(14);

    let yOffset = 20;

    doc.text('Destination Report', 10, yOffset);
    yOffset += 10;

    if (destinations.length > 0) {
      destinations.forEach((dest, index) => {
        doc.text(`${index + 1}. ${dest.destination} - ${dest.count} reservation(s)`, 10, yOffset);
        yOffset += 10;

        doc.text('', 10, yOffset);
        yOffset += 10;
        dest.fullNames.forEach((name, nameIndex) => {
          doc.text(`  ${nameIndex + 1}. ${name}`, 20, yOffset);
          yOffset += 10;
        });
      });
    } else {
      doc.text('No destinations booked.', 10, yOffset);
      yOffset += 10;
    }

    doc.save('KDU_go_Staff_Bus_Management_System_Destination_Report.pdf');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5', color: '#333', fontFamily: 'Times New Roman, serif' }}>
    <header style={{ height: '70px', backgroundColor: '#263043', padding: '15px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#FFAC1C' }}>
        Seat Reservation
      </h1>
      
      {/* Icon container aligned to the right */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <FaHome
          onClick={() => navigate('/home')}
          style={{
            fontSize: '28px',
            cursor: 'pointer',
            transition: 'color 0.3s',
            color: '#fff',
          }}
        />
         <FaMapMarkerAlt
          onClick={() => navigate('/location')}
          style={{
            fontSize: '28px',
            cursor: 'pointer',
            transition: 'color 0.3s',
            color: '#fff',
          }}
        />
         <FaBell
          onClick={() => navigate('/childpage_1/Notification')}
          style={{
            fontSize: '28px',
            cursor: 'pointer',
            transition: 'color 0.3s',
            color: '#fff',
          }}
        />
        <BsFillArchiveFill
          onClick={() => navigate('/childpage_1/center-details')}
          style={{
            fontSize: '28px',
            cursor: 'pointer',
            transition: 'color 0.3s',
            color: '#fff',
          }}
        />
        <BsFillTelephoneFill 
          onClick={() => navigate('/childpage_1//childpage_1/Details')}
          style={{
            fontSize: '28px',
            cursor: 'pointer',
            transition: 'color 0.3s',
            color: '#fff',
          }}
        />
       
        <BsInfoCircleFill 
          onClick={() => navigate('/childpage_1/About')}
          style={{
            fontSize: '28px',
            cursor: 'pointer',
            transition: 'color 0.3s',
            color: '#fff',
          }}
        />
        
       
       
      </div>
    </header>
      <main style={{ flexGrow: 1, padding: '30px', display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ flex: 2, maxWidth: '900px', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', marginRight: '20px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.5rem', color: '#333', fontWeight: 'bold' }}>
            Seat Block
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 45px)', gap: '12px', justifyContent: 'center' }}>
            {rows.map((row, rowIndex) =>
              row.map((seatNumber) => (
                <div
                  key={seatNumber}
                  style={seatStyle(seatNumber)}
                  onClick={() => handleSeatClick(seatNumber)}
                >
                  {seatNumber}
                </div>
              ))
            )}
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={makeAllSeatsAvailable}
              style={{
                padding: '10px 20px',
                backgroundColor: '#FF3D00',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                marginRight: '10px',
              }}
            >
              Make All Seats Available
            </button>
            <button
              onClick={generatePDF}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3F51B5',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Generate PDF
            </button>
          </div>

          {/* Seat Count Labels */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
              Available Seats: {availableSeatCount}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
              Booked Seats: {bookedSeatCount}
            </div>
          </div>
        </div>

        {/* Booked Destinations */}
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ textAlign: 'center', fontSize: '1.2rem', color: '#333', marginBottom: '20px' }}>
            Booked Destinations
          </h3>
          {destinations.length > 0 ? (
            <ul style={{ listStyleType: 'none', paddingLeft: '0', fontFamily: 'Times New Roman, serif' }}>
              {destinations.map((dest, index) => (
                <li key={index} style={{ margin: '10px 0', fontSize: '1rem', color: '#555' }}>
                  {dest.destination} - {dest.count} reservation(s)
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ textAlign: 'center', fontSize: '1rem', color: '#777', fontFamily: 'Times New Roman, serif' }}>No destinations booked.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default SeatReservation;
