import React, { useEffect, useState } from 'react';
import { storage } from '../../firebase/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, getDocs, addDoc, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; 
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Lostandfound() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null); 
  const [text, setText] = useState(''); 

  const navigate = useNavigate();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const q = query(collection(db, 'uploads'));
      const querySnapshot = await getDocs(q);

      const fetchedImages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        imageUrl: doc.data().imageUrl,
        text: doc.data().text || 'No description available',
      }));

      setImages(fetchedImages);
    } catch (error) {
      console.error('Error fetching images and texts:', error);
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        await addDoc(collection(db, 'uploads'), {
          imageUrl: downloadURL,
          text: text || 'No description available',
        });

        alert('Image uploaded successfully!');
        setFile(null);
        setText('');
        fetchImages();
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      alert('Please select a file.');
    }
  };

  const handleDelete = async (imageId, imageUrl) => {
    try {
      const imageRef = ref(storage, `images/${imageUrl.split('%2F')[1].split('?')[0]}`);
      await deleteObject(imageRef);
      await deleteDoc(doc(db, 'uploads', imageId));

      alert('Image deleted successfully!');
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const openModal = (url) => {
    setSelectedImage(url);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const headerStyle = {
    background: '#263043',
    color: '#FFA500',
    padding: '20px',
    textAlign: 'center',
    fontSize: '25px',
    fontWeight: 'bold',
    position: 'fixed', // Fixed position
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    fontFamily: 'Poppins, sans-serif',
  };

  const homeIconStyle = {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '32px',
    color: '#fff',
  };

  const modalStyle = {
    display: modalOpen ? 'flex' : 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s',
  };

  const imageStyle = {
    maxWidth: '80%',
    maxHeight: '80%',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    margin: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s, transform 0.3s',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    paddingTop: '80px', // Add padding to prevent overlap with header
  };

  const contentStyle = {
    flex: 1,
    overflowY: 'auto', // Enable vertical scrolling
    padding: '20px',
    marginBottom: '60px', // Margin to prevent overlap with footer
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        Lost and Found
        <FaHome 
          style={homeIconStyle}
          onClick={() => navigate('/home')}
        />
      </header>

      <div style={contentStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={buttonContainerStyle}>
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])} 
              style={{ marginBottom: '20px' }}
            />
            <input
              type="text"
              placeholder="Enter description"
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ marginBottom: '20px', padding: '10px', width: '100%', maxWidth: '400px' }}
            />
            <button 
              onClick={handleUpload} 
              style={buttonStyle}
            >
              Upload Image
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
            {images.length > 0 ? (
              images.map(({ imageUrl, text, id }, index) => (
                <div key={id} style={{ position: 'relative', width: '150px', overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}>
                  <img 
                    src={imageUrl} 
                    alt={`Lost item ${index + 1}`} 
                    style={{ width: '100%', height: 'auto', borderRadius: '12px', cursor: 'pointer' }} 
                    onClick={() => openModal(imageUrl)}
                  />
                  <p style={{ textAlign: 'center', marginTop: '5px', fontSize: '14px', color: '#555' }}>{text}</p>
                  <button 
                    onClick={() => handleDelete(id, imageUrl)} 
                    style={{ 
                      position: 'absolute', 
                      top: '5px', 
                      right: '5px', 
                      backgroundColor: 'red', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '50%', 
                      cursor: 'pointer', 
                      width: '30px', 
                      height: '30px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center'
                    }}
                  >
                    X
                  </button>
                </div>
              ))
            ) : (
              <p>No images found.</p>
            )}
          </div>
        </div>
      </div>

      <footer style={{ background: '#263043', color: '#FFA500', padding: '20px', textAlign: 'center', position: 'fixed', left: 0, right: 0, bottom: 0 }}>
        &copy; 2024 Lost and Found. All rights reserved.
      </footer>

      <div 
        style={modalStyle} 
        onClick={closeModal}
      >
        {selectedImage && (
          <img 
            src={selectedImage} 
            alt="Selected" 
            style={imageStyle} 
            onClick={(e) => e.stopPropagation()} 
          />
        )}
      </div>
    </div>
  );
}

export default Lostandfound;
