import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MDBContainer, MDBCol, MDBRow, MDBBtn, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../assets/CSS/LoginPage.module.css';
import { auth, db } from '../firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the email is verified
      if (!user.emailVerified) {
        toast.error('Please verify your email address before logging in.');
        return;
      }

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "Users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const { role } = userData;

        navigate(`/dashboard`, { state: { role: role, userId: user.uid } });
        toast.success('Login successful!');
      } else {
        toast.error('User not found.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      toast.error('Error during login: ' + err.message);
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
              alt="Sample image"
            />
          </MDBCol>

          <MDBCol col='4' md='6'>
            <h2 className="text-center mb-4">Login</h2>
            <form onSubmit={handleLogin} className={styles.formContainer}>
              <MDBInput
                wrapperClass='mb-4'
                label='Email address'
                id='email'
                type='email'
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <MDBInput
                wrapperClass='mb-4'
                label='Password'
                id='password'
                type='password'
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <div className="d-flex justify-content-between mb-4">
                <MDBCheckbox
                  name='rememberMe'
                  id='rememberMe'
                  label='Remember me'
                />
                <Link to="/forgot" className="link-danger">Forgot password?</Link>
               </div>
              <div className='text-center text-md-start mt-4 pt-2'>
                <button className="mb-0 px-5" size='lg' type="submit" disabled={loading}>
                  {loading ? 'Logging In...' : 'Login'}
                </button>
                <p className="small fw-bold mt-2 pt-1 mb-2">
                  Don't have an account? <Link to="/signup" className="link-danger">Register</Link>
                </p>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <ToastContainer />
    </>
  );
};

export default LoginPage;
