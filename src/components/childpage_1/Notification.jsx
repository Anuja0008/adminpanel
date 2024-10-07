import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase'; // Import Firebase configuration
import { collection, setDoc, doc, deleteDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { AiOutlineEdit } from 'react-icons/ai'; // Import Edit icon
import { MdDelete } from 'react-icons/md'; // Import Delete icon
import { FaHome, FaMapMarkerAlt } from 'react-icons/fa';
import { BsFillArchiveFill, BsFillTelephoneFill, BsInfoCircleFill, BsGrid1X2Fill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

// Header Component
function Header() {
  const navigate = useNavigate();

  return (
    <header style={{
      padding: '20px',
      backgroundColor: '#263043',
      borderBottom: '4px solid #ffac1c',
      color: '#ffffff',
      textAlign: 'center',
      fontSize: '24px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      display: 'flex', // Use flexbox for alignment
      justifyContent: 'space-between', // Space between title and icons
      alignItems: 'center', // Center align items vertically
      height: '55px',
    }}>
      <h1 style={{ margin: 0 }}>Notices</h1>
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
        <BsGrid1X2Fill
          onClick={() => navigate('/childpage_1/seat-reservation')}
          style={{
            fontSize: '25px',
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
          onClick={() => navigate('/childpage_1/Details')}
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
  );
}

// Notification Component
function Notification() {
  const [notices, setNotices] = useState([]);
  const [notice, setNotice] = useState('');
  const [editId, setEditId] = useState(null);

  // Function to fetch notices from Firestore
  const fetchNotices = async () => {
    const noticesCollection = collection(db, 'Notices');
    const noticeSnapshot = await getDocs(noticesCollection);
    const noticesList = noticeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNotices(noticesList);
  };

  // Fetch notices when the component loads
  useEffect(() => {
    fetchNotices();
  }, []);

  // Function to handle adding or updating a notice in Firestore
  const handleAddOrUpdateNotice = async () => {
    if (notice.trim()) {
      if (editId) {
        // Update existing notice
        const noticeRef = doc(db, 'Notices', editId);
        await setDoc(noticeRef, {
          notice,
          date: serverTimestamp(),
        });
        setEditId(null);
      } else {
        // Add new notice with a custom document ID
        const noticesCollection = collection(db, 'Notices');
        const noticeSnapshot = await getDocs(noticesCollection);
        const newDocId = `doc${noticeSnapshot.docs.length + 1}`;

        const noticeRef = doc(db, 'Notices', newDocId);
        await setDoc(noticeRef, {
          notice,
          date: serverTimestamp(),
        });
      }
      setNotice('');
      fetchNotices();
    }
  };

  // Function to handle editing a notice
  const handleEditNotice = (id, noticeText) => {
    setNotice(noticeText);
    setEditId(id);
  };

  // Function to handle deleting a notice
  const handleDeleteNotice = async (id) => {
    const noticeRef = doc(db, 'Notices', id);
    await deleteDoc(noticeRef);
    fetchNotices();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: '"Roboto", sans-serif' }}>
      <Header />
      
      {/* Main Content Area */}
      <div style={{
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '30px',
        backgroundColor: '#f5f7fa',
        overflowY: 'auto', // Enable vertical scrolling
        maxHeight: 'calc(100vh - 100px)', // Adjust height to leave space for header and footer
      }}>
        <div style={{
          maxWidth: '800px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '20px',
        }}>
          {/* Input Section */}
          <h2 style={{ 
            textAlign: 'center', 
            // color: '#FF8C00', // web orange color
            fontFamily: 'Times New Roman', // Times New Roman font
            fontSize: '24px', // Adjust the font size if needed
          }}>
            Manage Notices
          </h2>
          <textarea
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
            placeholder="Enter notice"
            style={{
              padding: '15px',
              fontSize: '16px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              backgroundColor: '#F5F7FA',
              width: '100%',
              height: '200px',
              resize: 'none',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          />
          <button
            onClick={handleAddOrUpdateNotice}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2a9d8f',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              alignSelf: 'center',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s ease',
              marginTop: '10px',
            }}
          >
            {editId ? 'Update' : 'Add'}
          </button>

          {/* Notices List Section */}
          <div style={{ marginTop: '20px' }}>
            {notices.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'gray' }}>You have no notices.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {notices.map(({ id, notice, date }) => (
                  <li
                    key={id}
                    style={{
                      padding: '15px',
                      margin: '10px 0',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div style={{ flex: '1' }}>
                      <p style={{ margin: '0 0 5px', fontWeight: 'bold' }}>{notice}</p>
                      <small style={{ color: 'gray' }}>{date?.toDate().toLocaleString()}</small>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleEditNotice(id, notice)}
                        style={{
                          padding: '8px 15px',
                          backgroundColor: '#FF8C00',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s ease',
                        }}
                      >
                        <AiOutlineEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteNotice(id)}
                        style={{
                          padding: '8px 15px',
                          backgroundColor: '#e63946',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s ease',
                        }}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer style={{
        padding: '15px',
        backgroundColor: '#263043',
        color: '#ffffff',
        textAlign: 'center',
        fontSize: '16px',
        boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        bottom: '0',
        width: '100%',
      }}>
        <p style={{ margin: 0 }}>© 2024 Your Company Name</p>
      </footer>
    </div>
  );
}

export default Notification;
