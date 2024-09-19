 import axios from 'axios';

 export const sendEmail = async (emailData) => {
  try {
    const response = await axios.post('http://localhost:3000/send-email', emailData);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
