import React from 'react';
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
import styles from '../assets/CSS/LoginPage.module.css'; 

const LoginPage = () => {
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

          <div className="d-flex justify-content-between mb-4">
            <MDBCheckbox
              name='rememberMe'
              value=''
              id='rememberMe'
              label='Remember me'
            />
            <a href="#!">Forgot password?</a>
          </div>

  

          <div className='text-center text-md-start mt-4 pt-2'>
            <MDBBtn className="mb-0 px-5" size='lg'>
              Login
            </MDBBtn>
            <p className="small fw-bold mt-2 pt-1 mb-2">
              Don't have an account? <Link to="/signup" className="link-danger">Register</Link>
            </p>
          </div>

        </MDBCol>

      </MDBRow>
    </MDBContainer>
  );
};

export default LoginPage;
