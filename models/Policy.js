const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    policyNumber: { type: String, required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    productName: { type: String, required: true }, // New field for Product Name
    isRenewed: { type: Boolean, default: false },

    agentName: {              // New field for agent name
        type: String,
        required: true
    },
    agentCode: {              // New field for agent code
        type: String,
        required: true
    },
    agentMobile: {            // New field for agent mobile number
        type: String,
        required: true
    },
    agentEmail: {             // New field for agent email
        type: String,
        required: true
    }
});

const Policy = mongoose.model('Policy', policySchema);
module.exports = Policy;
