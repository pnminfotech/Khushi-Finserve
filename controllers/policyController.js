const Policy = require('../models/Policy');
const xlsx = require('xlsx');



// Create a new policy
exports.createPolicy = async (req, res) => {
    const { policyNumber, clientName, clientEmail,productName , company, startDate, endDate, agentName,
        agentCode,
        agentMobile,
        agentEmail } = req.body;

    try {
        const policy = new Policy({ policyNumber, clientName, clientEmail, productName , company, startDate, endDate, agentName,
            agentCode,
            agentMobile,
            agentEmail });
        await policy.save();
        res.status(201).json({ message: 'Policy created successfully', policy });
    } catch (error) {
        res.status(500).json({ error: 'Error creating policy' });
    }
};

// Get all policies
exports.getPolicies = async (req, res) => {
    try {
        const policies = await Policy.find();
        res.json(policies);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching policies' });
    }
};


// Update policy by ID
exports.updatePolicy = async (req, res) => {
    try {
        const { id } = req.params; // Get the policy ID from the route params
        const updatedData = req.body; // The data you want to update

        // Use findByIdAndUpdate to update the document
        const updatedPolicy = await Policy.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedPolicy) {
            return res.status(404).json({ message: 'Policy not found' });
        }

        res.status(200).json(updatedPolicy); // Return the updated policy
    } catch (error) {
        res.status(500).json({ message: 'Error updating policy', error });
    }
};


// Delete policy by ID
exports.deletePolicy = async (req, res) => {
    try {
        const { id } = req.params; // Get the policy ID from the route params

        // Use findByIdAndDelete to delete the document
        const deletedPolicy = await Policy.findByIdAndDelete(id);

        if (!deletedPolicy) {
            return res.status(404).json({ message: 'Policy not found' });
        }

        res.status(200).json({ message: 'Policy deleted successfully' }); // Return success message
    } catch (error) {
        res.status(500).json({ message: 'Error deleting policy', error });
    }
};

// Export policies to Excel
exports.exportPolicies = async (req, res) => {
    try {
        const policies = await Policy.find(); // Fetch policies

        // Convert policies to an array of JSON objects
        const worksheetData = policies.map(policy => ({
            PolicyNumber: policy.policyNumber,
            ClientName: policy.clientName,
            ClientEmail: policy.clientEmail,
            ProductName: policy.productName,
            Company: policy.company,
            StartDate: policy.startDate ? new Date(policy.startDate).toLocaleDateString() : '',
            EndDate: policy.endDate ? new Date(policy.endDate).toLocaleDateString() : '',
            AgentName: policy.agentName,
            AgentCode: policy.agentCode,
            AgentMobile: policy.agentMobile,
            AgentEmail: policy.agentEmail
        }));

        // Create a new Excel workbook
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(worksheetData);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Policies');

        // Generate a binary Excel file (as a buffer)
        const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Set response headers for file download
        res.setHeader('Content-Disposition', 'attachment; filename=policies.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Send the file as binary data
        res.send(excelBuffer);
    } catch (error) {
        console.error('Error exporting policies:', error);
        res.status(500).send('Error generating Excel file');
    }
};