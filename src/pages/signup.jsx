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
      toast.error('You must agree to the terms and conditions.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (!role) {
      toast.error('Please select a role.');
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
        fullName: fullName,
        role: role
      });

      await sendEmailVerification(user);

      setVerificationSent(true);
      toast.success('Signup successful! Please check your email to verify your account.');

       setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('');
      setTermsAccepted(false);

    } catch (err) {
      console.error('Error during signup:', err);
      toast.error('Error during signup: ' + err.message);
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
            <h2 className="text-center mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
              <MDBInput
                wrapperClass='mb-4'
                label='Full Name'
                id='fullName'
                type='text'
                size="lg"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <MDBInput
                wrapperClass='mb-4'
                label='Email address'
                id='email'
                type='email'
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <MDBInput
                wrapperClass='mb-4'
                label='Password'
                id='password'
                type='password'
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <MDBInput
                wrapperClass='mb-4'
                label='Confirm Password'
                id='confirmPassword'
                type='password'
                size="lg"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <select 
                className="form-select mb-4"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="Employee">Employee</option>
                <option value="Department Head">Department Head</option>
                <option value="HR Manager">HR Manager</option>
                <option value="CEO">CEO</option>
                <option value="Store">Store</option>
              </select>
              <div className="d-flex justify-content-between mb-4">
                <MDBCheckbox
                  name='terms'
                  value={termsAccepted}
                  id='termsCheckbox'
                  label='I agree to the terms and conditions'
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
              </div>
              <div className='text-center text-md-start mt-4 pt-2'>
                <button type="submit" className="mb-0 px-5" size='lg' disabled={loading || verificationSent}>
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
                <p className="small fw-bold mt-2 pt-1 mb-2">
                  Already have an account? <Link to="/" className="link-danger">Login</Link>
                </p>
              </div>
            </form>
            {verificationSent && (
              <div className="text-center mt-4">
                <p>A verification email has been sent. Please check your email.</p>
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
