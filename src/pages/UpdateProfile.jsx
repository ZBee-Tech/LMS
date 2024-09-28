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
            toast.error('Données utilisateur non trouvées.');
          }
        } catch (err) {
          toast.error("Erreur lors de la récupération des données utilisateur.");
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

      toast.success("Profil mis à jour avec succès !");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du profil :" + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer fluid className={styles.container}>
      <MDBRow className="justify-content-center">
        <MDBCol col='12' md='8' lg='6'>
          <div className={styles.formWrapper}>
            <h2 className={styles.header}>Mettre à Jour le Profil</h2>
            <form onSubmit={handleUpdateProfile}>
              <MDBInput
                wrapperClass={styles.input}
                label='Nom Complet'
                id='name'
                type='text'
                size="lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
              <MDBInput
                wrapperClass={styles.input}
                label='Nouveau Mot de Passe'
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
                {loading ? 'Mise à jour...' : 'Mettre à Jour le Profil'}
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
