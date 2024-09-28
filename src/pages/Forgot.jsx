import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBContainer, MDBCol, MDBRow, MDBInput } from 'mdb-react-ui-kit';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../firebase-config';
import { sendPasswordResetEmail } from 'firebase/auth';
import styles from '../assets/CSS/ForgetPassword.module.css';
import { Link } from 'react-router-dom';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Veuillez entrer votre adresse e-mail.');
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success('E-mail de réinitialisation du mot de passe envoyé. Veuillez vérifier votre boîte de réception.');
      navigate('/');  
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail de réinitialisation du mot de passe :', error);
      toast.error('Erreur lors de l\'envoi de l\'e-mail de réinitialisation du mot de passe : ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MDBContainer fluid className={`${styles.container} p-3 my-5 d-flex justify-content-center align-items-center`}>
        <MDBRow className="d-flex justify-content-center align-items-center w-100">
          <MDBCol col='12' md='6' className={styles.imageCol}>
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Exemple"
            />
          </MDBCol>

          <MDBCol col='12' md='6' className={styles.formCol}>
            <h2 className={styles.title}>Mot de passe oublié</h2>
            <form onSubmit={handlePasswordReset} className={styles.form}>
              <MDBInput
                wrapperClass='mb-4'
                label='Adresse e-mail'
                id='email'
                type='email'
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className={styles.input}
              />
              <div className='text-center mt-4'>
                <button className={styles.button} size='lg' type="submit" disabled={loading}>
                  {loading ? 'Envoi en cours...' : 'Envoyer l\'e-mail de réinitialisation du mot de passe'}
                </button>
                <hr />
                <br />
                <Link to="/" className="link-danger">Connexion</Link>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <ToastContainer />
    </>
  );
};

export default ForgetPassword;
