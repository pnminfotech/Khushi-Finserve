const express = require('express'); 
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const policyRoutes = require('./routes/policyRoutes');
const userRoutes = require('./routes/userRoutes');
const cron = require('node-cron');
const checkPoliciesForNotifications = require('./utils/checkPoliciesForNotifications'); // Correct import
const sendEmail = require('./utils/sendEmail');

const app = express();
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api', policyRoutes);

// Test route to send email
// app.get('/test-email', async (req, res) => {
//     try {
//         await sendEmail('pnminfotech24@gmail.com', 'Test Email', 'This is a test email');
//         res.send('Test email sent successfully!');
//     } catch (error) {
//         console.error('Error sending test email:', error);
//         res.status(500).send('Failed to send test email');
//     }
// });

// Call the notification checking function once when the server starts
checkPoliciesForNotifications();

// Schedule a cron job to run the notification checker every day at midnight
cron.schedule('0 0 * * *', () => {
    console.log('Running daily policy expiration check...');
    checkPoliciesForNotifications();
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
