import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { MDBContainer, MDBCol, MDBRow, MDBBtn, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../assets/CSS/SignupPage.module.css';
import { realtimeDb } from '../firebase-config';

const SignupPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
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
  
      const userId = Date.now().toString();
  
      await set(ref(realtimeDb, 'users/' + userId), {
        fullName,
        email,
        role,
        createdAt: new Date().toISOString(),
        password
      });
  
      console.log('Data stored in Realtime Database');
  
      toast.success('Signup successful!');
      
       setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('');
  
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
                disabled={loading}
              />
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
              <MDBInput
                wrapperClass='mb-4'
                label='Confirm Password'
                id='confirmPassword'
                type='password'
                size="lg"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <select 
                className="form-select mb-4"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
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
                  value=''
                  id='termsCheckbox'
                  label='I agree to the terms and conditions'
                  disabled={loading}
                />
              </div>
              <div className='text-center text-md-start mt-4 pt-2'>
                <button type="submit" className="mb-0 px-5" size='lg' disabled={loading}>
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
                <p className="small fw-bold mt-2 pt-1 mb-2">
                  Already have an account? <Link to="/" className="link-danger">Login</Link>
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

export default SignupPage;
