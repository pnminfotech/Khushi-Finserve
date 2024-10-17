const express = require('express');
const { createPolicy, getPolicies , updatePolicy , deletePolicy , exportPolicies } = require('../controllers/policyController');
const sendEmail = require('../utils/sendEmail'); // Import the sendEmail function
const router = express.Router();
// const xlsx = require('xlsx');
router.post('/policies', createPolicy);
router.get('/policies', getPolicies);

router.post('/test-email', async (req, res) => {
    try {
        console.log('Request body:', req.body); // Log the entire request body

        const { clientEmail, agentEmail } = req.body; // Extract the clientEmail and agentEmail

        console.log('Sending email to admin, client, and agent:', clientEmail, agentEmail);

        // Send email to admin
        await sendEmail('pnminfotech2024@gmail.com', 'Dear Admin', 'New Policy has been created Successfully.');

        // Send email to client (if clientEmail exists)
        if (clientEmail) {
            await sendEmail(clientEmail, 'Test Email - Client', 'This is a test email for the client.');
        } else {
            console.log('Client email is missing');
        }

        // Send email to agent (if agentEmail exists)
        if (agentEmail) {
            await sendEmail(agentEmail, 'Test Email - Agent', 'This is a test email for the agent.');
        } else {
            console.log('Agent email is missing');
        }

        res.status(200).json({ message: 'Emails sent successfully!' });
    } catch (error) {
        console.error('Error sending test emails:', error);
        res.status(500).json({ message: 'Failed to send test emails.' });
    }
});


// PUT route to update policy by ID
router.put('/policies/:id', updatePolicy); 


// Update a policy
// router.put('/policies/:id', async (req, res) => {
//     try {
//         const policyId = req.params.id;
//         const {
//             policyNumber,
//             clientName,
//             clientEmail,
//             productName,
//             company,
//             startDate,
//             endDate,
//             agentName,
//             agentCode,
//             agentMobile,
//             agentEmail
//         } = req.body;

//         const updatedPolicy = await Policy.findByIdAndUpdate(
//             policyId,
//             {
//                 policyNumber,
//                 clientName,
//                 clientEmail,
//                 productName,
//                 company,
//                 startDate,
//                 endDate,
//                 agentName,
//                 agentCode,
//                 agentMobile,
//                 agentEmail
//             },
//             { new: true }
//         );

//         if (!updatedPolicy) {
//             return res.status(404).json({ message: 'Policy not found' });
//         }

//         res.status(200).json({ message: 'Policy updated successfully', updatedPolicy });

//     } catch (error) {
//         console.error('Error updating policy:', error);
//         res.status(500).json({ message: 'Error updating policy. Please try again later.' });
//     }
// });

// Delete a policy
// router.delete('/policies/:id', async (req, res) => {
//     const { id } = req.params;

//     try {
//         const deletedPolicy = await Policy.findByIdAndDelete(id);

//         if (!deletedPolicy) {
//             return res.status(404).json({ message: "Policy not found" });
//         }

//         res.status(200).json({
//             message: "Policy deleted successfully",
//             deletedPolicy
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error });
//     }
// });
  

// DELETE route to delete policy by ID
router.delete('/policies/:id', deletePolicy);





/////////////////////////
// Route to generate and send Excel file
// router.get('/export-policies', async (req, res) => {
//     try {
//         // Fetch data from the database (e.g., all policies)
//         const policies = await Policy.find();

//         // Create a new workbook and worksheet
//         const workbook = xlsx.utils.book_new();
//         const worksheetData = policies.map(policy => ({
           
//             policyNumber: policy.policyNumber,
//             clientName: policy.clientName,
//             clientEmail: policy.clientEmail,
//             productName: policy.productName,
//             company: policy.company,
//             startDate: policy.startDate ? formatDate(policy.startDate) : '',
//             endDate: policy.endDate ? formatDate(policy.endDate) : '',
//             agentName: policy.agentName,
//             agentCode: policy.agentCode,
//             agentMobile: policy.agentMobile,
//             agentEmail: policy.agentEmail
//             // Add any other fields you want to include
//         }));

//         // Convert the data to a worksheet
//         const worksheet = xlsx.utils.json_to_sheet(worksheetData);

//         // Add the worksheet to the workbook
//         xlsx.utils.book_append_sheet(workbook, worksheet, 'Policies');

//         // Create a buffer for the workbook
//         const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

//         // Send the file to the client
//         res.setHeader('Content-Disposition', 'attachment; filename="policies.xlsx"');
//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         res.send(excelBuffer);
//     } catch (error) {
//         console.error('Error exporting policies to Excel:', error);
//         res.status(500).send('Error generating Excel file');
//     }
// });






// Route to export policies as Excel
router.get('/export-policies', exportPolicies);

////////////////////////////
module.exports = router;
