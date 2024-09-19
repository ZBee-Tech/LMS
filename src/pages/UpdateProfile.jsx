import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBCol, MDBRow, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db } from '../firebase-config';
import { updateProfile, updatePassword } from 'firebase/auth';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import styles from './UpdateProfile.module.css';

const UpdateProfile = () => {
  const [name, setName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const userDoc = await getDoc(doc(db, 'Users', userId));
          if (userDoc.exists()) {
            setName(userDoc.data().fullName || '');
          } else {
            toast.error('User data not found.');
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          toast.error('Error fetching user data.');
        }
      }
    };

    fetchUserData();
  }, [userId]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
      }

      await updateDoc(doc(db, 'Users', userId), {
        fullName: name,
      });

      if (newPassword) {
        await updatePassword(auth.currentUser, newPassword);
      }

      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Error updating profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer fluid className={styles.container}>
      <MDBRow>
        <MDBCol col='12' md='6'>
          <div className={styles.formWrapper}>
            <h2 className={styles.header}>Update Profile</h2>
            <form onSubmit={handleUpdateProfile}>
              <MDBInput
                wrapperClass={styles.input}
                label='Full Name'
                id='name'
                type='text'
                size="lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
              <MDBInput
                wrapperClass={styles.input}
                label='New Password'
                id='password'
                type='password'
                size="lg"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
              <button 
                type="submit" 
                size='lg' 
                className={styles.button}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </MDBCol>
      </MDBRow>
      <ToastContainer />
    </MDBContainer>
  );
};

export default UpdateProfile;
