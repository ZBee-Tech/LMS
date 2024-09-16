import React, { useState } from 'react';
import { Link } from 'react-router-dom';  

import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox
} from 'mdb-react-ui-kit';
import styles from '../assets/CSS/SignupPage.module.css'; 

const SignupPage = () => {
 
  return (
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
          <MDBInput
            wrapperClass='mb-4'
            label='Full Name'
            id='fullName'
            type='text'
            size="lg"
          />
          <MDBInput
            wrapperClass='mb-4'
            label='Email address'
            id='email'
            type='email'
            size="lg"
          />
          <MDBInput
            wrapperClass='mb-4'
            label='Password'
            id='password'
            type='password'
            size="lg"
          />
          <MDBInput
            wrapperClass='mb-4'
            label='Confirm Password'
            id='confirmPassword'
            type='password'
            size="lg"
          />

       

          <div className="d-flex justify-content-between mb-4">
            <MDBCheckbox
              name='terms'
              value=''
              id='termsCheckbox'
              label='I agree to the terms and conditions'
            />
          </div>

          <div className='text-center text-md-start mt-4 pt-2'>
            <MDBBtn className="mb-0 px-5" size='lg'>
              Sign Up
            </MDBBtn>
            <p className="small fw-bold mt-2 pt-1 mb-2">
              Already have an account? <Link to="/" className="link-danger">Login</Link>
            </p>
          </div>

        </MDBCol>

      </MDBRow>
    </MDBContainer>
  );
};

export default SignupPage;
