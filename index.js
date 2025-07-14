require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { configDotenv } = require('dotenv');

const app = express();
configDotenv();

// Middleware
app.use(cors(
  { origin: 'https://cs2-full.vercel.app' } 
));
app.use(bodyParser.json());
app.use(express.json());


// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Serve static frontend files
//app.use(express.static(path.join(__dirname, 'client/build')));

// Fallback: serve index.html for all other routes
// app.get('*', (req, res) => {
//  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });

// ❌ All undefined routes send a custom HTML 404 page
// app.use((req, res) => {
//   res.status(404).send(`
//     <html>
//       <head>
//         <title>404 Not Found</title>
//         <style>
//           body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
//           h1 { font-size: 48px; color: #e74c3c; }
//           p { font-size: 18px; }
//         </style>
//       </head>
//       <body>
//         <h1>404</h1>
//         <p>The API route you're looking for was not found.</p>
//       </body>
//     </html>
//   `);
// });

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, course, message } = req.body;

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVING_EMAIL, // Your receiving email address
      subject: `New Contact Form Submission: ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Course Interest:</strong> ${course || 'Not specified'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p>Sent from CSC Website</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});