import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore'; // Firestore methods
import { db } from '../../firebase/firebase';

const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px 40px 20px 20px',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
};

const headerStyle = {
  textAlign: 'center',
  color: '#333',
  marginBottom: '20px',
};

const fieldStyle = {
  marginBottom: '15px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
};

const selectStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
};

const labelStyle = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: 'bold',
};

const buttonStyle = {
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: '#007bff',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '16px',
};

const unbookButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#dc3545',
};

const destinationsList = [
  'Kahathuduwa Interchange',
  'Gelanigama Interchange',
  'Dodangoda Interchange',
  'Welipenna Interchange',
  'Kurudugahahethekma Interchange',
  'Baddegama Interchange',
  'Pinnaduwa Interchange',
  'Imaduwa Interchange',
  'Kokmaduwa Interchange',
  'Godagama Interchange',
  'Godagama - Palatuwa Interchange',
  'Kapuduwa Interchange',
  'Aparekka Interchange',
  'Beliatta Interchange',
  'Bedigama Interchange',
  'Kasagala Interchange',
  'Angunukolapelessa Interchange',
  'Barawakubuka Interchange',
  'Sooriyawewa Interchange',
];

const rolesList = ['Student', 'Lecturer', 'Officer'];
const journeyTypesList = ['One Way', 'Two Way'];

const SeatDetails = () => {
  const { seatNumber } = useParams();
  const [seatDetails, setSeatDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    enrollmentNum: '', // Enrollment number field
    journeyType: 'One Way',
    destination: '',
    role: 'Student',
    travelDate: '',
  });

  useEffect(() => {
    const fetchSeatDetails = async () => {
      try {
        const seatIdNumber = Number(seatNumber);
        const seatsRef = collection(db, 'reservations');
        const q = query(seatsRef, where('seatId', '==', seatIdNumber));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const seatData = querySnapshot.docs.map(doc => doc.data())[0];
          setSeatDetails(seatData);
          setIsBooked(seatData.seat_state);
        } else {
          setSeatDetails(null);
          setIsBooked(false);
        }
      } catch (error) {
        setError('Error fetching seat details: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeatDetails();
  }, [seatNumber]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return date.toLocaleDateString();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleDateInput = (e) => {
    const selectedDate = e.target.value;
    if (isDisabledDate(selectedDate)) {
      alert('Only Saturdays and Tuesdays are available for booking!');
      setFormData((prevFormData) => ({
        ...prevFormData,
        travelDate: '',
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        travelDate: selectedDate,
      }));
    }
  };

  const isDisabledDate = (date) => {
    const day = new Date(date).getDay();
    return day !== 2 && day !== 6;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (isBooked) {
      alert('This seat is already booked!');
      return;
    }

    try {
      const seatIdNumber = Number(seatNumber);
      const { email, fullName, phoneNumber, enrollmentNum, journeyType, destination, role, travelDate } = formData;

      if (!travelDate) {
        alert('Please select a valid travel date!');
        return;
      }

      const seatDocId = `${email}_${seatIdNumber}_${travelDate}`;
      await setDoc(doc(db, 'reservations', seatDocId), {
        seatId: seatIdNumber,
        fullName,
        email,
        phoneNumber,
        enrollmentNum, // Save enrollment number
        journeyType,
        destination,
        role,
        travelDate: new Date(travelDate),
        seat_state: true,
      });

      const userdataRef = doc(db, 'userdata', email);
      await setDoc(
        userdataRef,
        {
          email,
          role,
          enrollmentNum, // Added enrollment number to 'userdata'
          fullName,       // Added full name to 'userdata'
          phoneNumber,    // Added phone number to 'userdata'
        },
        { merge: true }
      );

      setSeatDetails((prevDetails) => ({ ...prevDetails, seat_state: true }));
      setIsBooked(true);

      alert(`Seat ${seatIdNumber} booked successfully with email: ${email}`);

      window.location.reload();
    } catch (error) {
      setError('Error booking seat: ' + error.message);
    }
  };

  const handleUnbookSeat = async () => {
    try {
      const seatIdNumber = Number(seatNumber);
      const seatsRef = collection(db, 'reservations');
      const q = query(seatsRef, where('seatId', '==', seatIdNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;

        await deleteDoc(doc(db, 'reservations', docId));

        setIsBooked(false);
        setSeatDetails(null);

        alert(`Seat ${seatIdNumber} has been successfully unbooked.`);
      } else {
        alert('Reservation not found.');
      }
    } catch (error) {
      setError('Error unbooking seat: ' + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Seat Details</h2>
      {seatDetails ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ flex: 1 }}>
            <p>
              <strong>Seat ID:</strong> {seatDetails.seatId || 'N/A'}
            </p>
            <p>
              <strong>Full Name:</strong> {seatDetails.fullName || 'N/A'}
            </p>
            <p>
              <strong>Journey Type:</strong> {seatDetails.journeyType || 'N/A'}
            </p>
            <p>
              <strong>Phone Number:</strong> {seatDetails.phoneNumber || 'N/A'}
            </p>
            <p>
              <strong>Travel Date:</strong> {formatTimestamp(seatDetails.travelDate) || 'N/A'}
            </p>
            <p>
              <strong>Role:</strong> {seatDetails.role || 'N/A'}
            </p>
            <p>
              <strong>Seat State:</strong> {seatDetails.seat_state ? 'Booked' : 'Available'}
            </p>
          </div>
          <div style={{ flex: 1, paddingLeft: '20px' }}>
            <p>
              <strong>Destination:</strong> {seatDetails.destination || 'N/A'}
            </p>
          </div>
        </div>
      ) : (
        <p>No seat details available</p>
      )}

      {!isBooked && seatDetails === null && (
        <form onSubmit={handleRegistration}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Full Name:</label>
            <input
              style={inputStyle}
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Email:</label>
            <input
              style={inputStyle}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Phone Number:</label>
            <input
              style={inputStyle}
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Enrolment Number:</label>
            <input
              style={inputStyle}
              type="text"
              name="enrollmentNum"
              value={formData.enrollmentNum}
              onChange={handleChange}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Journey Type:</label>
            <select
              style={selectStyle}
              name="journeyType"
              value={formData.journeyType}
              onChange={handleChange}
            >
              {journeyTypesList.map((journeyType) => (
                <option key={journeyType} value={journeyType}>
                  {journeyType}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Destination:</label>
            <select
              style={selectStyle}
              name="destination"
              value={formData.destination}
              onChange={handleChange}
            >
              {destinationsList.map((destination) => (
                <option key={destination} value={destination}>
                  {destination}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Role:</label>
            <select style={selectStyle} name="role" value={formData.role} onChange={handleChange}>
              {rolesList.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Travel Date:</label>
            <input
              style={inputStyle}
              type="date"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleDateInput}
              required
            />
          </div>

          <button type="submit" style={buttonStyle}>
            Book Seat
          </button>
        </form>
      )}

      {isBooked && (
        <button onClick={handleUnbookSeat} style={unbookButtonStyle}>
          Unbook Seat
        </button>
      )}
    </div>
  );
};

export default SeatDetails;
