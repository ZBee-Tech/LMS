import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { MDBContainer, MDBCol, MDBRow, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../assets/CSS/SignupPage.module.css';
import { auth, db } from '../firebase-config';
import { setDoc, doc } from "firebase/firestore";

const SignupPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast.error('Vous devez accepter les termes et conditions.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
        fullName: fullName,
        role: "PDG"
      });

      await sendEmailVerification(user);

      setVerificationSent(true);
      toast.success('Inscription réussie! Veuillez vérifier votre email pour valider votre compte.');

      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('');
      setTermsAccepted(false);

    } catch (err) {
      console.error('Erreur lors de l\'inscription:', err);
      toast.error('Erreur lors de l\'inscription: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MDBContainer fluid className="p-3 my-5 h-100 d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <MDBRow className="d-flex justify-content-center align-items-center w-100">
          <MDBCol col='10' md='6'>
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Image d'exemple"
            />
          </MDBCol>

          <MDBCol col='4' md='6'>
            <h2 className="text-center mb-4">S'inscrire</h2>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
              <MDBInput
                wrapperClass='mb-4'
                label='Nom et prénom'
                id='fullName'
                type='text'
                size="lg"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <MDBInput
                wrapperClass='mb-4'
                label='Adresse e-mail'
                id='email'
                type='email'
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <MDBInput
                wrapperClass='mb-4'
                label='Mot de passe'
                id='password'
                type='password'
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <MDBInput
                wrapperClass='mb-4'
                label='Confirmer le mot de passe'
                id='confirmPassword'
                type='password'
                size="lg"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <div className="d-flex justify-content-between mb-4">
                <MDBCheckbox
                  name='terms'
                  value={termsAccepted}
                  id='termsCheckbox'
                  label='accepte les termes et conditions'
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
              </div>
              <div className='text-center text-md-start mt-4 pt-2'>
                <button type="submit" className={styles.btn} size='lg' disabled={loading || verificationSent}>
                  {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                </button>
                <p className="small fw-bold mt-2 pt-1 mb-2">
                  Vous avez déjà un compte? <Link to="/" className="link-danger">Connexion</Link>
                </p>
              </div>
            </form>
            {verificationSent && (
              <div className="text-center mt-4">
                <p>Un email de vérification a été envoyé. Veuillez vérifier votre boîte de réception.</p>
              </div>
            )}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <ToastContainer />
    </>
  );
};

export default SignupPage;
