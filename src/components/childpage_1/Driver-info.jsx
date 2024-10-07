// BusInformation.js
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase'; // Adjust the path if needed
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa'; 

const DriverDetails = () => {
  const navigate = useNavigate();
  const [busData, setBusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [newBusInfo, setNewBusInfo] = useState({ Name: '', RegNo: '', Tel: '' });

  const storage = getStorage();

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const driverCollection = collection(db, 'DriverDetails'); // Querying DriverDetails collection
        const driverSnapshot = await getDocs(driverCollection);
        const driverList = driverSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); 
        setBusData(driverList); // Set busData to fetched driver data
      } catch (error) {
        console.error("Error fetching driver details: ", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverDetails();
  }, []);

  const updateBusDetails = async (id, updatedInfo) => {
    const driverDoc = doc(db, 'DriverDetails', id); // Update using the DriverDetails collection
    await updateDoc(driverDoc, updatedInfo);
    const updatedBusData = busData.map(bus => (bus.id === id ? { ...bus, ...updatedInfo } : bus));
    setBusData(updatedBusData);
  };

  const uploadNewImage = async (id) => {
    const bus = busData.find(bus => bus.id === id);
    if (bus?.ImageUrl) {
      const oldImageRef = ref(storage, bus.ImageUrl);
      try {
        await deleteObject(oldImageRef);
      } catch (error) {
        console.error("Error deleting old image: ", error);
      }
    }

    if (newImage) {
      const imageRef = ref(storage, `DriverDetails/${newImage.name}`);
      try {
        await uploadBytes(imageRef, newImage);
        const imageUrl = await getDownloadURL(imageRef);
        await updateBusDetails(id, { ImageUrl: imageUrl });
        setNewImage(null);
        setNewBusInfo({ Name: '', RegNo: '', Tel: '' });
      } catch (error) {
        console.error("Error uploading new image: ", error);
      }
    }
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  if (loading) return <p>Loading driver information...</p>;
  if (error) return <p>Error fetching driver information: {error.message}</p>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>DRIVER INFORMATION</h1>
        <FaHome 
          style={styles.homeIcon} 
          onClick={() => navigate('/home')} 
          aria-label="Go to Home"
          onMouseEnter={(e) => e.currentTarget.style.color = '#FFAC1C'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
        />
      </header>
      
      <main style={styles.mainContent}>
        <div style={styles.busList}>
          {busData.map(bus => (
            <div key={bus.id} style={styles.busCard}>
              <img src={bus.ImageUrl} alt={bus.Name} style={styles.busImage} />
              <h2 style={styles.busName}>{bus.Name}</h2>
              <p style={styles.busDetails}>Reg No: {bus.RegNo}</p>
              <p style={styles.busDetails}>Tel: {bus.Tel}</p>
              
              <input 
                type="text" 
                placeholder="New Name" 
                onChange={(e) => setNewBusInfo({ ...newBusInfo, Name: e.target.value })} 
                style={styles.input}
              />
              <input 
                type="text" 
                placeholder="New Reg No" 
                onChange={(e) => setNewBusInfo({ ...newBusInfo, RegNo: e.target.value })} 
                style={styles.input}
              />
              <input 
                type="text" 
                placeholder="New Tel" 
                onChange={(e) => setNewBusInfo({ ...newBusInfo, Tel: e.target.value })} 
                style={styles.input}
              />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                style={styles.input}
              />
              <button 
                onClick={() => {
                  updateBusDetails(bus.id, newBusInfo);
                  uploadNewImage(bus.id);
                }} 
                style={styles.button}
              >
                Update Driver Info and Image
              </button>
            </div>
          ))}
        </div>
      </main>
      
      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2024 Bus Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#f4f4f4',
  },
  header: {
    backgroundColor: '#263043',
    padding: '20px',
    textAlign: 'center',
    position: 'relative',
  },
  headerTitle: {
    color: '#ffffff',
    margin: 0,
    fontSize: '26px',
    fontWeight: '600',
  },
  homeIcon: {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#ffffff',
    fontSize: '24px',
    cursor: 'pointer',
    transition: 'color 0.3s',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  busList: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  busCard: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    margin: '10px',
    width: '300px',
    textAlign: 'center',
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  busImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
  },
  busName: {
    fontSize: '20px',
    color: '#333',
    margin: '10px 0',
  },
  busDetails: {
    fontSize: '16px',
    color: '#555',
  },
  input: {
    marginBottom: '10px',
    padding: '8px',
    fontSize: '16px',
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 15px',
    fontSize: '16px',
    backgroundColor: '#FFAC1C',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  footer: {
    backgroundColor: '#263043',
    color: '#fff',
    textAlign: 'center',
    padding: '10px',
  },
  footerText: {
    margin: 0,
  },
};

export default DriverDetails;
