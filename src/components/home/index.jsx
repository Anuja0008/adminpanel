import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './profile.css';
import { 
  BsFillArchiveFill, 
  BsFillGrid3X3GapFill, 
  BsPeopleFill, 
  BsFillBellFill 
} from 'react-icons/bs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import { db } from '../../firebase/firebase'; // Import the Firestore database instance
import { collection, getDocs, query, where } from 'firebase/firestore';

function Home() {
  const [seatReservations, setSeatReservations] = useState([]);
  const [availableSeats, setAvailableSeats] = useState(0);
  const totalSeats = 45; // Total number of seats

  useEffect(() => {
    const fetchReservations = async () => {
      const reservationsCollection = collection(db, 'reservations');
      const q = query(reservationsCollection, where('seat_state', '==', true));
      const querySnapshot = await getDocs(q);

      const reservations = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const travelDate = data.travelDate ? new Date(data.travelDate.seconds * 1000).toLocaleDateString() : 'N/A';
        
        return {
          id: doc.id,
          seatNumber: data.seatId || 'N/A',
          destination: data.destination || 'N/A',
          fullName: data.fullName || 'N/A',
          email: data.email || 'N/A',
          phoneNumber: data.phoneNumber || 'N/A',
          role: data.role || 'N/A',
          travelDate: travelDate, // Format the date here
        };
      });

      setSeatReservations(reservations);
      calculateAvailableSeats(reservations.length);
    };

    fetchReservations();
  }, []);

  const calculateAvailableSeats = (bookedSeatsCount) => {
    setAvailableSeats(totalSeats - bookedSeatsCount);
  };

  // Sample chart data
  const data = [
    { name: '1st week', Lectures: 2000, Students: 2400, amt: 2400 },
    { name: '2nd Week', Lectures: 3000, Students: 1398, amt: 2210 },
    { name: '3rd Week', Lectures: 2000, Students: 9800, amt: 2290 },
    { name: '4th Week', Lectures: 2000, Students: 9800, amt: 2000 },
  ];

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3 className='Dashboard'>Hello Admin</h3>
      </div>

      <div className='main-cards'>
        <Link to="/childpage_1/seat-reservation" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className='card'>
            <div className='card-inner'>
              <h3>Seats Available</h3>
              <BsFillArchiveFill className='card_icon' />
            </div>
            <h1>{availableSeats}</h1> {/* Display available seat count */}
          </div>
        </Link>
        <div className='card'>
          <div className='card-inner'>
            <h3>Bus Information</h3>
            <BsFillGrid3X3GapFill className='card_icon' />
          </div>
          <h1>Izuzu</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>Users</h3>
            <BsPeopleFill className='card_icon' />
          </div>
          <h1>---</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>ALERTS</h3>
            <BsFillBellFill className='card_icon' />
          </div>
          <h1>---</h1>
        </div>
      </div>

      <div className='divider'></div> {/* Divider added here */}

      <div className='charts'>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Lectures" fill="#FFA500" />
            <Bar dataKey="Students" fill="#1f536b" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Lectures" stroke="#FFA500" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Students" stroke="#1f536b" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className='divider'></div> {/* Divider added here */} 

      <div className='reservations-table'>
        <h3>Seat Reservations</h3>
        <table>
          <thead>
            <tr>
              <th>Seat Number</th>
              <th>Destination</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Status</th>
              <th>Travel Date</th>
            </tr>
          </thead>
          <tbody>
            {seatReservations.length > 0 ? (
              seatReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.seatNumber}</td>
                  <td>{reservation.destination}</td>
                  <td>{reservation.fullName}</td>
                  <td>{reservation.email}</td>
                  <td>{reservation.phoneNumber}</td>
                  <td>{reservation.role}</td>
                  <td>{reservation.travelDate}</td> {/* Display formatted travel date */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No reservations found</td> {/* Updated colSpan to match the number of columns */}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Home;
